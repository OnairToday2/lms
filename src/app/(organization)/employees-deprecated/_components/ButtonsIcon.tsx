import React from "react";
import { Button, IconButton } from "@mui/material";
import { GridMenuIcon } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import AlarmIcon from "@mui/icons-material/Alarm";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import { styled } from "@mui/material/styles";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import SaveIcon from "@mui/icons-material/Save";
import Stack from "@mui/material/Stack";
import Tooltip from "@mui/material/Tooltip";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Fingerprint from "@mui/icons-material/Fingerprint";

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

const ButtonsIcons: React.FC = () => {
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timeout);
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3">
        <IconButton color="secondary" size="large">
          <GridMenuIcon />
        </IconButton>
        <IconButton color="success" size="large">
          <GridMenuIcon />
        </IconButton>
        <IconButton color="warning" size="large">
          <GridMenuIcon />
        </IconButton>
        <IconButton color="error" size="large">
          <GridMenuIcon />
        </IconButton>
        <IconButton color="info" size="large">
          <GridMenuIcon />
        </IconButton>
        <IconButton color="default" size="large">
          <GridMenuIcon />
        </IconButton>
      </div>
      <div className="flex gap-3">
        <IconButton color="primary" size="large">
          <GridMenuIcon />
        </IconButton>
        <IconButton color="secondary" size="large">
          <GridMenuIcon />
        </IconButton>
        <IconButton color="success" size="large">
          <GridMenuIcon />
        </IconButton>
        <IconButton color="warning" size="large">
          <GridMenuIcon />
        </IconButton>
        <IconButton color="error" size="large">
          <GridMenuIcon />
        </IconButton>
        <IconButton color="info" size="large">
          <GridMenuIcon />
        </IconButton>
        <IconButton color="default" size="large">
          <GridMenuIcon />
        </IconButton>
      </div>
      <div className="flex gap-3 ">
        <IconButton color="primary">
          <AddShoppingCartIcon />
        </IconButton>
        <IconButton color="secondary">
          <AlarmIcon />
        </IconButton>
        <IconButton color="success">
          <GridMenuIcon />
        </IconButton>
        <IconButton color="warning">
          <DeleteIcon />
        </IconButton>
        <IconButton color="error">
          <GridMenuIcon />
        </IconButton>
        <IconButton color="info">
          <GridMenuIcon />
        </IconButton>
        <IconButton color="default">
          <GridMenuIcon />
        </IconButton>
      </div>
      <div className="flex gap-3">
        <IconButton color="primary" size="small">
          <GridMenuIcon />
        </IconButton>
        <IconButton color="secondary" size="small">
          <GridMenuIcon />
        </IconButton>
        <IconButton color="success" size="small">
          <GridMenuIcon />
        </IconButton>
        <IconButton color="warning" size="small">
          <GridMenuIcon />
        </IconButton>
        <IconButton color="error" size="small">
          <GridMenuIcon />
        </IconButton>
        <IconButton color="info" size="small">
          <GridMenuIcon />
        </IconButton>
        <IconButton color="default" size="small">
          <GridMenuIcon />
        </IconButton>
      </div>
      <div className="flex gap-3">
        <Tooltip title="Click to see loading">
          <IconButton onClick={() => setLoading(true)} loading={loading}>
            <ShoppingCartIcon />
          </IconButton>
        </Tooltip>
        <IconButton color="secondary" size="small">
          <GridMenuIcon />
        </IconButton>
        <IconButton color="success" size="small">
          <GridMenuIcon />
        </IconButton>
        <IconButton color="warning" size="small">
          <GridMenuIcon />
        </IconButton>
        <IconButton color="error" size="small">
          <GridMenuIcon />
        </IconButton>
        <IconButton color="info" size="small">
          <GridMenuIcon />
        </IconButton>
        <IconButton color="default" size="small">
          <GridMenuIcon />
        </IconButton>
      </div>
      <div>
        <Button
          component="label"
          role={undefined}
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
        >
          Upload files
          <VisuallyHiddenInput
            type="file"
            onChange={(event) => console.log(event.target.files)}
            multiple
          />
        </Button>
      </div>
      <Stack spacing={2}>
        <Stack direction="row" spacing={2}>
          <Button loading variant="outlined">
            Submit
          </Button>
          <Button loading loadingIndicator="Loading…" variant="outlined">
            Fetch data
          </Button>
          <Button
            loading
            loadingPosition="start"
            startIcon={<SaveIcon />}
            variant="outlined"
          >
            Save
          </Button>
        </Stack>
        <Button
          fullWidth
          loading
          loadingPosition="start"
          startIcon={<SaveIcon />}
          variant="outlined"
        >
          Full width
        </Button>
        <Button
          fullWidth
          loading
          loadingPosition="end"
          endIcon={<SaveIcon />}
          variant="outlined"
        >
          Full width
        </Button>
        <Stack direction="row" spacing={2}>
          <Button loading variant="outlined" loadingPosition="start">
            Submit
          </Button>
          <Button loading variant="outlined" loadingPosition="end">
            Submit
          </Button>
          <Button
            loading
            variant="outlined"
            loadingPosition="end"
            startIcon={<SaveIcon />}
          >
            Save
          </Button>
        </Stack>
      </Stack>
      <div>
        <IconButton aria-label="fingerprint" color="secondary">
          <Fingerprint />
        </IconButton>
        <IconButton aria-label="fingerprint" color="success">
          <Fingerprint />
        </IconButton>
      </div>
    </div>
  );
};
export default ButtonsIcons;
