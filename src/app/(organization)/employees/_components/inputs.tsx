import { TextField } from "@mui/material";
const Inputs = () => {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <TextField id="outlined-basic" label="Outlined" variant="outlined" />
      </div>
      <div>
        <TextField id="filled-basic" label="Filled" variant="filled" />
      </div>

      <div>
        <TextField id="standard-basic" label="Standard" variant="standard" />
      </div>
    </div>
  );
};
export default Inputs;
