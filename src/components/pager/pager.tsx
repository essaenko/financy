import React, { ChangeEvent, useEffect, useState } from 'react'
import classnames from 'classnames'

import arrowLeft from 'static/icons/arrow-left.png'

import css from './pager.module.css'

type PropsType = {
  page: number,
  count: number,
  onChange?: (page: number) => void,
}

export const Pager = ({ count, page, onChange }: PropsType): JSX.Element => {
  const [value, setValue] = useState<string>(page.toString())

  useEffect(() => {
    if (onChange && Number.isInteger(+value) && value !== '') {
      onChange(+value)
    }
  }, [value])

  const onChangeValue = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.currentTarget.value)
  }

  const onNextClick = () => {
    if (page < count) {
      if (onChange) {
        onChange(page + 1)
      }
    }
  }
  const onPrevClick = () => {
    if (page - 1 >= 1) {
      if (onChange) {
        onChange(page - 1)
      }
    }
  }

  return (
    <div className={css.root}>
      <span className={css.icon} onClick={onPrevClick}>
        <img src={arrowLeft} alt="Previous page icon" />
      </span>

      <div className={css.pages}>
        <input type="text" value={value} onChange={onChangeValue} /> of {count}
      </div>
      <span
        className={classnames(css.icon, css.rightIcon)}
        onClick={onNextClick}
      >
        <img src={arrowLeft} alt="Next page icon" />
      </span>
    </div>
  )
}
