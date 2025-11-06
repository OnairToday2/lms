import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import type { CreateAssignmentDto } from "@/types/dto/assignments";
import { assignmentService } from "@/services";
import { createSVClient } from "@/services";
import { employeesRepository } from "@/repository";

export async function POST(request: NextRequest) {
  try {
    const payload: CreateAssignmentDto = await request.json();

    // Get the current user's employee ID
    const supabase = await createSVClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
    }

    const employee = await employeesRepository.getEmployeeByUserId(user.id);

    const result = await assignmentService.createAssignmentWithRelations(payload, employee.id);

    revalidatePath("/assignments");

    return NextResponse.json(
      {
        success: true,
        message: "Tạo bài kiểm tra thành công",
        assignmentId: result.assignmentId,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating assignment:", error);

    const errorMessage = error instanceof Error ? error.message : "Có lỗi xảy ra khi tạo bài kiểm tra";

    return NextResponse.json({ success: false, message: errorMessage }, { status: 500 });
  }
}

