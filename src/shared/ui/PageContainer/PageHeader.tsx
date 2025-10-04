"use client";
import { Toolbar, Stack, Box, Typography, Avatar, styled } from "@mui/material";
import Link from "next/link";
import PageContentHeader from "./PageContentHeader";
import PageHeaderToolbar from "./PageHeaderToolbar";
import PageHeaderBreadcrumbs from "./PageHeaderBreadCrumb";

export interface Breadcrumb {
  title: string;
  path?: string;
}

const PageHeaderWraper = styled(Toolbar)(({ theme }) => ({
  padding: 0,
}));
export interface PageHeaderProps {
  pageTitle?: string;
  actions?: React.ReactNode;
  breadcrumbs?: Breadcrumb[];
  rightColumn?: React.ReactNode;
  className?: string;
}
const PageHeader: React.FC<PageHeaderProps> = ({
  pageTitle,
  actions,
  breadcrumbs,
  rightColumn,
  className,
}) => {
  return (
    <PageHeaderWraper
      sx={{ backgroundColor: "inherit", px: 0, mx: 0 }}
      className={className}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        sx={{
          flexWrap: "wrap",
          width: "100%",
        }}
      >
        <Stack direction="row" alignItems="center">
          <Stack>
            <PageContentHeader>
              {pageTitle ? (
                <Typography variant="h4">{pageTitle}</Typography>
              ) : null}
              <PageHeaderToolbar>{actions}</PageHeaderToolbar>
            </PageContentHeader>
            <PageHeaderBreadcrumbs
              aria-label="breadcrumb"
              separator={
                <span className="text-sm mx-1 mt-[1px] inline-block text-gray-600">
                  /
                </span>
              }
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
                        }}
                        className="text-sm"
                      >
                        {breadcrumb.title}
                      </Typography>
                    );
                  })
                : null}
            </PageHeaderBreadcrumbs>
          </Stack>
        </Stack>
        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
          sx={{ marginLeft: "auto" }}
        >
          {rightColumn}
        </Stack>
      </Stack>
    </PageHeaderWraper>
  );
};
export default PageHeader;
