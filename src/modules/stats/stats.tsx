import React from 'react'
import { observer } from 'mobx-react-lite'

import css from './stats.module.css'

export const Stats = observer((): JSX.Element => {
  return (
    <div className={css.root}>
      <div className={css.header}>
        <h2>Statistic</h2>
      </div>
    </div>
  )
})
