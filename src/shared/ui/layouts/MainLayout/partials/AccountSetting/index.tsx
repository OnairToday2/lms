import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import AccountMenuOptions from "./AccountMenuOptions";

interface AccountSettingProps {
  className?: string;
}
const AccountSetting: React.FC<AccountSettingProps> = () => {
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
        src="/assets/images/avatar/7.jpg"
        sx={{ width: 36, height: 36 }}
      />
      <Box sx={{ mr: "auto" }}>
        <Typography
          variant="body2"
          sx={{ fontWeight: 500, lineHeight: "16px" }}
        >
          Riley Carter
        </Typography>
        <Typography variant="caption" sx={{ color: "text.secondary" }}>
          riley@email.com
        </Typography>
      </Box>
      <AccountMenuOptions />
    </Stack>
  );
};
export default AccountSetting;
