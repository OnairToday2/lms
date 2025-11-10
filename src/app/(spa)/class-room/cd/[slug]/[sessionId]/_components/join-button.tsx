"use client";
import { Button } from "@mui/material";
import { useMemo } from "react";

interface IJoinButton {
	startDate: string
	roomUrl: string
	isOwner: boolean
}


const JoinButton = ({ startDate, roomUrl, isOwner }: IJoinButton) => {

	const isDisable = useMemo(() => {
		if (isOwner) {
			return (
				new Date(new Date().getTime() + 60 * 60 * 1000) < new Date(startDate)
			);
		}
		return (
			new Date(new Date().getTime() + 10 * 60 * 1000) < new Date(startDate)
		);
	}, [isOwner, startDate]);

	return (
		<Button
			disabled={isDisable}
			variant="contained"
			size="large"
			fullWidth
			component="a"
			// href={!isDisable ? roomUrl : undefined}
			className="w-40"
		// onClick={(e) => isDisable && e.preventDefault()}
		>
			Vào lớp học
		</Button>
	);
};

export default JoinButton;
