import * as React from "react";
import { Card, Typography, FormLabel, Stack } from "@mui/material";
import type { AssignmentQuestionDto } from "@/types/dto/assignments";
import FileUploadButton from "./FileUploadButton";
import FileListItem from "./FileListItem";

interface QuestionCardProps {
  question: AssignmentQuestionDto;
  questionNumber: number;
  files: File[];
  onFileSelect: (files: FileList | null) => void;
  onRemoveFile: (fileIndex: number) => void;
}

export default function QuestionCard({
  question,
  questionNumber,
  files,
  onFileSelect,
  onRemoveFile,
}: QuestionCardProps) {
  return (
    <Card variant="outlined" sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Câu {questionNumber}
      </Typography>

      <Typography variant="body1" sx={{ mb: 3 }}>
        {question.label}
      </Typography>

      <FormLabel sx={{ mb: 2, display: "block" }}>
        Tải lên file trả lời <span style={{ color: "red" }}>*</span>
      </FormLabel>

      <FileUploadButton onFileSelect={onFileSelect} />

      {/* File List */}
      {files.length > 0 && (
        <Stack spacing={2} sx={{ mt: 2 }}>
          {files.map((file, fileIndex) => (
            <FileListItem
              key={fileIndex}
              file={file}
              onRemove={() => onRemoveFile(fileIndex)}
            />
          ))}
        </Stack>
      )}
    </Card>
  );
}

