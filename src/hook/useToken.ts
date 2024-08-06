import token from '@/util/token';

const useToken = () => {
  /**
   * set token
   *
   * @param tokenValue
   */
  const setToken = (tokenValue: string) => {
    return token.setToken(tokenValue);
  };

  const getToken = (): string | undefined => {
    return token.getToken();
  };
  return { setToken, getToken };
};

export default useToken;
