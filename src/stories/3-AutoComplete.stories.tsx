import React from 'react';
import { action } from '@storybook/addon-actions';
import { withKnobs } from "@storybook/addon-knobs";
import AutoComplete from '../components/AutoComplete/autoComplete';

export default {
  title: 'AutoComplete 自动完成',
  component: AutoComplete,
  decorators: [withKnobs]
};

export const  DefaultAutoComplete = () => {
  const lakers = ['bradley', 'pope', 'caruso', 'cook', 'cousins', 'james', 'AD', 'green', 'howard', 'kuzma', 'McGee', 'rando'];
  const handleFetch = (query: string) => {
    return lakers.filter(name => name.includes(query)).map(item => ({value: item}));
  };
  return (
    <AutoComplete
      fetchSuggestions={handleFetch}
      style={{width: 300}}
      placeholder="输入内容试试"
      onSelect={action('selected')}
    />
  );
};
DefaultAutoComplete.story = {
  name: 'AutoComplete'
};

export const  GitHubAutoComplete = () => {
  const handleFetch = (query: string) => {
    return fetch(`https://api.github.com/search/users?q=${query}`)
      .then(res => res.json())
      .then(({items}) => {
        console.log(items);
        return items.slice(0, 10).map((item: any) => ({ value: item.login, ...item}));
      });
  };
  return (
    <AutoComplete
      fetchSuggestions={handleFetch}
      style={{width: 300}}
      placeholder="输入内容试试"
      onSelect={action('selected')}
    />
  );
};
GitHubAutoComplete.story = {
  name: '异步请求github用户名'
};