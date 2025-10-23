"use client";

import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Stack,
  Divider,
  Alert,
} from "@mui/material";
import { useLibraryStore } from "@/modules/library/store/libraryProvider";
import { Resource } from "@/modules/library/types";
import { SelectedResourceCard } from "@/modules/library/components/SelectedResourceCard";
import { SelectedResourcesList } from "@/modules/library/components/SelectedResourcesList";

export default function LibraryTestClient() {
  const openLibrary = useLibraryStore((state) => state.openLibrary);
  const [selectedSingleResource, setSelectedSingleResource] = useState<Resource | null>(null);
  const [selectedMultipleResources, setSelectedMultipleResources] = useState<Resource[]>([]);
  const [loadingSingle, setLoadingSingle] = useState(false);
  const [loadingMultiple, setLoadingMultiple] = useState(false);

  const handleSelectSingle = async () => {
    setLoadingSingle(true);
    try {
      const resources = await openLibrary({
        mode: "single",
        selectedIds: [],
      });
      setSelectedSingleResource(resources[0] || null);
    } catch (error) {
      setSelectedSingleResource(null);
    } finally {
      setLoadingSingle(false);
    }
  };

  const handleSelectMultiple = async () => {
    setLoadingMultiple(true);
    try {
      const resources = await openLibrary({
        mode: "multiple",
        selectedIds: selectedMultipleResources.map((r) => r.id),
      });
      setSelectedMultipleResources(resources);
    } catch (error) {
    } finally {
      setLoadingMultiple(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Library Components Examples
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Examples demonstrating how to use the library selection components in your application
      </Typography>

      <Stack spacing={4}>
        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Single Resource Selection Example
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Use the <code>openLibrary</code> function with <code>mode: "single"</code> to allow users to select a single resource.
              Display the selected resource using the <code>SelectedResourceCard</code> component.
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Button
              variant="contained"
              onClick={handleSelectSingle}
              disabled={loadingSingle}
              sx={{ mb: 3 }}
            >
              {loadingSingle ? "Opening..." : "Select Single Resource"}
            </Button>

            {selectedSingleResource ? (
              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Selected Resource:
                </Typography>
                <Box sx={{ maxWidth: 300, mt: 2 }}>
                  <SelectedResourceCard resourceId={selectedSingleResource.id} />
                </Box>
              </Box>
            ) : (
              <Alert severity="info">
                Click the button above to select a resource from the library
              </Alert>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent>
            <Typography variant="h5" gutterBottom>
              Multiple Resources Selection Example
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
              Use the <code>openLibrary</code> function with <code>mode: "multiple"</code> to allow users to select multiple resources.
              Display the selected resources using the <code>SelectedResourcesList</code> component.
            </Typography>
            <Divider sx={{ my: 2 }} />

            <Button
              variant="contained"
              color="secondary"
              onClick={handleSelectMultiple}
              disabled={loadingMultiple}
              sx={{ mb: 3 }}
            >
              {loadingMultiple ? "Opening..." : "Select Multiple Resources"}
            </Button>

            {selectedMultipleResources.length > 0 ? (
              <Box>
                <SelectedResourcesList
                  resourceIds={selectedMultipleResources.map((r) => r.id)}
                />
              </Box>
            ) : (
              <Alert severity="info">
                Click the button above to select resources from the library
              </Alert>
            )}
          </CardContent>
        </Card>
      </Stack>
    </Box>
  );
}

