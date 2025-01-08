'use client';

import { App, Button, Menu, Popover, Result, Typography, Upload } from 'antd';
import {
  DeleteOutlined,
  FieldTimeOutlined,
  FileOutlined,
  FolderOutlined,
  PlusOutlined,
  PushpinOutlined,
  ShareAltOutlined,
  StarOutlined,
  TagOutlined,
  UploadOutlined,
} from '@ant-design/icons';
import MenuDivider from 'antd/es/menu/MenuDivider';
import MenuItem from 'antd/es/menu/MenuItem';
import { observer } from 'mobx-react-lite';
import { ModalForm, ProFormText } from '@ant-design/pro-components';
import useDocApi, { DocType } from '@/services/doc';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import './main.css';
import { useStore } from '@/hook/useStore';
import token from '@/util/token';
import useError from '@/hook/useError';
import IconDocx from '@/components/Icons/IconDocx';
import IconXlsx from '@/components/Icons/IconXlsx';
import IconPpt from '@/components/Icons/IconPpt';

const Main = observer(
  ({ children, ...props }: { children: React.ReactNode }) => {
    const router = useRouter();

    const { message, modal } = App.useApp();

    const { unImplementation } = useError();

    const docApi = useDocApi();

    const [createDocVisible, setCreateDocVisible] = useState<boolean>(false);
    const [createLoading, setCreateLoading] = useState<boolean>(false);

    const [createDocType, setCreateDocType] = useState<DocType | undefined>();

    const { eventStore, tourStore, menuStore } = useStore();

    const createRef = useRef<unknown | undefined>(null);
    const uploadRef = useRef<unknown | undefined>(null);

    useEffect(() => {
      tourStore.register(2, {
        title: '新建',
        description: '您能创建空白的文字,表格,演示三种office格式的文档',
        placement: 'top',
        target: () => createRef?.current,
      });
      tourStore.register(3, {
        title: '上传',
        description: '您能上传任意大小的文档文件',
        placement: 'top',
        target: () => uploadRef?.current,
      });
    }, []);

    return (
      <>
        <main className='flex flex-row mt-1 h-[100%]'>
          <div className='flex w-64 shadow-xl rounded-md'>
            <Menu
              mode='inline'
              selectedKeys={[menuStore.mineMenu]}
              className='h-[100%] w-64'
              onClick={(e) => menuStore.setMenu(e.key)}
            >
              <div className='flex flex-col m-2 gap-2'>
                <div ref={createRef}>
                  <Popover
                    content={
                      <div className='p-4'>
                        <Typography.Title level={5}>
                          Office文档
                        </Typography.Title>
                        <div className='w-64 flex flex-row gap-6 p-2'>
                          <div
                            className='flex flex-col items-center align-middle gap-2 hover:bg-[#f5f5f5] active:bg-[#f0f0f0] h-20 w-20 cursor-pointer p-2 rounded-md'
                            onClick={(e) => {
                              e.stopPropagation();
                              setCreateDocVisible(true);
                              setCreateDocType('docx');
                            }}
                          >
                            <IconDocx width='35px' height='35px' />
                            <Typography.Text type='secondary'>
                              文字
                            </Typography.Text>
                          </div>
                          <div
                            className='flex flex-col items-center align-middle gap-2 hover:bg-[#f5f5f5] active:bg-[#f0f0f0] h-20 w-20 cursor-pointer p-2 rounded-md'
                            onClick={(e) => {
                              e.stopPropagation();
                              setCreateDocVisible(true);
                              setCreateDocType('xlsx');
                            }}
                          >
                            <IconXlsx width='35px' height='35px' />
                            <Typography.Text type='secondary'>
                              表格
                            </Typography.Text>
                          </div>
                          <div
                            className='flex flex-col items-center align-middle gap-2 hover:bg-[#f5f5f5] active:bg-[#f0f0f0] h-20 w-20 cursor-pointer p-2 rounded-md'
                            onClick={(e) => {
                              e.stopPropagation();
                              setCreateDocVisible(true);
                              setCreateDocType('pptx');
                            }}
                          >
                            <IconPpt width='35px' height='35px' />
                            <Typography.Text type='secondary'>
                              演示
                            </Typography.Text>
                          </div>
                        </div>
                      </div>
                    }
                    placement='bottom'
                  >
                    <Button
                      type='primary'
                      block
                      onClick={(e) => e.stopPropagation()}
                      icon={<PlusOutlined />}
                    >
                      新建
                    </Button>
                  </Popover>
                </div>
                <div ref={uploadRef}>
                  <Upload
                    action='/api/office/v1/doc/saves'
                    accept='.doc,.docx,.xls,.xlsx,.ppt,.pptx'
                    name='file'
                    maxCount={1}
                    showUploadList={false}
                    headers={{
                      'X-AUTHENTICATION': token.getToken(),
                      'X-TENANT': 0,
                    }}
                    onChange={(info) => {
                      const {
                        file: { status, response },
                      } = info;
                      if (status === 'done') {
                        const code = response.code || 500;
                        if (code === 200) {
                          message.success('上传文件成功!');
                          eventStore.onRefresh();
                        } else {
                          message.error(response.message || '上传文件失败!');
                        }
                      } else if (status === 'error') {
                        message.error('上传文件失败!');
                      }
                    }}
                  >
                    <Button icon={<UploadOutlined />} className='w-[100%]'>
                      导入
                    </Button>
                  </Upload>
                </div>
              </div>
              <MenuDivider />
              <MenuItem
                key='recently'
                onClick={() => router.push('/')}
                icon={<FieldTimeOutlined />}
              >
                最近
              </MenuItem>
              <MenuItem
                key='share'
                onClick={() => router.push('/share')}
                icon={<ShareAltOutlined />}
              >
                分享给我
              </MenuItem>
              <MenuItem
                key='favorite'
                onClick={() => router.push('/favorite')}
                icon={<StarOutlined />}
              >
                我的收藏
              </MenuItem>
              <MenuDivider />

              <MenuItem
                key='create'
                onClick={() => router.push('/create')}
                icon={<FileOutlined />}
              >
                我的创建
              </MenuItem>
              <MenuDivider />

              <MenuItem
                key='director'
                onClick={() => router.push('/director')}
                icon={<FolderOutlined />}
              >
                我的云文档
              </MenuItem>
              <MenuDivider />

              <MenuItem
                key='favor'
                onClick={() => router.push('/favor')}
                icon={<PushpinOutlined />}
              >
                常用
              </MenuItem>
              <MenuItem
                key='tag'
                icon={<TagOutlined />}
                onClick={() => unImplementation()}
              >
                我的标签
              </MenuItem>
              <MenuDivider />
              <div className='absolute bottom-2 p-2 w-64'>
                <Button
                  type='dashed'
                  block
                  icon={<DeleteOutlined />}
                  onClick={() => unImplementation()}
                >
                  回收站
                </Button>
              </div>
            </Menu>
          </div>
          <div className='shadow-xl rounded-md p-2 w-[100%]'>{children}</div>
        </main>

        <ModalForm<{ title: string }>
          title='新建空白文档'
          open={createDocVisible}
          loading={createLoading}
          onOpenChange={setCreateDocVisible}
          width='35%'
          onFinish={async (values) => {
            setCreateLoading(true);
            return docApi
              .create({ title: values.title, type: createDocType as DocType })
              .then((res) => {
                // empty state
                const triggerCreateFormFinish = () => {
                  setCreateDocType(undefined);
                };
                const { code, message, data } = res;

                const modalRef = modal.info({
                  style: { padding: '10px 24px' },
                  content:
                    code === 200 ? (
                      <Result
                        status='success'
                        title={`创建${values.title}文档成功!`}
                        extra={[
                          <Button
                            type='primary'
                            key='console'
                            onClick={() => {
                              triggerCreateFormFinish();
                              window.open(`/editor/${data.id}`);
                              modalRef.destroy();
                              eventStore.onRefresh();
                            }}
                          >
                            立即前往编辑
                          </Button>,
                          <Button
                            key='back'
                            onClick={() => {
                              triggerCreateFormFinish();
                              modalRef.destroy();
                              eventStore.onRefresh();
                            }}
                          >
                            返回
                          </Button>,
                        ]}
                      />
                    ) : (
                      <Result
                        status='error'
                        title={`创建${values.title}文档失败!`}
                        subTitle={message}
                        extra={[
                          <Button
                            type='primary'
                            key='reEdit'
                            onClick={() => {
                              setCreateDocVisible(true);
                              modalRef.destroy();
                            }}
                          >
                            重新编辑
                          </Button>,
                          <Button
                            key='back'
                            onClick={() => {
                              triggerCreateFormFinish();
                              modalRef.destroy();
                            }}
                          >
                            返回
                          </Button>,
                        ]}
                      />
                    ),
                  footer: null,
                  icon: null,
                  width: '35%',
                });
              })
              .catch((err) => {
                message.error(err);
              })
              .finally(() => {
                setCreateLoading(false);
                setCreateDocVisible(false);
              });
          }}
        >
          <ProFormText
            name='title'
            label='文档名称'
            placeholder='请输入不超过64个字文档名称!'
            rules={[
              { required: true, message: '请输入文档名称!' },
              { min: 1 },
              { max: 64 },
            ]}
          />
        </ModalForm>
      </>
    );
  }
);

export default Main;
