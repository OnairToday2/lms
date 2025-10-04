"use client";
import React, { Children, memo } from "react";
import {
  Button,
  Menu,
  MenuItem,
  Divider,
  ListItemText,
  ListItemIcon,
  listItemIconClasses,
  paperClasses,
  listClasses,
  dividerClasses,
} from "@mui/material";
import LogoutRoundedIcon from "@mui/icons-material/LogoutRounded";

type AccountMenuDividerItem = {
  type: "divider";
};
type AccountMenuItem = {
  title: string;
  type: "item";
  onClick?: () => void;
};

type AccountMenuItems = (AccountMenuItem | AccountMenuDividerItem)[];
export interface AccountMenuOptionsProps extends React.PropsWithChildren {
  menuItems?: AccountMenuItems;
}
const AccountMenuOptions: React.FC<AccountMenuOptionsProps> = ({
  children,
  menuItems = [],
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const Element = Children.only(children);

  return (
    <React.Fragment>
      <Button
        aria-label="Open menu"
        onClick={handleClick}
        sx={{ borderColor: "transparent" }}
        type="button"
        color="inherit"
        variant="fill"
        className="bg-transparent flex items-center gap-2 text-left px-0 py-0"
      >
        {Element}
      </Button>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        sx={{
          [`& .${listClasses.root}`]: {
            padding: "8px",
          },
          [`& .${paperClasses.root}`]: {
            padding: 0,
            width: "180px",
          },
          [`& .${dividerClasses.root}`]: {
            margin: "4px -8px",
          },
        }}
      >
        {menuItems.map((item, _index) => {
          if (item.type === "divider") {
            return <Divider key={_index} />;
          }
          return (
            <MenuItem key={_index} className="line-clamp-1 my-[0.5]">
              {item.title}
            </MenuItem>
          );
        })}
        {menuItems.length ? <Divider /> : null}
        <MenuItem
          sx={{
            [`& .${listItemIconClasses.root}`]: {
              ml: "auto",
              minWidth: 0,
            },
          }}
        >
          <ListItemText>Đăng xuất</ListItemText>
          <ListItemIcon>
            <LogoutRoundedIcon fontSize="small" />
          </ListItemIcon>
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
};

export default memo(AccountMenuOptions);
