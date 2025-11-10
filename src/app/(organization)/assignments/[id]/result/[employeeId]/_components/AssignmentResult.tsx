"use client";

import React, { useMemo } from "react";
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
import { useRouter } from "next/navigation";
import { useGetSubmissionDetailQuery } from "@/modules/assignment-management/operations/query";
import PageContainer from "@/shared/ui/PageContainer";
import ResultQuestionCard from "./ResultQuestionCard";

interface AssignmentResultProps {
  assignmentId: string;
  employeeId: string;
}

const AssignmentResult: React.FC<AssignmentResultProps> = ({
  assignmentId,
  employeeId,
}) => {
  const router = useRouter();
  const { data: submission, isLoading, error } = useGetSubmissionDetailQuery(assignmentId, employeeId);

  const totalScore = useMemo(() => {
    if (!submission) return 0;

    let total = 0;
    submission.questions.forEach((q) => {
      total += q.earnedScore ?? 0;
    });

    return total;
  }, [submission]);

  const handleBack = () => {
    router.push(`/assignments/${assignmentId}/students`);
  };

  if (isLoading) {
    return (
      <PageContainer
        title="Kết quả bài kiểm tra"
        breadcrumbs={[
          { title: "Bài tập", path: "/assignments" },
          { title: "Kết quả" },
        ]}
      >
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
          <CircularProgress />
        </Box>
      </PageContainer>
    );
  }

  if (error || !submission) {
    return (
      <PageContainer
        title="Kết quả bài kiểm tra"
        breadcrumbs={[
          { title: "Bài tập", path: "/assignments" },
          { title: "Kết quả" },
        ]}
      >
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
      </PageContainer>
    );
  }

  return (
    <PageContainer
      title={`Kết quả - ${submission.assignmentName}`}
      breadcrumbs={[
        { title: "Bài tập", path: "/assignments" },
        { title: submission.assignmentName, path: `/assignments/${assignmentId}` },
        { title: "Danh sách học viên", path: `/assignments/${assignmentId}/students` },
        { title: "Kết quả" },
      ]}
    >
      <Box sx={{ py: 3 }}>
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

        {submission.feedback && (
          <Card sx={{ p: 3, mb: 3, bgcolor: "info.50", border: "1px solid", borderColor: "info.200" }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Nhận xét chung của giáo viên
            </Typography>
            <Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
              {submission.feedback}
            </Typography>
          </Card>
        )}

        <Stack spacing={2} sx={{ mb: 3 }}>
          {submission.questions.map((question, index) => (
            <ResultQuestionCard
              key={question.id}
              question={question}
              questionNumber={index + 1}
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
        </Stack>
      </Box>
    </PageContainer>
  );
};

export default AssignmentResult;

