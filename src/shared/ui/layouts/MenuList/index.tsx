import * as React from "react";
import List from "@mui/material/List";

import MenuItem, { MenuItemType } from "./MenuItem";

interface MenuListProps {
  items: MenuItemType[];
  asSub?: boolean;
}
const MenuList: React.FC<MenuListProps> = ({ items }) => {
  return (
    <List dense>
      {items.map((menuItem, index) => (
        <MenuItem key={index} data={menuItem} isActive={index === 1} />
      ))}
    </List>
  );
};
export default MenuList;
