"use client";

import React, { useEffect, useMemo } from "react";
import {
  Box,
  Card,
  Typography,
  Stack,
  Button,
  Avatar,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SaveIcon from "@mui/icons-material/Save";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useGetSubmissionDetailQuery } from "@/modules/assignment-management/operations/query";
import { useSaveGradeMutation } from "@/modules/assignment-management/operations/mutation";
import GradeQuestionCard from "./GradeQuestionCard";
import { QuestionGradeInput } from "@/types/dto/assignments";

interface AssignmentGradingProps {
  assignmentId: string;
  employeeId: string;
}

interface GradeFormData {
  grades: Record<string, number>;
}

const AssignmentGrading: React.FC<AssignmentGradingProps> = ({
  assignmentId,
  employeeId,
}) => {
  const router = useRouter();
  const { data: submission, isLoading, error } = useGetSubmissionDetailQuery(assignmentId, employeeId);
  const saveGradeMutation = useSaveGradeMutation();

  const defaultGrades = useMemo(() => {
    if (!submission) return {};

    const initialGrades: Record<string, number> = {};
    submission.questions.forEach((q) => {
      if (!q.isAutoGraded) {
        initialGrades[q.id] = q.earnedScore ?? 0;
      }
    });
    return initialGrades;
  }, [submission]);

  const { control, handleSubmit, watch, reset, formState: { errors } } = useForm<GradeFormData>({
    defaultValues: {
      grades: defaultGrades,
    },
  });

  useEffect(() => {
    if (submission) {
      reset({ grades: defaultGrades });
    }
  }, [submission, defaultGrades, reset]);

  const grades = watch("grades");

  const totalScore = useMemo(() => {
    if (!submission) return 0;

    let total = 0;
    submission.questions.forEach((q) => {
      if (q.isAutoGraded) {
        total += q.earnedScore ?? 0;
      } else {
        total += grades[q.id] ?? 0;
      }
    });

    return total;
  }, [submission, grades]);

  const hasAllManualGrades = useMemo(() => {
    if (!submission) return false;

    const manualQuestions = submission.questions.filter((q) => !q.isAutoGraded);
    return manualQuestions.every((q) => {
      const grade = grades[q.id];
      return grade !== undefined && grade !== null && !isNaN(grade);
    });
  }, [submission, grades]);

  const onSubmit = async (data: GradeFormData) => {
    if (!submission) return;

    const questionGrades: QuestionGradeInput[] = submission.questions
      .filter((q) => !q.isAutoGraded)
      .map((q) => ({
        questionId: q.id,
        score: data.grades[q.id] ?? 0,
      }));

    try {
      await saveGradeMutation.mutateAsync({
        assignmentId,
        employeeId,
        questionGrades,
      });

      alert("Lưu điểm thành công!");
      router.push(`/assignments/${assignmentId}/students`);
    } catch (error) {
      console.error("Failed to save grade:", error);
      alert(error instanceof Error ? error.message : "Có lỗi xảy ra khi lưu điểm");
    }
  };

  const handleBack = () => {
    router.push(`/assignments/${assignmentId}/students`);
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !submission) {
    return (
      <Box p={3}>
        <Alert severity="error">
          {error instanceof Error ? error.message : "Không thể tải thông tin bài nộp"}
        </Alert>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mt: 2 }}
        >
          Quay lại
        </Button>
      </Box>
    );
  }

  return (
    <Box>
      <Card sx={{ p: 3, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Avatar
            src={submission.avatar || undefined}
            alt={submission.fullName}
            sx={{ width: 56, height: 56 }}
          />
          <Box flex={1}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {submission.fullName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Mã học viên: {submission.employeeCode}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Email: {submission.email}
            </Typography>
          </Box>
          <Box textAlign="right">
            <Typography variant="body2" color="text.secondary">
              Ngày nộp
            </Typography>
            <Typography variant="body1">
              {new Date(submission.submittedAt).toLocaleString("vi-VN")}
            </Typography>
          </Box>
        </Stack>

        <Divider sx={{ my: 2 }} />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {submission.assignmentName}
            </Typography>
            {submission.assignmentDescription && (
              <Box
                sx={{
                  "& p": { margin: 0 },
                  "& ul, & ol": { marginTop: 0.5, marginBottom: 0.5 },
                }}
              >
                <Typography
                  variant="body2"
                  color="text.secondary"
                  component="div"
                  dangerouslySetInnerHTML={{ __html: submission.assignmentDescription }}
                />
              </Box>
            )}
          </Box>
          <Box textAlign="right">
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {totalScore.toFixed(1)}/{submission.maxScore}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Tổng điểm
            </Typography>
          </Box>
        </Stack>
      </Card>

      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack spacing={2} sx={{ mb: 3 }}>
          {submission.questions.map((question, index) => (
            <GradeQuestionCard
              key={question.id}
              question={question}
              questionNumber={index + 1}
              control={question.isAutoGraded ? undefined : control}
            />
          ))}
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
          >
            Quay lại
          </Button>
          <Button
            type="submit"
            variant="contained"
            startIcon={<SaveIcon />}
            disabled={!hasAllManualGrades || saveGradeMutation.isPending}
          >
            {saveGradeMutation.isPending ? "Đang lưu..." : "Lưu điểm"}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default AssignmentGrading;

