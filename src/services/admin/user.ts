import useApi from '../model/api';
import { Api, Model } from '../model/interface';

export type User = Model & {
  username: string;
  password: string;
  email: string;
  name: string;
  phone: number;
  nickname: string;
  avatar: string;
  status: string;
  orgId: string;
  source: 'THIRD' | 'SELF-BUILT';
};

export type UserApi = Api<User> & {};

const useUserApi = (): UserApi => {
  const api = useApi<User>('/sys/user');

  return { ...api };
};

export default useUserApi;
