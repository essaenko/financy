import React, { useEffect } from 'react'
import { observer } from 'mobx-react-lite'
import { Route } from 'react-router-dom'

import { CategoryList } from 'modules/category/category.list'
import { CategoryCreate } from 'modules/category/category.create'

import { state } from '../../models'

import css from './category.module.css'

export const Category = observer((): JSX.Element => {
  useEffect(() => {
    state.categories.fetchCategories()
  }, [])

  return (
    <div className={css.root}>
      <Route path={'/dashboard/category'} exact>
        <CategoryList />
      </Route>
      <Route path={'/dashboard/category/create'} exact>
        <CategoryCreate />
      </Route>
    </div>
  )
})
