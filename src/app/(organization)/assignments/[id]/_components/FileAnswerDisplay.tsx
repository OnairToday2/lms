"use client";

import React from "react";
import { Box, Typography, Stack, Link } from "@mui/material";

interface FileAnswerDisplayProps {
  files: Array<{ url: string; originalName: string; fileSize: number; mimeType: string }> | undefined;
}

/**
 * Format file size in bytes to human-readable format
 */
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const FileAnswerDisplay: React.FC<FileAnswerDisplayProps> = ({ files }) => {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Tệp nộp của học viên:
      </Typography>
      {files && files.length > 0 ? (
        <Stack spacing={1} sx={{ mb: 2 }}>
          {files.map((file, index) => (
            <Box key={index}>
              <Link
                href={file.url}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ fontSize: "0.875rem" }}
              >
                {`Tệp ${index + 1}: ${file.originalName}`}
              </Link>
              <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                ({formatFileSize(file.fileSize)})
              </Typography>
            </Box>
          ))}
        </Stack>
      ) : (
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Học viên chưa nộp tệp
        </Typography>
      )}
    </Box>
  );
};

export default FileAnswerDisplay;

