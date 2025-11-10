export interface QuestionGradeInput {
  questionId: string;
  score: number;
}

export interface SaveGradeDto {
  assignmentId: string;
  employeeId: string;
  questionGrades: QuestionGradeInput[];
}

export interface SaveGradeResponse {
  success: boolean;
  message: string;
  totalScore: number;
  maxScore: number;
}

