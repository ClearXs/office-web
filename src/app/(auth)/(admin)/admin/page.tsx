'use client';

import useDocApi from '@/services/admin/doc';
import { Doc } from '@/services/doc';
import { EllipsisOutlined, PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ProColumns,
  ProTable,
  TableDropdown,
} from '@ant-design/pro-components';
import { App, Button, Dropdown } from 'antd';
import { useMemo, useRef, useState } from 'react';

const Admin = () => {
  const actionRef = useRef<ActionType>();
  const { message } = App.useApp();
  const [loading, setLoading] = useState<boolean>(false);

  const docApi = useDocApi();

  const columns: ProColumns<Doc>[] = useMemo(() => {
    return [
      {
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48,
      },
      {
        title: '文档名称',
        dataIndex: 'title',
        copyable: true,
        ellipsis: true,
        formItemProps: {
          rules: [
            {
              required: true,
              message: '此项为必填项',
            },
          ],
        },
      },
      {
        disable: true,
        title: '文档类型',
        dataIndex: 'type',
        filters: true,
      },
      {
        disable: true,
        title: '文档状态',
        dataIndex: 'type',
        filters: true,
      },
      {
        disable: true,
        title: '创建人',
        dataIndex: 'creator',
        search: false,
        renderFormItem: (_, { defaultRender }) => {
          return defaultRender(_);
        },
      },
      {
        disable: true,
        title: '大小',
        dataIndex: 'type',
        filters: true,
      },
      {
        title: '修改时间',
        dataIndex: 'updateTime',
        valueType: 'dateRange',
        search: {
          transform: (value) => {
            return {
              startTime: value[0],
              endTime: value[1],
            };
          },
        },
      },
      {
        title: '操作',
        valueType: 'option',
        key: 'option',
        render: (text, record, _, action) => [
          <a
            key='editable'
            onClick={() => {
              action?.startEditable?.(record.id);
            }}
          >
            查看
          </a>,
          <a
            key='editable'
            onClick={() => {
              action?.startEditable?.(record.id);
            }}
          >
            转移
          </a>,
          <a
            href={record.url}
            target='_blank'
            rel='noopener noreferrer'
            key='view'
          >
            恢复
          </a>,
          <TableDropdown
            key='actionGroup'
            onSelect={() => action?.reload()}
            menus={[
              { key: 'copy', name: '复制链接' },
              { key: 'delete', name: '销毁' },
            ]}
          />,
        ],
      },
    ];
  }, []);

  return (
    <ProTable<Doc>
      columns={columns}
      actionRef={actionRef}
      cardBordered
      loading={loading}
      request={async (params, sort, filter) => {
        setLoading(true);
        return docApi
          .page(
            { current: params.current, size: params.pageSize },
            { ...params }
          )
          .then((res) => {
            const { code, data } = res;
            return {
              data: data.records || [],
              success: code === 200,
              total: data.total,
            };
          })
          .finally(() => {
            setLoading(false);
          });
      }}
      editable={{
        type: 'multiple',
      }}
      columnsState={{
        persistenceKey: 'pro-table-singe-demos',
        persistenceType: 'localStorage',
        defaultValue: {
          option: { fixed: 'right', disable: true },
        },
        onChange(value) {
          console.log('value: ', value);
        },
      }}
      rowKey='id'
      search={{
        labelWidth: 'auto',
      }}
      options={{
        setting: {
          listsHeight: 800,
        },
      }}
      form={{
        // 由于配置了 transform，提交的参与与定义的不同这里需要转化一下
        syncToUrl: (values, type) => {
          if (type === 'get') {
            return {
              ...values,
              created_at: [values.startTime, values.endTime],
            };
          }
          return values;
        },
      }}
      pagination={{
        pageSize: 10,
        onChange: (page) => console.log(page),
      }}
      dateFormatter='string'
      toolBarRender={() => [
        <Button
          key='button'
          icon={<PlusOutlined />}
          onClick={() => {
            actionRef.current?.reload();
          }}
          type='primary'
        >
          新建
        </Button>,
        <Dropdown
          key='menu'
          menu={{
            items: [
              {
                label: '1st item',
                key: '1',
              },
              {
                label: '2nd item',
                key: '1',
              },
              {
                label: '3rd item',
                key: '1',
              },
            ],
          }}
        >
          <Button>
            <EllipsisOutlined />
          </Button>
        </Dropdown>,
      ]}
    />
  );
};

export default Admin;
