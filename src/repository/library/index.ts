import { createSVClient } from "@/services";
import { Database } from "@/types/supabase.types";

type Library = Database["public"]["Tables"]["libraries"]["Row"];
type Resource = Database["public"]["Tables"]["resources"]["Row"];

export async function getLibraryByEmployeeId(employeeId: string): Promise<Library | null> {
  const supabase = await createSVClient();

  const { data, error } = await supabase
    .from("libraries")
    .select("*")
    .eq("owner_id", employeeId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch library: ${error.message}`);
  }

  return data;
}

export async function getResourcesByLibrary(libraryId: string): Promise<Resource[]> {
  const supabase = await createSVClient();

  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .eq("library_id", libraryId)
    .is("deleted_at", null)
    .order("kind", { ascending: false })
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch resources: ${error.message}`);
  }

  return data || [];
}

export async function getResourcesByLibraryAndFolder(
  libraryId: string,
  folderId: string | null
): Promise<Resource[]> {
  const supabase = await createSVClient();

  let query = supabase
    .from("resources")
    .select("*")
    .eq("library_id", libraryId)
    .is("deleted_at", null);

  if (folderId === null) {
    query = query.is("parent_id", null);
  } else {
    query = query.eq("parent_id", folderId);
  }

  const { data, error } = await query
    .order("kind", { ascending: false })
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch resources: ${error.message}`);
  }

  return data || [];
}

export async function deleteResource(resourceId: string): Promise<void> {
  const supabase = await createSVClient();

  const { error } = await supabase
    .from("resources")
    .update({ deleted_at: new Date().toISOString() })
    .eq("id", resourceId);

  if (error) {
    throw new Error(`Failed to delete resource: ${error.message}`);
  }
}

