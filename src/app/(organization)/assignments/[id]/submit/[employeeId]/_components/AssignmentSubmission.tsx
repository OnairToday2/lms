"use client";

import * as React from "react";
import { useParams, useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import {
  Box,
  Button,
  Card,
  Typography,
  CircularProgress,
  Alert,
  Stack,
  FormLabel,
  IconButton,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DeleteIcon from "@mui/icons-material/Delete";
import ImageIcon from "@mui/icons-material/Image";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import AudiotrackIcon from "@mui/icons-material/Audiotrack";
import PageContainer from "@/shared/ui/PageContainer";
import { useGetAssignmentQuery, useGetAssignmentQuestionsQuery } from "@/modules/assignment-management/operations/query";
import { useGetEmployeeQuery } from "@/modules/employees/operations/query";
import { useDialogs } from "@/hooks/useDialogs/useDialogs";
import Image from "next/image";
import { formatFileSize } from "@/utils";

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

  const getFileIcon = (file: File) => {
    if (file.type.startsWith("image/")) {
      return <ImageIcon />;
    } else if (file.type.startsWith("video/")) {
      return <VideoLibraryIcon />;
    } else if (file.type.startsWith("audio/")) {
      return <AudiotrackIcon />;
    }
    return <CloudUploadIcon />;
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
          {(assignment || employee) && (
            <Box sx={{ mb: 4, p: 3, bgcolor: "grey.50", borderRadius: 2 }}>
              {assignment && (
                <Typography variant="h6" sx={{ mb: 2 }}>
                  {assignment.name}
                </Typography>
              )}
              {employee && (
                <Stack direction="row" spacing={2} alignItems="center">
                  <Typography variant="body2" color="text.secondary">
                    Học viên:
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {employee.profiles?.full_name} ({employee.employee_code})
                  </Typography>
                </Stack>
              )}
            </Box>
          )}

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
                    <Card key={question.id} variant="outlined" sx={{ p: 3 }}>
                      <Typography variant="h6" sx={{ mb: 2 }}>
                        Câu {index + 1}
                      </Typography>
                      
                      <Typography variant="body1" sx={{ mb: 3 }}>
                        {question.label}
                      </Typography>

                      <FormLabel sx={{ mb: 2, display: "block" }}>
                        Tải lên file trả lời <span style={{ color: "red" }}>*</span>
                      </FormLabel>

                      <Typography variant="caption" color="text.secondary" sx={{ mb: 2, display: "block" }}>
                        Hỗ trợ: Hình ảnh (JPG, PNG, GIF), Video (MP4, MOV, AVI), Audio (MP3, WAV)
                      </Typography>

                      {/* File Upload Button */}
                      <Button
                        variant="outlined"
                        component="label"
                        startIcon={<CloudUploadIcon />}
                        sx={{ mb: 2 }}
                      >
                        Chọn file
                        <input
                          type="file"
                          hidden
                          multiple
                          accept="image/*,video/*,audio/*"
                          onChange={(e) => handleFileSelect(question.id, e.target.files)}
                        />
                      </Button>

                      {/* File List */}
                      {files.length > 0 && (
                        <Stack spacing={2} sx={{ mt: 2 }}>
                          {files.map((file, fileIndex) => (
                            <Card key={fileIndex} variant="outlined" sx={{ p: 2 }}>
                              <Stack direction="row" spacing={2} alignItems="center">
                                {/* File Preview/Icon */}
                                <Box sx={{ flexShrink: 0 }}>
                                  {file.type.startsWith("image/") ? (
                                    <Box
                                      sx={{
                                        width: 60,
                                        height: 60,
                                        position: "relative",
                                        borderRadius: 1,
                                        overflow: "hidden",
                                      }}
                                    >
                                      <Image
                                        src={URL.createObjectURL(file)}
                                        alt={file.name}
                                        fill
                                        style={{ objectFit: "cover" }}
                                      />
                                    </Box>
                                  ) : (
                                    <Box
                                      sx={{
                                        width: 60,
                                        height: 60,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        bgcolor: "grey.100",
                                        borderRadius: 1,
                                      }}
                                    >
                                      {getFileIcon(file)}
                                    </Box>
                                  )}
                                </Box>

                                {/* File Info */}
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                  <Typography
                                    variant="body2"
                                    fontWeight={500}
                                    sx={{
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      whiteSpace: "nowrap",
                                    }}
                                  >
                                    {file.name}
                                  </Typography>
                                  <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                                    <Chip
                                      label={formatFileSize(file.size)}
                                      size="small"
                                      variant="outlined"
                                    />
                                    <Chip
                                      label={file.type || "Unknown"}
                                      size="small"
                                      variant="outlined"
                                    />
                                  </Stack>
                                </Box>

                                {/* Remove Button */}
                                <IconButton
                                  size="small"
                                  color="error"
                                  onClick={() => handleRemoveFile(question.id, fileIndex)}
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </Stack>
                            </Card>
                          ))}
                        </Stack>
                      )}
                    </Card>
                  );
                })}

                {/* Submit Button */}
                <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
                  <Button
                    variant="outlined"
                    onClick={handleBack}
                  >
                    Hủy
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={!hasAnyFiles()}
                  >
                    Nộp bài
                  </Button>
                </Box>
              </Stack>
            </form>
          )}
        </Card>
      </Box>
    </PageContainer>
  );
}

