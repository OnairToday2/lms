import * as React from "react";
import { Box, Button } from "@mui/material";

interface SubmissionActionsProps {
  onCancel: () => void;
  onSubmit: () => void;
  isSubmitDisabled: boolean;
}

export default function SubmissionActions({
  onCancel,
  onSubmit,
  isSubmitDisabled,
}: SubmissionActionsProps) {
  return (
    <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2 }}>
      <Button variant="outlined" onClick={onCancel}>
        Hủy
      </Button>
      <Button
        type="submit"
        variant="contained"
        disabled={isSubmitDisabled}
        onClick={onSubmit}
      >
        Nộp bài
      </Button>
    </Box>
  );
}

