import React, { useEffect, useMemo } from 'react'
import { observer } from 'mobx-react-lite'

import { state } from '../../models'

import css from './account.module.css'

export const Account = observer((): JSX.Element => {
  const { users } = state.account
  useEffect(() => {
    state.account.fetchAccountUsers()
  }, [])
  const familyUsers = useMemo(
    () => users.filter((user) => user.id !== state.user.id),
    [users]
  )

  return (
    <div className={css.root}>
      <h2>Account</h2>
      <div className={css.ownerData}>
        Account owner: {state.account.owner?.name}
      </div>
      <div className={css.ownerData}>E-mail: {state.account.owner?.email}</div>
      <div>
        <h3>Family users:</h3>
        {}
        {familyUsers.length === 0 && (
          <div className={css.emptyList}>No additional users...</div>
        )}
        {familyUsers.map((user) => (
          <div key={user.id}>{user.name}</div>
        ))}
      </div>
    </div>
  )
})
