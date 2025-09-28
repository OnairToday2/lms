import IconButton from "@mui/material/IconButton";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";
import useAuthSignOut from "../hooks/useAuthSignOut";

const SignOutButton = () => {
  const { signOut, isPending } = useAuthSignOut();

  return (
    <IconButton size="small" onClick={signOut} loading={isPending}>
      <LogoutRoundedIcon fontSize="small" />
    </IconButton>
  );
};
export default SignOutButton;
