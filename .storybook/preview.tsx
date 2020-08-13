import React from 'react';
import { addDecorator, addParameters } from '@storybook/react';
import { withInfo } from '@storybook/addon-info';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import '../src/styles/index.scss';
library.add(fas);

const storyWrapper = (storyFn: any) => (
  <div style={{ padding: '24px 40px' }}>
    <h3>组件演示</h3>
    {storyFn()}
  </div>
)
addDecorator(storyWrapper);
addDecorator(withInfo);
addParameters({
  info: {
    styles: {
      infoBody: {
        backgroundColor: '#fff',
        lineHeight: '2',
        padding: '20px 40px'
      },
    },
    header: false,
    inline: true
  },
});