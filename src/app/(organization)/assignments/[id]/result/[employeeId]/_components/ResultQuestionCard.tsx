"use client";

import React from "react";
import {
  Card,
  Typography,
  Stack,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Box,
  Chip,
  Link,
  TextField,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { QuestionGradeDetail } from "@/types/dto/assignments";

interface ResultQuestionCardProps {
  question: QuestionGradeDetail;
  questionNumber: number;
}

const ResultQuestionCard: React.FC<ResultQuestionCardProps> = ({
  question,
  questionNumber,
}) => {
  const isCorrect = question.earnedScore === question.maxScore;

  return (
    <Card variant="outlined" sx={{ p: 2.5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Câu {questionNumber} ({question.maxScore} điểm)
        </Typography>
        <Chip
          icon={isCorrect ? <CheckCircleIcon /> : <CancelIcon />}
          label={`${question.earnedScore}/${question.maxScore} điểm`}
          color={isCorrect ? "success" : "error"}
          size="small"
        />
      </Stack>

      <Typography variant="body1" sx={{ mb: 2 }}>
        {question.label}
      </Typography>

      {question.attachments && question.attachments.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
            Tệp đính kèm:
          </Typography>
          <Stack spacing={0.5}>
            {question.attachments.map((url, index) => (
              <Link
                key={index}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ fontSize: "0.875rem" }}
              >
                Tệp đính kèm {index + 1}
              </Link>
            ))}
          </Stack>
        </Box>
      )}

      {question.type === "radio" && (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Câu trả lời của học viên:
          </Typography>
          <RadioGroup value={question.answer.selectedOptionId || ""}>
            {question.options?.map((option) => {
              const isSelected = option.id === question.answer.selectedOptionId;
              const isCorrectOption = option.correct;

              return (
                <FormControlLabel
                  key={option.id}
                  value={option.id}
                  control={<Radio size="small" disabled />}
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body2">{option.label}</Typography>
                      {isSelected && isCorrectOption && (
                        <CheckCircleIcon fontSize="small" color="success" />
                      )}
                      {isSelected && !isCorrectOption && (
                        <CancelIcon fontSize="small" color="error" />
                      )}
                      {!isSelected && isCorrectOption && (
                        <Typography variant="caption" color="success.main">
                          (Đáp án đúng)
                        </Typography>
                      )}
                    </Stack>
                  }
                  sx={{ mb: 0.5 }}
                />
              );
            })}
          </RadioGroup>
        </Box>
      )}

      {question.type === "checkbox" && (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Câu trả lời của học viên:
          </Typography>
          <FormGroup>
            {question.options?.map((option) => {
              const isSelected = question.answer.selectedOptionIds?.includes(option.id);
              const isCorrectOption = option.correct;

              return (
                <FormControlLabel
                  key={option.id}
                  control={<Checkbox size="small" checked={isSelected} disabled />}
                  label={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Typography variant="body2">{option.label}</Typography>
                      {isSelected && isCorrectOption && (
                        <CheckCircleIcon fontSize="small" color="success" />
                      )}
                      {isSelected && !isCorrectOption && (
                        <CancelIcon fontSize="small" color="error" />
                      )}
                      {!isSelected && isCorrectOption && (
                        <Typography variant="caption" color="success.main">
                          (Đáp án đúng)
                        </Typography>
                      )}
                    </Stack>
                  }
                  sx={{ mb: 0.5 }}
                />
              );
            })}
          </FormGroup>
        </Box>
      )}

      {question.type === "text" && (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Câu trả lời của học viên:
          </Typography>
          <TextField
            fullWidth
            multiline
            rows={5}
            value={question.answer.text || ""}
            disabled
            sx={{ mb: 2 }}
          />

          {question.answerAttachments && question.answerAttachments.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                Tệp đính kèm của học viên:
              </Typography>
              <Stack spacing={0.5}>
                {question.answerAttachments.map((url, index) => (
                  <Link
                    key={index}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{ fontSize: "0.875rem" }}
                  >
                    Tệp đính kèm {index + 1}
                  </Link>
                ))}
              </Stack>
            </Box>
          )}

          <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Điểm đạt được:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {question.earnedScore}/{question.maxScore} điểm
            </Typography>
          </Box>

          {question.feedback && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "info.50", borderRadius: 1, border: "1px solid", borderColor: "info.200" }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600 }}>
                Nhận xét của giáo viên:
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                {question.feedback}
              </Typography>
            </Box>
          )}
        </Box>
      )}

      {question.type === "file" && (
        <Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Tệp nộp của học viên:
          </Typography>
          {question.answer.fileUrl ? (
            <Box sx={{ mb: 2 }}>
              <Link
                href={question.answer.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ fontSize: "0.875rem" }}
              >
                Xem tệp đã nộp
              </Link>
            </Box>
          ) : (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Học viên chưa nộp tệp
            </Typography>
          )}

          <Box sx={{ mt: 2, p: 2, bgcolor: "grey.50", borderRadius: 1 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
              Điểm đạt được:
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              {question.earnedScore}/{question.maxScore} điểm
            </Typography>
          </Box>

          {question.feedback && (
            <Box sx={{ mt: 2, p: 2, bgcolor: "info.50", borderRadius: 1, border: "1px solid", borderColor: "info.200" }}>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, fontWeight: 600 }}>
                Nhận xét của giáo viên:
              </Typography>
              <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                {question.feedback}
              </Typography>
            </Box>
          )}
        </Box>
      )}
    </Card>
  );
};

export default React.memo(ResultQuestionCard);

