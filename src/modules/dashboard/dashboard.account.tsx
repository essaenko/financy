import React, { MouseEvent, useCallback, useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import classnames from 'classnames'
import { useHistory } from 'react-router-dom'

import { state } from '../../models'
import { APIErrorList, NetworkComponentStatusList } from '../../api/api.handler'

import css from './dashboard.module.css'

export const DashboardAccount = observer((): JSX.Element => {
  const { status, id, error } = state.account
  const history = useHistory()
  useEffect(() => {
    if (id === void 0) {
      state.account.fetchAccount()
    }
  }, [id])

  const onClick = useCallback(
    async (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault()

      const result = await state.account.createAccount()

      if (result.success) {
        history.push('/dashboard/family')
      }
    },
    [history]
  )

  return (
    <div
      className={classnames(css.accountWindow, {
        [css.loaded]: status === NetworkComponentStatusList.Loaded,
      })}
    >
      {status === NetworkComponentStatusList.Failed &&
        error === APIErrorList.NoUserAccountException && (
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
