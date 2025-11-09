"use client";

import React from "react";
import {
  Card,
  Typography,
  Stack,
  TextField,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Box,
  Chip,
  Link,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { QuestionGradeDetail } from "@/types/dto/assignments";
import { Control, Controller } from "react-hook-form";

interface GradeQuestionCardProps {
  question: QuestionGradeDetail;
  questionNumber: number;
  control?: Control<any>;
}

const GradeQuestionCard: React.FC<GradeQuestionCardProps> = ({
  question,
  questionNumber,
  control,
}) => {
  const isCorrect = question.earnedScore === question.maxScore;

  return (
    <Card variant="outlined" sx={{ p: 2.5 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1.5 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Câu {questionNumber} ({question.maxScore} điểm)
        </Typography>
        {question.isAutoGraded && (
          <Chip
            icon={isCorrect ? <CheckCircleIcon /> : <CancelIcon />}
            label={`${question.earnedScore}/${question.maxScore} điểm`}
            color={isCorrect ? "success" : "error"}
            size="small"
          />
        )}
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

          {control && (
            <Controller
              name={`grades.${question.id}`}
              control={control}
              rules={{
                required: "Vui lòng nhập điểm",
                min: { value: 0, message: "Điểm không được nhỏ hơn 0" },
                max: { value: question.maxScore, message: `Điểm không được lớn hơn ${question.maxScore}` },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Điểm"
                  type="number"
                  size="small"
                  fullWidth
                  inputProps={{ min: 0, max: question.maxScore, step: 0.5 }}
                  error={!!error}
                  helperText={error?.message || `Điểm tối đa: ${question.maxScore}`}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              )}
            />
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

          {control && (
            <Controller
              name={`grades.${question.id}`}
              control={control}
              rules={{
                required: "Vui lòng nhập điểm",
                min: { value: 0, message: "Điểm không được nhỏ hơn 0" },
                max: { value: question.maxScore, message: `Điểm không được lớn hơn ${question.maxScore}` },
              }}
              render={({ field, fieldState: { error } }) => (
                <TextField
                  {...field}
                  label="Điểm"
                  type="number"
                  size="small"
                  fullWidth
                  inputProps={{ min: 0, max: question.maxScore, step: 0.5 }}
                  error={!!error}
                  helperText={error?.message || `Điểm tối đa: ${question.maxScore}`}
                  onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                />
              )}
            />
          )}
        </Box>
      )}
    </Card>
  );
};

export default React.memo(GradeQuestionCard);

