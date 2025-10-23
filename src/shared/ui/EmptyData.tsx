import { Box } from "@mui/material";
import { EmptyBoxIcon } from "../assets/icons";
import { cn } from "@/utils";

interface EmptyDataProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}
const EmptyData: React.FC<EmptyDataProps> = ({ title, description, className }) => {
  return (
    <div className={cn("empty-box", className)}>
      <div className="w-fit text-center flex flex-col justify-center items-center gap-2">
        <EmptyBoxIcon className="w-28 h-28" />
        <div className="empty-box-content">
          {typeof title === "string" ? (
            <Box component="div" sx={{ fontWeight: "bold", mb: 1 }}>
              {title}
            </Box>
          ) : (
            title
          )}
          {typeof description === "string" ? (
            <Box component="div" className="text-gray-500 text-sm">
              {description}
            </Box>
          ) : (
            description
          )}
        </div>
      </div>
    </div>
  );
};
export default EmptyData;
