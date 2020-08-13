import React from 'react';
import { render, cleanup, fireEvent } from '@testing-library/react';
import Button, { ButtonProps } from '../button';

const defaultProps = {
  onClick: jest.fn(e => {
    //console.log(1111,e);
  })
};
const testProps: ButtonProps = {
  type: 'primary',
  size: 'lg',
  className: 'klass',
  htmlType: 'submit'
};
const disabledProps: ButtonProps = {
  disabled: true,
  onClick: jest.fn(),
};

describe('test Button component', () => {
  afterEach(cleanup);
  it('should render the correct default button', () => {
    const wrapper = render(<Button {...defaultProps}>Default</Button>);
    const element = wrapper.queryByText('Default')?.parentElement as HTMLButtonElement;
    expect(element.tagName).toEqual('BUTTON');
    expect(element).toHaveClass('btn');
    fireEvent.click(element);
    //console.log(defaultProps.onClick.mock.calls[0][0].preventDefault);
    expect(defaultProps.onClick).toHaveBeenCalled();
  });

  it('should render the correct component based on different props', () => {
    const wrapper = render(<Button {...testProps}>Primary</Button>);
    // console.log(wrapper.debug());
    const element = wrapper.getByText(/Primary/i).parentElement;
    expect(element).toBeInTheDocument();
    expect(element).toHaveClass('btn-primary btn-lg klass');
    expect(element).toHaveAttribute('type', 'submit');
    expect(element).toHaveTextContent('Primary');
  });

  it('should render a link when type equals link and href is provided', () => {
    const wrapper = render(<Button type='link' href="http://dummyurl">Link</Button>);
    const element = wrapper.getByText('Link');
    expect(element).toBeInTheDocument();
    expect(element.tagName).toEqual('A');
    expect(element).toHaveClass('btn btn-link');
  });

  it('should render disabled button when disabled set to true', () => {
    const wrapper = render(<Button {...disabledProps}>Nice</Button>);
    const element = wrapper.getByText('Nice').parentElement as HTMLButtonElement;
    expect(element).toBeInTheDocument();
    expect(element).toHaveAttribute('disabled', '');
    expect(element.disabled).toBeTruthy();
    fireEvent.click(element);
    expect(disabledProps.onClick).not.toHaveBeenCalled();
  });
});
