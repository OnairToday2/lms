"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import { useLibraryStore } from "@/modules/library/store/libraryProvider";
import { Resource } from "@/modules/library/types";

export default function LibraryTestClient() {
  const openLibrary = useLibraryStore((state) => state.openLibrary);
  const [selectedResources, setSelectedResources] = useState<Resource[]>([]);
  const [lastAction, setLastAction] = useState<"success" | "cancelled" | null>(
    null
  );
  const [loading, setLoading] = useState(false);

  const handleSelectSingle = async () => {
    setLoading(true);
    setLastAction(null);
    try {
      const resources = await openLibrary({
        mode: "single",
        selectedIds: [],
      });
      setSelectedResources(resources);
      setLastAction("success");
    } catch (error) {
      setLastAction("cancelled");
      setSelectedResources([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectMultiple = async () => {
    setLoading(true);
    setLastAction(null);
    try {
      const resources = await openLibrary({
        mode: "multiple",
        selectedIds: selectedResources.map((r) => r.id),
      });
      setSelectedResources(resources);
      setLastAction("success");
    } catch (error) {
      setLastAction("cancelled");
    } finally {
      setLoading(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedResources([]);
    setLastAction(null);
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Library Store Test Page
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Test the promise-based library store implementation
      </Typography>

      <Stack spacing={3}>
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Actions
            </Typography>
            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                onClick={handleSelectSingle}
                disabled={loading}
              >
                {loading ? "Opening..." : "Select Single Resource"}
              </Button>
              <Button
                variant="contained"
                color="secondary"
                onClick={handleSelectMultiple}
                disabled={loading}
              >
                {loading ? "Opening..." : "Select Multiple Resources"}
              </Button>
              <Button
                variant="outlined"
                onClick={handleClearSelection}
                disabled={selectedResources.length === 0}
              >
                Clear Selection
              </Button>
            </Stack>
          </CardContent>
        </Card>

        {lastAction && (
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Last Action
              </Typography>
              <Chip
                label={
                  lastAction === "success"
                    ? "Selection Successful"
                    : "Selection Cancelled"
                }
                color={lastAction === "success" ? "success" : "default"}
              />
            </CardContent>
          </Card>
        )}

        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              Selected Resources ({selectedResources.length})
            </Typography>
            <Divider sx={{ my: 2 }} />
            {selectedResources.length === 0 ? (
              <Typography color="text.secondary">
                No resources selected
              </Typography>
            ) : (
              <Stack spacing={2}>
                {selectedResources.map((resource) => (
                  <Card key={resource.id} variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1" fontWeight="bold">
                        {resource.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        ID: {resource.id}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Kind: {resource.kind}
                      </Typography>
                      {resource.mime_type && (
                        <Typography variant="body2" color="text.secondary">
                          Type: {resource.mime_type}
                        </Typography>
                      )}
                      {resource.size && (
                        <Typography variant="body2" color="text.secondary">
                          Size: {(resource.size / 1024).toFixed(2)} KB
                        </Typography>
                      )}
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        display="block"
                        sx={{ mt: 1 }}
                      >
                        Created: {new Date(resource.created_at).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Stack>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}

