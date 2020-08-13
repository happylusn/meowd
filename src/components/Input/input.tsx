import React, { ChangeEvent, ReactElement, InputHTMLAttributes, FC } from 'react';
import classNames from 'classnames';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import Icon from '../Icon/icon'; 

type InputSize = 'lg' | 'sm'
export interface InputProps extends Omit<InputHTMLAttributes<HTMLElement>, 'size'> {
  /**是否禁用 Input */
  disabled?: boolean;
  /**设置 input 大小，支持 lg 或者是 sm */
  size?: InputSize;
  /**添加图标，在右侧悬浮添加一个图标，用于提示 */
  icon?: IconProp;
  /**添加前缀 用于配置一些固定组合 */
  prepend?: string | ReactElement;
  /**添加后缀 用于配置一些固定组合 */
  append?: string | ReactElement;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

/**
 * Input 输入框 通过鼠标或键盘输入内容，是最基础的表单域的包装。
 * ### 引用方法
 * ~~~js
 * // 这样引用
 * import { Input } from 'meowui'
 * ~~~
 * 支持 HTMLInput 的所有基本属性
 */
export const Input: FC<InputProps> = (props) => {
  const { className, disabled, size, icon, prepend, append, style, ...restProps } = props;
  const classes = classNames('meow-input', classNames, {
    [`meow-input-size-${size}`]: size,
    'meow-input-disabled': disabled,
    'meow-input-icon': !!icon,
    'meow-input-group': prepend || append,
    'meow-input-group-with-append': !!append,
    'meow-input-group-with-prepend': !!prepend
  });
  const fixControlledValue = (value: any) => {
    if (typeof value === 'undefined' || value === null) {
      return '';
    }
    return value;
  };
  if ('value' in props) {
    delete restProps.defaultValue;
    restProps.value = fixControlledValue(props.value);
  }
  return (
    <div className={classes} style={style}>
      {prepend && <div className="meow-input-group-prepend">{prepend}</div>}
      {icon && <div className="meow-input-icon-wrapper"><Icon icon={icon} title={`title-${icon}`}/></div>}
      <input className="meow-input-inner" disabled={disabled} {...restProps}/>
      {append && <div className="meow-input-group-append">{append}</div>}
    </div>
  );
};

export default Input;
