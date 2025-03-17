'use client';

import useWebhookApi, { Webhook } from '@/services/admin/webhook';
import { DeleteFilled, EditFilled, PlusOutlined } from '@ant-design/icons';
import {
  ActionType,
  ModalForm,
  ProColumns,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
  ProTable,
} from '@ant-design/pro-components';
import { App, Button } from 'antd';
import { useMemo, useRef, useState } from 'react';

type FormOptions = {
  title: string;
  visible: boolean;
};

const WebhookPage = () => {
  const actionRef = useRef<ActionType>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [formLoading, setFormLoading] = useState<boolean>(false);
  const webhookApi = useWebhookApi();
  const formRef = useRef<ProFormInstance<Webhook>>(null);

  const [form, setForm] = useState<Partial<Webhook>>();

  const { message, modal } = App.useApp();

  const [formOptions, setFormOptions] = useState<FormOptions>({
    title: '新增',
    visible: false,
  });

  const columns = useMemo(() => {
    return [
      {
        dataIndex: 'index',
        valueType: 'indexBorder',
        width: 48,
      },
      {
        title: 'url',
        key: 'url',
        dataIndex: 'url',
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
        title: '类型',
        key: 'type',
        dataIndex: 'type',
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
        title: '操作',
        valueType: 'option',
        key: 'option',
        render: (text, record) => [
          <Button
            icon={<DeleteFilled />}
            color='danger'
            type='text'
            onClick={() => {
              modal.confirm({
                title: '删除',
                content: '是否确定删除',
                onOk: () => {
                  webhookApi.deleteBatchIds([record.id]).then((res) => {
                    if (res.code === 200) {
                      message.success('删除成功');
                      actionRef.current?.reload?.();
                    }
                  });
                },
              });
            }}
          >
            删除
          </Button>,
          <Button
            icon={<EditFilled />}
            color='primary'
            type='text'
            onClick={() => {
              setForm(record);
              setFormOptions({ title: '编辑', visible: true });
            }}
          >
            编辑
          </Button>,
        ],
      },
    ] as ProColumns<Webhook>[];
  }, []);

  return (
    <>
      <ProTable<Webhook>
        columns={columns}
        actionRef={actionRef}
        cardBordered
        loading={loading}
        request={async ({ current, pageSize, ...params }, sort, filter) => {
          setLoading(true);
          return webhookApi
            .page(
              {
                current: current as number,
                size: pageSize as number,
              },
              { entity: params }
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
              setFormOptions({ title: '新增', visible: true });
              setForm({});
            }}
            type='primary'
          >
            新建
          </Button>,
        ]}
      />

      <ModalForm
        title={formOptions.title}
        open={formOptions.visible}
        formRef={formRef}
        initialValues={form}
        width={600}
        modalProps={{
          onCancel: () => {
            setFormOptions({ visible: false, title: '' });
          },
          destroyOnClose: true,
        }}
        submitter={{
          render: (props) => {
            return [
              <Button
                key='submit'
                type='primary'
                loading={formLoading}
                onClick={() => {
                  formRef.current?.validateFields().then((values) => {
                    setFormLoading(true);
                    const value = { ...form, ...values };
                    webhookApi
                      .saveOrUpdate(value)
                      .then((res) => {
                        if (res.code === 200) {
                          setFormOptions({ title: '', visible: false });
                          actionRef.current?.reloadAndRest?.();
                          setForm({});
                        } else {
                          message.error(res.message);
                        }
                      })
                      .finally(() => setFormLoading(false));
                  });
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
      >
        <ProFormText
          name='url'
          label='url'
          placeholder='请输入url'
          required={true}
        ></ProFormText>
        <ProFormSelect
          name='type'
          label='类型'
          options={[{ value: 'edit', label: 'edit' }]}
          required={true}
          placeholder='请选择类型'
        ></ProFormSelect>
      </ModalForm>
    </>
  );
};

export default WebhookPage;
