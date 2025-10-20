import { createSVClient } from "@/services";
import type { Database } from "@/types/supabase.types";

export async function createProfile(data: {
  employee_id: string;
  email: string;
  full_name: string;
  phone_number?: string;
  gender: Database["public"]["Enums"]["gender"];
  birthday?: string | null;
}) {
  const supabase = await createSVClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .insert({
      employee_id: data.employee_id,
      email: data.email,
      full_name: data.full_name,
      phone_number: data.phone_number || "",
      gender: data.gender,
      birthday: data.birthday || null,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create profile: ${error.message}`);
  }

  return profile;
}

export async function updateProfileByEmployeeId(
  employeeId: string,
  data: {
    full_name?: string;
    email?: string;
    phone_number?: string;
    gender?: Database["public"]["Enums"]["gender"];
    birthday?: string | null;
  }
) {
  const supabase = await createSVClient();

  const { error } = await supabase
    .from("profiles")
    .update(data)
    .eq("employee_id", employeeId);

  if (error) {
    throw new Error(`Failed to update profile: ${error.message}`);
  }
}

export async function deleteProfileByEmployeeId(employeeId: string) {
  const supabase = await createSVClient();

  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("employee_id", employeeId);

  if (error) {
    throw new Error(`Failed to delete profile: ${error.message}`);
  }
}

