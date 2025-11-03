import { Constants, Database } from "@/types/supabase.types";
import { createEnum } from "@/utils";

export const PermissionActions = createEnum(Constants.public.Enums.action_code_enum)
export type TPermissionActions = Database["public"]["Enums"]["action_code_enum"];