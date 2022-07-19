import React, { ChangeEvent, useEffect, useState } from 'react';

import css from './pager.module.css';
import { ChevronLeftIcon, ChevronRightIcon } from 'static/icons';

type PropsType = {
  page: number;
  count: number;
  onChange?: (page: number) => void;
};

export const Pager = ({ count, page, onChange }: PropsType): JSX.Element => {
  const [value, setValue] = useState<string>(page.toString());

  useEffect(() => {
    if (onChange && Number.isInteger(+value) && value !== '') {
      onChange(+value);
    }
  }, [onChange, value]);

  const onChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value);
  };

  const onNextClick = () => {
    if (page < count) {
      if (onChange) {
        setValue((page + 1).toString());
        onChange(page + 1);
      }
    }
  };
  const onPrevClick = () => {
    if (page - 1 >= 1) {
      if (onChange) {
        setValue((page - 1).toString());
        onChange(page - 1);
      }
    }
  };

  return (
    <div className={css.root}>
      <span className={css.icon} onClick={onPrevClick}>
        <ChevronLeftIcon />
      </span>
      <div className={css.pages}>
        <input type="text" value={value} onChange={onChangeValue} /> of {count}
      </div>
      <span className={css.icon} onClick={onNextClick}>
        <ChevronRightIcon />
      </span>
    </div>
  );
};
