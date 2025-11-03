import { assignmentResultsRepository } from "@/repository";
import type { AnswerData } from "@/repository/assignment-results";

export interface QuestionAnswer {
  questionId: string;
  questionLabel: string;
  files: Array<{
    url: string;
    fileName: string;
    fileType: string;
    fileSize: number;
  }>;
}

export interface SubmitAssignmentPayload {
  assignmentId: string;
  employeeId: string;
  answers: QuestionAnswer[];
}

export interface SubmitAssignmentResult {
  id: string;
  assignmentId: string;
  employeeId: string;
  submittedAt: string;
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

  const answersData: AnswerData[] = answers
    .filter(answer => answer.files.length > 0)
    .map(answer => ({
      questionId: answer.questionId,
      questionLabel: answer.questionLabel,
      files: answer.files,
    }));

  if (answersData.length === 0) {
    throw new Error("Vui lòng tải lên ít nhất một file trả lời.");
  }

  try {
    const result = await assignmentResultsRepository.createAssignmentResult({
      assignment_id: assignmentId,
      employee_id: employeeId,
      answers: answersData,
      grade: 0,
    });

    return {
      id: result.id,
      assignmentId: result.assignment_id,
      employeeId: result.employee_id,
      submittedAt: result.created_at,
    };
  } catch (error) {
    console.error("Failed to create assignment result:", error);
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

  return {
    id: result.id,
    assignmentId: result.assignment_id,
    employeeId: result.employee_id,
    submittedAt: result.created_at,
    grade: result.grade,
    answers: result.answers as unknown as AnswerData[],
  };
}

