import React, { PropsWithChildren } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/utils";
import { Dot2RowVerticalIcon } from "@/shared/assets/icons";

interface SortableLessionItemProps extends PropsWithChildren {
  id: string;
  label?: React.ReactNode;
  onClick: () => void;
}
const SortableLessionItem: React.FC<SortableLessionItemProps> = ({ id, children, label, onClick }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={style}
      className={cn("bg-slate-100 rounded-lg overflow-hidden", {
        "border-blue-600": isDragging,
      })}
    >
      <Box component="div" className="flex gap-2 flex-1">
        <div className="text-center">
          <IconButton className="w-fit bg-transparent text-blue-600 p-1" disableRipple {...listeners}>
            <Dot2RowVerticalIcon className="w-4 h-4" />
          </IconButton>
        </div>
        <div className="section-item__top-middle px-2 py-1 flex-1 cursor-pointer" onClick={onClick}>
          <Typography sx={{ fontSize: "0.875rem" }}>{label}</Typography>
        </div>
      </Box>
    </div>
  );
};
export default SortableLessionItem;
