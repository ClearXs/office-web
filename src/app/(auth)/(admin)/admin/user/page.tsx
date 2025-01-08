'use client';

import useUserApi, { User } from '@/services/admin/user';
import {
  DeleteOutlined,
  EditOutlined,
  FileTextOutlined,
  PlusOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  ProColumns,
  ProForm,
  ProFormDigit,
  ProFormInstance,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import {
  App,
  Button,
  Dropdown,
  Flex,
  MenuProps,
  Modal,
  Table,
  Tag,
} from 'antd';
import { useMemo, useRef, useState } from 'react';

const Admin = () => {
  const actionRef = useRef<ActionType>();
  const formRef = useRef<ProFormInstance>();
  const { message } = App.useApp();
  const [loading, setLoading] = useState<boolean>(false);
  const [form, setForm] = useState<boolean>(false);

  const userApi = useUserApi();

  const columns: ProColumns<User>[] = useMemo(() => {
    return [
      {
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48,
      },
      {
        title: '用户名',
        dataIndex: 'username',
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
        title: '昵称',
        dataIndex: 'nickname',
        ellipsis: true,
        search: false,
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
        title: '电话号码',
        dataIndex: 'phone',
        ellipsis: true,
        search: false,
      },
      {
        title: '用户状态',
        dataIndex: 'status',
        ellipsis: true,
        search: false,
        render(text, record, _, action) {
          return (
            (record.status === 'ENABLE' && <Tag color='green'>启用</Tag>) ||
            (record.status === 'DISABLE' && <Tag color='blue'>禁用</Tag>)
          );
        },
      },
      {
        title: '来源',
        dataIndex: 'source',
        ellipsis: true,
        search: false,
        render(text, record, _, action) {
          return (
            (record.source === 'SELF-BUILT' && <Tag color='green'>自建</Tag>) ||
            (record.source === 'THIRD' && <Tag color='blue'>第三方</Tag>)
          );
        },
      },
      {
        title: '操作',
        valueType: 'option',
        key: 'option',
        render(text, record, index, action) {
          return (
            <Dropdown.Button menu={operatorMenu} key='edit'>
              编辑
            </Dropdown.Button>
          );
        },
      },
    ] as ProColumns<User>[];
  }, []);

  const operatorMenu: MenuProps = useMemo(() => {
    return {
      onClick: (e) => {
        console.log(e);
      },
      items: [
        { key: 'detail', label: '详情', icon: <FileTextOutlined /> },
        {
          key: 'delete',
          label: '删除',
          danger: true,
          icon: <DeleteOutlined />,
        },
      ],
    };
  }, []);

  return (
    <>
      <ProTable<User>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        loading={loading}
        request={async (params, sort, filter) => {
          setLoading(true);
          return userApi
            .page(
              { current: params.current!, size: params.pageSize! },
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
        rowSelection={{
          // 自定义选择项参考: https://ant.design/components/table-cn/#components-table-demo-row-selection-custom
          // 注释该行则默认不显示下拉选项
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
        }}
        toolBarRender={() => [
          <Button
            key='button'
            icon={<PlusOutlined />}
            type='primary'
            onClick={() => {
              setForm(true);
            }}
          >
            新建
          </Button>,
          <Button
            key='button'
            icon={<SyncOutlined />}
            onClick={() => {
              setForm(true);
            }}
          >
            重制密码
          </Button>,
        ]}
      />

      <ModalForm
        title={'新建用户'}
        open={form}
        width={600}
        submitter={{
          render: (props) => {
            return [
              <Button
                key='submit'
                type='primary'
                onClick={() => {
                  formRef.current?.validateFields().then((values) => {
                    console.log(values);
                  });

                  formRef.current?.submit();
                }}
              >
                提交
              </Button>,
              <Button
                key='reset'
                onClick={() => {
                  formRef.current?.resetFields();
                }}
              >
                重置
              </Button>,
            ];
          },
        }}
        onFinish={async (values) => {
          console.log(values);
        }}
      >
        <ProFormText
          name='username'
          label='用户名'
          tooltip='最长为 24 位'
          placeholder='请输入用户名'
          required={true}
        ></ProFormText>
        <ProFormText.Password
          name='password'
          label='密码'
          placeholder='请输入密码'
          required={true}
        ></ProFormText.Password>
        <ProFormDigit
          width='md'
          name='phone'
          label='手机号'
          placeholder='请输入手机号'
          required={true}
        ></ProFormDigit>
        <ProFormText
          name='email'
          label='邮箱'
          placeholder='请输入邮箱'
          required={true}
        ></ProFormText>
        <ProFormText
          name='nickname'
          label='昵称'
          placeholder='请输入昵称'
        ></ProFormText>
      </ModalForm>
    </>
  );
};

export default Admin;
