"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Grid,
} from "@mui/material";
import { useLibraryStore } from "../store/libraryProvider";
import { Resource } from "../types";
import { LibraryBreadcrumbs } from "./LibraryBreadcrumbs";
import { ResourceCard } from "./ResourceCard";

export function LibraryDialog() {
  const open = useLibraryStore((state) => state.open);
  const config = useLibraryStore((state) => state.config);
  const closeLibrary = useLibraryStore((state) => state.closeLibrary);
  const cancelLibrary = useLibraryStore((state) => state.cancelLibrary);
  const data = useLibraryStore((state) => state.data);

  const [selectedResources, setSelectedResources] = useState<Resource[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [folderPath, setFolderPath] = useState<Array<{ id: string | null; name: string }>>([
    { id: null, name: "Root" },
  ]);

  useEffect(() => {
    if (open && config) {
      const preSelected = data.filter((resource: Resource) =>
        config.selectedIds.includes(resource.id) && resource.kind === "file",
      );
      setSelectedResources(preSelected);
      setCurrentFolderId(null);
      setFolderPath([{ id: null, name: "Root" }]);
    } else {
      setSelectedResources([]);
      setCurrentFolderId(null);
      setFolderPath([{ id: null, name: "Root" }]);
    }
  }, [open, config, data]);

  const displayedResources = data.filter(
    (resource: Resource) => resource.parent_id === currentFolderId,
  );

  const handleResourceClick = (resource: Resource) => {
    if (resource.kind === "folder") {
      return;
    }

    if (config?.mode === "single") {
      setSelectedResources([resource]);
    } else {
      setSelectedResources((prev) => {
        const isSelected = prev.some((r) => r.id === resource.id);
        if (isSelected) {
          return prev.filter((r) => r.id !== resource.id);
        } else {
          return [...prev, resource];
        }
      });
    }
  };

  const handleFolderDoubleClick = (folder: Resource) => {
    if (folder.kind !== "folder") return;

    setCurrentFolderId(folder.id);
    setFolderPath((prev) => [...prev, { id: folder.id, name: folder.name }]);
  };

  const handleBreadcrumbClick = (folderId: string | null) => {
    setCurrentFolderId(folderId);
    const index = folderPath.findIndex((f) => f.id === folderId);
    if (index !== -1) {
      setFolderPath(folderPath.slice(0, index + 1));
    }
  };

  const handleConfirm = () => {
    closeLibrary(selectedResources);
  };

  const handleCancel = () => {
    cancelLibrary();
  };

  const isResourceSelected = (resourceId: string) => {
    return selectedResources.some((r) => r.id === resourceId);
  };

  if (!open || !config) return null;

  return (
    <Dialog open={open} onClose={handleCancel} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Typography variant="h6">
            Thư viện tài liệu
          </Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ mb: 2 }}>
          <LibraryBreadcrumbs folderPath={folderPath} onNavigate={handleBreadcrumbClick} />
        </Box>

        {displayedResources.length === 0 ? (
          <Box sx={{ py: 8, textAlign: "center" }}>
            <Typography color="text.secondary">
              No resources in this folder
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2}>
            {displayedResources.map((resource: Resource) => {
              const selected = isResourceSelected(resource.id);

              return (
                <Grid size={{
                  xs: 12,
                  sm: 6,
                  md: 3,
                  lg: 2,
                }} key={resource.id}>
                  <ResourceCard
                    resource={resource}
                    selected={selected}
                    onClick={() => handleResourceClick(resource)}
                    onDoubleClick={() => handleFolderDoubleClick(resource)}
                  />
                </Grid>
              );
            })}
          </Grid>
        )}
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" color="inherit" onClick={handleCancel}>Đóng</Button>
        <Button
          onClick={handleConfirm}
          variant="contained"
          disabled={selectedResources.length === 0}
        >
          Xác nhận ({selectedResources.length})
        </Button>
      </DialogActions>
    </Dialog>
  );
}

