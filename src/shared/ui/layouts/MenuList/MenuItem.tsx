import * as React from "react";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

export interface MenuItemType {
  label: React.ReactNode;
  icon: React.ReactNode;
  path: string;
  key?: string;
  subItems: MenuItemType[];
}
export interface MenuItemProps {
  data: MenuItemType;
  isActive?: boolean;
}
const MenuItem: React.FC<MenuItemProps> = ({
  data: { label, icon, path, key, subItems },
  isActive,
}) => {
  return (
    <ListItem disablePadding sx={{ display: "block" }}>
      <ListItemButton selected={isActive}>
        {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
        <ListItemText primary={label} />
      </ListItemButton>
      {/* {subItems?.length ? <MenuList items={subItems} /> : null} */}
    </ListItem>
  );
};
export default MenuItem;
