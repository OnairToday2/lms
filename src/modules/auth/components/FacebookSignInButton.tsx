import { FacebookIcon } from "@/shared/assets/icons";
import Button from "@mui/material/Button";

interface FacebookSignInButtonProps {
  buttonName?: React.ReactNode;
  disabled?: boolean;
}
const FacebookSignInButton: React.FC<FacebookSignInButtonProps> = ({
  buttonName = "Sign up with Facebook",
  disabled,
}) => {
  return (
    <Button
      fullWidth
      variant="outlined"
      startIcon={<FacebookIcon />}
      disabled={disabled}
    >
      {buttonName}
    </Button>
  );
};
export default FacebookSignInButton;
