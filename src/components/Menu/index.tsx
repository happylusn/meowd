import React from 'react';
import Menu, { MenuProps } from './menu';
import MenuItem, { MenuItemProps } from './menuItem';
import Submenu, { SubMenuProps } from './subMenu';

export type IMenuComponent = React.FC<MenuProps> & {
  Item: React.FC<MenuItemProps>;
  Submenu: React.FC<SubMenuProps>
}

const TransMenu: IMenuComponent = Menu as IMenuComponent;

TransMenu.Item = MenuItem;
TransMenu.Submenu = Submenu;

export default TransMenu;
