import React, { useContext } from 'react';
import classNames from 'classnames';
import { MenuContext } from './menu';

export interface MenuItemProps {
  index?: string;
  disabled?: boolean;
  className?: string;
  style?: React.CSSProperties;
  icon?: React.ReactNode;
  subIndexs?: string[];
}

export const MenuItem: React.FC<MenuItemProps> = (props) => {
  const { index, disabled, className, style, children, icon, subIndexs, ...restProps } = props;
  const context = useContext(MenuContext);
  const classes = classNames('meow-menu-item', className, {
    [`meow-menu-item-disabled`]: disabled,
    [`meow-menu-item-active`]: context.index === index
  });

  const handleClick = () => {
    if (context.onSelect && !disabled && (typeof index === 'string')) {
      context.onSelect(index, subIndexs ? subIndexs : []);
    }
  };
  return (
    <li
      className={classes}
      style={style}
      onClick={handleClick}
      {...restProps}
    > 
      {icon ? <span className="meowicon">{icon}</span> : null}
      <span>{children}</span>
    </li>
  );
};

MenuItem.defaultProps = {
  disabled: false,
  subIndexs: []
};
MenuItem.displayName = 'MenuItem';
export default MenuItem;