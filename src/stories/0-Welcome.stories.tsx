import React from 'react';
// import { linkTo } from '@storybook/addon-links';
// import { Welcome } from '@storybook/react/demo';
// import { withKnobs} from "@storybook/addon-knobs";
// import { withInfo } from '@storybook/addon-info';

export default {
  title: 'Welcome',
  // decorators: [withKnobs,withInfo]
  parameters: {
    info: { disable: true }
  }
};

export const ToStorybook = () => {
  return (
    <>
      <h1>欢迎来到 meowd 组件库</h1>
      <p>meowd 是专门为React打造的UI组件库，目前还在不断完善中</p>
      <h3>安装试试</h3>
      <code>
        npm install meowd --save
      </code>
    </>
  );
};

ToStorybook.story = {
  name: 'Welcome',
};
