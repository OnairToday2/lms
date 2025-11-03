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
  LinearProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PageContainer from "@/shared/ui/PageContainer";
import { useGetAssignmentQuery, useGetAssignmentQuestionsQuery } from "@/modules/assignment-management/operations/query";
import { useGetEmployeeQuery } from "@/modules/employees/operations/query";
import { useDialogs } from "@/hooks/useDialogs/useDialogs";
import useNotifications from "@/hooks/useNotifications/useNotifications";
import { uploadFileToS3 } from "@/utils/s3-upload";
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
  const notifications = useNotifications();

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

  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState(0);
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

    setIsSubmitting(true);
    setUploadProgress(0);

    try {
      const questionMap = new Map(
        questions?.map(q => [q.id, q.label]) || []
      );

      const answersWithFiles = data.answers.filter(answer => answer.files.length > 0);

      if (answersWithFiles.length === 0) {
        throw new Error("Vui lòng tải lên ít nhất một file");
      }

      const totalFiles = answersWithFiles.reduce((sum, answer) => sum + answer.files.length, 0);
      let completedFiles = 0;

      const answersWithUrls = await Promise.all(
        answersWithFiles.map(async (answer) => {
          const uploadedFileResults = await Promise.all(
            answer.files.map(async (file) => {
              const result = await uploadFileToS3(file, {
                onProgress: (percent) => {
                  const currentFileProgress = percent / 100;
                  const overallProgress = Math.round(
                    ((completedFiles + currentFileProgress) / totalFiles) * 100
                  );
                  setUploadProgress(overallProgress);
                },
              });

              completedFiles++;
              setUploadProgress(Math.round((completedFiles / totalFiles) * 100));

              return {
                url: result.url,
                fileName: result.fileName,
                fileType: result.fileType,
                fileSize: result.fileSize,
              };
            })
          );

          return {
            questionId: answer.questionId,
            questionLabel: questionMap.get(answer.questionId) || "",
            files: uploadedFileResults,
          };
        })
      );

      const response = await fetch(`/api/assignments/${assignmentId}/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          employeeId,
          answers: answersWithUrls,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Có lỗi xảy ra khi nộp bài");
      }

      notifications.show(result.message || "Nộp bài thành công!", {
        severity: "success",
      });

      router.push(`/assignments/${assignmentId}/students`);
    } catch (error) {
      console.error("Error submitting assignment:", error);

      const errorMessage = error instanceof Error
        ? error.message
        : "Có lỗi xảy ra khi nộp bài. Vui lòng thử lại.";

      notifications.show(errorMessage, {
        severity: "error",
      });
    } finally {
      setIsSubmitting(false);
      setUploadProgress(0);
    }
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
                {/* Upload Progress */}
                {isSubmitting && uploadProgress > 0 && (
                  <Box>
                    <LinearProgress variant="determinate" value={uploadProgress} />
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                      Đang tải lên... {uploadProgress}%
                    </Typography>
                  </Box>
                )}

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
                  isSubmitDisabled={!hasAnyFiles() || isSubmitting}
                  isSubmitting={isSubmitting}
                />
              </Stack>
            </form>
          )}
        </Card>
      </Box>
    </PageContainer>
  );
}

