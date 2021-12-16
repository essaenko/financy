import {APIParsedResponse, requestHandler} from "./api.handler";
import {api} from "./api.transport";

export const fetchUser = async (): Promise<APIParsedResponse<any>> => {
  const request: Response = await api.get('/user');

  return requestHandler<{}>(request);
}