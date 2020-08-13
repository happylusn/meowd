import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import Input, { InputProps } from '../input';

const defaultProps: InputProps = {
  onChange: jest.fn(),
  placeholder: 'test-input'
};

describe('test Input component', () => {
  it('should render the correct default Input', () => {
    const wrapper = render(<Input {...defaultProps}/>);
    const testInput = wrapper.getByPlaceholderText('test-input') as HTMLInputElement;
    expect(testInput).toBeInTheDocument();
    expect(testInput).toHaveClass('meow-input-inner');
    fireEvent.change(testInput, {target: {value: 123}});
    expect(defaultProps.onChange).toHaveBeenCalled();
    expect(testInput.value).toEqual('123');
  });
  it('should render the disabled Input on disabled property', () => {
    const wrapper = render(<Input disabled placeholder="disabled-input"/>);
    const testInput = wrapper.getByPlaceholderText('disabled-input') as HTMLInputElement;
    expect(testInput.disabled).toBeTruthy();
  });
  it('should render different input sizes on size property', () => {
    const wrapper = render(<Input size="lg" placeholder="size-lg"/>);
    const testContainer = wrapper.container.querySelector('.meow-input');
    expect(testContainer).toHaveClass('meow-input-size-lg');
  });
  it('should render prepand and append element on prepand/append property', () => {
    const {getByText, container} = render(<Input placeholder="pend" prepend="http://" append=".com"/>);
    const testContainer = container.querySelector('.meow-input');
    expect(testContainer).toHaveClass('meow-input-group meow-input-group-with-append meow-input-group-with-prepend');
    expect(getByText('http://')).toBeInTheDocument(); 
    expect(getByText('.com')).toBeInTheDocument();
  });
});
