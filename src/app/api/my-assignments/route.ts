import { NextRequest, NextResponse } from "next/server";
import { createSVClient } from "@/services";
import { getMyAssignments } from "@/services/assignments/assignment.service";
import { employeesRepository } from "@/repository";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createSVClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    // Get employee ID from user ID
    const employee = await employeesRepository.getEmployeeByUserId(user.id);

    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 }
      );
    }

    const myAssignments = await getMyAssignments(employee.id);

    return NextResponse.json(myAssignments, { status: 200 });
  } catch (error) {
    console.error("Error fetching my assignments:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Failed to fetch my assignments",
      },
      { status: 500 }
    );
  }
}

