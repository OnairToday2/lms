import { createSVClient } from "@/services";

export const getOrganizationByUserId = async (userId: string) => {
  const supabase = await createSVClient();
  const { data, error } = await supabase
    .from("employees")
    .select(
      `
      id, 
      status, 
      employee_code, 
      user_id, 
      organizations(
        id, 
        name, 
        subdomain, 
        employee_limit, 
        subdomain
      )
    `,
    )
    .eq("user_id", userId)
    .single();

  if (error) {
    console.log(error);
    throw new Error(error.message);
  }
  return data;
};
export type OrganizationByUserIdResponse = Awaited<ReturnType<typeof getOrganizationByUserId>>;
