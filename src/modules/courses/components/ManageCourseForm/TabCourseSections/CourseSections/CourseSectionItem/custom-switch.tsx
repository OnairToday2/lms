import { styled, Switch } from "@mui/material";
import { memo } from "react";

const CustomSwitch = styled(Switch)(({ theme }) => ({
	padding: 8,
	"& .MuiSwitch-track": {
		borderRadius: 22 / 2,
		"&::before, &::after": {
			content: '""',
			position: "absolute",
			top: "50%",
			transform: "translateY(-50%)",
			width: 16,
			height: 16,
		},
	},
	"& .MuiSwitch-thumb": {
		boxShadow: "none",
		width: 16,
		height: 16,
		margin: 2,
	},
	"& .MuiSwitch-switchBase": {
		left: "-7px",
		"&.Mui-checked": {
			transform: "translateX(27px)",
		},
	},
}));
export default memo(CustomSwitch);
