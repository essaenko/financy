import React, {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  SetStateAction,
  useState,
} from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useHistory } from 'react-router-dom';

import { UserState } from 'models/user.model';

import { APIErrorList } from 'api/api.handler';
import css from './auth.module.css';
import { useQuery } from 'utils/url.utils';

type PropsType = {
  user: UserState;
};

export const AuthReset = observer(({ user }: PropsType): JSX.Element => {
  const [password, setPassword] = useState<string>('');
  const [passwordCopy, setPasswordCopy] = useState<string>('');
  const [notification, setNotification] = useState<string>('');
  const [disabled, setDisabled] = useState<boolean>(false);

  const history = useHistory();
  const query = useQuery();

  const onChangeFactory =
    (setter: Dispatch<SetStateAction<string>>) =>
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      setter(target.value);
    };
  const onSubmit = async (event: MouseEvent) => {
    event.preventDefault();
    setNotification('');
    setDisabled(true);
    const token = query.get('token');

    if (password !== passwordCopy) {
      setNotification('Пароли должны совпадать');
      setDisabled(false);

      return;
    }
    if (!token) {
      setNotification(
        'Ссылка восстановления пароля некорректна. Пожалуйста проверьте свой E-mail ящик',
      );
      setDisabled(false);

      return;
    }

    const result = await user.resetPassword(password, token);

    if (result.errorCode === APIErrorList.ServiceUnreachableException) {
      setNotification(
        'Сервис временно недоступен. Пожалуйста повторите еще раз',
      );
      setDisabled(false);
    }

    if (result.success) {
      setNotification(
        'Ваш пароль успешно изменен. Теперь вы можете войти в учетную запись используя новые данные для входа',
      );

      setTimeout(() => {
        history.push('/');
      }, 5000);
    }
  };

  return (
    <div className={css.login}>
      <form className={css.form} autoComplete="off">
        <h2>Новый пароль</h2>
        <input
          type="password"
          placeholder="Пароль"
          className={css.field}
          value={password}
          autoComplete="off"
          onChange={onChangeFactory(setPassword)}
          disabled={disabled}
        />
        <input
          type="password"
          placeholder="Повторите пароль"
          className={css.field}
          value={passwordCopy}
          autoComplete="off"
          onChange={onChangeFactory(setPasswordCopy)}
          disabled={disabled}
        />
        <span>{notification}</span>
        <button className={css.submit} onClick={onSubmit} disabled={disabled}>
          Изменить пароль
        </button>
        <Link to="/" className={css.link}>
          Отменить
        </Link>
      </form>
    </div>
  );
});
