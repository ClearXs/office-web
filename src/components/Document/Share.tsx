'use client';

import { observer } from 'mobx-react-lite';
import './share.css';
import { Button, Modal } from 'antd';
import { DownloadOutlined, PaperClipOutlined } from '@ant-design/icons';

export type IShareProps = {
  docId: string;
};

const Share = observer(({ docId }: IShareProps) => {
  return (
    <div className='flex flex-col gap-2'>
      <div className='border-1 rounded-lg border-gray-300 h-64 shadow-sm shadow-gray-300'></div>
      <div className='border-1 rounded-lg border-gray-300 h-36 shadow-sm shadow-gray-300 mt-1'></div>
      <div className='mt-1'>
        <Button
          block
          type='dashed'
          icon={<DownloadOutlined />}
          onClick={() => {
            Modal.confirm({ content: <div>123</div> });
          }}
        >
          下载
        </Button>
        <Button block type='dashed' icon={<PaperClipOutlined />}>
          复制链接
        </Button>
      </div>
    </div>
  );
});

export default Share;
