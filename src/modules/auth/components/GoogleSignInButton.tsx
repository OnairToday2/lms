"use client";
import { GoogleIcon } from "@/shared/assets/icons";
import Button from "@mui/material/Button";
import { useAuthSignInWithGoogle } from "../hooks/useAuthSignIn";
interface GoogleSignInButtonProps {
  buttonText?: string;
  disabled?: boolean;
}
const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  buttonText = "Đăng ký với Google",
  disabled = false,
}) => {
  const { signInWithGoogle, isPending } = useAuthSignInWithGoogle();
  return (
    <Button
      disabled={disabled}
      variant="outlined"
      startIcon={<GoogleIcon />}
      fullWidth
      loading={isPending}
      onClick={signInWithGoogle}
    >
      {buttonText}
    </Button>
  );
};
export default GoogleSignInButton;
