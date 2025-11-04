"use client";

import { MonitorIcon } from "@/shared/assets/icons";
import { Box, Typography } from "@mui/material";
import Link from "next/link";

interface BoxMenuClassListProps {
  items: { path: string; title: string }[];
}
const BoxMenuClassList: React.FC<BoxMenuClassListProps> = ({ items }) => {
  return (
    <div className="flex items-center gap-6">
      {items.map((item, _index) => (
        <Box
          component="div"
          key={_index}
          sx={(theme) => ({
            backgroundColor: "#ffffff",
            borderRadius: "8px",
            overflow: "hidden",
            border: "1px solid",
            borderColor: "white",
            "&:hover": {
              borderColor: theme.palette.primary.main,
            },
          })}
        >
          <Link href={item.path} className="aspect-square flex items-center justify-center w-48">
            <div>
              <div className="text-center">
                <MonitorIcon className="w-8 h-8 mx-auto" />
              </div>
              <div className="p-4">
                <Typography className="line-clamp-2 text-center">{item.title}</Typography>
              </div>
            </div>
          </Link>
        </Box>
      ))}
    </div>
  );
};
export default BoxMenuClassList;
