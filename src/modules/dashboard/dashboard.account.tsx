import React, { MouseEvent, useCallback, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import classnames from 'classnames';
import { Link, useHistory } from 'react-router-dom';

import { state } from '../../models';
import { APIErrorList, NetworkComponentStatusList } from 'api/api.handler';

import css from './dashboard.module.css';

enum FormTypeList {
  CreateAccount,
  JoinFamily,
}

export const DashboardAccount = observer((): JSX.Element => {
  const { status, error } = state.account;
  const { collection: fRequests, status: fRequestStatus } = state.family;
  const history = useHistory();
  const [formType, setFormType] = useState<FormTypeList>(
    FormTypeList.CreateAccount,
  );
  const [email, setEmail] = useState<string>('');

  useEffect(() => {
    if (status === NetworkComponentStatusList.Untouched) {
      state.account.fetchAccount();
    }
    if (fRequestStatus === NetworkComponentStatusList.Untouched) {
      state.family.fetchFamilyRequest();
    }
  }, [fRequestStatus, status]);

  const onEmailEnter = useCallback(event => {
    setEmail(event.target.value);
  }, []);

  const onCreateNewAccount = useCallback(
    async (event: MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      const result = await state.account.createAccount();

      if (result.success) {
        history.push('/dashboard/account');
      }
    },
    [history],
  );

  const onJoinFamily = useCallback(
    event => {
      event.preventDefault();

      state.family.createFamilyRequest(email);
    },
    [email],
  );

  return (
    <div
      className={classnames(css.accountWindow, {
        [css.loaded]: status === NetworkComponentStatusList.Loaded,
      })}
    >
      {status === NetworkComponentStatusList.Failed &&
        error === APIErrorList.NoUserAccountException && (
          <form className={css.accountPopup}>
            Мы не нашли вашего семейного аккаунта.
            <br />
            Вы можете создать свой или присоединиться <br /> к существующему
            аккаунту
            {fRequests.length === 0 && (
              <>
                {formType === FormTypeList.CreateAccount && (
                  <button onClick={onCreateNewAccount}>Создать новый</button>
                )}
                {formType === FormTypeList.JoinFamily && (
                  <div className={css.joinForm}>
                    <input
                      type="email"
                      placeholder="E-mail"
                      value={email}
                      onChange={onEmailEnter}
                    />
                    <button onClick={onJoinFamily}>Join</button>
                  </div>
                )}
                <Link
                  to="/dashboard"
                  onClick={event => {
                    event.preventDefault();

                    setFormType(
                      formType === FormTypeList.CreateAccount
                        ? FormTypeList.JoinFamily
                        : FormTypeList.CreateAccount,
                    );
                  }}
                >
                  {formType === FormTypeList.CreateAccount
                    ? 'Присоедениться к существующему'
                    : 'Создать новый'}
                </Link>
              </>
            )}
            {fRequests.length > 0 && (
              <>
                <br />
                <br />
                Запросы ожидающие подтверждения <br />
                Запрос к {fRequests[0].owner} -{' '}
                {fRequests[0].isActive ? 'Ожидает' : 'Отклонен'}
              </>
            )}
          </form>
        )}
    </div>
  );
});
