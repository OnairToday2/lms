import FolderIcon from "@mui/icons-material/Folder";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import VideoFileIcon from "@mui/icons-material/VideoFile";
import DescriptionIcon from "@mui/icons-material/Description";
import TableChartIcon from "@mui/icons-material/TableChart";
import SlideshowIcon from "@mui/icons-material/Slideshow";
import { Resource } from "../types";

interface ResourceIconProps {
  resource: Resource;
}

export function ResourceIcon({ resource }: ResourceIconProps) {
  if (resource.kind === "folder") {
    return <FolderIcon sx={{ fontSize: 48, color: "#5f6368" }} />;
  }

  const mimeType = resource.mime_type?.toLowerCase() || "";
  const extension = resource.extension?.toLowerCase() || "";

  if (mimeType.includes("pdf") || extension === "pdf") {
    return <PictureAsPdfIcon sx={{ fontSize: 48, color: "#ea4335" }} />;
  }
  if (mimeType.includes("image") || ["jpg", "jpeg", "png", "gif", "svg"].includes(extension)) {
    return <ImageIcon sx={{ fontSize: 48, color: "#34a853" }} />;
  }
  if (mimeType.includes("video") || ["mp4", "avi", "mov", "mkv"].includes(extension)) {
    return <VideoFileIcon sx={{ fontSize: 48, color: "#fbbc04" }} />;
  }
  if (
    mimeType.includes("spreadsheet") ||
    mimeType.includes("excel") ||
    ["xlsx", "xls", "csv"].includes(extension)
  ) {
    return <TableChartIcon sx={{ fontSize: 48, color: "#0f9d58" }} />;
  }
  if (
    mimeType.includes("presentation") ||
    mimeType.includes("powerpoint") ||
    ["pptx", "ppt"].includes(extension)
  ) {
    return <SlideshowIcon sx={{ fontSize: 48, color: "#f4b400" }} />;
  }
  if (
    mimeType.includes("document") ||
    mimeType.includes("word") ||
    ["docx", "doc", "txt"].includes(extension)
  ) {
    return <DescriptionIcon sx={{ fontSize: 48, color: "#4285f4" }} />;
  }

  return <InsertDriveFileIcon sx={{ fontSize: 48, color: "#5f6368" }} />;
}

