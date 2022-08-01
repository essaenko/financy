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
          placeholder="Full name"
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
          placeholder="Password"
          className={classnames(css.field, {
            [css.invalidField]: formState === FormStateList.InvalidPassword,
          })}
          value={password}
          onChange={onChangeFactory(setPassword)}
        />
        <input
          type="password"
          placeholder="Repeat password"
          className={classnames(css.field, {
            [css.invalidField]: formState === FormStateList.InvalidPassword,
          })}
          value={passwordCopy}
          onChange={onChangeFactory(setPasswordCopy)}
        />
        <span>
          {formState === FormStateList.InvalidEmail && 'Incorrect email'}
          {formState === FormStateList.InvalidName && 'Incorrect name'}
          {formState === FormStateList.InvalidPassword && 'Invalid password'}
          {formState === FormStateList.EmailAlreadyRegistered &&
            'User with this email already registered, try to login or reset your password'}
        </span>
        <div className={css.regSubmitWrapper}>
          <button className={css.regSubmit} onClick={onSubmit}>
            Done
          </button>
        </div>
        <Link to="/" className={css.link}>
          Already have account
        </Link>
      </form>
    </div>
  );
});
