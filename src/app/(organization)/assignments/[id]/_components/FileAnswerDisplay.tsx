"use client";

import React from "react";
import { Box, Typography, Stack, Link } from "@mui/material";

interface FileAnswerDisplayProps {
  fileUrls: string[] | undefined;
}

const FileAnswerDisplay: React.FC<FileAnswerDisplayProps> = ({ fileUrls }) => {
  return (
    <Box>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
        Tệp nộp của học viên:
      </Typography>
      {fileUrls && fileUrls.length > 0 ? (
        <Stack spacing={1} sx={{ mb: 2 }}>
          {fileUrls.map((fileUrl, index) => (
            <Link
              key={index}
              href={fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              sx={{ fontSize: "0.875rem" }}
            >
              {`Tệp ${index + 1}: ${decodeURIComponent(fileUrl.split("/").pop() || "Xem tệp")}`}
            </Link>
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

