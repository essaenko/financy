import React from 'react'
import { observer } from 'mobx-react-lite'
import { Link } from 'react-router-dom'

import { state } from '../../models'
import { AUTH_TOKEN_LOCAL_STORAGE_KEY } from '../../globals.config'

import css from './header.module.css'

export const Header = observer((): JSX.Element => {
  const onLogout = () => {
    localStorage.removeItem(AUTH_TOKEN_LOCAL_STORAGE_KEY)

    window.location.reload()
  }
  return (
    <div className={css.root}>
      <Link to={'/dashboard'} className={css.logo}>
        Financy
      </Link>
      <span className={css.username}>
        {state.user.name}
        <div className={css.actions}>
          <span className={css.action} onClick={onLogout}>
            Logout
          </span>
          <span className={css.tail} />
        </div>
      </span>
    </div>
  )
})
