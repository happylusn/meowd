import React, { FC, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react';
import classNames from 'classnames';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Icon from '../Icon/icon';

export type ButtonSize = 'lg' | 'sm';

export type ButtonType = 'primary' | 'success' | 'warning' | 'info' | 'danger' | 'link' | 'default';

interface IBaseButtonProps {
  className?: string;
  /**设置 Button 的禁用 */
  disabled?: boolean;
  /**设置 Button 的尺寸 */
  size?: ButtonSize;
  /**设置 Button 的类型 */
  type?: ButtonType;
  /**html原生属性type */
  htmlType?: 'button' | 'reset' | 'submit';
  /**添加图标，用于提示 */
  icon?: IconProp;
  href?: string;
}
type NativeButtonProps = IBaseButtonProps & Omit<ButtonHTMLAttributes<HTMLElement>, 'type'>;
type AnchorButtonProps = IBaseButtonProps & Omit<AnchorHTMLAttributes<HTMLElement>, 'type'>;
export type ButtonProps = Partial<NativeButtonProps & AnchorButtonProps>;

/**
 * 页面中最常用的的按钮元素，适合于完成特定的交互
 * ### 引用方法
 * 
 * ~~~js
 * import { Button } from 'meowui'
 * ~~~
 */
export const Button: FC<ButtonProps> = (props) => {
  const {
    className,
    disabled,
    type,
    size,
    children,
    href,
    htmlType,
    icon,
    ...restProps
  } = props;
  
  const classes = classNames('btn', className, {
    [`btn-${type}`]: type,
    [`btn-${size}`]: size,
    'disabled': (type === 'link') && disabled
  });
  if (type === 'link' && href ) {
    return (
      <a
        className={classes}
        href={href}
        {...restProps}
      >
        {children}
      </a>
    );
  } else {
    const type = htmlType || 'button';
    return (
      <button
        type={type}
        className={classes}
        disabled={disabled}
        {...restProps}
      >
        {icon && <Icon className="btn-icon" icon={icon}/>}
        <span>{children}</span>
      </button>
    );
  }
};
Button.defaultProps = {
  disabled: false,
  type: 'default',
  htmlType: 'button'
};
export default Button;
