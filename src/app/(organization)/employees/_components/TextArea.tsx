import { Button, TextareaAutosize } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Fingerprint from "@mui/icons-material/Fingerprint";
const TextAreas: React.FC = ({}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="text-red-500">123123213131231 text red</div>
      <TextareaAutosize />
      <TextareaAutosize />
    </div>
  );
};
export default TextAreas;
