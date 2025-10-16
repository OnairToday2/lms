import { supabase } from "@/services";
import { PostgrestSingleResponse } from "@supabase/supabase-js";

interface GetTeacherQueryParams {
  page?: number;
  perPage?: number;
}
const getTeacherList = async (filter?: GetTeacherQueryParams) => {
  return await supabase.from("teachers").select("*").range(11, 2);
};

const getTeacherById = async (id: string) => {
  return await supabase.from("teachers").select("*").match({ id }).limit(1).single();
};

const listWithPagination = async <T>(promise: Promise<PostgrestSingleResponse<T>>) => {
  try {
    const response = await promise;
  } catch (err) {}
};
export { getTeacherList, getTeacherById };
