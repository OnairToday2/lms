import { createSVClient } from "@/services";

export const getEmployeeDetailInfoByUserId = async (userId: string) => {
  const supabase = await createSVClient();
  const { data, error } = await supabase
    .from("employees")
    .select(
      `
      id, 
      status, 
      employee_code, 
      employee_type,
      user_id,
      organization_id,
      organizations(
        id, 
        name, 
        subdomain, 
        employee_limit, 
        subdomain
      ),
        positions(
          id,
          title, 
          organization_id
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
export type GetEmployeeDetailInfoByUserIdResponse = Awaited<ReturnType<typeof getEmployeeDetailInfoByUserId>>;
