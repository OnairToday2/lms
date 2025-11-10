import { Database } from "@/types/supabase.types";

type AssignmentResultStatus = Database["public"]["Enums"]["assignment_result_status"];

export interface MyAssignmentDto {
  assignment_id: string;
  assignment_name: string;
  assignment_description: string;
  created_at: string;
  has_submitted: boolean;
  submitted_at: string | null;
  score: number | null;
  max_score: number | null;
  status: AssignmentResultStatus | null;
}

