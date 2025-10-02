import { TextField } from "@mui/material";
import { Box } from "@mui/material";
const InputFields = () => {
  return (
    <Box
      component="form"
      sx={{ "& .MuiTextField-root": { m: 1, width: "25ch" } }}
      noValidate
      autoComplete="off"
      className="flex flex-col gap-3"
    >
      <div>
        <div>disabled ountline</div>
        <TextField
          disabled
          type="text"
          label="Disabled medium outlined"
          defaultValue="Hello World medium"
          variant="outlined"
        />
        <TextField
          disabled
          label="Disablaed small outlined"
          type="text"
          size="small"
          variant="outlined"
        />
      </div>
      <div>
        <div>primary ountline</div>
        <TextField
          type="text"
          label="primary medium outlined"
          defaultValue="Hello World medium"
          variant="outlined"
          color="primary"
        />
        <TextField
          label="primary small outlined"
          type="text"
          size="small"
          variant="outlined"
          color="primary"
        />
      </div>
      <div>
        <div>secondary ountline</div>
        <TextField
          type="text"
          label="secondary medium outlined"
          defaultValue="Hello World medium"
          variant="outlined"
          color="secondary"
        />
        <TextField
          label="secondary small outlined"
          type="text"
          size="small"
          variant="outlined"
          color="secondary"
        />
      </div>
      <div>
        <div>Secondary Filled</div>
        <TextField
          label="Filled small"
          type="text"
          autoComplete="current-password"
          placeholder="placeholder"
          size="small"
          color="secondary"
          variant="filled"
        />
        <TextField
          label="Filled medium"
          type="text"
          defaultValue="filled medium"
          placeholder="placeholder"
          variant="filled"
        />
      </div>
      <div>
        <div>secondary filled read only</div>
        <TextField
          label="Filled small readonly"
          type="text"
          autoComplete="current-password"
          placeholder="placeholder"
          size="small"
          color="secondary"
          variant="filled"
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        />
        <TextField
          label="Filled medium readonly"
          type="text"
          defaultValue="filled password"
          variant="filled"
          slotProps={{
            input: {
              readOnly: true,
            },
          }}
        />
      </div>
      --------------
      <div>
        <div>standard medium</div>
        <TextField
          required
          id="standard-required"
          label="Required"
          defaultValue="Hello World"
          variant="standard"
        />
        <TextField
          disabled
          id="standard-disabled"
          label="Disabled"
          defaultValue="Hello World"
          variant="standard"
        />
      </div>
      <div>
        <div>standard small</div>
        <TextField
          required
          id="standard-required"
          label="Required"
          defaultValue="Hello World"
          variant="standard"
          size="small"
        />
        <TextField
          disabled
          id="standard-disabled"
          label="Disabled"
          defaultValue="Hello World"
          variant="standard"
          size="small"
        />
      </div>
    </Box>
  );
};
export default InputFields;
