"use client";
import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { cn } from "@/utils/cn";
import Link from "next/link";

export type MenuItemType = {
  title: string;
  icon: React.ReactNode;
  path: string;
  key: string;
  children?: MenuItemType[];
};
export interface MenuItemProps {
  data: MenuItemType;
  dropdown?: React.ReactNode;
  isActive?: boolean;
  isOpenDropdown?: boolean;
  onToggleOpen?: (key: string) => void;
}
const MenuItem: React.FC<MenuItemProps> = ({
  data,
  dropdown,
  isActive,
  onToggleOpen,
  isOpenDropdown,
}) => {
  const { icon, title, path, key } = data;
  //   const [isOpenDropdown, setOpenDropdown] = React.useState(false);
  //   const toggleDropdown = React.useCallback(
  //     () => setOpenDropdown((prev) => !prev),
  //     [],
  //   );

  if (dropdown) {
    return (
      <ListItem disablePadding sx={{ display: "block" }}>
        <ListItemButton
          selected={isActive}
          sx={{ height: 40 }}
          className="flex items-center"
          onClick={() => onToggleOpen?.(key)}
        >
          <div className="flex items-center gap-3 flex-1">
            {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
            <ListItemText primary={title} className="line-clamp-1" />
          </div>
          <KeyboardArrowDownIcon
            className={cn({
              "rotate-x-180": isOpenDropdown,
            })}
          />
        </ListItemButton>
        <div
          className={cn("menu-dropdown", {
            block: isOpenDropdown,
            hidden: !isOpenDropdown,
          })}
        >
          {dropdown}
        </div>
      </ListItem>
    );
  }

  return (
    <ListItem disablePadding sx={{ display: "block" }}>
      <ListItemButton
        LinkComponent={Link}
        href={path}
        selected={isActive}
        sx={{ height: 40 }}
        className="flex items-center"
      >
        <div className="flex items-center gap-3 flex-1">
          {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
          <ListItemText primary={title} className="line-clamp-1" />
        </div>
      </ListItemButton>
    </ListItem>
  );
};
export default MenuItem;
