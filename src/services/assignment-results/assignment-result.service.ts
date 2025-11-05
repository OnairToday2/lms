import { assignmentResultsRepository, assignmentsRepository } from "@/repository";
import type {
  SubmissionData,
  QuestionWithAnswer,
  FileAnswer,
  TextAnswer,
  RadioAnswer,
  CheckboxAnswer,
  QuestionAnswer,
} from "@/repository/assignment-results";
import { Database } from "@/types/supabase.types";
import { QuestionOption, AssignmentDto } from "@/types/dto/assignments";

type QuestionType = Database["public"]["Enums"]["question_type"];
type AssignmentResultStatus = Database["public"]["Enums"]["assignment_result_status"];

export interface QuestionAnswerInput {
  questionId: string;
  questionLabel: string;
  questionType: QuestionType;
  options?: QuestionOption[];
  answer: string | string[]; // Format depends on question type
}

export interface SubmitAssignmentPayload {
  assignmentId: string;
  employeeId: string;
  answers: QuestionAnswerInput[];
}

export interface SubmitAssignmentResult {
  id: string;
  assignmentId: string;
  employeeId: string;
  submittedAt: string;
  score: number | null;
  maxScore: number;
  status: AssignmentResultStatus;
}

/**
 * Auto-grade a radio question
 */
function gradeRadioQuestion(
  answer: RadioAnswer,
  options: QuestionOption[],
  questionScore: number
): number {
  const correctOption = options.find(opt => opt.correct);
  if (!correctOption) return 0;

  return answer.selectedOptionId === correctOption.id ? questionScore : 0;
}

/**
 * Auto-grade a checkbox question
 */
function gradeCheckboxQuestion(
  answer: CheckboxAnswer,
  options: QuestionOption[],
  questionScore: number
): number {
  const correctOptionIds = options.filter(opt => opt.correct).map(opt => opt.id);
  const selectedIds = answer.selectedOptionIds;

  // Check if all correct options are selected and no incorrect ones
  const allCorrectSelected = correctOptionIds.every(id => selectedIds.includes(id));
  const noIncorrectSelected = selectedIds.every(id => correctOptionIds.includes(id));

  return (allCorrectSelected && noIncorrectSelected) ? questionScore : 0;
}

/**
 * Convert answer input to typed answer format
 */
function convertAnswerToTypedFormat(
  questionType: QuestionType,
  answer: string | string[]
): QuestionAnswer {
  switch (questionType) {
    case "file":
      // For file type, answer is array of URLs, take the first one
      const fileUrl = Array.isArray(answer) ? answer[0] : answer;
      return { fileUrl } as FileAnswer;

    case "text":
      return { text: answer as string } as TextAnswer;

    case "radio":
      return { selectedOptionId: answer as string } as RadioAnswer;

    case "checkbox":
      return { selectedOptionIds: answer as string[] } as CheckboxAnswer;

    default:
      throw new Error(`Unsupported question type: ${questionType}`);
  }
}

export async function submitAssignment(
  payload: SubmitAssignmentPayload
): Promise<SubmitAssignmentResult> {
  const { assignmentId, employeeId, answers } = payload;

  const existingResult = await assignmentResultsRepository.getAssignmentResult(
    assignmentId,
    employeeId
  );

  if (existingResult) {
    throw new Error("Bài kiểm tra đã được nộp trước đó. Không thể nộp lại.");
  }

  if (answers.length === 0) {
    throw new Error("Vui lòng trả lời ít nhất một câu hỏi.");
  }

  try {
    // Fetch the complete assignment data for snapshot
    const assignment: AssignmentDto = await assignmentsRepository.getAssignmentById(assignmentId);

    // Create a map of answers by question ID for easy lookup
    const answerMap = new Map(
      answers.map(a => [a.questionId, a])
    );

    // Build questions with answers and calculate scores
    const questionsWithAnswers: QuestionWithAnswer[] = assignment.questions.map(question => {
      const answerInput = answerMap.get(question.id);

      if (!answerInput) {
        throw new Error(`Thiếu câu trả lời cho câu hỏi: ${question.label}`);
      }

      // Convert answer to typed format
      const typedAnswer = convertAnswerToTypedFormat(question.type, answerInput.answer);

      // Calculate earned score based on question type
      let earnedScore: number | null = null;

      if (question.type === "radio" && question.options) {
        earnedScore = gradeRadioQuestion(
          typedAnswer as RadioAnswer,
          question.options,
          question.score
        );
      } else if (question.type === "checkbox" && question.options) {
        earnedScore = gradeCheckboxQuestion(
          typedAnswer as CheckboxAnswer,
          question.options,
          question.score
        );
      }
      // For "text" and "file" types, earnedScore remains null (manual grading required)

      return {
        id: question.id,
        label: question.label,
        type: question.type,
        score: question.score,
        options: question.options,
        attachments: question.attachments || undefined,
        created_at: question.created_at,
        updated_at: question.updated_at,
        answer: typedAnswer,
        earnedScore,
      };
    });

    // Calculate total score and max score
    const maxScore = questionsWithAnswers.reduce((sum, q) => sum + q.score, 0);

    // Determine if all questions can be auto-graded
    const allAutoGradable = questionsWithAnswers.every(
      q => q.type === "radio" || q.type === "checkbox"
    );

    let totalScore: number | null = null;
    let status: AssignmentResultStatus = "submitted";

    if (allAutoGradable) {
      // All questions are auto-gradable, calculate total score
      totalScore = questionsWithAnswers.reduce(
        (sum, q) => sum + (q.earnedScore ?? 0),
        0
      );
      status = "graded";
    }

    // Create submission data snapshot
    const submissionData: SubmissionData = {
      assignment: {
        id: assignment.id,
        name: assignment.name,
        description: assignment.description,
        created_by: assignment.created_by,
        created_at: assignment.created_at,
        updated_at: assignment.updated_at,
      },
      questions: questionsWithAnswers,
    };

    const result = await assignmentResultsRepository.createAssignmentResult({
      assignment_id: assignmentId,
      employee_id: employeeId,
      submissionData,
      score: totalScore,
      max_score: maxScore,
      status,
    });

    return {
      id: result.id,
      assignmentId: result.assignment_id,
      employeeId: result.employee_id,
      submittedAt: result.created_at,
      score: totalScore,
      maxScore,
      status,
    };
  } catch (error) {
    console.error("Failed to create assignment result:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Không thể lưu bài nộp. Vui lòng thử lại.");
  }
}

export async function getSubmissionStatus(
  assignmentId: string,
  employeeId: string
) {
  const result = await assignmentResultsRepository.getAssignmentResult(
    assignmentId,
    employeeId
  );

  if (!result) {
    return null;
  }

  // Try to parse as new format, fall back to legacy format
  let submissionData: SubmissionData | null = null;

  try {
    const data = result.data as any;

    // Check if it's the new format (has 'assignment' and 'questions' fields)
    if (data && typeof data === 'object' && 'assignment' in data && 'questions' in data) {
      submissionData = data as SubmissionData;
    }
  } catch (error) {
    console.error("Failed to parse submission data:", error);
  }

  return {
    id: result.id,
    assignmentId: result.assignment_id,
    employeeId: result.employee_id,
    submittedAt: result.created_at,
    score: result.score,
    maxScore: result.max_score,
    status: result.status,
    submissionData, // New format data (null for legacy submissions)
  };
}

