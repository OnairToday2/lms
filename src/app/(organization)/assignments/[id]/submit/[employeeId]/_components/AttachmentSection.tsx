import * as React from "react";
import { Box, Button, FormLabel } from "@mui/material";
import FileListItem from "./FileListItem";

interface AttachmentSectionProps {
  attachments?: File[];
  onAttachmentSelect?: (files: FileList | null) => void;
  onRemoveAttachment?: (fileIndex: number) => void;
  label?: string;
  accept?: string;
}

function AttachmentSection({
  attachments = [],
  onAttachmentSelect,
  onRemoveAttachment,
  label = "Tệp đính kèm (không bắt buộc)",
  accept = "image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx",
}: AttachmentSectionProps) {
  return (
    <Box sx={{ mt: 3 }}>
      <FormLabel sx={{ mb: 1, display: "block", color: "text.secondary" }}>
        {label}
      </FormLabel>
      <Button
        variant="outlined"
        component="label"
        size="small"
        sx={{ mb: 1 }}
      >
        Chọn tệp
        <input
          type="file"
          hidden
          accept={accept}
          onChange={(e) => onAttachmentSelect?.(e.target.files)}
        />
      </Button>
      {attachments.length > 0 && attachments[0] && (
        <Box sx={{ mt: 2 }}>
          <FileListItem
            file={attachments[0]}
            onRemove={() => onRemoveAttachment?.(0)}
          />
        </Box>
      )}
    </Box>
  );
}

export default React.memo(AttachmentSection);

