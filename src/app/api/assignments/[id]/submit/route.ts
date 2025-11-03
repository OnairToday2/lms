import { NextRequest, NextResponse } from "next/server";
import { createSVClient } from "@/services";
import * as assignmentResultService from "@/services/assignment-results/assignment-result.service";

interface SubmitAssignmentRequest {
  employeeId: string;
  answers: Array<{
    questionId: string;
    questionLabel: string;
    files: Array<{
      url: string;
      fileName: string;
      fileType: string;
      fileSize: number;
    }>;
  }>;
}

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSVClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const params = await context.params;
    const assignmentId = params.id;

    const body: SubmitAssignmentRequest = await request.json();
    const { employeeId, answers } = body;

    if (!employeeId) {
      return NextResponse.json(
        { error: "Missing required field: employeeId" },
        { status: 400 }
      );
    }

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return NextResponse.json(
        { error: "Thiếu thông tin bắt buộc: answers" },
        { status: 400 }
      );
    }

    for (const answer of answers) {
      if (!answer.files || !Array.isArray(answer.files)) {
        return NextResponse.json(
          { error: "Định dạng câu trả lời không hợp lệ" },
          { status: 400 }
        );
      }

      for (const file of answer.files) {
        if (!file.url || !file.fileName || !file.fileType || !file.fileSize) {
          return NextResponse.json(
            { error: "Thiếu thông tin file" },
            { status: 400 }
          );
        }

        const isValidS3Url = file.url.includes('.s3.') && file.url.includes('amazonaws.com');
        if (!isValidS3Url) {
          return NextResponse.json(
            { error: "URL file không hợp lệ" },
            { status: 400 }
          );
        }
      }
    }

    const result = await assignmentResultService.submitAssignment({
      assignmentId,
      employeeId,
      answers,
    });

    return NextResponse.json(
      {
        success: true,
        data: result,
        message: "Nộp bài thành công!",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting assignment:", error);

    const errorMessage = error instanceof Error
      ? error.message
      : "Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.";

    const isDuplicateError = errorMessage.includes("đã được nộp trước đó");
    const statusCode = isDuplicateError ? 409 : 500;

    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    );
  }
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const supabase = await createSVClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const params = await context.params;
    const assignmentId = params.id;

    const { searchParams } = new URL(request.url);
    const employeeId = searchParams.get("employeeId");

    if (!employeeId) {
      return NextResponse.json(
        { error: "Missing required query parameter: employeeId" },
        { status: 400 }
      );
    }

    const status = await assignmentResultService.getSubmissionStatus(
      assignmentId,
      employeeId
    );

    if (!status) {
      return NextResponse.json(
        { submitted: false },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        submitted: true,
        data: status,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error checking submission status:", error);

    const errorMessage = error instanceof Error
      ? error.message
      : "Có lỗi xảy ra khi kiểm tra trạng thái nộp bài.";

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}

