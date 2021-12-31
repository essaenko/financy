import React, {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useState,
} from 'react'
import { observer } from 'mobx-react-lite'
import { Link, useHistory } from 'react-router-dom'

import { UserState } from '../../models/user.model'

import css from './auth.module.css'
import { APIErrorList } from '../../api/api.handler'

type PropsType = {
  user: UserState,
}

export const AuthLogin = observer(({ user }: PropsType): JSX.Element => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [notification, setNotification] = useState<string>('')

  const history = useHistory()

  useEffect(() => {
    if (user.email === void 0) {
      user.fetchUser()
    }
  }, [user])

  useEffect(() => {
    if (user.email !== void 0) {
      history.push('/dashboard/transaction')
    }
  }, [history, user.email])

  const onChangeFactory =
    (setter: Dispatch<SetStateAction<string>>) =>
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      setter(target.value)
    }
  const onSubmit = (event: MouseEvent) => {
    event.preventDefault()
    setNotification('')

    user.loginUser(email, password).then((res) => {
      if (res.errorCode === APIErrorList.UnauthorizedException) {
        setNotification('User not found, check your credentials and try again')
      }
    })
  }

  return (
    <div className={css.login}>
      <form className={css.form} autoComplete={'off'}>
        <h2>Welcome</h2>
        <input
          type="email"
          placeholder={'Email'}
          className={css.field}
          value={email}
          onChange={onChangeFactory(setEmail)}
        />
        <input
          type="password"
          placeholder={'Password'}
          className={css.field}
          autoComplete={'off'}
          value={password}
          onChange={onChangeFactory(setPassword)}
        />
        <span>{notification}</span>
        <button className={css.submit} onClick={onSubmit}>
          Login
        </button>
        <Link to={'/signup'} className={css.link}>
          Signup
        </Link>
      </form>
    </div>
  )
})
