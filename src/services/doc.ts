import useRequest from '@/hook/useRequest';
import { Model } from './model/interface';
import Result from './model/result';
import { OnlineDocUser } from '@office-editor/react';

export type Doc = Model & {
  /**
   * 文档名称
   */
  title: string;

  /**
   * 文件类型
   */
  type: DocType;

  /**
   * 文档标签
   */
  label: string;

  /**
   * 文档唯一标识
   */
  key: string;

  /**
   * 文件
   */
  file: string;

  /**
   * 拥有者
   */
  creator: string;

  /**
   * 版本号
   */
  version: number;
};

export type DocType = 'doc' | 'docx' | 'xls' | 'xlsx' | 'ppt' | 'pptx';

export type DocApi = {
  /**
   * 创建空白模板
   */
  create: ({
    title,
    type,
  }: {
    title: string;
    type: DocType;
  }) => Promise<Result<Doc>>;

  /**
   * share document
   *
   * @param docId
   * @returns
   */
  share: (docId: number) => Promise<Result<string>>;

  /**
   * get document by id
   *
   * @param docId
   * @returns
   */
  getDocumentById: (docId: number) => Promise<Result<Doc>>;

  /**
   * remove document
   *
   * @param docIdList
   * @returns
   */
  remove: (docIdList: string[]) => Promise<Result<boolean>>;

  /**
   * force specifies document
   *
   * @param docId
   * @returns
   */
  forceSave: (docId: string) => Promise<Result<boolean>>;

  /**
   * rename document
   *
   * @param docId
   * @param rename
   * @returns
   */
  rename: (
    docId: string,
    rename: { newfilename: string; ext: string }
  ) => Promise<Result<boolean>>;

  restore: (docId: string, version: number) => Promise<Result<boolean>>;
  getHistory: (docId: string) => Promise<Result<Record<string, any>>>;
  getHistoryData: (
    docId: string,
    version: number
  ) => Promise<Result<Record<string, any>>>;
  kickout: (docId: string, userIds: string[]) => Promise<Result<boolean>>;
  kickoutOthers: (docId: string) => Promise<Result<boolean>>;
  kickoutAll: (docId: string) => Promise<Result<boolean>>;
  getOnlineDocUser: (docId: string) => Promise<Result<OnlineDocUser[]>>;
};

const useDocApi = (): DocApi => {
  const request = useRequest();
  return {
    create({ title, type }) {
      return request
        .post('/api/office/v1/doc/create', { title, type })
        .then((res) => res.data);
    },
    share(docId) {
      return request
        .get(`/api/office/v1/doc/share/${docId}`)
        .then((res) => res.data);
    },
    getDocumentById(docId) {
      return request
        .get(`/api/office/v1/doc/getDocumentById/${docId}`)
        .then((res) => res.data);
    },
    remove(docIdList) {
      return request
        .delete(`/api/office/v1/doc/remove`, docIdList)
        .then((res) => res.data);
    },
    forceSave(docId) {
      return request
        .get(`/api/office/v1/doc/forceSave/${docId}`)
        .then((res) => res.data);
    },
    rename(docId, rename) {
      return request
        .put(`/api/office/v1/doc/rename/${docId}`, rename)
        .then((res) => res.data);
    },
    restore(docId, version): Promise<Result<boolean>> {
      return request
        .put(`/api/office/doc/restore/${docId}/${version}`)
        .then((res) => {
          return res.data;
        });
    },
    getHistory(docId) {
      return request.get(`/api/office/doc/history/${docId}`).then((res) => {
        return res.data;
      });
    },
    getHistoryData(docId, version) {
      return request
        .get(`/api/office/doc/historyData/${docId}/${version}`)
        .then((res) => {
          return res.data;
        });
    },
    forceSave(docId) {
      return request.get(`/api/office/doc/forceSave/${docId}`).then((res) => {
        return res.data;
      });
    },
    kickout(docId, userIds) {
      return request
        .post(`/api/office/doc/kickout/${docId}`, userIds)
        .then((res) => {
          return res.data;
        });
    },
    kickoutOthers(docId) {
      return request
        .post(`/api/office/doc/kickoutOthers/${docId}`)
        .then((res) => {
          return res.data;
        });
    },
    kickoutAll(docId) {
      return request.post(`/api/office/doc/kickoutAll/${docId}`).then((res) => {
        return res.data;
      });
    },
    getOnlineDocUser(docId) {
      return request
        .get(`/api/office/doc/getOnlineDocUser/${docId}`)
        .then((res) => {
          return res.data;
        });
    },
  };
};

export default useDocApi;
