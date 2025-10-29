"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  Box,
  Button,
  Card,
  Typography,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PageContainer from "@/shared/ui/PageContainer";
import { useGetAssignmentQuery, useGetAssignmentQuestionsQuery } from "@/modules/assignment-management/operations/query";
import { useGetEmployeeQuery } from "@/modules/employees/operations/query";
import { useDialogs } from "@/hooks/useDialogs/useDialogs";
import AssignmentHeader from "./AssignmentHeader";
import QuestionCard from "./QuestionCard";
import SubmissionActions from "./SubmissionActions";

interface QuestionAnswer {
  questionId: string;
  files: File[];
}

interface SubmissionFormData {
  answers: QuestionAnswer[];
}

export default function AssignmentSubmission() {
  const params = useParams();
  const router = useRouter();
  const { confirm } = useDialogs();

  const assignmentId = params.id as string;
  const employeeId = params.employeeId as string;

  const { data: assignment, isLoading: isLoadingAssignment } = useGetAssignmentQuery(assignmentId);
  const { data: questions, isLoading: isLoadingQuestions, error: questionsError } = useGetAssignmentQuestionsQuery(assignmentId);
  const { data: employee, isLoading: isLoadingEmployee } = useGetEmployeeQuery(employeeId);

  const { control, handleSubmit, watch, setValue } = useForm<SubmissionFormData>({
    defaultValues: {
      answers: [],
    },
  });

  const isLoading = isLoadingAssignment || isLoadingQuestions || isLoadingEmployee;
  const answers = watch("answers");

  // Initialize answers when questions are loaded
  React.useEffect(() => {
    if (questions && questions.length > 0) {
      const initialAnswers = questions.map((q) => ({
        questionId: q.id,
        files: [],
      }));
      setValue("answers", initialAnswers);
    }
  }, [questions, setValue]);

  const handleBack = () => {
    router.push(`/assignments/${assignmentId}/students`);
  };

  const handleFileSelect = (questionId: string, files: FileList | null) => {
    if (!files || files.length === 0) return;

    const currentAnswers = answers || [];
    const answerIndex = currentAnswers.findIndex((a) => a.questionId === questionId);

    if (answerIndex >= 0) {
      const currentAnswer = currentAnswers[answerIndex];
      if (!currentAnswer) return;

      const newFiles = Array.from(files);
      const updatedAnswers = [...currentAnswers];
      updatedAnswers[answerIndex] = {
        questionId: currentAnswer.questionId,
        files: [...currentAnswer.files, ...newFiles],
      };
      setValue("answers", updatedAnswers);
    }
  };

  const handleRemoveFile = (questionId: string, fileIndex: number) => {
    const currentAnswers = answers || [];
    const answerIndex = currentAnswers.findIndex((a) => a.questionId === questionId);

    if (answerIndex >= 0) {
      const currentAnswer = currentAnswers[answerIndex];
      if (!currentAnswer) return;

      const updatedAnswers = [...currentAnswers];
      const updatedFiles = [...currentAnswer.files];
      updatedFiles.splice(fileIndex, 1);
      updatedAnswers[answerIndex] = {
        questionId: currentAnswer.questionId,
        files: updatedFiles,
      };
      setValue("answers", updatedAnswers);
    }
  };

  const hasAnyFiles = () => {
    return answers?.some((answer) => answer.files.length > 0) || false;
  };

  const onSubmit = async (data: SubmissionFormData) => {
    const confirmed = await confirm(
      "Bạn có chắc chắn muốn nộp bài? Sau khi nộp bài, bạn không thể chỉnh sửa.",
      {
        title: "Xác nhận nộp bài",
        okText: "Nộp bài",
        cancelText: "Hủy",
      }
    );

    if (!confirmed) return;

    // For now, just log the data to console
    console.log("Submission data:", {
      assignmentId,
      employeeId,
      answers: data.answers.map((answer) => ({
        questionId: answer.questionId,
        fileCount: answer.files.length,
        files: answer.files.map((f) => ({
          name: f.name,
          size: f.size,
          type: f.type,
        })),
      })),
    });

    // TODO: Implement actual file upload and submission API call
    alert("Dữ liệu đã được log ra console. API submission sẽ được implement sau.");
  };

  return (
    <PageContainer
      title={assignment ? `Nộp bài - ${assignment.name}` : "Nộp bài"}
      breadcrumbs={[
        { title: "Bài kiểm tra", path: "/assignments" },
        { title: assignment?.name || "...", path: `/assignments/${assignmentId}/students` },
        { title: "Nộp bài" },
      ]}
    >
      <Box sx={{ py: 3 }}>
        <Card sx={{ p: 3 }}>
          <Stack direction="row" spacing={2} sx={{ mb: 3 }} alignItems="center">
            <Button
              variant="outlined"
              startIcon={<ArrowBackIcon />}
              onClick={handleBack}
            >
              Quay lại
            </Button>
          </Stack>

          {/* Assignment and Student Info */}
          <AssignmentHeader assignment={assignment} employee={employee} />

          {isLoading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 400,
              }}
            >
              <CircularProgress />
            </Box>
          ) : questionsError ? (
            <Alert severity="error">
              Có lỗi xảy ra khi tải danh sách câu hỏi
            </Alert>
          ) : !questions || questions.length === 0 ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: 400,
              }}
            >
              <Typography variant="body2" color="text.secondary">
                Bài kiểm tra chưa có câu hỏi nào
              </Typography>
            </Box>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <Stack spacing={4}>
                {questions.map((question, index) => {
                  const answer = answers?.find((a) => a.questionId === question.id);
                  const files = answer?.files || [];

                  return (
                    <QuestionCard
                      key={question.id}
                      question={question}
                      questionNumber={index + 1}
                      files={files}
                      onFileSelect={(files) => handleFileSelect(question.id, files)}
                      onRemoveFile={(fileIndex) => handleRemoveFile(question.id, fileIndex)}
                    />
                  );
                })}

                {/* Submit Button */}
                <SubmissionActions
                  onCancel={handleBack}
                  onSubmit={() => {}}
                  isSubmitDisabled={!hasAnyFiles()}
                />
              </Stack>
            </form>
          )}
        </Card>
      </Box>
    </PageContainer>
  );
}

