import useRequest from '@/hook/useRequest';
import { Model } from './model/interface';
import Result from './model/result';

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
  };
};

export default useDocApi;
