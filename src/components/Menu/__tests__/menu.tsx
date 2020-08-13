import React from 'react';
import { render, cleanup, fireEvent, RenderResult, wait } from '@testing-library/react';
import Menu, { MenuProps } from '../menu';
import MenuItem from '../menuItem';
import SubMenu from '../subMenu';
jest.mock('../../Icon', () => {
  return () => {
    return <i className="fa" />;
  };
});
jest.mock('react-transition-group', () => {
  return {
    CSSTransition: (props: any) => {
      return props.children;
    }
  };
});
const testProps: MenuProps = {
  defaultKey: 'op1',
  onSelect: jest.fn(),
  className: 'test'
};
const testHorProps: MenuProps = {
  defaultKey: 'op1',
  mode: 'horizontal',
  onSelect: jest.fn(),
  className: 'test-horizontal'
};

const generateMenu = (props: MenuProps) => {
  return (
    <Menu {...props}>
      <MenuItem key="op1">op1</MenuItem>
      <MenuItem key="op2" disabled>op2</MenuItem>
      <MenuItem key="op3">op3</MenuItem>
      <SubMenu key="op4" title="dropdown">
        <MenuItem key="op4-1">op4-1</MenuItem>
        <MenuItem key="op4-2" data-testid="op4-2">op4-2</MenuItem>
      </SubMenu>
      <SubMenu key="op5" title="opened">
        <MenuItem key="op5-1">op5-1</MenuItem>
      </SubMenu>
    </Menu>
  );
};
const createStyleFile = () => {
  const cssFile: string = `
    .meow-menu-sub {
      display: none;
    }
    .meow-menu-sub.meow-menu-opened {
      display: block;
    }
  `;
  const style = document.createElement('style');
  style.type = 'text/css';
  style.innerHTML = cssFile;
  return style;
};
let wrapper: RenderResult, wrapper2: RenderResult, menuElement: HTMLElement, activeElement: HTMLElement, disabledElement: HTMLElement;
describe('test Menu and MenuItem component in default(vertical) mode', () => {
  beforeEach(() => {
    wrapper = render(generateMenu(testProps));
    wrapper.container.append(createStyleFile());
    menuElement = wrapper.getByTestId('test-menu');
    activeElement = wrapper.getByText('op1').parentElement!;
    disabledElement = wrapper.getByText('op2').parentElement!;
  });
  it('should render correct Menu and MenuItem based on default props', () => {
    expect(menuElement).toBeInTheDocument();
    expect(menuElement).toHaveClass('meow-menu test meow-menu-vertical');
    expect(menuElement.querySelectorAll('li').length).toEqual(8);
    expect(activeElement).toHaveClass('meow-menu-item-active');
    expect(disabledElement).toHaveClass('meow-menu-item-disabled');
  });
  it('click items should change active and call the right callback', () => {
    const op3Item = wrapper.getByText('op3').parentElement!;
    fireEvent.click(op3Item);
    expect(op3Item).toHaveClass('meow-menu-item-active');
    expect(activeElement).not.toHaveClass('meow-menu-item-active');
    // expect(testProps.onSelect).toHaveBeenCalled();
    expect(testProps.onSelect).toHaveBeenCalledWith('op3');
    fireEvent.click(disabledElement);
    expect(activeElement).not.toHaveClass('meow-menu-item-active');
    expect(testProps.onSelect).not.toHaveBeenCalledWith('op2');
  });
  it('should show dropdown items when click on subMenu for vertical mode', () => {
    const dropdownElement = wrapper.queryByText('op4-1');
    expect(dropdownElement).not.toBeVisible();
    fireEvent.click(wrapper.getByText('dropdown').parentElement!);
    expect(dropdownElement).toBeVisible();
  });
  
  afterEach(cleanup);
});

describe('test Menu and MenuItem component in horizontal mode', () => {
  beforeEach(() => {
    wrapper2 = render(generateMenu(testHorProps));
    wrapper2.container.append(createStyleFile());
  });
  it('should render horizontal mode when mode is set to horizontal', () => {
    const menuElement = wrapper2.getByTestId('test-menu');
    expect(menuElement).toHaveClass('meow-menu test-horizontal meow-menu-horizontal');
  });
  it('should show dropdown items when hover on subMenu', async () => {
    expect(wrapper2.queryByText('op4-1')).toBeInTheDocument();
    expect(wrapper2.queryByText('op4-1')).not.toBeVisible();
    const dropdownElement = wrapper.getByText('dropdown').parentElement;
    fireEvent.mouseEnter(dropdownElement!);
    await wait(() => {
      expect(wrapper2.getByTestId('op4-2')).toBeVisible();
    });
    fireEvent.click(wrapper2.getByTestId('op4-2'));
    expect(testHorProps.onSelect).toHaveBeenCalledWith('op4-2');
    fireEvent.mouseLeave(dropdownElement!);
    await wait(() => {
      expect(wrapper2.getByTestId('op4-2')).not.toBeVisible();
    });
  });
  afterEach(cleanup);
});
