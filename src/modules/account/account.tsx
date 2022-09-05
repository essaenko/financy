import React, {
  useCallback,
  useEffect,
  MouseEvent,
  useState,
  Dispatch,
  SetStateAction,
  ChangeEvent,
} from 'react';
import { Link } from 'react-router-dom';

import { observer } from 'mobx-react-lite';

import { state } from 'models';
import { FamilyRequestState } from 'models/familyrequest.model';
import { AUTH_TOKEN_LOCAL_STORAGE_KEY } from '../../globals.config';

import css from './account.module.css';

export const Account = observer((): JSX.Element => {
  const {
    account,
    family,
    user,
    account: { users },
    family: { collection: fRequests },
  } = state;
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState<string>('');
  const [changePasswordNotification, setChangePasswordNotification] =
    useState<string>('');

  useEffect(() => {
    account.fetchAccountUsers();
    family.fetchFamilyRequests();
  }, [account, family]);
  const onChangeFactory = useCallback(
    (setter: Dispatch<SetStateAction<string>>) =>
      (event: ChangeEvent<HTMLInputElement>) => {
        setter(event.target.value);
      },
    [],
  );
  const onRemoveUserFromAccount = useCallback(
    (email: string) => () => {
      account.removeUserFromAccount(email);
    },
    [account],
  );
  const onApproveRequest = useCallback(
    (request: FamilyRequestState) =>
      async (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();

        await request.approveRequest();
        await account.fetchAccountUsers();
        await family.fetchFamilyRequests();
      },
    [account, family],
  );
  const onRejectRequest = useCallback(
    (request: FamilyRequestState) =>
      async (event: MouseEvent<HTMLAnchorElement>) => {
        event.preventDefault();

        await request.rejectRequest();
        await family.fetchFamilyRequests();
      },
    [family],
  );
  const onLogout = useCallback(event => {
    event.preventDefault();
    event.stopPropagation();

    localStorage.removeItem(AUTH_TOKEN_LOCAL_STORAGE_KEY);

    window.location.href = `/`;
  }, []);
  const onChangePassword = useCallback(
    async event => {
      event.preventDefault();
      event.stopPropagation();
      setChangePasswordNotification('');
      if (newPassword !== newPasswordConfirm) {
        setChangePasswordNotification(
          'Новый пароль и подтверждение пароля должны совпадать',
        );

        return;
      }
      if (currentPassword === newPassword) {
        setChangePasswordNotification(
          'Новый пароль не должен совпадать с старым паролем',
        );

        return;
      }

      const result = await user.updatePassword(currentPassword, newPassword);

      if (result.success) {
        setChangePasswordNotification('Пароль успешно изменен');
        setCurrentPassword('');
        setNewPassword('');
        setNewPasswordConfirm('');
      } else {
        setChangePasswordNotification(
          'Что-то пошло не так... Попробуйте еще раз',
        );
      }
    },
    [currentPassword, newPassword, newPasswordConfirm, user],
  );

  return (
    <div className={css.root}>
      <h2>Аккаунт</h2>
      <div className={css.ownerData}>
        Владелец: {state.account.owner?.name} (
        <a href={`mailto:${state.account.owner?.email}`}>
          {state.account.owner?.email}
        </a>
        )
      </div>
      <div className={css.ownerData}>Имя: {user.name}</div>
      <div className={css.ownerData}>E-mail: {user.email}</div>
      <form>
        <button onClick={onLogout}>Выйти</button>
      </form>
      <h3>Изменить пароль</h3>
      <form>
        <input
          type="password"
          autoComplete="off"
          value={currentPassword}
          placeholder="Текущий пароль"
          onChange={onChangeFactory(setCurrentPassword)}
        />
        <input
          type="password"
          autoComplete="off"
          value={newPassword}
          placeholder="Новый пароль"
          onChange={onChangeFactory(setNewPassword)}
        />
        <input
          type="password"
          autoComplete="off"
          value={newPasswordConfirm}
          placeholder="Повторите новый пароль"
          onChange={onChangeFactory(setNewPasswordConfirm)}
        />
        <span>{changePasswordNotification}</span>
        <button onClick={onChangePassword}>Сохранить</button>
      </form>
      <div className={css.family}>
        <h3>Пользователи аккаунта:</h3>
        {}
        {users.map(user => (
          <div key={user.id}>
            {user.name} {user.id === state.user.id && ' (You)'}{' '}
            {user.id !== state.user.id && account.owner?.id === state.user.id && (
              <Link
                className={css.remove}
                to="/dashboard/account"
                onClick={onRemoveUserFromAccount(user.email as string)}
              >
                Удалить
              </Link>
            )}
          </div>
        ))}
        {users.length === 1 && (
          <div className={css.emptyList}>Нет других пользователей...</div>
        )}
      </div>
      <div className={css.pendingRequests}>
        {fRequests.length > 0 && <h3>Запросы:</h3>}
        {fRequests.map(request => (
          <div key={request.id} className={css.pendingRequest}>
            {request.user} -{' '}
            <Link to="/dashboard/account" onClick={onApproveRequest(request)}>
              Добавить
            </Link>{' '}
            <Link
              className={css.rejectRequest}
              to="/dashboard/account"
              onClick={onRejectRequest(request)}
            >
              Отклонить
            </Link>
          </div>
        ))}
      </div>
      <a className={css.footerLink} href="mailto:support@financy.live">
        Поддержка
      </a>
      <span>Financy © 2022</span>
    </div>
  );
});
