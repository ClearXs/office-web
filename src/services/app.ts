import useRequest from '@/hook/useRequest';
import Result from './model/result';

export type Advice = {
  userId?: string;
  username?: string;
  content: string;
};

export interface AppApi {
  reportAdvice: (advice: Advice) => Promise<Result<boolean>>;
  getAdviceList: () => Promise<Result<Advice[]>>;
}

const useAppApi = (): AppApi => {
  const request = useRequest();

  return {
    reportAdvice(advice) {},
    getAdviceList() {},
  };
};

export default useAppApi;
