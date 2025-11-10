import { Tables, Database } from "@/types/supabase.types";
export type Profile = Tables<"profiles">;
export type Gender = Profile["gender"];
