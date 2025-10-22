"use server";

import { libraryRepository } from "@/repository";
import { Database } from "@/types/supabase.types";
import { createSVClient } from "@/services";

type Library = Database["public"]["Tables"]["libraries"]["Row"];
type Resource = Database["public"]["Tables"]["resources"]["Row"];

export async function getCurrentUserLibrary(): Promise<Library | null> {
  const supabase = await createSVClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User not authenticated");
  }

  const { data: employee, error: employeeError } = await supabase
    .from("employees")
    .select("id")
    .eq("user_id", user.id)
    .single();

  if (employeeError || !employee) {
    throw new Error("Employee not found for current user");
  }

  return libraryRepository.getLibraryByEmployeeId(employee.id);
}

export async function getLibraryResources(libraryId: string): Promise<Resource[]> {
  return libraryRepository.getResourcesByLibrary(libraryId);
}

export async function getLibraryResourcesByFolder(
  libraryId: string,
  folderId: string | null
): Promise<Resource[]> {
  return libraryRepository.getResourcesByLibraryAndFolder(libraryId, folderId);
}

export async function deleteResource(resourceId: string): Promise<void> {
  return libraryRepository.deleteResource(resourceId);
}

