import React, {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  SetStateAction,
  useEffect,
  useState,
} from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useHistory } from 'react-router-dom';

import { UserState } from 'models/user.model';

import { APIErrorList } from 'api/api.handler';
import css from './auth.module.css';

type PropsType = {
  user: UserState;
};

export const AuthLogin = observer(({ user }: PropsType): JSX.Element => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [notification, setNotification] = useState<string>('');

  const onChangeFactory =
    (setter: Dispatch<SetStateAction<string>>) =>
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      setter(target.value);
    };
  const onSubmit = (event: MouseEvent) => {
    event.preventDefault();
    setNotification('');

    user.loginUser(email, password).then(res => {
      // eslint-disable-next-line no-debugger
      if (res.errorCode === APIErrorList.UnauthorizedException) {
        setNotification('User not found, check your credentials and try again');
      }
      if (res.errorCode === APIErrorList.ServiceUnreachableException) {
        setNotification(
          `Service temporary unavailable. Please try again later`,
        );
      }
      if (res.errorCode === APIErrorList.InternalServerException) {
        setNotification(
          'Service temporary unavailable. Please try again later',
        );
      }
    });
  };

  return (
    <div className={css.login}>
      <form className={css.form} autoComplete="off">
        <h2>Welcome</h2>
        <input
          type="email"
          placeholder="Email"
          className={css.field}
          value={email}
          onChange={onChangeFactory(setEmail)}
        />
        <input
          type="password"
          placeholder="Password"
          className={css.field}
          autoComplete="off"
          value={password}
          onChange={onChangeFactory(setPassword)}
        />
        <span>{notification}</span>
        <button className={css.submit} onClick={onSubmit}>
          Login
        </button>
        <Link to="/signup" className={css.link}>
          Signup
        </Link>
        <Link to="/restore" className={css.link}>
          Forgot password
        </Link>
      </form>
    </div>
  );
});
