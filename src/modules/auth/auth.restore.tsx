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
  const [disabled, setDisabled] = useState<boolean>(false);
  const history = useHistory();

  const onChangeFactory =
    (setter: Dispatch<SetStateAction<string>>) =>
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      setter(target.value);
    };
  const onSubmit = async (event: MouseEvent) => {
    event.preventDefault();
    setNotification('');
    setDisabled(true);

    const result = await user.restorePassword(email);

    if (result.errorCode === APIErrorList.ServiceUnreachableException) {
      setNotification('Service temporary unreachable, please try again later');
      setDisabled(false);
    }

    if (result.success) {
      setNotification(
        "We'll send email with instructions if user with this email exists. Check your mailbox (mail can be in Spam folder).",
      );

      setTimeout(() => {
        history.push('/');
      }, 5000);
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
          disabled={disabled}
        />
        <span>{notification}</span>
        <button className={css.submit} onClick={onSubmit} disabled={disabled}>
          Restore
        </button>
        <Link to="/" className={css.link}>
          Back
        </Link>
      </form>
    </div>
  );
});
