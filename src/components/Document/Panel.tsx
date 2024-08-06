'use client';

import DocumentHeader, { IDocumentHeaderProps } from './Header';
import DocumentList, { IDocumentListProps } from './List';

export type IDocumentPanelProps = IDocumentHeaderProps & IDocumentListProps;

const DocumentPanel: React.FC<IDocumentPanelProps> = ({ title, api }) => {
  return (
    <div className='w-[100%] h-[100%] flex flex-col p-1'>
      <div className='h-12'>
        <DocumentHeader title={title} />
      </div>
      <div className='h-[100%]'>
        <DocumentList api={api} />
      </div>
    </div>
  );
};

export default DocumentPanel;
