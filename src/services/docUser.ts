import useRequest from '@/hook/useRequest';
import { Doc } from './doc';
import IPage from './model/page';
import Result from './model/result';

export type DocUser = Doc & {
  /**
   * 是否是分享的
   */
  shared: boolean;

  /**
   * 是否是喜爱的
   */
  favorite: boolean;

  /**
   * 是否是常用
   */
  favor: boolean;

  /**
   * 协作者
   */
  cooperator: number;

  /**
   * 权限组
   */
  permissionGroupId: number;

  /**
   * 创建者名称
   */
  createName: string;

  /**
   * 协作者名称
   */
  collaboratorName: string;
};

export type DocUserParams = IPage<DocUser> & {
  /**
   * 文档名称
   */
  title: string;

  /**
   * 文档类型
   */
  type: string[];

  /**
   * 文档创建者
   */
  creator: number;

  /**
   * 文档协作者
   */
  collaborator: number;

  /**
   * 是否分享
   */
  shared: boolean;

  /**
   * 是否喜欢
   */
  favorite: boolean;

  /**
   * 是否常用
   */
  favor: boolean;
};

export type OnlineDocUser = {
  /**
   * 用户id
   */
  userId: string;

  /**
   * 用户名称
   */
  userName: string;

  /**
   * 文档key
   */
  docKey: string;
};

export type DocUserApi = {
  favorOfDocument: (docId: string) => Promise<Result<boolean>>;
  cancelFavorOfDocument: (docId: string) => Promise<Result<boolean>>;
  favoriteOfDocument: (docId: string) => Promise<Result<boolean>>;
  cancelFavoriteDocument: (docId: string) => Promise<Result<boolean>>;
  searchMineDocument: (pattern: string) => Promise<Result<DocUser[]>>;
  getMineDocument: (
    params: Partial<DocUserParams>
  ) => Promise<Result<IPage<DocUser>>>;
  getMineRecentlyDocument: (
    params: Partial<DocUserParams>
  ) => Promise<Result<IPage<DocUser>>>;
  getShareToMeDocument: (
    params: Partial<DocUserParams>
  ) => Promise<Result<IPage<DocUser>>>;
  getMineFavoriteDocument: (
    params: Partial<DocUserParams>
  ) => Promise<Result<IPage<DocUser>>>;
  getMineCreateDocument: (
    params: Partial<DocUserParams>
  ) => Promise<Result<IPage<DocUser>>>;
  getMineFavorDocument: (
    params: Partial<DocUserParams>
  ) => Promise<Result<IPage<DocUser>>>;

  /**
   * kickout users
   *
   * @param docId
   * @param userIds
   * @returns
   */
  kickout: (docId: string, userIds: string[]) => Promise<Result<boolean>>;

  /**
   * kickout others
   *
   * @param docId
   * @returns
   */
  kickoutOthers: (docId: string) => Promise<Result<boolean>>;

  /**
   * kickout all
   *
   * @param docId
   * @returns
   */
  kickoutAll: (docId: string) => Promise<Result<boolean>>;

  /**
   * get online users
   *
   * @param docId
   * @returns
   */
  getOnlineDocUser: (docId: string) => Promise<Result<OnlineDocUser[]>>;
};

const useDocUserApi = (): DocUserApi => {
  const request = useRequest();

  return {
    favorOfDocument(docId) {
      return request
        .put(`/api/office/v1/doc/user/favor/${docId}`)
        .then((res) => res.data);
    },
    cancelFavorOfDocument(docId) {
      return request
        .put(`/api/office/v1/doc/user/favor/cancel/${docId}`)
        .then((res) => res.data);
    },
    favoriteOfDocument(docId) {
      return request
        .put(`/api/office/v1/doc/user/favorite/${docId}`)
        .then((res) => res.data);
    },
    cancelFavoriteDocument(docId) {
      return request
        .put(`/api/office/v1/doc/user/favorite/cancel/${docId}`)
        .then((res) => res.data);
    },
    getMineDocument(params) {
      return request
        .post('/api/office/v1/doc/user/getMine', {
          ...params,
        })
        .then((res) => {
          return res.data;
        });
    },
    getMineRecentlyDocument(params) {
      return request
        .post('/api/office/v1/doc/user/getMineRecently', {
          ...params,
        })
        .then((res) => {
          return res.data;
        });
    },
    getShareToMeDocument(params) {
      return request
        .post('/api/office/v1/doc/user/getShareToMe', {
          ...params,
        })
        .then((res) => {
          return res.data;
        });
    },
    searchMineDocument(pattern) {
      return request
        .get(`/api/office/v1/doc/user/searchMine?pattern=${pattern}`)
        .then((res) => res.data);
    },
    getMineFavoriteDocument(params) {
      return request
        .post('/api/office/v1/doc/user/getMineFavorite', {
          ...params,
        })
        .then((res) => res.data);
    },
    getMineCreateDocument(params) {
      return request
        .post('/api/office/v1/doc/user/getMineCreate', {
          ...params,
        })
        .then((res) => res.data);
    },
    getMineFavorDocument(params) {
      return request
        .post('/api/office/v1/doc/user/getMineFavor', {
          ...params,
        })
        .then((res) => res.data);
    },
    kickout(docId, userIds) {
      return request
        .post(`/api/office/v1/doc/user/kickout/${docId}`, userIds)
        .then((res) => res.data);
    },
    kickoutOthers(docId) {
      return request
        .post(`/api/office/v1/doc/user/kickoutOthers/${docId}`)
        .then((res) => res.data);
    },
    kickoutAll(docId) {
      return request
        .post(`/api/office/v1/doc/user/kickoutAll/${docId}`)
        .then((res) => res.data);
    },
    getOnlineDocUser(docId) {
      return request
        .get(`/api/office/v1/doc/user/getOnlineDocUser/${docId}`)
        .then((res) => res.data);
    },
  };
};

export default useDocUserApi;
