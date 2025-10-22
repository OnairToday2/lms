import { Database } from "@/types/supabase.types";

type Resource = Database["public"]["Tables"]["resources"]["Row"] & {}

export type { Resource };
