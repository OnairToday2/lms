"use client";
import * as React from "react";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import { LogoOnairIcon } from "@/shared/assets/icons";

const Card = styled(MuiCard)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignSelf: "center",
  width: "100%",
  gap: theme.spacing(2),
  margin: "auto",
  border: "none",
  padding: 0,
  overflow: "visible",
}));

const CardContainer = styled(Stack)(({ theme }) => ({
  padding: theme.spacing(2),
}));

export interface AuhCardProps extends React.PropsWithChildren {
  title?: React.ReactNode;
  description?: React.ReactNode;
  className?: string;
}
const AuhCard: React.FC<AuhCardProps> = ({
  children,
  title = "Sign up",
  description,
  className,
}) => {
  return (
    <CardContainer
      direction="column"
      justifyContent="space-between"
      className={className}
    >
      <Card variant="outlined">
        <LogoOnairIcon className="w-auto h-12 mr-auto" />
        <Typography
          component="h1"
          variant="h4"
          sx={{ width: "100%", fontSize: "clamp(2rem, 10vw, 2.15rem)" }}
        >
          {title}
        </Typography>
        {description ? (
          <Typography
            component="div"
            variant="body1"
            className="text-sm text-gray-600"
          >
            {description}
          </Typography>
        ) : null}
        {children}
      </Card>
    </CardContainer>
  );
};
export default React.memo(AuhCard);
