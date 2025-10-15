import { Tables } from "@/types/supabase.types";

export type ClassSession = Tables<"class_sessions">;
export type ClassSessionChannelProvider = Required<ClassSession>["channel_provider"];
export type ClassSessionAgenda = Tables<"class_sessions_agendas">;
