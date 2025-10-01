import * as React from "react";
import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";

import FormatColorFillIcon from "@mui/icons-material/FormatColorFill";

import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewQuiltIcon from "@mui/icons-material/ViewQuilt";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function ToggleButtonsMultiple() {
  const [formats, setFormats] = React.useState(() => ["bold", "italic"]);

  const handleFormat = (
    event: React.MouseEvent<HTMLElement>,
    newFormats: string[],
  ) => {
    setFormats(newFormats);
  };

  const [alignment, setAlignment] = React.useState("web");

  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    setAlignment(newAlignment);
  };

  const [view, setView] = React.useState("list");

  return (
    <>
      <div>primary</div>
      <div>
        <ToggleButtonGroup size="large" color="primary">
          <ToggleButton value="bold" aria-label="bold">
            Middle 123
          </ToggleButton>
          <ToggleButton value="italic" aria-label="italic">
            Middle 123
          </ToggleButton>
          <ToggleButton value="underlined" aria-label="underlined">
            Middle 123
          </ToggleButton>
          <ToggleButton value="color" aria-label="color" disabled>
            Middle 123
          </ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup size="medium" color="primary">
          <ToggleButton value="bold" aria-label="bold">
            Middle 123
          </ToggleButton>
          <ToggleButton value="italic" aria-label="italic">
            Middle 123
          </ToggleButton>
          <ToggleButton value="underlined" aria-label="underlined">
            Middle 123
          </ToggleButton>
          <ToggleButton value="color" aria-label="color" disabled>
            Middle 123
          </ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup size="small" color="primary">
          <ToggleButton value="bold" aria-label="bold">
            Middle 123
          </ToggleButton>
          <ToggleButton value="italic" aria-label="italic">
            Middle 123
          </ToggleButton>
          <ToggleButton value="underlined" aria-label="underlined">
            Middle 123
          </ToggleButton>
          <ToggleButton value="color" aria-label="color" disabled>
            Middle 123
          </ToggleButton>
        </ToggleButtonGroup>
      </div>
      <div className="py-6">Secondary</div>
      <div>
        <ToggleButtonGroup
          color="secondary"
          onChange={handleFormat}
          aria-label="text formatting"
          size="large"
        >
          <ToggleButton value="bold" aria-label="bold">
            <FormatBoldIcon />
          </ToggleButton>
          <ToggleButton value="italic" aria-label="italic">
            <FormatItalicIcon />
          </ToggleButton>
          <ToggleButton value="underlined" aria-label="underlined">
            <FormatUnderlinedIcon />
          </ToggleButton>
          <ToggleButton value="color" aria-label="color" disabled>
            <FormatColorFillIcon />
            <ArrowDropDownIcon />
          </ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup color="secondary" onChange={handleFormat}>
          <ToggleButton value="bold" aria-label="bold">
            <FormatBoldIcon />
          </ToggleButton>
          <ToggleButton value="italic" aria-label="italic">
            <FormatItalicIcon />
          </ToggleButton>
          <ToggleButton value="underlined" aria-label="underlined">
            <FormatUnderlinedIcon />
          </ToggleButton>
          <ToggleButton value="color" aria-label="color" disabled>
            <FormatColorFillIcon />
            <ArrowDropDownIcon />
          </ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          color="secondary"
          onChange={handleFormat}
          size="small"
        >
          <ToggleButton value="bold" aria-label="bold">
            <FormatBoldIcon />
          </ToggleButton>
          <ToggleButton value="italic" aria-label="italic">
            <FormatItalicIcon />
          </ToggleButton>
          <ToggleButton value="underlined" aria-label="underlined">
            <FormatUnderlinedIcon />
          </ToggleButton>
          <ToggleButton value="color" aria-label="color" disabled>
            <FormatColorFillIcon />
            <ArrowDropDownIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div className="py-6">Success</div>
      <div>
        <ToggleButtonGroup
          color="success"
          onChange={handleFormat}
          aria-label="text formatting"
        >
          <ToggleButton value="bold" aria-label="bold">
            <FormatBoldIcon />
          </ToggleButton>
          <ToggleButton value="italic" aria-label="italic">
            <FormatItalicIcon />
          </ToggleButton>
          <ToggleButton value="underlined" aria-label="underlined">
            <FormatUnderlinedIcon />
          </ToggleButton>
          <ToggleButton value="color" aria-label="color" disabled>
            <FormatColorFillIcon />
            <ArrowDropDownIcon />
          </ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup color="success" onChange={handleFormat}>
          <ToggleButton value="bold" aria-label="bold">
            <FormatBoldIcon />
          </ToggleButton>
          <ToggleButton value="italic" aria-label="italic">
            <FormatItalicIcon />
          </ToggleButton>
          <ToggleButton value="underlined" aria-label="underlined">
            <FormatUnderlinedIcon />
          </ToggleButton>
          <ToggleButton value="color" aria-label="color" disabled>
            <FormatColorFillIcon />
            <ArrowDropDownIcon />
          </ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup color="success" onChange={handleFormat} size="small">
          <ToggleButton value="bold" aria-label="bold">
            <FormatBoldIcon />
          </ToggleButton>
          <ToggleButton value="italic" aria-label="italic">
            <FormatItalicIcon />
          </ToggleButton>
          <ToggleButton value="underlined" aria-label="underlined">
            <FormatUnderlinedIcon />
          </ToggleButton>
          <ToggleButton value="color" aria-label="color" disabled>
            <FormatColorFillIcon />
            <ArrowDropDownIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div className="py-6">warning</div>
      <div>
        <ToggleButtonGroup
          value={formats}
          color="warning"
          onChange={handleFormat}
          aria-label="text formatting"
        >
          <ToggleButton value="bold" aria-label="bold">
            <FormatBoldIcon />
          </ToggleButton>
          <ToggleButton value="italic" aria-label="italic">
            <FormatItalicIcon />
          </ToggleButton>
          <ToggleButton value="underlined" aria-label="underlined">
            <FormatUnderlinedIcon />
          </ToggleButton>
          <ToggleButton value="color" aria-label="color" disabled>
            <FormatColorFillIcon />
            <ArrowDropDownIcon />
          </ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          value={formats}
          color="warning"
          onChange={handleFormat}
        >
          <ToggleButton value="bold" aria-label="bold">
            <FormatBoldIcon />
          </ToggleButton>
          <ToggleButton value="italic" aria-label="italic">
            <FormatItalicIcon />
          </ToggleButton>
          <ToggleButton value="underlined" aria-label="underlined">
            <FormatUnderlinedIcon />
          </ToggleButton>
          <ToggleButton value="color" aria-label="color" disabled>
            <FormatColorFillIcon />
            <ArrowDropDownIcon />
          </ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          value={formats}
          color="warning"
          onChange={handleFormat}
          size="small"
        >
          <ToggleButton value="bold" aria-label="bold">
            <FormatBoldIcon />
          </ToggleButton>
          <ToggleButton value="italic" aria-label="italic">
            <FormatItalicIcon />
          </ToggleButton>
          <ToggleButton value="underlined" aria-label="underlined">
            <FormatUnderlinedIcon />
          </ToggleButton>
          <ToggleButton value="color" aria-label="color" disabled>
            <FormatColorFillIcon />
            <ArrowDropDownIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div className="py-6">info</div>
      <div>
        <ToggleButtonGroup
          value={formats}
          color="info"
          onChange={handleFormat}
          aria-label="text formatting"
        >
          <ToggleButton value="bold" aria-label="bold">
            <FormatBoldIcon />
          </ToggleButton>
          <ToggleButton value="italic" aria-label="italic">
            <FormatItalicIcon />
          </ToggleButton>
          <ToggleButton value="underlined" aria-label="underlined">
            <FormatUnderlinedIcon />
          </ToggleButton>
          <ToggleButton value="color" aria-label="color" disabled>
            <FormatColorFillIcon />
            <ArrowDropDownIcon />
          </ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup value={formats} color="info" onChange={handleFormat}>
          <ToggleButton value="bold" aria-label="bold">
            <FormatBoldIcon />
          </ToggleButton>
          <ToggleButton value="italic" aria-label="italic">
            <FormatItalicIcon />
          </ToggleButton>
          <ToggleButton value="underlined" aria-label="underlined">
            <FormatUnderlinedIcon />
          </ToggleButton>
          <ToggleButton value="color" aria-label="color" disabled>
            <FormatColorFillIcon />
            <ArrowDropDownIcon />
          </ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          value={formats}
          color="info"
          onChange={handleFormat}
          size="small"
        >
          <ToggleButton value="bold" aria-label="bold">
            <FormatBoldIcon />
          </ToggleButton>
          <ToggleButton value="italic" aria-label="italic">
            <FormatItalicIcon />
          </ToggleButton>
          <ToggleButton value="underlined" aria-label="underlined">
            <FormatUnderlinedIcon />
          </ToggleButton>
          <ToggleButton value="color" aria-label="color" disabled>
            <FormatColorFillIcon />
            <ArrowDropDownIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div className="py-6">error</div>
      <div>
        <ToggleButtonGroup
          value={formats}
          color="error"
          onChange={handleFormat}
          aria-label="text formatting"
        >
          <ToggleButton value="bold" aria-label="bold">
            <FormatBoldIcon />
          </ToggleButton>
          <ToggleButton value="italic" aria-label="italic">
            <FormatItalicIcon />
          </ToggleButton>
          <ToggleButton value="underlined" aria-label="underlined">
            <FormatUnderlinedIcon />
          </ToggleButton>
          <ToggleButton value="color" aria-label="color" disabled>
            <FormatColorFillIcon />
            <ArrowDropDownIcon />
          </ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          value={formats}
          color="error"
          onChange={handleFormat}
        >
          <ToggleButton value="bold" aria-label="bold">
            <FormatBoldIcon />
          </ToggleButton>
          <ToggleButton value="italic" aria-label="italic">
            <FormatItalicIcon />
          </ToggleButton>
          <ToggleButton value="underlined" aria-label="underlined">
            <FormatUnderlinedIcon />
          </ToggleButton>
          <ToggleButton value="color" aria-label="color" disabled>
            <FormatColorFillIcon />
            <ArrowDropDownIcon />
          </ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          value={formats}
          color="error"
          onChange={handleFormat}
          size="small"
        >
          <ToggleButton value="bold" aria-label="bold">
            <FormatBoldIcon />
          </ToggleButton>
          <ToggleButton value="italic" aria-label="italic">
            <FormatItalicIcon />
          </ToggleButton>
          <ToggleButton value="underlined" aria-label="underlined">
            <FormatUnderlinedIcon />
          </ToggleButton>
          <ToggleButton value="color" aria-label="color" disabled>
            <FormatColorFillIcon />
            <ArrowDropDownIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div className="py-6">standard</div>
      <div>
        <ToggleButtonGroup
          value={formats}
          color="standard"
          onChange={handleFormat}
          aria-label="text formatting"
        >
          <ToggleButton value="bold" aria-label="bold">
            <FormatBoldIcon />
          </ToggleButton>
          <ToggleButton value="italic" aria-label="italic">
            <FormatItalicIcon />
          </ToggleButton>
          <ToggleButton value="underlined" aria-label="underlined">
            <FormatUnderlinedIcon />
          </ToggleButton>
          <ToggleButton value="color" aria-label="color" disabled>
            <FormatColorFillIcon />
            <ArrowDropDownIcon />
          </ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          value={formats}
          color="standard"
          onChange={handleFormat}
        >
          <ToggleButton value="bold" aria-label="bold">
            <FormatBoldIcon />
          </ToggleButton>
          <ToggleButton value="italic" aria-label="italic">
            <FormatItalicIcon />
          </ToggleButton>
          <ToggleButton value="underlined" aria-label="underlined">
            <FormatUnderlinedIcon />
          </ToggleButton>
          <ToggleButton value="color" aria-label="color" disabled>
            <FormatColorFillIcon />
            <ArrowDropDownIcon />
          </ToggleButton>
        </ToggleButtonGroup>
        <ToggleButtonGroup
          value={formats}
          color="standard"
          onChange={handleFormat}
          size="small"
        >
          <ToggleButton value="bold" aria-label="bold">
            <FormatBoldIcon />
          </ToggleButton>
          <ToggleButton value="italic" aria-label="italic">
            <FormatItalicIcon />
          </ToggleButton>
          <ToggleButton value="underlined" aria-label="underlined">
            <FormatUnderlinedIcon />
          </ToggleButton>
          <ToggleButton value="color" aria-label="color" disabled>
            <FormatColorFillIcon />
            <ArrowDropDownIcon />
          </ToggleButton>
        </ToggleButtonGroup>
      </div>

      <div className="py-12">vertical</div>

      <div className="flex gap-3">
        <div>
          <div>primary</div>
          <ToggleButtonGroup
            orientation="vertical"
            color="primary"
            value={view}
            exclusive
            onChange={handleChange}
          >
            <ToggleButton value="list" aria-label="list">
              <ViewListIcon />
            </ToggleButton>
            <ToggleButton value="module" aria-label="module">
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value="quilt" aria-label="quilt">
              <ViewQuiltIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div>
          <div>secondary</div>
          <ToggleButtonGroup
            orientation="vertical"
            color="secondary"
            value={view}
            exclusive
            onChange={handleChange}
          >
            <ToggleButton value="list" aria-label="list">
              <ViewListIcon />
            </ToggleButton>
            <ToggleButton value="module" aria-label="module">
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value="quilt" aria-label="quilt">
              <ViewQuiltIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div>
          <div>success</div>
          <ToggleButtonGroup
            orientation="vertical"
            color="success"
            value={view}
            exclusive
            onChange={handleChange}
          >
            <ToggleButton value="list" aria-label="list">
              <ViewListIcon />
            </ToggleButton>
            <ToggleButton value="module" aria-label="module">
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value="quilt" aria-label="quilt">
              <ViewQuiltIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>

        <div>
          <div>info</div>
          <ToggleButtonGroup
            orientation="vertical"
            color="info"
            value={view}
            exclusive
            onChange={handleChange}
          >
            <ToggleButton value="list" aria-label="list">
              <ViewListIcon />
            </ToggleButton>
            <ToggleButton value="module" aria-label="module">
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value="quilt" aria-label="quilt">
              <ViewQuiltIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div>
          <div>warning</div>
          <ToggleButtonGroup
            orientation="vertical"
            color="warning"
            value={view}
            exclusive
            onChange={handleChange}
          >
            <ToggleButton value="list" aria-label="list">
              <ViewListIcon />
            </ToggleButton>
            <ToggleButton value="module" aria-label="module">
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value="quilt" aria-label="quilt">
              <ViewQuiltIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div>
          <div>error</div>
          <ToggleButtonGroup
            orientation="vertical"
            color="error"
            value={view}
            exclusive
            onChange={handleChange}
          >
            <ToggleButton value="list" aria-label="list">
              <ViewListIcon />
            </ToggleButton>
            <ToggleButton value="module" aria-label="module">
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value="quilt" aria-label="quilt">
              <ViewQuiltIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
        <div>
          <div>standard</div>
          <ToggleButtonGroup
            orientation="vertical"
            color="standard"
            value={view}
            exclusive
            onChange={handleChange}
          >
            <ToggleButton value="list" aria-label="list">
              <ViewListIcon />
            </ToggleButton>
            <ToggleButton value="module" aria-label="module">
              <ViewModuleIcon />
            </ToggleButton>
            <ToggleButton value="quilt" aria-label="quilt">
              <ViewQuiltIcon />
            </ToggleButton>
          </ToggleButtonGroup>
        </div>
      </div>
    </>
  );
}
