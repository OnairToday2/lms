import { Database } from "@/types/supabase.types";
import { QuestionOption } from "./question-option.dto";

type QuestionType = Database["public"]["Enums"]["question_type"];
type AssignmentResultStatus = Database["public"]["Enums"]["assignment_result_status"];

export interface QuestionGradeDetail {
  id: string;
  label: string;
  type: QuestionType;
  maxScore: number;
  options?: QuestionOption[];
  attachments?: string[];
  answer: {
    fileUrl?: string;
    text?: string;
    selectedOptionId?: string;
    selectedOptionIds?: string[];
  };
  answerAttachments?: string[];
  earnedScore: number | null;
  isAutoGraded: boolean;
}

export interface SubmissionDetailDto {
  resultId: string;
  assignmentId: string;
  assignmentName: string;
  assignmentDescription: string;
  employeeId: string;
  employeeCode: string;
  fullName: string;
  email: string;
  avatar: string | null;
  submittedAt: string;
  status: AssignmentResultStatus;
  totalScore: number | null;
  maxScore: number;
  questions: QuestionGradeDetail[];
}

