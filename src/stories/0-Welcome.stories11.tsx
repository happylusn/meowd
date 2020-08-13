import React from 'react';
import { linkTo } from '@storybook/addon-links';
import { Welcome } from '@storybook/react/demo';
import { withKnobs} from "@storybook/addon-knobs";
import { withInfo } from '@storybook/addon-info';

export default {
  title: 'Welcome',
  component: Welcome,
  decorators: [withKnobs,withInfo]
};

export const ToStorybook = () => <Welcome showApp={linkTo('Button')} />;

ToStorybook.story = {
  name: 'to Storybook',
};
