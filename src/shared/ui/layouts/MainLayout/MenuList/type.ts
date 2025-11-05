interface MenuContentItemType {
  title: string;
  subTitle?: string;
  icon?: React.ReactNode;
  path: string;
  key: string;
  children?: (MenuContentItemType | MenuGroupItemType)[];
  type?: "item";
}
interface MenuGroupItemType {
  title: string;
  subTitle?: string;
  icon?: React.ReactNode;
  key: string;
  children: MenuContentItemType[];
  type: "group";
}

export type MenuItemType = MenuGroupItemType | MenuContentItemType;
