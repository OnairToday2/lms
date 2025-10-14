import * as React from "react";
import Box from "@mui/material/Box";
import Container, { ContainerProps } from "@mui/material/Container";
import Stack from "@mui/material/Stack";
import PageHeader, { PageHeaderProps } from "./PageHeader";
import NotifycationButton from "../NotificationButton";
import ThemeSwitcher from "../layouts/MainLayout/ThemeSwitcher";
import SettingButton from "../SettingButton";
import AccountSetting from "../layouts/MainLayout/AccountSetting";
import { Toolbar } from "@mui/material";

export interface PageContainerProps extends ContainerProps {
  children?: React.ReactNode;
  title?: string;
  breadcrumbs?: PageHeaderProps["breadcrumbs"];
  actions?: React.ReactNode;
}
export default function PageContainer(props: PageContainerProps) {
  const { children, breadcrumbs, title, actions = null } = props;
  return (
    <div className="page-container">
      <div className="h-6"></div>
      <PageHeader
        breadcrumbs={breadcrumbs}
        actions={actions}
        pageTitle={title}
        rightColumn={
          <Stack direction="row" alignItems="center" spacing={1.5}>
            <AccountSetting />
            <NotifycationButton />
            <ThemeSwitcher />
            <SettingButton />
          </Stack>
        }
      />
      <div className="h-6"></div>
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
        {children}
      </Container>
    </div>
  );
}
