import useRequest from '@/hook/useRequest';
import Result from './model/result';

const useFileApi = () => {
  const request = useRequest();
  const upload = (file: any): Promise<Result<any>> => {
    return request
      .post(
        '/api/sys/attachment/upload',
        { file },
        { 'Content-Type': 'multipart/form-data' }
      )
      .then((res) => {
        return res.data;
      });
  };

  return { upload };
};

export default useFileApi;
