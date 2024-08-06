'use client';

import { useStore } from '@/hook/useStore';
import { IDocEditorProps, OfficeEditor } from '@office-editor/react';
import { useSearchParams } from 'next/navigation';
import { Suspense, useRef } from 'react';
import { observer } from 'mobx-react-lite';

export interface EditorProps {
  params: {
    id: string;
  };
}

const Editor = observer(({ params }: EditorProps) => {
  const editorRef = useRef<IDocEditorProps>();
  const searchParams = useSearchParams();

  const { eventStore } = useStore();

  const preview = Boolean(searchParams.get('preview')) || false;

  return (
    <div className='h-[100vh] w-[100vw]'>
      <Suspense>
        <OfficeEditor
          docId={params.id}
          printLog={true}
          type='desktop'
          action={preview === true ? 'view' : 'edit'}
          onDocumentReady={(editorProps) => (editorRef.current = editorProps)}
          onDocumentBeforeDestroy={() => {
            eventStore.onRefresh();
          }}
        />
      </Suspense>
    </div>
  );
});

export default Editor;
