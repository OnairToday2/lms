"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Breadcrumbs, { breadcrumbsClasses } from "@mui/material/Breadcrumbs";
import Container, { ContainerProps } from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import NavigateNextRoundedIcon from "@mui/icons-material/NavigateNextRounded";
import Link from "next/link";

const PageContentHeader = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  justifyContent: "space-between",
  gap: theme.spacing(2),
}));

const PageHeaderBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: "center",
  },
}));

const PageHeaderToolbar = styled("div")(({ theme }) => ({
  display: "flex",
  flexDirection: "row",
  gap: theme.spacing(1),
  marginLeft: "auto",
}));

export interface Breadcrumb {
  title: string;
  path?: string;
}
export interface PageContainerProps extends ContainerProps {
  children?: React.ReactNode;
  title?: string;
  breadcrumbs?: Breadcrumb[];
  actions?: React.ReactNode;
}

export default function PageContainer(props: PageContainerProps) {
  const { children, breadcrumbs, title, actions = null } = props;

  return (
    <Container
      sx={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        width: "100%",
        maxWidth: { sm: "100%", md: "1700px" },
      }}
      className="!px-0"
      maxWidth={false}
    >
      <Stack sx={{ flex: 1, my: 2 }} spacing={2}>
        <Stack>
          <PageHeaderBreadcrumbs
            aria-label="breadcrumb"
            separator={<NavigateNextRoundedIcon fontSize="small" />}
          >
            {breadcrumbs
              ? breadcrumbs.map((breadcrumb, index) => {
                  return breadcrumb.path ? (
                    <Link
                      key={index}
                      color="inherit"
                      href={breadcrumb.path}
                      className="text-sm"
                    >
                      {breadcrumb.title}
                    </Link>
                  ) : (
                    <Typography
                      key={index}
                      sx={{
                        color: "text.primary",
                        fontWeight: 400,
                      }}
                      className="text-sm"
                    >
                      {breadcrumb.title}
                    </Typography>
                  );
                })
              : null}
          </PageHeaderBreadcrumbs>
          <PageContentHeader>
            {title ? <Typography variant="h4">{title}</Typography> : null}
            <PageHeaderToolbar>{actions}</PageHeaderToolbar>
          </PageContentHeader>
        </Stack>
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
          {children}
        </Box>
      </Stack>
    </Container>
  );
}
