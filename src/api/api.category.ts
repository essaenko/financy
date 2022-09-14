import { APIParsedResponse, requestHandler } from './api.handler';
import { api } from './api.transport';
import { CategoryModel, CategoryTypeList } from 'models/category.model';

export const fetchCategories = async (): Promise<
  APIParsedResponse<CategoryModel[]>
> => {
  return requestHandler<CategoryModel[]>(api.get('/category'));
};

export const updateCategory = async (
  id: number,
  name: string,
  type: CategoryTypeList,
  mcc: string,
  parent?: number,
): Promise<APIParsedResponse<CategoryModel>> => {
  const payload: {
    id: number;
    name: string;
    type: CategoryTypeList;
    mcc: string;
    parent?: number;
  } = {
    id,
    name,
    type,
    mcc,
  };

  if (parent !== void 0 && parent > 0) {
    payload.parent = parent;
  }
  return requestHandler<CategoryModel>(api.post('/category/update', payload));
};

export const createCategory = async (
  name: string,
  type: CategoryTypeList,
  parent?: number,
): Promise<APIParsedResponse<CategoryModel>> => {
  const payload: {
    name: string;
    type: CategoryTypeList;
    parent?: number;
  } = {
    name,
    type,
  };

  if (parent !== void 0 && parent > 0) {
    payload.parent = parent;
  }
  return requestHandler<CategoryModel>(api.post('/category/create', payload));
};
