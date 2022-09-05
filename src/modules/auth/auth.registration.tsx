import React, {
  ChangeEvent,
  Dispatch,
  MouseEvent,
  SetStateAction,
  useState,
} from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import css from 'modules/auth/auth.module.css';
import { UserState } from 'models/user.model';
import { APIErrorList } from 'api/api.handler';

enum FormStateList {
  Ok,
  EmailAlreadyRegistered,
  InvalidEmail,
  InvalidName,
  InvalidPassword,
}

type PropsType = {
  user: UserState;
};

export const AuthRegistration = observer(({ user }: PropsType): JSX.Element => {
  const [email, setEmail] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordCopy, setPasswordCopy] = useState<string>('');
  const [formState, setFormState] = useState<FormStateList>(FormStateList.Ok);

  const onChangeFactory =
    (setter: Dispatch<SetStateAction<string>>) =>
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      setter(target.value);
    };

  const onSubmit = async (event: MouseEvent) => {
    event.preventDefault();
    let hasError: boolean = false;

    if (
      !email.includes('@') ||
      email.split('@')[0].length < 2 ||
      email.split('@')[1].length < 3
    ) {
      setFormState(FormStateList.InvalidEmail);
      hasError = true;
    }

    if (name.length < 2) {
      setFormState(FormStateList.InvalidName);
      hasError = true;
    }

    if (password !== passwordCopy) {
      setFormState(FormStateList.InvalidPassword);
      hasError = true;
    }

    if (!hasError) {
      setFormState(FormStateList.Ok);
      const result = await user.createUser(email, name, password);

      if (result.errorCode === APIErrorList.EmailAlreadyRegisteredException) {
        setFormState(FormStateList.EmailAlreadyRegistered);
      }
    }
  };

  return (
    <div className={css.registration}>
      <form className={css.form}>
        <h2>Registration</h2>
        <input
          type="text"
          placeholder="Имя"
          className={classnames(css.field, {
            [css.invalidField]: formState === FormStateList.InvalidName,
          })}
          value={name}
          onChange={onChangeFactory(setName)}
        />
        <input
          type="email"
          placeholder="E-mail"
          className={classnames(css.field, {
            [css.invalidField]: formState === FormStateList.InvalidEmail,
          })}
          value={email}
          onChange={onChangeFactory(setEmail)}
        />
        <input
          type="password"
          placeholder="Пароль"
          className={classnames(css.field, {
            [css.invalidField]: formState === FormStateList.InvalidPassword,
          })}
          value={password}
          onChange={onChangeFactory(setPassword)}
        />
        <input
          type="password"
          placeholder="Повторите пароль"
          className={classnames(css.field, {
            [css.invalidField]: formState === FormStateList.InvalidPassword,
          })}
          value={passwordCopy}
          onChange={onChangeFactory(setPasswordCopy)}
        />
        <span>
          {formState === FormStateList.InvalidEmail && 'Некорректный E-mail'}
          {formState === FormStateList.InvalidName && 'Некорректное имя'}
          {formState === FormStateList.InvalidPassword && 'Неподходящий пароль'}
          {formState === FormStateList.EmailAlreadyRegistered &&
            'Пользователь с таким E-mail уже зарегистрирован. Попробуйте войти или восстановить пароль.'}
        </span>
        <div className={css.regSubmitWrapper}>
          <button className={css.regSubmit} onClick={onSubmit}>
            Готово
          </button>
        </div>
        <Link to="/" className={css.link}>
          Уже есть аккаунт
        </Link>
      </form>
    </div>
  );
});
