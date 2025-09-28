"use client";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useAuthStore } from "@/modules/auth/store/AuthProvider";
import IconButton from "@mui/material/IconButton";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import SignOutButton from "@/modules/auth/components/SignOutButton";
interface AccountSettingProps {
  className?: string;
}
const AccountSetting: React.FC<AccountSettingProps> = () => {
  const {
    data: { name, email, avatarUrl } = {},
    signOut,
    isLoading,
  } = useAuthStore((state) => state) || {};

  return (
    <Stack
      direction="row"
      sx={{
        p: 2,
        gap: 1,
        alignItems: "center",
        borderTop: "1px solid",
        borderColor: "divider",
      }}
    >
      <Avatar
        sizes="small"
        alt="Riley Carter"
        src={avatarUrl ?? "/assets/images/avatar/7.jpg"}
        sx={{ width: 36, height: 36 }}
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
          {email}
        </Typography>
      </Box>
      <SignOutButton />
      {/* <AccountMenuOptions /> */}
    </Stack>
  );
};
export default AccountSetting;
