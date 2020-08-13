import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs } from "@storybook/addon-knobs";
import Icon from '../components/Icon';
import Menu from '../components/Menu';
import { MenuProps } from '../components/Menu/menu';

export default {
  title: 'Menu 菜单',
  component: Menu,
  decorators: [withKnobs],
  parameters: {
    info: {
      propTables:[Menu]
    }
  }
};

const generateMenu = (props: MenuProps) => {
  return (
    <Menu 
      {...props}
    >
      <Menu.Item key="op1" icon={<Icon icon="user"/>} data-testid="op1">
        员工管理
      </Menu.Item>
      <Menu.Submenu key="sub-1" title='系统管理' icon={<Icon icon="cog"/>}>
        <Menu.Item key="op2-1">
          角色管理
        </Menu.Item>
        <Menu.Item key="op2-2">
          权限管理
        </Menu.Item>
        <Menu.Item key="op2-3">
          权限管理
        </Menu.Item>
        <Menu.Item key="op2-4">
          权限管理
        </Menu.Item>
      </Menu.Submenu>
      <Menu.Item key="op3" icon={<Icon icon="chart-bar"/>}>
        报表服务
      </Menu.Item>
      <Menu.Item key="op4" disabled>
        被禁止的
      </Menu.Item>
    </Menu>
  );
};

export const DefaultMenu = () => {
  const props1: MenuProps = {
    onSelect: action('select'),
    defaultKey: 'op1'
  };
  const props2: MenuProps = {
    onSelect: action('select'),
    defaultKey: 'op1',
    mode: 'horizontal'
  };
  return (
    <>
      <h5>默认竖直方向</h5>
      <div style={{width: 200, marginBottom: 20}}>  
        {generateMenu(props1)}
      </div>
      <h5>水平方向</h5>
      <div>
        {generateMenu(props2)}
      </div>
    </>
  );
};
DefaultMenu.story = {
  name: 'Menu'
};

export const DarkMenu = () => {
  const props1: MenuProps = {
    onSelect: action('select'),
    defaultKey: 'op1',
    theme: 'dark'
  };
  return (
    <div style={{width: 200, marginBottom: 20}}>  
      {generateMenu(props1)}
    </div>
  );
};
DarkMenu.story = {
  name: 'dark 主题背景'
};
