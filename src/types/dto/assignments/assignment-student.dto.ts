import { Database } from "@/types/supabase.types";

type AssignmentResultStatus = Database["public"]["Enums"]["assignment_result_status"];

export interface AssignmentStudentDto {
  employee_id: string;
  employee_code: string;
  full_name: string;
  email: string;
  avatar: string | null;
  has_submitted: boolean;
  submitted_at: string | null;
  score: number | null;
  max_score: number | null;
  status: AssignmentResultStatus | null;
}

