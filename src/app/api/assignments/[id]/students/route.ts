import { NextRequest, NextResponse } from "next/server";
import { getAssignmentStudents } from "@/services/assignments/assignment.service";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: assignmentId } = await params;

    const students = await getAssignmentStudents(assignmentId);

    return NextResponse.json(students, { status: 200 });
  } catch (error) {
    console.error("Error fetching assignment students:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch assignment students",
      },
      { status: 500 }
    );
  }
}

