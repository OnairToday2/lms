import { Button } from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Fingerprint from "@mui/icons-material/Fingerprint";
const Buttons: React.FC = ({}) => {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex gap-3 ">
        <Button variant="fill" size="large" color="primary">
          Fill primary
        </Button>
        <Button variant="fill" size="large" color="secondary">
          Fill secondary
        </Button>
        <Button variant="fill" size="large" color="success">
          Fill success
        </Button>
        <Button variant="fill" size="large" color="warning">
          Fill warning
        </Button>
        <Button variant="fill" size="large" color="error">
          Fill error
        </Button>
        <Button variant="fill" size="large" color="info">
          Fill info
        </Button>
        <Button variant="fill" size="large" color="inherit">
          Fill inherit
        </Button>
      </div>
      <div className="flex gap-3 ">
        <Button variant="contained" color="primary" size="large">
          Primary large
        </Button>
        <Button variant="contained" color="secondary" size="large">
          Secondary large
        </Button>
        <Button variant="contained" color="success" size="large">
          Success large
        </Button>
        <Button variant="contained" color="warning" size="large">
          Warning large
        </Button>
        <Button variant="contained" color="error" size="large">
          Error large
        </Button>
        <Button variant="contained" color="info" size="large">
          Inffo large
        </Button>
        <Button variant="contained" color="inherit" size="large">
          Inherit large
        </Button>
      </div>
      <div className="flex gap-3">
        <Button variant="contained" color="primary" size="medium">
          Primary medium
        </Button>
        <Button variant="contained" color="secondary" size="medium">
          Secondary medium
        </Button>
        <Button variant="contained" color="success" size="medium">
          Success medium
        </Button>
        <Button variant="contained" color="warning" size="medium">
          Warning medium
        </Button>
        <Button variant="contained" color="error" size="medium">
          Error medium
        </Button>
        <Button variant="contained" color="info" size="medium">
          Inffo medium
        </Button>
        <Button variant="contained" color="inherit" size="medium">
          Inherit medium
        </Button>
      </div>
      <div className="flex gap-3">
        <Button variant="contained" color="primary" size="small">
          Primary small
        </Button>
        <Button variant="contained" color="secondary" size="small">
          Secondary small
        </Button>
        <Button variant="contained" color="success" size="small">
          Success small
        </Button>
        <Button variant="contained" color="warning" size="small">
          Warning small
        </Button>
        <Button variant="contained" color="error" size="small">
          Error small
        </Button>
        <Button variant="contained" color="info" size="small">
          Inffo small
        </Button>
        <Button variant="contained" color="inherit" size="small">
          Inherit small
        </Button>
        <Button size="small">default color</Button>
      </div>
      <div className="flex gap-3">
        <Button variant="outlined" color="primary" size="large">
          Primary outlined
        </Button>
        <Button variant="outlined" color="secondary" size="large">
          Secondary outlined
        </Button>
        <Button variant="outlined" color="success" size="large">
          Success outlined
        </Button>
        <Button variant="outlined" color="warning" size="large">
          Warning outlined
        </Button>
        <Button variant="outlined" color="error">
          Error outlined
        </Button>
        <Button variant="outlined" color="info">
          Inffo outlined
        </Button>
        <Button variant="outlined" color="inherit">
          inherit outlined
        </Button>
      </div>
      <div className="flex gap-3">
        <Button variant="text" color="primary" size="large">
          Primary text
        </Button>
        <Button variant="text" color="secondary" size="large">
          Secondary text
        </Button>
        <Button variant="text" color="success" size="large">
          Success text
        </Button>
        <Button variant="text" color="warning" size="large">
          Warning text
        </Button>
        <Button variant="text" color="error">
          Error text
        </Button>
        <Button variant="text" color="info">
          Inffo text
        </Button>
        <Button variant="text" color="inherit">
          inherit text
        </Button>
      </div>
      <div className="flex gap-3">
        <Button
          variant="contained"
          color="primary"
          size="small"
          startIcon={<Fingerprint />}
        >
          Primary text
        </Button>
        <Button
          variant="contained"
          color="primary"
          // size="small"
          startIcon={<Fingerprint />}
        >
          Primary text
        </Button>
        <Button
          variant="contained"
          color="primary"
          size="large"
          startIcon={<Fingerprint />}
        >
          Primary text
        </Button>

        <Button
          variant="text"
          color="secondary"
          size="large"
          endIcon={<Fingerprint />}
        >
          Secondary text
        </Button>
        <Button
          variant="outlined"
          color="success"
          size="large"
          endIcon={<Fingerprint />}
        >
          Success text
        </Button>
        <Button variant="text" color="warning" size="large">
          Warning text
        </Button>
        <Button variant="text" color="error">
          Error text
        </Button>
        <Button variant="text" color="info">
          Inffo text
        </Button>
        <Button variant="text" color="inherit">
          inherit text
        </Button>
      </div>
    </div>
  );
};
export default Buttons;
