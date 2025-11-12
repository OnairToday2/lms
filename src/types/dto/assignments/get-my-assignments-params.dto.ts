import { PaginationParams } from "../pagination.dto";
import type { Database } from "@/types/supabase.types";

// Extends from database enum (submitted | graded) and adds not_submitted for filtering
export type MyAssignmentStatusFilter = "not_submitted" | Database["public"]["Enums"]["assignment_result_status"];

export class GetMyAssignmentsParams extends PaginationParams {
  search?: string;
  status?: MyAssignmentStatusFilter;
}

