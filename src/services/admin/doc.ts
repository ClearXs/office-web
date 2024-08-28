import { Doc } from '../doc';
import useApi from '../model/api';
import { Api } from '../model/interface';

export type DocApi = Api<Doc> & {};

const useDocApi = (): DocApi => {
  const api = useApi<Doc>('/office/doc');

  return { ...api };
};

export default useDocApi;
