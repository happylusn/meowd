import React, { useContext, useState, useRef } from 'react';
import classNames from 'classnames';
import { MenuContext } from './menu';
import { MenuItemProps } from './menuItem';
import Icon from '../Icon';
import Transition from '../Transition/transition';

export interface SubMenuProps {
  index?: string;
  title: string;
  className?: string;
  level?: number;
  icon?: React.ReactNode;
  subIndexs?: string[];
}

const SubMenu: React.FC<SubMenuProps> = (props) => {
  const { index, children, title, className, level, icon, subIndexs } = props;
  const context = useContext(MenuContext);
  const isOpend =  (index && context.mode === 'vertical') ? context.defaultOpenSubMenus!.includes(index) : false;
  const [menuOpen, setMenuOpen] = useState(isOpend);
  const subHeight = useRef(0);
  const diddom = useRef(false);

  const classes = classNames('meow-menu-submenu', className, {
    [`meow-menu-submenu-${context.mode}`]: context.mode,
    [`meow-menu-submenu-open`]: menuOpen,
    [`meow-menu-submenu-selected`]: context.selectedSub === index
  });
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    diddom.current = true;
    setMenuOpen(!menuOpen);
  };
  const clickEvent = context.mode === 'vertical' ? {
    onClick: handleClick
  } : {};

  let timer: any;
  const handleMouse = (e: React.MouseEvent, toggle: boolean) => {
    clearTimeout(timer);
    e.preventDefault();
    timer = setTimeout(() => {
      setMenuOpen(toggle);
    }, 100);
  };
  const hoverEvents = context.mode !== 'vertical' ? {
    onMouseEnter: (e: React.MouseEvent) => handleMouse(e, true),
    onMouseLeave: (e: React.MouseEvent) => handleMouse(e, false)
  } : {};

  const renderChildren = () => {
    const subClasses = context.mode === 'vertical' ? classNames('meow-menu meow-menu-sub', {
      [`meow-menu-${context.mode}`]: context.mode,
      [`meow-menu-hidden`]: diddom.current === false && !menuOpen,
      [`meow-menu-opened`]: menuOpen
    }) : classNames('meow-menu meow-menu-sub', {
      [`meow-menu-${context.mode}`]: context.mode,
      [`meow-menu-opened`]: menuOpen
    });
    const subStyle = context.mode === 'vertical' ? {paddingLeft: (level! + 1) * 24} : {};
    const childrenComponent = React.Children.map(children, (child, i) => {
      let childElement = child as React.FunctionComponentElement<MenuItemProps & SubMenuProps>;
      const { displayName } = childElement.type;
      if (displayName === 'MenuItem') {
        const style = childElement.props.style || {};
        return React.cloneElement(childElement, {
          index: childElement.key?.toString() || childElement.props.index?.toString() || i.toString(),
          style: {...style, ...subStyle},
          subIndexs: [...subIndexs!, index!]
        });
      } else if (displayName === 'SubMenu') {
        return React.cloneElement(childElement, {
          index: childElement.key?.toString() || childElement.props.index?.toString() || `sub-${level! + 1}-${i}`,
          level: level! + 1,
          subIndexs: [index!]
        });
      } else {
        console.error("Warning: Menu has a child which is not a MenuItem component");
      }
    });
    
    return context.mode === 'vertical' ? (
      <Transition
        in={menuOpen}
        timeout={300}
        animation="zoom-in-collapse"
        onEnter={e =>  {
          if (subHeight.current === 0) {
            subHeight.current = e.clientHeight;
          };
          e.style.height = '0px';
          e.className = subClasses;
        }}
        onEntering={e => {e.style.height = subHeight.current + 'px';}}
        onEntered={e => {e.style.height = '';}}
        onExit={e => {subHeight.current = e.clientHeight;e.style.height = subHeight.current + 'px';}}
        onExiting={e => e.style.height = '0px'}
        onExited={e => {
          e.style.height = '';
          if (!menuOpen) {
            e.className = e.className + ` meow-menu-hidden`;
          }
        }}
      >
        <ul className={subClasses}>
          {childrenComponent}
        </ul>
      </Transition>
    ) : (
      <Transition
        in={menuOpen}
        timeout={300}
        animation="zoom-in-top"
        unmountOnExit={true}
      >
        <ul className={subClasses}>
          {childrenComponent}
        </ul>
      </Transition>
    );
  };
  const subTitleStyle = context.mode === 'vertical' ? {paddingLeft: level! * 24} : {};
  return (
    <li key={index} className={classes} {...hoverEvents}>
      <div className="meow-menu-submenu-title" style={subTitleStyle} {...clickEvent}>
        {icon ? <span className="meowicon">{icon}</span> : null}
        <span>{title}</span>
        <Icon icon="angle-down" className="meow-menu-submenu-arrow" />
      </div>
      {renderChildren()}
    </li>
  );
};
SubMenu.defaultProps = {
  level: 1,
  subIndexs: []
};

SubMenu.displayName = 'SubMenu';
export default SubMenu;
