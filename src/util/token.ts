import { Authentication } from './constant';
import Cookies from 'js-cookie';

export default {
  getToken: (): string | undefined => {
    return Cookies.get(Authentication);
  },

  /**
   * set token
   *
   * @param tokenValue
   */
  setToken: (tokenValue: string) => {
    Cookies.set(Authentication, tokenValue);
  },

  /**
   * clear token
   */
  clearToken: () => {
    Cookies.remove(Authentication);
  },
};
