import { APIParsedResponse, requestHandler } from './api.handler';
import { FamilyRequestModel } from '../models/familyrequest.model';
import { api } from './api.transport';

export const fetchFamilyRequests = async (): Promise<
  APIParsedResponse<FamilyRequestModel[]>
> => {
  return requestHandler<FamilyRequestModel[]>(api.get('/family/requests'));
};

export const fetchFamilyRequest = async (): Promise<
  APIParsedResponse<FamilyRequestModel>
> => {
  return requestHandler<FamilyRequestModel>(api.get('/family/request'));
};

export const createFamilyRequest = async (
  email: string,
): Promise<APIParsedResponse<FamilyRequestModel>> => {
  return requestHandler<FamilyRequestModel>(
    api.post('/family/request/create', { email }),
  );
};

export const approveFamilyRequest = async (
  id: number,
): Promise<APIParsedResponse<boolean>> => {
  return requestHandler<boolean>(api.post('/family/request/approve', { id }));
};

export const rejectFamilyRequest = async (
  id: number,
): Promise<APIParsedResponse<boolean>> => {
  return requestHandler<boolean>(api.post('/family/request/reject', { id }));
};
