import useRequest from '@/hook/useRequest';
import Result from './model/result';
import { Model } from './model/interface';

export type UserInfo = Model & {
  userId: string;
  username: string;
  password: string;
  email: string;
  name: string;
  phone: number;
  nickname: string;
  avatar: string;
  status: string;
  orgId: string;
  administrator: boolean;
  source: 'THIRD' | 'SELF-BUILT';
};

interface UserApi {
  getCurrentUser: () => Promise<Result<UserInfo>>;
}

const useUserApi = (): UserApi => {
  const request = useRequest();
  return {
    getCurrentUser() {
      return request.get('/api/auth/current-user').then((res) => {
        return res.data;
      });
    },
  };
};

export default useUserApi;
