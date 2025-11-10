"use client";

import React from "react";
import { Box, Typography, Stack, Link } from "@mui/material";

interface AnswerAttachmentsProps {
  attachments: string[];
}

const AnswerAttachments: React.FC<AnswerAttachmentsProps> = ({ attachments }) => {
  if (!attachments || attachments.length === 0) {
    return null;
  }

  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
        Tệp đính kèm của học viên:
      </Typography>
      <Stack spacing={0.5}>
        {attachments.map((url, index) => (
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
  );
};

export default AnswerAttachments;

