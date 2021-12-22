import React, { useEffect } from 'react'
import { Route, useHistory } from 'react-router-dom'

import { AuthLogin } from 'modules/auth/auth.login'
import { AuthRegistration } from 'modules/auth/auth.registration'

import css from './auth.module.css'
import { state } from '../../models'

export const Auth = (): JSX.Element => {
  const history = useHistory()

  useEffect(() => {
    state.user.fetchUser().then((result) => {
      if (result.error === true) {
        history.push('/')
      }
    })
  }, [])

  return (
    <div className={css.root}>
      <Route path={'/'} exact>
        <AuthLogin user={state.user} />
      </Route>
      <Route path={'/signup'} exact>
        <AuthRegistration user={state.user} />
      </Route>
    </div>
  )
}
