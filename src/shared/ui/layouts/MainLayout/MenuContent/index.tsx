"use client";
import * as React from "react";
import List, { ListProps } from "@mui/material/List";
import Stack from "@mui/material/Stack";
import { usePathname } from "next/navigation";
import { cn } from "@/utils/cn";
import type { MenuItemType } from "../menuConfig";
import MenuItem, { MenuItemProps } from "./MenuItem";

interface MenuContentProps {
  items: MenuItemType[];
}
const MenuContent: React.FC<MenuContentProps> = ({ items }) => {
  return (
    <Stack sx={{ flexGrow: 1, p: 2, justifyContent: "space-between" }}>
      <MenuList items={items} />
    </Stack>
  );
};

export default MenuContent;

interface MenuListProps {
  items: MenuItemType[];
  asSub?: boolean;
  depth?: number;
  className?: string;
  sx?: ListProps["sx"];
}
const MenuList: React.FC<MenuListProps> = ({
  items,
  asSub,
  depth = 1,
  className,
  sx,
}) => {
  const [menuItemDrropdownKey, setMenuItemDropdownKey] = React.useState<
    string[]
  >([]);
  const pathName = usePathname();
  const pathNameArr = pathName.split("/");

  const hasActive = (path: string) => {
    return [...pathNameArr.slice(1)].includes(path.replace("/", ""));
  };

  const hasOpenDropdown = React.useCallback(
    (key: string) => {
      return menuItemDrropdownKey?.includes(key);
    },
    [menuItemDrropdownKey],
  );

  const handleOpen: Exclude<MenuItemProps["onToggleOpen"], undefined> =
    React.useCallback(
      (key: string) => {
        console.log(key);
        setMenuItemDropdownKey((prevKeys) => {
          let updateKey = [...prevKeys];
          const keyIndex = updateKey.findIndex((item) => item === key);
          if (!keyIndex || keyIndex < 0) {
            updateKey = [...updateKey, key];
          } else {
            updateKey.splice(keyIndex, 1);
          }
          return updateKey;
        });
      },
      [menuItemDrropdownKey],
    );

  return (
    <List
      dense
      sx={sx}
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
          onToggleOpen={handleOpen}
          isOpenDropdown={hasOpenDropdown(menuItem.key)}
          dropdown={
            menuItem?.children?.length ? (
              <MenuList
                items={menuItem.children}
                depth={depth + 1}
                sx={{ paddingLeft: `${depth * 0.5}rem !important` }}
              />
            ) : undefined
          }
        />
      ))}
    </List>
  );
};
