import React from 'react'
import classnames from 'classnames'

import css from './picker.module.css'

export type PropsType = {
  elements: {
    id: string | number,
    text: string,
  }[],
  active: string | number,
  onChange: (id: any) => () => void,
  className?: string,
}

export const Picker = ({
  elements,
  active,
  onChange,
  className,
}: PropsType): JSX.Element => {
  return (
    <div className={classnames(css.root, className)}>
      {elements.map((tab) => (
        <div
          key={tab.id}
          className={classnames(css.tab, {
            [css.activeTab]: active === tab.id,
          })}
          onClick={onChange(tab.id)}
        >
          {tab.text}
        </div>
      ))}
    </div>
  )
}
