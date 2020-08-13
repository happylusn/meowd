import React, { useState } from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs } from "@storybook/addon-knobs";
import Input from '../components/Input/input';

export default {
  title: 'Input 输入框',
  component: Input,
  decorators: [withKnobs]
};
const style = {width: 300, marginBottom: 20};

const ControlledInput = () => {
  const [value, setValue] = useState('');
  return <Input style={style} value={value} placeholder="输入内容试试" onChange={(e) => {setValue(e.target.value);}}/>;
};

export const DefaultInput = () => (
  <div style={{width: 300}}>
    <Input
      style={style}
      placeholder="default input"
      onChange={action('ssss')}
    />
    <ControlledInput />
    <p>被禁用状态</p>
    <Input
      style={style}
      disabled
      value="disabled input"
    />
  </div>
);
DefaultInput.story = {
  name: 'Input'
};

export const InputWithIcon = () => (
  <Input
    style={style}
    icon="search"
    placeholder="输入内容试试"
    onChange={action('ssss')}
  />
);
InputWithIcon.story = {
  name: '带图标的 Input'
};

export const InputAllSize = () => (
  <div style={{width: 300}}>
    <Input
      style={style}
      size="lg"
      placeholder="large input"
    />
    <Input
      style={style}
      placeholder="default input"
    />
    <Input
      style={style}
      size="sm"
      placeholder="small input"
    />
  </div>
);
InputAllSize.story = {
  name: '不同大小的 Input'
};

export const InputWithPand = () => (
  <div style={{width: 300}}>
    <Input
      style={style}
      prepend="http://"
    />
    <Input
      style={style}
      append=".com"
    />
    <Input
      style={style}
      prepend="http://"
      append=".com"
    />
  </div>
);
InputWithPand.story = {
  name: '带前后缀的 Input'
};
