import { DocumentEditorConfig } from '@office-editor/react';
import useRequest from '@/hook/useRequest';
import Result from './model/result';

export const useEditorApi = () => {
  const request = useRequest();

  const editor = (
    docId: string,
    action?: string,
    type?: string,
    actionLink?: string,
    directUrl?: string
  ): Promise<Result<DocumentEditorConfig>> => {
    return request
      .get('/api/office/editor', {
        docId,
        action,
        type,
        actionLink,
        directUrl,
      })
      .then((res) => {
        return res.data;
      });
  };

  return { editor };
};
