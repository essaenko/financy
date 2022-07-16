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

export const AuthRestore = observer(({ user }: PropsType): JSX.Element => {
  const [email, setEmail] = useState<string>('');
  const [notification, setNotification] = useState<string>('');

  const history = useHistory();

  useEffect(() => {
    if (user.email === void 0) {
      user.fetchUser();
    }
  }, [user]);

  useEffect(() => {
    if (user.email !== void 0) {
      history.push('/dashboard/transaction');
    }
  }, [history, user.email]);

  const onChangeFactory =
    (setter: Dispatch<SetStateAction<string>>) =>
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      setter(target.value);
    };
  const onSubmit = async (event: MouseEvent) => {
    event.preventDefault();
    setNotification('');

    const result = await user.restorePassword(email);

    if (result.errorCode === APIErrorList.UserNotFountException) {
      setNotification(`Account with email ${email} was not found`);
    }

    if (result.errorCode === APIErrorList.ServiceUnreachableException) {
      setNotification('Service temporary unreachable, please try again later');
    }
  };

  return (
    <div className={css.login}>
      <form className={css.form} autoComplete="off">
        <h2>Restore password</h2>
        <input
          type="email"
          placeholder="Email"
          className={css.field}
          value={email}
          onChange={onChangeFactory(setEmail)}
        />
        <span>{notification}</span>
        <button className={css.submit} onClick={onSubmit}>
          Restore
        </button>
        <Link to="/" className={css.link}>
          Back
        </Link>
      </form>
    </div>
  );
});
