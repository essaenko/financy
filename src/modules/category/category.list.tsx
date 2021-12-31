import React, {useCallback, useMemo, useState} from 'react'
import {observer} from 'mobx-react-lite'
import {Link} from "react-router-dom";
import classnames from "classnames";

import {Picker} from 'components/picker'
import add from 'static/icons/add.png'
import refresh from 'static/icons/refresh.png'

import {CategoryModel, CategoryTypeList} from 'models/category.model'
import {state} from "../../models";

import {normalizeTree} from "utils/collection.utils";

import css from 'modules/category/category.module.css'
import {NetworkComponentStatusList} from "../../api/api.handler";

export const CategoryList = observer((): JSX.Element => {
  const [tabState, setTabState] = useState<CategoryTypeList>(
    CategoryTypeList.Income
  )
  const { collection, status } = state.categories
  const categories = useMemo(
    () =>
      normalizeTree<CategoryModel>(
        collection.filter((category) => tabState === CategoryTypeList.All || category.type === tabState)
      ),
    [collection, tabState]
  )

  const onChangeCategoryType = (type: keyof typeof CategoryTypeList) => () => {
    setTabState(CategoryTypeList[type])
  }

  const deepRender = (node: any): JSX.Element => (
    <div key={node.id} className={classnames(css.deepNode, {
      [css.parentNode]: !!node.children
    })}>
      {node.name}
      {node.children && <>{Object.values(node.children).map(deepRender)}</>}
    </div>
  )
  const refreshList = useCallback(() => {
    state.categories.fetchCategories()
  }, [])
  return (
    <>
      <div className={css.header}>
        <h2>Categories </h2>
        <Picker
          className={css.picker}
          onChange={onChangeCategoryType}
          active={tabState}
          elements={[
            {
              id: CategoryTypeList.All,
              text: 'All',
            },
            {
              id: CategoryTypeList.Income,
              text: 'Income',
            },
            {
              id: CategoryTypeList.Outcome,
              text: 'Outcome',
            },
          ]}
        />
        <Link to={'/dashboard/category/create'}>
          <img className={css.iconLink} src={add} alt={'New categoty'} />
        </Link>
      </div>
      <div className={css.categoriesOwner}>
        {status === NetworkComponentStatusList.Loading && (
          <div className={css.loader}>Loading categories...</div>
        )}
        {status === NetworkComponentStatusList.Loaded && Object.values(categories).map(deepRender)}
        {status === NetworkComponentStatusList.Failed && (
          <div className={css.loader}>
            Some error occurred while fetching categories...
            <img
              className={css.icon}
              src={refresh}
              onClick={refreshList}
              alt={'Refresh'}
            />
          </div>
        )}
      </div>
    </>
  )
})
