import { NextRequest, NextResponse } from "next/server";
import { createFileResource } from "@/services/libraries/library.service";
import { CreateResourceRequest } from "@/types/dto/resources";

export async function POST(request: NextRequest) {
  try {
    const body: CreateResourceRequest = await request.json();
    const { name, libraryId, parentId, path, size, mimeType, extension, thumbnailUrl } = body;

    if (!name || !libraryId || !path || !size || !mimeType || !extension) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const resource = await createFileResource(
      name,
      libraryId,
      parentId,
      path,
      size,
      mimeType,
      extension,
      thumbnailUrl || null
    );

    return NextResponse.json(resource, { status: 201 });
  } catch (error) {
    console.error("Error creating resource:", error);
    const errorMessage = error instanceof Error
      ? error.message
      : "An unexpected error occurred while creating resource";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

