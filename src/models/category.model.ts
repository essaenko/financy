import { makeAutoObservable, runInAction } from 'mobx'

import { AccountModel } from './account.model'
import { createCategory, fetchCategories } from '../api/api.category'
import { APIErrorList, NetworkComponentStatusList } from '../api/api.handler'

export enum CategoryTypeList {
  Income = 'Income',
  Outcome = 'Outcome',
  All = 'All',
}

export interface CategoryModel {
  id: number | undefined;
  parent: CategoryModel | undefined;
  account: AccountModel | undefined;
  name: String | undefined;
  type: CategoryTypeList | undefined;
  createdAt: String | undefined;
  updatedAt: String | undefined;
}

export class CategoryState implements CategoryModel {
  id: number | undefined
  parent: CategoryModel | undefined
  account: AccountModel | undefined
  name: String | undefined
  type: CategoryTypeList | undefined
  createdAt: String | undefined
  updatedAt: String | undefined

  constructor() {
    makeAutoObservable(this)
  }

  setState(category: CategoryModel) {
    this.id = category.id
    this.parent = category.parent
    this.account = category.account
    this.name = category.name
    this.type = category.type
    this.createdAt = category.createdAt
    this.updatedAt = category.updatedAt
  }
}

export class CategoryCollectionState {
  collection: CategoryState[] = []
  status: NetworkComponentStatusList = NetworkComponentStatusList.Untouched
  error: APIErrorList | null = null

  constructor() {
    makeAutoObservable(this)
  }

  async createCategory(name: string, type: CategoryTypeList, parent?: number) {
    const result = await createCategory(name, type, parent)

    if (result.success && result.payload) {
      await this.fetchCategories()
    }

    return result
  }

  async fetchCategories() {
    runInAction(() => {
      this.status = NetworkComponentStatusList.Loading
      this.error = null
    })
    const result = await fetchCategories()

    if (result.success && result.payload) {
      runInAction(() => {
        this.status = NetworkComponentStatusList.Loaded
        this.collection =
          result.payload?.map((category) => {
            const cat = new CategoryState()
            cat.setState(category)

            return cat
          }) ?? []
      })
    } else {
      runInAction(() => {
        this.status = NetworkComponentStatusList.Failed
        if (result.errorCode) {
          this.error = APIErrorList[result.errorCode]
        }
      })
    }
  }
}
