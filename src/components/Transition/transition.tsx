import React from 'react';
import { CSSTransition } from 'react-transition-group';
import { CSSTransitionProps } from 'react-transition-group/CSSTransition';

type AnimationName = 'zoom-in-collapse' | 'zoom-in-top' | 'zoom-in-left' | 'zoom-in-bottom' | 'zoom-in-right'

interface ITransitionProps {
  animation?: AnimationName,
  wrapper? : boolean,
};
type TransitionProps = ITransitionProps & CSSTransitionProps

const Transition: React.FC<TransitionProps> = (props) => {
  const { animation, wrapper, classNames, children, ...restProps } = props;
  return (
    <CSSTransition classNames={classNames ? classNames : animation} {...restProps}>
      {wrapper ? <div>{children}</div> : children}
    </CSSTransition>
  );
};

Transition.defaultProps = {
  unmountOnExit: false,
  appear: true,
};

export default Transition;
