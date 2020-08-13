import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs, text, boolean, select } from "@storybook/addon-knobs";
import Button, { ButtonType } from '../components/Button/button';

export default {
  title: 'Button 按钮',
  component: Button,
  decorators: [withKnobs]
};

export const DefaultButton = () => <Button onClick={action('clicked')}>Default</Button>;
DefaultButton.story = {
  name: 'Button'
};

export const ButtonWithType = () => (
  <>
    <Button type="primary" onClick={action('clicked')} icon="search">Primary</Button>
    <Button type="success">Success</Button>
    <Button type="warning">Warning</Button>
    <Button type="info">Info</Button>
    <Button type="danger">Danger</Button>
    <Button type="link" href="#">Link</Button>
  </>
);
ButtonWithType.story = {
  name: '不同样式 Button',
};

export const ButtonWithSize = () => (
  <>
    <Button type="primary" size="lg">Primary</Button>
    <Button type="primary">Primary</Button>
    <Button type="primary" size="sm">Primary</Button>
  </>
);
ButtonWithSize.story = {
  name: '不同尺寸 Button'
};

export const DiyButton = () => {
  const label = text('Label', 'Dynamic Button');
  const disabled = boolean('Disabled', false);
  const options = {
    Default: 'default',
    Primary: 'primary',
    Success: 'success',
    Warning: 'warning',
    Info: 'info',
    Danger: 'danger',
    Link: 'link'
  };
  const defaultValue = 'info';
  const type = select('Type', options, defaultValue);
  return (
    <Button type={type as ButtonType} disabled={disabled}>{label}</Button>
  );
};
DiyButton.story = {
  name: 'Dynamic Button'
};
