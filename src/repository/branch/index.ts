import { createClient } from "@/services/supabase/client";
import type { BranchDto, GetBranchesParams, CreateBranchDto, UpdateBranchDto } from "@/types/dto/branches";
import type { PaginatedResult } from "@/types/dto/pagination.dto";

export const branchRepository = {
  /**
   * Get list of branches with optional filters and pagination
   */
  async getList(
    params?: GetBranchesParams
  ): Promise<PaginatedResult<BranchDto>> {
    const { page = 0, limit = 10, search, organizationId } = params || {};
    const supabase = createClient();
    let query = supabase
      .from("organization_units")
      .select("*", { count: "exact" })
      .eq("type", "branch")
      .order("created_at", { ascending: false });

    // Apply organization filter
    if (organizationId) {
      query = query.eq("organization_id", organizationId);
    }

    // Apply search filter (name, case-insensitive, accent-sensitive)
    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    // Apply pagination
    const from = page * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (countError) throw countError;

    // Return plain objects to avoid Next.js serialization issues
    return {
      data: (data || []).map(item => ({ ...item })) as BranchDto[],
      total: count ?? 0,
      page,
      limit,
    };
  },

  /**
   * Get a single branch by ID
   */
  async getById(id: string): Promise<BranchDto> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("organization_units")
      .select("*")
      .eq("id", id)
      .eq("type", "branch")
      .single();

    if (error) throw error;
    // Return plain object to avoid Next.js serialization issues
    return { ...data } as BranchDto;
  },

  /**
   * Create a new branch
   */
  async create(branch: CreateBranchDto): Promise<BranchDto> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("organization_units")
      .insert({ ...branch, type: "branch" })
      .select()
      .single();

    if (error) throw error;
    // Return plain object to avoid Next.js serialization issues
    return { ...data } as BranchDto;
  },

  /**
   * Update an existing branch
   */
  async update(payload: UpdateBranchDto): Promise<BranchDto> {
    const supabase = createClient();
    const { id, ...updateData } = payload;
    const { data, error } = await supabase
      .from("organization_units")
      .update(updateData)
      .eq("id", id)
      .eq("type", "branch")
      .select()
      .single();

    if (error) throw error;
    return data as BranchDto;
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
  async bulkImport(branches: CreateBranchDto[]): Promise<BranchDto[]> {
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
    return data as BranchDto[];
  },
};
