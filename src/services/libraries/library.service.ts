"use server";

import { libraryRepository, employeesRepository } from "@/repository";
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

  const employee = await employeesRepository.getEmployeeByUserId(user.id);

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

export async function createFolder(
  name: string,
  libraryId: string,
  parentId: string | null
): Promise<Resource> {
  const supabase = await createSVClient();

  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("User not authenticated");
  }

  const employee = await employeesRepository.getEmployeeByUserId(user.id);

  if (!employee.organization_id) {
    throw new Error("Employee does not belong to an organization");
  }

  return libraryRepository.createFolder({
    name,
    library_id: libraryId,
    parent_id: parentId,
    organization_id: employee.organization_id,
    created_by: employee.id,
  });
}

export async function renameResource(resourceId: string, newName: string): Promise<void> {
  return libraryRepository.renameResource(resourceId, newName);
}

