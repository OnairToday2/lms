import { createClient } from "@/services/supabase/client";
import { Tables, TablesInsert, TablesUpdate } from "@/types/supabase.types";

type Department = Tables<"organization_units">;
type DepartmentInsert = TablesInsert<"organization_units">;
type DepartmentUpdate = TablesUpdate<"organization_units">;

export interface DepartmentFilters {
  search?: string;
  organizationId?: string;
  branchId?: string;
}

export interface DepartmentListResult {
  data: Department[];
  count: number;
}

export const departmentRepository = {
  /**
   * Get list of departments with optional filters and pagination
   */
  async getList(
    filters?: DepartmentFilters,
    page = 1,
    limit = 10
  ): Promise<DepartmentListResult> {
    const supabase = createClient();
    let query = supabase
      .from("organization_units")
      .select("*", { count: "exact" })
      .eq("type", "department")
      .order("created_at", { ascending: false });

    // Apply organization filter
    if (filters?.organizationId) {
      query = query.eq("organization_id", filters.organizationId);
    }

    // Apply branch filter (parent_id)
    if (filters?.branchId) {
      query = query.eq("parent_id", filters.branchId);
    }

    // Apply search filter (name, case-insensitive)
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
   * Get a single department by ID
   */
  async getById(id: string): Promise<Department | null> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("organization_units")
      .select("*")
      .eq("id", id)
      .eq("type", "department")
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Create a new department
   */
  async create(department: DepartmentInsert): Promise<Department> {
    const supabase = createClient();

    const { data, error } = await supabase
      .from("organization_units")
      .insert({ ...department, type: "department" })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Update an existing department
   */
  async update(id: string, department: DepartmentUpdate): Promise<Department> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("organization_units")
      .update(department)
      .eq("id", id)
      .eq("type", "department")
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  /**
   * Delete a department (only if no employees belong to it)
   */
  async delete(id: string): Promise<void> {
    const supabase = createClient();

    // Check if department has any employees
    const { data: employments, error: checkError } = await supabase
      .from("employments")
      .select("id")
      .eq("organization_unit_id", id)
      .limit(1);

    if (checkError) throw checkError;

    if (employments && employments.length > 0) {
      throw new Error(
        "Không thể xóa phòng ban có nhân viên"
      );
    }

    const { error } = await supabase
      .from("organization_units")
      .delete()
      .eq("id", id)
      .eq("type", "department");

    if (error) throw error;
  },

  /**
   * Check if department name already exists in the same branch
   */
  async checkNameExists(
    name: string,
    organizationId: string,
    branchId: string | null,
    excludeId?: string
  ): Promise<boolean> {
    const supabase = createClient();
    let query = supabase
      .from("organization_units")
      .select("id")
      .eq("organization_id", organizationId)
      .eq("type", "department")
      .eq("name", name);

    if (branchId) {
      query = query.eq("parent_id", branchId);
    } else {
      query = query.is("parent_id", null);
    }

    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const { data, error } = await query.limit(1);

    if (error) throw error;
    return data && data.length > 0;
  },

  /**
   * Get all branches for selection
   */
  async getBranches(organizationId: string): Promise<Department[]> {
    const supabase = createClient();
    const { data, error } = await supabase
      .from("organization_units")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("type", "branch")
      .order("name", { ascending: true });

    if (error) throw error;
    return data || [];
  },

  /**
   * Bulk import departments
   */
  async bulkImport(departments: DepartmentInsert[]): Promise<Department[]> {
    const supabase = createClient();

    // Set type to department for all
    const departmentsWithType = departments.map((dept) => ({
      ...dept,
      type: "department" as const,
    }));

    const { data, error } = await supabase
      .from("organization_units")
      .insert(departmentsWithType)
      .select();

    if (error) throw error;
    return data;
  },
};
