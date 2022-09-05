import React, { useCallback, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import classnames from 'classnames';

import { Picker } from 'components/picker';

import { CategoryModel, CategoryTypeList } from 'models/category.model';
import { state } from 'models';
import { NetworkComponentStatusList } from 'api/api.handler';
import { PlusIcon, ReloadIcon } from 'static/icons';

import { normalizeTree, TreeNode } from 'utils/collection.utils';

import css from 'modules/category/category.module.css';

export const CategoryList = observer((): JSX.Element => {
  const [tabState, setTabState] = useState<CategoryTypeList>(
    CategoryTypeList.Income,
  );
  const { collection, status } = state.categories;
  const categories = useMemo(
    () =>
      normalizeTree<CategoryModel>(
        collection.filter(
          category =>
            tabState === CategoryTypeList.All || category.type === tabState,
        ),
      ),
    [collection, tabState],
  );

  const onChangeCategoryType = (type: string | number) => () => {
    setTabState(CategoryTypeList[type as keyof typeof CategoryTypeList]);
  };

  const deepRender = (node: TreeNode<{ name?: string }>): JSX.Element => (
    <div
      key={node.id}
      className={classnames(css.deepNode, {
        [css.parentNode]: !!node.children,
      })}
    >
      {node.name}
      {node.children && <>{Object.values(node.children).map(deepRender)}</>}
    </div>
  );
  const refreshList = useCallback(() => {
    state.categories.fetchCategories();
  }, []);
  return (
    <>
      <div className={css.header}>
        <h2>
          Категории{' '}
          <Link to="/dashboard/category/create" className={css.mobileLink}>
            <PlusIcon className={css.icon} />
          </Link>
        </h2>
        <Picker
          className={css.picker}
          onChange={onChangeCategoryType}
          active={tabState}
          elements={[
            {
              id: CategoryTypeList.All,
              text: 'Все',
            },
            {
              id: CategoryTypeList.Income,
              text: 'Доходы',
            },
            {
              id: CategoryTypeList.Outcome,
              text: 'Расходы',
            },
          ]}
        />
        <Link to="/dashboard/category/create" className={css.desktopLink}>
          <PlusIcon className={css.icon} />
        </Link>
      </div>
      <div className={css.categoriesOwner}>
        {status === NetworkComponentStatusList.Loading && (
          <div className={css.loader}>Загружаем категории...</div>
        )}
        {status === NetworkComponentStatusList.Loaded &&
          Object.values(categories).map(deepRender)}
        {status === NetworkComponentStatusList.Failed && (
          <div className={css.loader}>
            Что-то пошло не так...
            <ReloadIcon className={css.icon} onClick={refreshList} />
          </div>
        )}
      </div>
    </>
  );
});
