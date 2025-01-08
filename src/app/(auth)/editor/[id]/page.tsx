'use client';

import { useStore } from '@/hook/useStore';
import {
  DocumentEditorConfig,
  IEditor,
  IEditorApi,
  OfficeEditor,
} from '@clearx/office-editor-react';
import { useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useEditorApi } from '@/services/editor';
import useDocApi from '@/services/doc';
import { App } from 'antd';

export interface EditorProps {
  params: {
    id: string;
  };
}

const Editor = observer(({ params }: EditorProps) => {
  const { message } = App.useApp();
  const editorRef = useRef<IEditor>();
  const searchParams = useSearchParams();

  const editorApi = useEditorApi();
  const docApi = useDocApi();

  const [config, setConfig] = useState<DocumentEditorConfig>();

  const { eventStore } = useStore();

  const preview = Boolean(searchParams.get('preview')) || false;

  useEffect(() => {
    editorApi.editor(params.id).then((res) => {
      const { code, data } = res;
      if (code === 200) {
        setConfig(data);
      } else {
        message.error(res.message);
      }
    });
  }, [params.id]);

  const internalApi: IEditorApi = useMemo(() => {
    const docId = params.id;
    return {
      loadHistoryList() {
        return docApi.getHistory(docId).then((res) => {
          const { code, data, message } = res;
          if (code === 200) {
            return Promise.resolve(data);
          } else {
            return Promise.reject(new Error(message));
          }
        });
      },
      loadHistoryData(version) {
        docApi.getHistoryData(docId, version).then((res) => {
          const { code, data, message } = res;
          if (code === 200) {
            return Promise.resolve(data);
          } else {
            return Promise.reject(new Error(message));
          }
        });
      },
      triggerForceSave() {
        return docApi.forceSave(docId).then((res) => {
          const { data, code, message } = res;
          if (code === 200 && data) {
            return Promise.resolve(true);
          } else {
            return Promise.reject(message);
          }
        });
      },
      triggerKickout(userIds) {
        return docApi.kickout(docId, userIds).then((res) => {
          const { code, data, message } = res;
          if (code === 200 && data) {
            return Promise.resolve(true);
          } else {
            return Promise.reject(new Error(message));
          }
        });
      },
      triggerKickoutOthers() {
        return docApi.kickoutOthers(docId).then((res) => {
          const { code, data, message } = res;
          if (code === 200 && data) {
            return Promise.resolve(true);
          } else {
            return Promise.reject(new Error(message));
          }
        });
      },
      triggerKickoutAll() {
        return docApi.kickoutAll(docId).then((res) => {
          const { code, data, message } = res;
          if (code === 200 && data) {
            return Promise.resolve(true);
          } else {
            return Promise.reject(new Error(message));
          }
        });
      },
      triggerOnlineDocUser() {
        return docApi.getOnlineDocUser(docId).then((res) => {
          const { code, data, message } = res;
          if (code === 200) {
            return Promise.resolve(data);
          } else {
            return Promise.reject(new Error(message));
          }
        });
      },
      triggerRestore(version) {
        return docApi.restore(docId, version).then((res) => {
          const { code, message } = res;
          if (code === 200) {
            return Promise.resolve(true);
          } else {
            return Promise.reject(message);
          }
        });
      },
      triggerRename(newfilename) {
        return docApi.rename(docId, { newfilename }).then((res) => {
          const { code, message } = res;
          if (code === 200) {
            return Promise.resolve(true);
          } else {
            return Promise.reject(message);
          }
        });
      },
    };
  }, [params.id]);

  return (
    config && (
      <div className='h-[100vh] w-[100vw]'>
        <OfficeEditor
          id={params.id}
          config={config}
          api={internalApi}
          printLog
          action={preview === true ? 'view' : 'edit'}
          onDocumentReady={(editorProps) => (editorRef.current = editorProps)}
          onDocumentBeforeDestroy={() => {
            eventStore.onRefresh();
          }}
        />
      </div>
    )
  );
});

export default Editor;
