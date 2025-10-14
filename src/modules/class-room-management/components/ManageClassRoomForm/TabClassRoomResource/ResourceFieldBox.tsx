import { cn } from "@/utils";
import { alpha, Box, Button, Typography } from "@mui/material";
import { PropsWithChildren } from "react";

interface ResourceFieldBoxProps extends PropsWithChildren {
  className?: string;
  icon?: React.ReactNode;
  onClick?: () => void;
  title: string;
}
const ResourceFieldBox: React.FC<ResourceFieldBoxProps> = ({ icon, onClick, title, children, className }) => {
  return (
    <div className={cn("field-box", className)}>
      <div className="field-box__header flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Box
            component="div"
            sx={(theme) => ({
              width: "2.5rem",
              height: "2.5rem",
              backgroundColor: alpha(theme.palette.primary["dark"], 0.1),
              color: theme.palette.primary["main"],
              borderRadius: "0.25rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            })}
          >
            {icon}
          </Box>
          {title ? <Typography sx={{ fontWeight: 600 }}>{title}</Typography> : null}
        </div>
        {onClick ? (
          <div>
            <Button variant="fill" onClick={onClick}>
              Thêm
            </Button>
          </div>
        ) : null}
      </div>
      {children ? <div className="field-box__body">{children}</div> : null}
    </div>
  );
};
export default ResourceFieldBox;
