import React, {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  SetStateAction,
  useState,
} from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';

import { UserState } from 'models/user.model';
import { AccountState } from 'models/account.model';

import { APIErrorList } from 'api/api.handler';

import css from './auth.module.css';

type PropsType = {
  user: UserState;
  account: AccountState;
};

export const AuthLogin = observer(
  ({ user, account }: PropsType): JSX.Element => {
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
        if (res.errorCode === APIErrorList.UnauthorizedException) {
          setNotification(
            'Нет такого пользователя, проверьте имя пользователя и пароль',
          );
        }
        if (
          res.errorCode === APIErrorList.ServiceUnreachableException ||
          res.errorCode === APIErrorList.InternalServerException
        ) {
          setNotification(
            `Сервис временно не доступен. Пожалуйста попробуйте позже`,
          );
        }
        if (res.success) {
          account.fetchAccount();
        }
      });
    };

    return (
      <div className={css.login}>
        <form className={css.form} autoComplete="off">
          <h2>Добро пожаловать</h2>
          <input
            type="email"
            placeholder="E-mail"
            className={css.field}
            value={email}
            onChange={onChangeFactory(setEmail)}
          />
          <input
            type="password"
            placeholder="Пароль"
            className={css.field}
            autoComplete="off"
            value={password}
            onChange={onChangeFactory(setPassword)}
          />
          <span>{notification}</span>
          <button className={css.submit} onClick={onSubmit}>
            Войти
          </button>
          <Link to="/signup" className={css.link}>
            Регистрация
          </Link>
          <Link to="/restore" className={css.link}>
            Забыли пароль?
          </Link>
        </form>
      </div>
    );
  },
);
