import React from 'react';
import classnames from 'classnames';

import css from './icon.module.css';

export enum IconStyleList {
  White,
  Black,
}

type Props = {
  icon: string;
  className?: string;
  onClick?: () => void;
  style?: IconStyleList;
};

export const ReactIcon = ({
  icon,
  className,
  onClick,
  style,
}: Props): JSX.Element => {
  return (
    <div
      className={classnames(css.root, className, {
        [css.white]: style === IconStyleList.White,
      })}
      onClick={onClick}
    >
      <img src={icon} alt="ReactIconComponent" />
    </div>
  );
};
