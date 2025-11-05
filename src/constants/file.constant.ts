export const FILE_TYPES = {
  images: [".jpg", ".jpeg", ".png", ".gif", ".svg", ".webp", ".bmp", ".tif", ".tiff"],
  audios: [".mp3", ".wav", ".ogg", ".m4a", ".flac"],
  docs: [
    ".pdf",
    ".doc",
    ".docx",
    ".xml",
    ".xls",
    ".xlsx",
    ".ppt",
    ".pptx",
    ".txt",
    ".md",
    ".csv",
    ".json",
    ".xml",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  ],
  videos: [".mp4", ".webm", ".avi", ".mov", ".mkv"],
} as const;
export type FileTypes = typeof FILE_TYPES;
export type FileCategory = keyof FileTypes; // "images" | "audios" | "docs" | "videos"

export const getTypeOfFile = (fileExtensionOrMime: string): FileCategory | "unknown" => {
  const ext = fileExtensionOrMime.toLowerCase();

  for (const [category, extensions] of Object.entries(FILE_TYPES) as [FileCategory, readonly string[]][]) {
    if (extensions.includes(`.${ext}`)) {
      return category;
    }
  }

  return "unknown";
};
