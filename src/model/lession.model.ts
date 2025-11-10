import { Database, Tables } from "@/types/supabase.types";

export type Lession = Tables<"lessions">;
export type LessionType = Database["public"]["Enums"]["lession_type"];
export type LessionStatus = Tables<"lessions">["status"];
