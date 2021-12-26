import React, {ChangeEvent, useMemo, useState, MouseEvent, useCallback} from 'react'
import {Link, useHistory} from 'react-router-dom'
import { observer } from 'mobx-react-lite'

import { CategoryModel, CategoryTypeList } from '../../models/category.model'
import { state } from '../../models'

import { normalizeTree } from 'utils/collection.utils'

import css from './category.module.css'

export const CategoryCreate = observer((): JSX.Element => {
  const [name, setName] = useState<string>("")
  const [type, setType] = useState<CategoryTypeList>(CategoryTypeList.Income)
  const [parent, setParent] = useState<number>(-1);
  const [notification, setNotification] = useState<string>("");
  const { collection } = state.categories
  const history = useHistory();
  const categories = useMemo(
    () => normalizeTree<CategoryModel>(collection.filter((category) => category.type === type)),
    [collection, type]
  );

  const onCategoryTypeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setType(event.currentTarget.value as CategoryTypeList);
  }
  const onParentChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setParent(+event.currentTarget.value);
  }
  const onNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
  }
  const onSubmit = useCallback(async (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setNotification("");

    if (!name) {
      setNotification("Name can't be empty");

      return void 0;
    }

    const result = await state.categories.createCategory(name, type, parent);

    if (result.success) {
      history.push('/dashboard/category');
    } else {
      setNotification('Some error occurred while creating new category, please try again or comeback later')
    }
  }, [history, name, parent, type])

  return (
    <div>
      <Link to={'/dashboard/category'}>Back</Link>
      <br />
      <h2>New category</h2>
      <div className={css.categoryCreate}>
        <form>
          <input type="text" placeholder={'Name'} value={name} onChange={onNameChange} />
          <select onChange={onCategoryTypeChange} value={type}>
            <option value={0} disabled>
              Category type
            </option>
            <option key={CategoryTypeList.Income} value={CategoryTypeList.Income}>Income</option>
            <option key={CategoryTypeList.Outcome} value={CategoryTypeList.Outcome}>Outcome</option>
          </select>
          <select value={parent} onChange={onParentChange}>
            <option value={-1} disabled>
              Attach category to
            </option>
            <option value={0}>
              None
            </option>
            {Object.values(categories).map((category) => {
              return <option key={category.id} value={category.id}>{category.name}</option>
            })}
          </select>
          <button onClick={onSubmit}>
            Create
          </button>
          <span>
            {notification}
          </span>
        </form>
      </div>
    </div>
  )
})
