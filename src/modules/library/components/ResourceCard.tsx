"use client";

import { Card, CardContent, Box, Typography } from "@mui/material";
import { Resource } from "../types";
import { ResourceThumbnail } from "./ResourceThumbnail";

interface ResourceCardProps {
  resource: Resource;
  selected: boolean;
  onClick: () => void;
  onDoubleClick: () => void;
}

const formatFileSize = (bytes: number | null) => {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

export function ResourceCard({ resource, selected, onClick, onDoubleClick }: ResourceCardProps) {
  const isFolder = resource.kind === "folder";

  return (
    <Card
      onClick={onClick}
      onDoubleClick={onDoubleClick}
      sx={{
        cursor: "pointer",
        width: "100%",
        height: 190,
        border: selected ? "3px solid #1976d2" : "1px solid #e0e0e0",
        backgroundColor: selected ? "#e3f2fd" : "white",
        "&:hover": {
          boxShadow: 3,
          borderColor: isFolder ? "#5f6368" : selected ? "#1976d2" : "#bdbdbd",
        },
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "100%",
          p: 2,
          "&:last-child": { pb: 2 },
        }}
      >
        <Box sx={{ mb: 1 }}>
          <ResourceThumbnail resource={resource} />
        </Box>
        <Typography
          variant="body2"
          align="center"
          sx={{
            fontWeight: 400,
            wordBreak: "break-word",
            mb: 0.5,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {resource.name || "Untitled"}
        </Typography>
        {!isFolder && (
          <Typography variant="caption" color="text.secondary" align="center">
            {formatFileSize(resource.size)}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

