import React, {
  ChangeEvent,
  useMemo,
  useState,
  MouseEvent,
  useCallback,
  Dispatch,
  SetStateAction,
} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { normalizeTree } from 'utils/collection.utils';
import { CategoryModel, CategoryTypeList } from 'models/category.model';
import { state } from 'models';

import css from './category.module.css';

export const CategoryCreate = observer((): JSX.Element => {
  const [name, setName] = useState<string>('');
  const [type, setType] = useState<CategoryTypeList>(CategoryTypeList.Income);
  const [parent, setParent] = useState<number>(-1);
  const [mcc, setMcc] = useState<string>('');
  const [notification, setNotification] = useState<string>('');
  const { collection } = state.categories;
  const history = useHistory();
  const categories = useMemo(
    () =>
      normalizeTree<CategoryModel>(
        collection.filter(category => category.type === type),
      ),
    [collection, type],
  );

  const onChangeFactory = useCallback(
    <T extends unknown>(setter: Dispatch<SetStateAction<T>>) =>
      ({
        currentTarget: { value },
      }: ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
        setter(value as T);
      },
    [],
  );

  const onSubmit = useCallback(
    async (event: MouseEvent<HTMLButtonElement>): Promise<void> => {
      event.preventDefault();
      setNotification('');

      if (!name) {
        setNotification('Название не может быть пустым');

        return void 0;
      }

      const result = await state.categories.createCategory(name, type, parent);

      if (result.success) {
        history.push('/dashboard/category');
      } else {
        setNotification(
          'Что-то пошло не так, повторите попытку или вернитесь позднее',
        );
      }

      return void 0;
    },
    [history, name, parent, type],
  );

  return (
    <div>
      <Link to="/dashboard/category">Back</Link>
      <br />
      <h2>Новая категория</h2>
      <div className={css.categoryCreate}>
        <form>
          <input
            type="text"
            placeholder="Название"
            value={name}
            onChange={onChangeFactory(setName)}
          />
          <select onChange={onChangeFactory(setType)} value={type}>
            <option value={0} disabled>
              Тип категории
            </option>
            <option
              key={CategoryTypeList.Income}
              value={CategoryTypeList.Income}
            >
              Доходы
            </option>
            <option
              key={CategoryTypeList.Outcome}
              value={CategoryTypeList.Outcome}
            >
              Расходы
            </option>
          </select>
          <select value={parent} onChange={onChangeFactory(setParent)}>
            <option value={-1} disabled>
              Добавить категорию к
            </option>
            <option value={0}>None</option>
            {Object.values(categories).map(category => {
              return (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              );
            })}
          </select>
          <input
            type="text"
            placeholder="MCC коды категории (перечислите коды через запятую)"
            value={mcc}
            onChange={onChangeFactory(setMcc)}
          />
          <button onClick={onSubmit}>Создать</button>
          <span>{notification}</span>
        </form>
      </div>
    </div>
  );
});
