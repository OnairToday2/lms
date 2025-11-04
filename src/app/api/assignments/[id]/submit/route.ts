import { NextRequest, NextResponse } from "next/server";
import { createSVClient } from "@/services";
import * as assignmentResultService from "@/services/assignment-results/assignment-result.service";
import { Database } from "@/types/supabase.types";
import { QuestionOption } from "@/types/dto/assignments";

type QuestionType = Database["public"]["Enums"]["question_type"];

interface SubmitAssignmentRequest {
  employeeId: string;
  answers: Array<{
    questionId: string;
    questionLabel: string;
    questionType: QuestionType;
    options?: QuestionOption[];
    answer: string | string[]; // Format depends on question type
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

    // Validate each answer based on question type
    for (const answer of answers) {
      if (!answer.questionId || !answer.questionType) {
        return NextResponse.json(
          { error: "Thiếu thông tin câu hỏi" },
          { status: 400 }
        );
      }

      // Validate answer format based on question type
      switch (answer.questionType) {
        case "file":
          // For file type, answer should be array of URLs
          if (!Array.isArray(answer.answer) || answer.answer.length === 0) {
            return NextResponse.json(
              { error: `Vui lòng tải lên file cho câu hỏi: ${answer.questionLabel}` },
              { status: 400 }
            );
          }
          // Validate S3 URLs
          for (const url of answer.answer) {
            if (typeof url !== "string") {
              return NextResponse.json(
                { error: "Định dạng URL file không hợp lệ" },
                { status: 400 }
              );
            }
            const isValidS3Url = url.includes('.s3.') && url.includes('amazonaws.com');
            if (!isValidS3Url) {
              return NextResponse.json(
                { error: "URL file không hợp lệ" },
                { status: 400 }
              );
            }
          }
          break;

        case "text":
          // For text type, answer should be a non-empty string
          if (typeof answer.answer !== "string" || answer.answer.trim() === "") {
            return NextResponse.json(
              { error: `Vui lòng nhập câu trả lời cho câu hỏi: ${answer.questionLabel}` },
              { status: 400 }
            );
          }
          break;

        case "checkbox":
          // For checkbox type, answer should be array of option IDs
          if (!Array.isArray(answer.answer) || answer.answer.length === 0) {
            return NextResponse.json(
              { error: `Vui lòng chọn ít nhất một đáp án cho câu hỏi: ${answer.questionLabel}` },
              { status: 400 }
            );
          }
          // Validate option IDs exist in question options
          if (answer.options) {
            const validOptionIds = answer.options.map(opt => opt.id);
            for (const optionId of answer.answer) {
              if (!validOptionIds.includes(optionId)) {
                return NextResponse.json(
                  { error: "Đáp án được chọn không hợp lệ" },
                  { status: 400 }
                );
              }
            }
          }
          break;

        case "radio":
          // For radio type, answer should be a single option ID
          if (typeof answer.answer !== "string" || answer.answer.trim() === "") {
            return NextResponse.json(
              { error: `Vui lòng chọn đáp án cho câu hỏi: ${answer.questionLabel}` },
              { status: 400 }
            );
          }
          // Validate option ID exists in question options
          if (answer.options) {
            const validOptionIds = answer.options.map(opt => opt.id);
            if (!validOptionIds.includes(answer.answer)) {
              return NextResponse.json(
                { error: "Đáp án được chọn không hợp lệ" },
                { status: 400 }
              );
            }
          }
          break;

        default:
          return NextResponse.json(
            { error: `Loại câu hỏi không hợp lệ: ${answer.questionType}` },
            { status: 400 }
          );
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

