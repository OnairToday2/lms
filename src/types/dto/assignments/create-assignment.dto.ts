import { Database } from "@/types/supabase.types";

export class CreateAssignmentDto {
  name!: string;
  description!: string;
  assignmentCategories!: string[]; // category IDs
  questions!: Array<{
    type: Database["public"]["Enums"]["question_type"];
    label: string;
  }>;
  assignedEmployees!: string[]; // employee IDs
}

