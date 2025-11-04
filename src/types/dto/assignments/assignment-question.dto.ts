import { Database } from "@/types/supabase.types";

export interface AssignmentQuestionDto {
  id: string;
  assignment_id: string;
  label: string;
  type: Database["public"]["Enums"]["question_type"];
  attachments?: string[] | null;
  created_at: string;
  updated_at: string;
  created_by: string;
}

