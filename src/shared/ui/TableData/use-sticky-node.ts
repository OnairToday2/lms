import { useEffect, useLayoutEffect } from "react";

const useStickyNode = (
	{
		nodeList,
		isHeader,
		fixedDirection,
	}: {
		nodeList: HTMLElement[];
		isHeader?: boolean;
		fixedDirection: "left" | "right";
	},
	deps: any[],
) => {
	useEffect(() => {
		nodeList.forEach((cellNode, _index) => {
			let stickyPosition = 0;
			for (let i = 0; i < _index; i++) {
				const { width } = getClientInfo(nodeList[i]);
				stickyPosition += width;
			}

			if (fixedDirection === "left") {
				cellNode.style.left = stickyPosition + "px";
			}
			if (fixedDirection === "right") {
				cellNode.style.right = stickyPosition + "px";
			}
			cellNode.classList.add(
				fixedDirection === "left" ? "fixed-left" : "fixed-right",
			);
			cellNode.style.background = isHeader ? "rgb(245 246 248)" : "#fff";
		});
	}, [nodeList, isHeader, fixedDirection, ...deps]);
};
export default useStickyNode;
const getClientInfo = (el: HTMLElement | Element) => {
	return {
		x: el.getBoundingClientRect().x,
		y: el.getBoundingClientRect().y,
		width: el.getBoundingClientRect().width,
		height: el.getBoundingClientRect().height,
	};
};
