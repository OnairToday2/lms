import { createClient } from "@/services/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types";

type Branch = Tables<"organization_units">;
type BranchInsert = TablesInsert<"organization_units">;
type BranchUpdate = TablesUpdate<"organization_units">;

export interface BranchFilters {
  search?: string;
  organizationId?: string;
}

export interface BranchListResult {
  data: Branch[];
  count: number;
}

export const branchRepository = {
  /**
   * Get list of branches with optional filters and pagination
   */
  async getList(
    filters?: BranchFilters,
    page = 1,
    limit = 10
  ): Promise<BranchListResult> {
    const supabase = createClient();
    let query = supabase
      .from("organization_units")
      .select("*", { count: "exact" })
      .eq("type", "branch")
      .order("created_at", { ascending: false });

    // Apply organization filter
    if (filters?.organizationId) {
      query = query.eq("organization_id", filters.organizationId);
    }

    // Apply search filter (name, case-insensitive, accent-sensitive)
    if (filters?.search) {
      query = query.ilike("name", `%${filters.search}%`);
    }

    // Apply pagination
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) throw error;

    return {
      data: data || [],
      count: count || 0,
    };
  },

  /**
   * Get a single branch by ID
   */
  async getById(id: string): Promise<Branch | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("organization_units")
      .select("*")
      .eq("id", id)
      .eq("type", "branch")
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create a new branch
   */
  async create(branch: BranchInsert): Promise<Branch> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("organization_units")
      .insert({ ...branch, type: "branch", parent_id: null })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update an existing branch
   */
  async update(id: string, branch: BranchUpdate): Promise<Branch> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("organization_units")
      .update(branch)
      .eq("id", id)
      .eq("type", "branch")
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete a branch (only if no departments belong to it)
   */
  async delete(id: string): Promise<void> {
    const supabase = createClient();

    // Check if branch has any child organization units (departments)
    const { data: units, error: checkError } = await supabase
      .from("organization_units")
      .select("id")
      .eq("parent_id", id)
      .eq("type", "department")
      .limit(1);

    if (checkError) throw checkError;

    if (units && units.length > 0) {
      throw new Error(
        "Không thể xóa chi nhánh có phòng ban"
      );
    }

    const { error } = await supabase
      .from("organization_units")
      .delete()
      .eq("id", id)
      .eq("type", "branch");

    if (error) throw error;
  },

  /**
   * Check if branch name already exists
   */
  async checkNameExists(
    name: string,
    organizationId: string,
    excludeId?: string
  ): Promise<boolean> {
    const supabase = createClient();
    let query = supabase
      .from("organization_units")
      .select("id")
      .eq("organization_id", organizationId)
      .eq("type", "branch")
      .eq("name", name);

    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const { data, error } = await query.limit(1);

    if (error) throw error;
    return data && data.length > 0;
  },

  /**
   * Bulk import branches
   */
  async bulkImport(branches: BranchInsert[]): Promise<Branch[]> {
    const supabase = createClient();

    // Set type and parent_id for all branches
    const branchesWithParent = branches.map((branch) => ({
      ...branch,
      type: "branch" as const,
      parent_id: null,
    }));

    const { data, error } = await supabase
      .from("organization_units")
      .insert(branchesWithParent)
      .select();

    if (error) throw error;
    return data;
  },
};
