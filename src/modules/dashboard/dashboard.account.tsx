import React, { useEffect, MouseEvent, useCallback } from 'react'
import { observer } from 'mobx-react-lite'
import classnames from 'classnames'
import { useHistory } from 'react-router-dom'

import { state } from '../../models'
import { APIErrorList } from '../../api/api.handler'

import css from './dashboard.module.css'

export const DashboardAccount = observer((): JSX.Element => {
  const { account } = state
  const history = useHistory()
  useEffect(() => {
    if (account.id === void 0) {
      account.fetchAccount()
    }
  }, [account, account.id])

  const onClick = useCallback(
    async (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()

      const result = await account.createAccount()

      if (result.success) {
        history.push('/dashboard/family')
      }
    },
    [account, history]
  )

  return (
    <div
      className={classnames(css.accountWindow, {
        [css.loaded]: account.loaded,
      })}
    >
      {account.error && account.error === APIErrorList.NoUserAccountException && (
        <form className={css.accountPopup}>
          No account found. <br />
          You can create your own account, or join <br /> your family with
          existed account
          <button onClick={onClick}>Create my own account</button>
        </form>
      )}
    </div>
  )
})
