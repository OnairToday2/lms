export interface AssignmentStudentDto {
  employee_id: string;
  employee_code: string;
  full_name: string;
  email: string;
  avatar: string | null;
  has_submitted: boolean;
  submitted_at: string | null;
  grade: number | null;
}

