import React from 'react';
import { config } from 'react-transition-group';
import { render, RenderResult, fireEvent, wait, cleanup } from '@testing-library/react';
import { AutoComplete, AutoCompleteProps } from '../autoComplete';

jest.mock('../../Icon/icon', () => {
  return () => {
    return <i className="fa" />;
  };
});

config.disabled = true;
const testArray = [
  {value: 'ab', number: 11},
  {value: 'abc', number: 1},
  {value: 'b', number: 4},
  {value: 'c', number: 15},
];
const testProps: AutoCompleteProps = {
  fetchSuggestions: (query) => testArray.filter(item => item.value.includes(query)),
  onSelect: jest.fn(),
  placeholder: 'auto-complete'
};

const asyncFetch = (str: string) => {
  return Promise.resolve().then(() => {
    return [
      {value: str + '1', number: 11},
      {value: str + '2', number: 12}
    ];
  });
};
const testAsyncProps: AutoCompleteProps = {
  fetchSuggestions: asyncFetch,
  onSelect: jest.fn(),
  placeholder: 'auto-complete'
};

let wrapper: RenderResult, inputNode: HTMLInputElement;
describe('test AutoComplete component', () => {
  beforeEach(() => {
    wrapper = render(<AutoComplete {...testProps}/>);
    inputNode = wrapper.getByPlaceholderText('auto-complete') as HTMLInputElement;
  });
  it('test basic AutoComplete behavior', async () => {
    fireEvent.change(inputNode, {target: {value: 'a'}});
    await wait(() => {
      expect(wrapper.getByText('ab')).toBeInTheDocument();
      expect(wrapper.getByText('abc')).toBeInTheDocument();
    });
    expect(wrapper.container.querySelectorAll('.meow-suggestion-item').length).toEqual(2);
    fireEvent.click(wrapper.getByText('ab'));
    expect(testProps.onSelect).toHaveBeenCalledWith({value: 'ab', number: 11});
    expect(wrapper.container.querySelectorAll('.meow-suggestion-item').length).toEqual(0);
    expect(inputNode.value).toBe('ab');
  });
  it('should provide keyboard support', async () => {
    fireEvent.change(inputNode, {target: { value: 'a'}});
    await wait(() => {
      expect(wrapper.queryByText('ab')).toBeInTheDocument();
    });
    const firstResult = wrapper.queryByText('ab');
    const secondResult = wrapper.queryByText('abc');

    fireEvent.keyDown(inputNode, {keyCode: 40});
    expect(firstResult).toHaveClass('meow-suggestion-item-focus');

    fireEvent.keyDown(inputNode, {keyCode: 40});
    expect(secondResult).toHaveClass('meow-suggestion-item-focus');

    fireEvent.keyDown(inputNode, {keyCode: 38});
    expect(firstResult).toHaveClass('meow-suggestion-item-focus');

    fireEvent.keyDown(inputNode, { keyCode: 13 });
    expect(testProps.onSelect).toHaveBeenCalledWith({value: 'ab', number: 11});
    expect(wrapper.container.querySelectorAll('.meow-suggestion-item').length).toEqual(0);
    expect(inputNode.value).toBe('ab');
  });
  it('click outside should hide the dropdown', async () => {
    fireEvent.change(inputNode, {target: { value: 'a'}});
    await wait(() => {
      expect(wrapper.queryByText('ab')).toBeInTheDocument();
    });
    fireEvent.click(document);
    expect(wrapper.queryByText('ab')).not.toBeInTheDocument();
  });
  it('async fetchSuggestions should works fine', async () => {
    cleanup();
    const wrapper = render(<AutoComplete {...testAsyncProps}/>);
    const inputNode = wrapper.getByPlaceholderText('auto-complete') as HTMLInputElement;
    fireEvent.change(inputNode, {target: { value: 'a'}});
    await wait(() => {
      expect(wrapper.queryByText('a1')).toBeInTheDocument();
    });
    fireEvent.click(wrapper.getByText('a1'));
    expect(testAsyncProps.onSelect).toHaveBeenCalledWith({value: 'a1', number: 11});
    expect(wrapper.queryByText('a1')).not.toBeInTheDocument();
    expect(inputNode.value).toBe('a1');
  });
});
