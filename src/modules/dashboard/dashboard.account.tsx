import React, { useEffect, MouseEvent } from 'react'
import { observer } from 'mobx-react-lite'
import { state } from '../../models'
import { APIErrorList } from '../../api/api.handler'

export const DashboardAccount = observer((): JSX.Element => {
  const { account } = state
  useEffect(() => {
    if (account.id === void 0) {
      account.fetchAccount()
    }
  }, [account, account.id])

  const onClick = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault()
    account.createAccount()
  }

  return (
    <div>
      {account.loading && 'Loading account data'}
      {account.error && account.error === APIErrorList.NoUserAccountException && (
        <div>
          No account found. You can create your own account, or join to your
          family with existed account
          <button onClick={onClick}>Create my own account</button>
        </div>
      )}
    </div>
  )
})
