import token from '@/util/token';
import { Authentication, Tenant } from '@/util/constant';
import { message } from 'antd';
import axios, { AxiosError, AxiosInstance, AxiosResponse, Method } from 'axios';
import { useEffect } from 'react';

export interface InternalRequest {
  request: (
    path: string,
    method: Method,
    params?: Record<string, any>,
    headers?: Record<string, any>
  ) => Promise<AxiosResponse<any, any>>;
  get: (
    path: string,
    params?: Record<string, any>
  ) => Promise<AxiosResponse<any, any>>;
  post: (
    path: string,
    params?: Record<string, any>,
    headers?: Record<string, string>
  ) => Promise<AxiosResponse<any, any>>;
  put: (
    path: string,
    params?: Record<string, any>
  ) => Promise<AxiosResponse<any, any>>;
  delete: (
    path: string,
    params?: Record<string, any>
  ) => Promise<AxiosResponse<any, any>>;
}

// 创建内部remote
const internalRemote = axios.create();
internalRemote.defaults.baseURL = '/';
internalRemote.defaults.timeout = 100000;
internalRemote.defaults.headers.post['Content-Type'] = 'application/json';

// 请求拦截器
internalRemote.interceptors.request.use((config) => {
  const tokenValue = token.getToken();
  if (tokenValue) {
    config.headers.set(Authentication, tokenValue);
  }
  config.headers.set(Tenant, 0);
  return config;
});

// 响应拦截器
internalRemote.interceptors.response.use(
  (res) => {
    return handleSuccess(res);
  },
  (err) => {
    if (err instanceof AxiosError) {
      return handleResError(err);
    } else {
      return Promise.reject(err);
    }
  }
);

function handleSuccess(res: AxiosResponse): Promise<AxiosResponse> {
  const status = res.status;
  if (status === 200) {
    // 消息提示
    const data = res.data;
    if (data?.code !== 200) {
      message.error(data?.message);
      return Promise.reject(res);
    } else {
      return Promise.resolve(res);
    }
  } else {
    throw new Error('unkonwn error');
  }
}

/**
 * response错误处理，包含消息提示
 * @param err
 */
function handleResError(err: AxiosError, errorValue?: any) {
  const errCode = err.response?.status || err.status;

  const errMessage = err.response?.data as string;
  errMessage && message.error(errMessage);

  // 认证失败
  if (errCode === 401) {
    token.clearToken();
    return Promise.reject(err);
  } else if (errCode === 403 || errCode === 500) {
    return Promise.resolve(errorValue || err.response);
  }
  return Promise.resolve(errorValue || err.response);
}

class InternalRequestImpl implements InternalRequest {
  constructor(private axiosRequest: AxiosInstance) {}

  request(
    path: string,
    method: Method,
    params?: Record<string, any>,
    headers?: Record<string, any>
  ) {
    if (method === 'GET') {
      return this.axiosRequest.request({ url: path, method, params, headers });
    } else {
      return this.axiosRequest.request({
        url: path,
        method,
        data: params,
        headers,
      });
    }
  }
  get(path: string, params?: Record<string, any>) {
    return this.axiosRequest.request({
      url: path,
      method: 'GET',
      params,
    });
  }
  post(
    path: string,
    params?: Record<string, any>,
    headers?: Record<string, string>
  ) {
    return this.axiosRequest.request({
      url: path,
      method: 'POST',
      data: params,
      headers,
    });
  }
  put(path: string, params?: Record<string, any>) {
    return this.axiosRequest.request({
      url: path,
      method: 'PUT',
      data: params,
    });
  }
  delete(path: string, params?: Record<string, any>) {
    return this.axiosRequest.request({
      url: path,
      method: 'DELETE',
      data: params,
    });
  }
}

const useRequest = () => {
  useEffect(() => {
    // 清除存在的响应拦截器
    internalRemote.interceptors.response.clear();
    internalRemote.interceptors.response.use(
      (res) => {
        return handleSuccess(res);
      },
      (err) => {
        if (err instanceof AxiosError) {
          return handleResError(err, undefined);
        } else {
          return Promise.reject(err);
        }
      }
    );
  }, []);

  return new InternalRequestImpl(internalRemote);
};

export const createRequest = () => {
  const axiosRequest = axios.create();
  return new InternalRequestImpl(axiosRequest);
};

export default useRequest;
