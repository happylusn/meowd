import React, { FC } from 'react';
import { ThemeProps } from '../Icon/icon';

export interface ProgressProps {
  percent: number;
  theme?: ThemeProps;
  strokeHeight?: number;
  showText?: boolean;
  styles?: React.CSSProperties;
}

export const Progress: FC<ProgressProps> = (props) => {
  const {
    percent,
    theme,
    strokeHeight,
    showText,
    styles
  } = props;
  return (
    <div className="meow-progress-bar" style={styles}>
      <div className="meow-progress-bar-outer" style={{ height: `${strokeHeight}px`}}>
        <div 
          className={`meow-progress-bar-inner color-${theme}`}
          style={{width: `${percent}%`}}
        >
          {showText && <span className="meow-progress-bar-inner-text">{`${percent}%`}</span>}
        </div>
      </div>
    </div>
  );
};

Progress.defaultProps = {
  strokeHeight: 15,
  showText: true,
  theme: "primary",
};

export default Progress;
