'use client';

import { useStore } from '@/hook/useStore';
import useDocApi from '@/services/doc';
import {
  DeleteOutlined,
  DownloadOutlined,
  RedoOutlined,
  TagOutlined,
} from '@ant-design/icons';
import { App, Button, Space, Tooltip, Typography } from 'antd';
import ButtonGroup from 'antd/es/button/button-group';
import { observer } from 'mobx-react-lite';

export type IDocumentHeaderProps = {
  // header title
  title: string;
};

const DocumentHeader = observer(({ title }: IDocumentHeaderProps) => {
  const { message, modal } = App.useApp();
  const { eventStore, documentStore } = useStore();

  const docApi = useDocApi();

  return (
    <div className='pl-4 pr-4 flex'>
      <Typography.Title level={4}>
        {title}
        <Tooltip title='刷新列表'>
          <Button
            icon={<RedoOutlined />}
            type='text'
            onClick={() => eventStore.onRefresh()}
          />
        </Tooltip>
      </Typography.Title>
      {documentStore.selectDocumentRows.length > 0 && (
        <Space className='ml-auto'>
          <span>
            已选
            <Typography.Text mark>
              {documentStore.selectDocumentRows.length}
            </Typography.Text>
            项
          </span>
          <Button
            type='link'
            onClick={() => {
              documentStore.setSelectDocumentRows([]);
            }}
          >
            取消选择
          </Button>
          <ButtonGroup>
            <Button icon={<DeleteOutlined />}>
              <Typography.Text
                type='danger'
                onClick={() => {
                  const docIdList = documentStore.selectDocumentRows.map(
                    (doc) => doc.id
                  );
                  modal.confirm({
                    content: '是否要移除文档?',
                    okText: '确定',
                    cancelText: '取消',
                    onOk() {
                      docApi.remove(docIdList).then((res) => {
                        const { code } = res;
                        if (code === 200) {
                          message.success('删除成功!');
                          documentStore.setSelectDocumentRows([]);
                          eventStore.onRefresh();
                        } else {
                          message.error(res.message);
                        }
                      });
                    },
                  });
                }}
              >
                移除记录
              </Typography.Text>
            </Button>
            <Button
              icon={<DownloadOutlined />}
              onClick={() => {
                const docIdsString = documentStore.selectDocumentRows
                  .map((doc) => doc.id)
                  .join(',');
                window.open(
                  `/api/v1/document/downloads?docIds=${docIdsString}`
                );
              }}
            >
              <Typography.Text>下载</Typography.Text>
            </Button>
            <Button icon={<TagOutlined />}>
              <Typography.Text>添加标签</Typography.Text>
            </Button>
          </ButtonGroup>
        </Space>
      )}
    </div>
  );
});

export default DocumentHeader;
