"use client";
import { styled } from "@mui/material";
const PageHeaderToolbar = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  gap: theme.spacing(1),
  marginLeft: "auto",
}));

export default PageHeaderToolbar;
