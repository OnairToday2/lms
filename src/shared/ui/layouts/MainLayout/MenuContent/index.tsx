"use client";
import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import Stack from "@mui/material/Stack";
import { usePathname } from "next/navigation";
import { cn } from "@/shared/utils/cn";

import { SECONDARY_MENU_LIST, MAIN_MENU_LIST } from "./menuConfig";
import type { MenuItemType } from "./menuConfig";
import Link from "next/link";
import IconButton from "@mui/material/IconButton";

export default function MenuContent() {
  return (
    <Stack sx={{ flexGrow: 1, p: 2, justifyContent: "space-between" }}>
      <MenuList items={MAIN_MENU_LIST} />
      <List dense>
        {SECONDARY_MENU_LIST.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: "block" }}>
            <ListItemButton>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}

interface MenuItemProps {
  data: MenuItemType;
  dropdown?: React.ReactNode;
  isActive?: boolean;
}
const MenuItem: React.FC<MenuItemProps> = ({
  data: { title, icon, path, key, children: subItems },
  isActive,
  dropdown,
}) => {
  const [isOpenDropdown, setOpenDropdown] = React.useState(false);
  const toggleDropdown = React.useCallback(
    () => setOpenDropdown((prev) => !prev),
    [],
  );

  return (
    <ListItem disablePadding sx={{ display: "block" }}>
      {dropdown ? (
        <>
          <ListItemButton
            selected={isActive}
            sx={{ height: 40 }}
            className="flex items-center"
          >
            <div className="flex items-center gap-3 flex-1">
              {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
              <ListItemText primary={title} />
            </div>
            <IconButton
              className="border-0 bg-transparent"
              size="small"
              onClick={toggleDropdown}
            >
              <KeyboardArrowDownIcon
                className={cn({
                  "rotate-x-180": isOpenDropdown,
                })}
              />
            </IconButton>
          </ListItemButton>
          <div
            className={cn("menu-dropdown", {
              block: isOpenDropdown,
              hidden: !isOpenDropdown,
            })}
          >
            {dropdown}
          </div>
        </>
      ) : (
        <ListItemButton
          LinkComponent={Link}
          href={path}
          selected={isActive}
          sx={{ height: 40 }}
          className="flex items-center"
        >
          <div className="flex items-center gap-3 flex-1">
            {icon ? <ListItemIcon>{icon}</ListItemIcon> : null}
            <ListItemText primary={title} />
          </div>
        </ListItemButton>
      )}
    </ListItem>
  );
};

interface MenuListProps {
  items: MenuItemType[];
  asSub?: boolean;
  depth?: number;
  className?: string;
}
const MenuList: React.FC<MenuListProps> = ({
  items,
  asSub,
  depth = 1,
  className,
}) => {
  const pathName = usePathname();
  const pathNameArr = pathName.split("/");

  const hasActive = (path: string) => {
    return pathNameArr.includes(path.replace("/", ""));
  };

  return (
    <List
      dense
      data-depth={depth}
      className={cn(
        "menu-list p-0 flex flex-col gap-2",
        { "sub-meu": asSub },
        className,
      )}
    >
      {items.map((menuItem, index) => (
        <MenuItem
          key={index}
          data={menuItem}
          isActive={hasActive(menuItem.path)}
          dropdown={
            menuItem?.children?.length ? (
              <MenuList items={menuItem.children} depth={depth + 1} />
            ) : undefined
          }
        />
      ))}
    </List>
  );
};
