import { supabase } from "@/services";
import { createSVClient } from "@/services";

const getOrganizationUnits = async () => {
  const response = await supabase.from("organization_units").select("*");

  return response.data;
};

export async function getAllOrganizationUnitsWithDetails() {
  const supabase = await createSVClient();

  const { data, error } = await supabase.from("organization_units").select("id, name, type");

  if (error) {
    throw new Error(`Failed to fetch organization units: ${error.message}`);
  }

  return data || [];
}

export const getOrganizationDepartmentOrBranch = async (type?: "department" | "branch") => {
  try {
    let organizationQuery = supabase.from("organization_units").select(
      `
        id,
        name,
        parent_id,
        type
      `,
    );
    if (type) {
      organizationQuery = organizationQuery.eq("type", type);
    }
    return await organizationQuery;
  } catch (err) {
    throw new Error("Get department Error");
  }
};
export { getOrganizationUnits };
