import useRequest from '@/hook/useRequest';
import Result from './model/result';

export interface AuthApi {
  login: (
    username: string,
    password: string
  ) => Promise<Result<Record<string, any>>>;
}

const useAuthApi = (): AuthApi => {
  const request = useRequest();

  return {
    login(username, password) {
      return request
        .post(
          '/api/auth/login',
          {
            username: username,
            password: password,
          },
          { 'X-LOGIN-MODE': 'EMPTY' }
        )
        .then((res) => {
          return res.data;
        });
    },
  };
};

export default useAuthApi;
