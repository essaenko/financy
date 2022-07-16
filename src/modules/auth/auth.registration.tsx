import React, {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useState,
  MouseEvent,
  useEffect,
} from 'react';
import { observer } from 'mobx-react-lite';
import { Link, useHistory } from 'react-router-dom';
import classnames from 'classnames';

import css from 'modules/auth/auth.module.css';
import { UserState } from '../../models/user.model';

enum FormStateList {
  Ok,
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

  const history = useHistory();

  useEffect(() => {
    if (user.email === void 0) {
      user.fetchUser();
    }
  }, [user]);

  useEffect(() => {
    if (user.email !== void 0) {
      history.push('/dashboard');
    }
  }, [history, user.email]);

  const onChangeFactory =
    (setter: Dispatch<SetStateAction<string>>) =>
    ({ target }: ChangeEvent<HTMLInputElement>) => {
      setter(target.value);
    };

  const onSubmit = (event: MouseEvent) => {
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
      user.createUser(email, name, password);
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
