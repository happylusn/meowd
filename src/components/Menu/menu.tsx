import React, { useState, createContext } from 'react';
import classNames from 'classnames';
import { MenuItemProps } from './menuItem';
import { SubMenuProps } from './subMenu';

type MenuMode = 'horizontal' | 'vertical';
type Theme = 'dark' | 'light';
export interface MenuProps {
  className?: string;
  mode?: MenuMode;
  theme?: Theme;
  style?: React.CSSProperties;
  /**默认 active 的菜单项的索引值 */
  defaultKey?: string;
  /**点击菜单项触发的回掉函数 */
  onSelect?: (selectedKey: string) => void;
  /**设置子菜单的默认打开 只在纵向模式下生效 */
  defaultOpenSubMenus?: string[];
  defaultSelectedSub?: string;
};

interface IMenuContext {
  index: string;
  onSelect?: (selectedKey: string, subIndex: string[]) => void;
  mode?: MenuMode;
  theme?: Theme;
  defaultOpenSubMenus?: string[],
  selectedSub?: string;
}
export const MenuContext = createContext<IMenuContext>({index: ''});

export const Menu: React.FC<MenuProps> = (props) => {
  const { className, mode, children, style, defaultKey, onSelect, theme, defaultOpenSubMenus, defaultSelectedSub } = props;
  const [currentActive, setCurrentActive] = useState(defaultKey);
  const [selectedSub, setSelectedSub] = useState(defaultSelectedSub);
  
  const handleClick = (index: string, subIndex: string[] = []) => {
    setCurrentActive(index);
    setSelectedSub(subIndex[0]);
    if (onSelect) {
      onSelect(index);
    }
  };
  
  const passedContext: IMenuContext = {
    index: currentActive || '',
    onSelect: handleClick,
    mode,
    theme,
    defaultOpenSubMenus,
    selectedSub
  };
  
  const classes = classNames('meow-menu', className, {
    [`meow-menu-${mode}`]: mode,
    [`meow-menu-${theme}`]: theme
  });
 
  const renderChildren = () => {
    const itemStyle = mode === 'vertical' ? {paddingLeft: 24} : {};
    return React.Children.map(children, (child, index) => {
      let childElement = child as React.FunctionComponentElement<MenuItemProps & SubMenuProps>;
      const { displayName } = childElement.type;
      if (displayName === 'MenuItem') {
        const style = childElement.props.style || {};
        const transChild = React.cloneElement(childElement, {
          index: childElement.key?.toString() || childElement.props.index?.toString() || index.toString(),
          style: {...style, ...itemStyle}
        });
        return transChild;
      } else if (displayName === 'SubMenu') {
        const transChild = React.cloneElement(childElement, {
          index: childElement.key?.toString() || childElement.props.index?.toString() || `sub-1-${index}`,
          level: 1
        });
        return transChild;
      } else {
        console.error("Warning: Menu has a child which is not a MenuItem component");
      }
    });
  };
  return (
    <ul 
      className={classes}
      style={style}
      data-testid="test-menu"
    >
      <MenuContext.Provider value={passedContext}>
        {renderChildren()}
      </MenuContext.Provider>
    </ul>
  );
};

Menu.defaultProps = {
  mode: 'vertical',
  theme: 'light',
  defaultKey: '',
  defaultOpenSubMenus: [],
  defaultSelectedSub: ''
};

export default Menu;
