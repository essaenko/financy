import React, { useState, MouseEvent } from 'react';

import css from './transaction.module.css';
import { uploadTransactions } from 'api/api.transaction';

export const TransactionImport = () => {
  const [files, setState] = useState<FileList | null>(null);
  const [provider, setProvider] = useState<string | 0>(0);
  const [notification, setNotification] = useState('');

  const onSubmit = async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setNotification('');
    const data = new FormData();

    if (
      !files?.[0].name.includes('.csv') &&
      !files?.[0].name.includes('.xls') &&
      !files?.[0].name.includes('.xlsx') &&
      !files?.[0].name.includes('.pdf')
    ) {
      setNotification('В данный момент мы поддерживаем файлы xls, csv и pdf');

      return;
    }
    if (files && provider !== 0) {
      data.set('file', files[0]);
      data.set('provider', provider);

      setNotification('Загружаем файл операций');
      const result = await uploadTransactions(data);

      if (result.success) {
        setNotification('Операции успешно добавлены');
      } else {
        setNotification(
          'Мы не смогли добавить операции из этого файла. Повторите попытку или попробуйте позже',
        );
      }
    } else {
      setNotification(
        'Выберите банк операции которого хотите загрузить и прикрепите файл, если банка нет в списке мы пока не поддерживаем формат данных этого банка',
      );
    }
  };
  return (
    <div>
      <div className={css.header}>
        <h2>Импорт операций из приложения банка</h2>
      </div>
      <form>
        <select
          value={provider}
          onChange={({ target: { value } }) => setProvider(value)}
        >
          <option value={0} disabled>
            Выберите банк
          </option>
          <option value="Tinkoff">Tinkoff</option>
          {/* <option value="SberBank">СберБанк</option> */}
        </select>
        <input type="file" onChange={event => setState(event.target.files)} />
        <span>{notification}</span>
        <button onClick={onSubmit}>Загрузить</button>
      </form>
    </div>
  );
};
