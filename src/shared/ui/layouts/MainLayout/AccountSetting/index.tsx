"use client";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAuthStore } from "@/modules/auth/store/AuthProvider";
import AccountMenuOptions, {
  AccountMenuOptionsProps,
} from "./AccountMenuOptions";
import { useMemo } from "react";
interface AccountSettingProps {
  className?: string;
}

const AccountSetting: React.FC<AccountSettingProps> = () => {
  const {
    data: { name, email, avatarUrl } = {},
    signOut,
    isLoading,
  } = useAuthStore((state) => state) || {};

  const ACCOUNT_ITEMS: AccountMenuOptionsProps["menuItems"] = useMemo(
    () => [
      {
        title: "Thông tin cá nhân",
        type: "item",
      },
      {
        title: "Tài khoản",
        type: "item",
      },
      {
        title: "Cài đặt",
        type: "item",
      },
    ],
    [],
  );

  return (
    <Stack direction="row" className="account-item">
      <AccountMenuOptions menuItems={ACCOUNT_ITEMS}>
        <>
          <Avatar
            sizes="small"
            alt="Riley Carter"
            src={avatarUrl ?? "/assets/images/avatar/7.jpg"}
            sx={{ width: 36, height: 36 }}
            variant="rounded"
          />
          <Box component="div" sx={{ mr: "auto" }} className="flex-1">
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, lineHeight: "16px" }}
            >
              {name}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: "text.secondary" }}
              className="line-clamp-1 break-all"
            >
              {name || email}
            </Typography>
          </Box>
        </>
      </AccountMenuOptions>
    </Stack>
  );
};
export default AccountSetting;
