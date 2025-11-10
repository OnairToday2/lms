import React, { PropsWithChildren, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Typography,
} from "@mui/material";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/utils";
import { Accordion, AccordionSummary, AccordionDetails } from "./CourseSectionAccordion";
import { ChevronDownIcon, Dot2RowVerticalIcon, Edit05Icon, Trash01Icon } from "@/shared/assets/icons";
import RHFTextField from "@/shared/ui/form/RHFTextField";

interface SortableSectionItemProps extends PropsWithChildren {
  id: string;
  header?: React.ReactNode;
  label?: React.ReactNode;
  subLabel?: string;
  onEdit?: () => void;
  onDelete?: () => void;
}
const SortableSectionItem: React.FC<SortableSectionItemProps> = ({
  id,
  children,
  header,
  label,
  subLabel,
  onEdit,
  onDelete,
}) => {
  const [isOpenDialog, setIsOpenDialog] = useState(false);
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const [isEdit, setIsEdit] = useState(false);
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const [expanded, setExpanded] = React.useState<boolean>(true);

  const handleChange = () => {
    setExpanded((prev) => !prev);
  };

  const openDialogConfirmDelete = () => {
    setIsOpenDialog(true);
  };

  const closeDialogConfirmDelete = () => {
    setIsOpenDialog(false);
  };
  return (
    <div
      ref={setNodeRef}
      {...attributes}
      style={style}
      className={cn("bg-white border border-transparent rounded-xl overflow-hidden", {
        "border-blue-600": isDragging,
      })}
    >
      <Accordion expanded={expanded}>
        <AccordionSummary component="div" onToggleExpand={handleChange} expandIcon={null}>
          <Box component="div" className="flex gap-2 flex-1">
            <div className="flex flex-col gap-2 items-center">
              <IconButton className="w-fit bg-transparent text-blue-600 p-1 h-auto" disableRipple {...listeners}>
                <Dot2RowVerticalIcon className="w-4 h-4" />
              </IconButton>
              {subLabel ? (
                <Typography
                  sx={(theme) => ({
                    width: "32px",
                    height: "28px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: "8px",
                    backgroundColor: theme.palette.secondary.main,
                    color: "white",
                    fontSize: "0.75rem",
                    fontWeight: "bold",
                  })}
                >
                  {subLabel}
                </Typography>
              ) : null}
            </div>
            <div className="section-item__top-middle pt-2 px-2 flex-1">{header}</div>
            <div className="section-item__top-right flex flex-col">
              <IconButton className="w-fit h-fit bg-transparent p-1" disableRipple>
                <ChevronDownIcon className="w-4 h-4" onClick={handleChange} />
              </IconButton>
              {onEdit && (
                <IconButton className="w-fit h-fit bg-transparent p-1" disableRipple onClick={onEdit}>
                  <Edit05Icon className="w-4 h-4" />
                </IconButton>
              )}
              {onDelete && (
                <IconButton className="w-fit h-fit bg-transparent p-1" disableRipple onClick={openDialogConfirmDelete}>
                  <Trash01Icon className="w-4 h-4" />
                </IconButton>
              )}
            </div>
          </Box>
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
      {onDelete ? (
        <Dialog
          open={isOpenDialog}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          fullWidth
          maxWidth="xs"
        >
          <DialogTitle id="alert-dialog-title" className="break-all">{`Xoá`}</DialogTitle>
          <DialogContent>
            <DialogContentText
              id="alert-dialog-description"
              className="break-all"
              sx={{ fontSize: "0.875rem" }}
            >{`Bạn có chắc chắn muốn xoá "${label}"`}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialogConfirmDelete} variant="outlined" color="inherit">
              Tiếp tục chỉnh sửa
            </Button>
            <Button onClick={onDelete} color="error">
              Xóa
            </Button>
          </DialogActions>
        </Dialog>
      ) : null}
    </div>
  );
};
export default SortableSectionItem;
