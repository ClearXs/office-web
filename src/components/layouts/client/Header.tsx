'use client';

import useUserApi from '@/services/user';
import {
  BellOutlined,
  InboxOutlined,
  LogoutOutlined,
  MenuOutlined,
  SettingOutlined,
  SkinOutlined,
  TeamOutlined,
  TranslationOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  App,
  Avatar,
  Button,
  Col,
  Dropdown,
  Image,
  Popover,
  Row,
  Space,
  Tooltip,
  Typography,
} from 'antd';
import _ from 'lodash';
import { observer } from 'mobx-react-lite';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useRef } from 'react';
import token from '@/util/token';

import './header.css';
import { useStore } from '@/hook/useStore';
import {
  ProForm,
  ProFormTextArea,
  StatisticCard,
} from '@ant-design/pro-components';
import useAppApi from '@/services/app';
import useError from '@/hook/useError';
import { ItemType } from 'antd/es/menu/interface';
import IconTemplateRepository from '@/components/Icons/IconTemplateRepository';
import { DocSearch } from '@docsearch/react';
import { MultipleQueriesResponse, Hit } from '@algolia/client-search';
import useDocUserApi, { DocUser } from '@/services/docUser';
import { chooseDocumentIcon } from '@/components/Document/List';
import HighlightText from '@/components/HighlightText';
import logo from '@/assets/logo.png';

const Header = observer((props) => {
  const { message, modal } = App.useApp();

  const { unImplementation } = useError();
  const router = useRouter();
  const { tourStore, userStore } = useStore();

  const pathname = usePathname();
  const userApi = useUserApi();
  const appApi = useAppApi();
  const docUserApi = useDocUserApi();

  const logoRef = useRef<unknown | undefined>(null);
  const adviceRef = useRef<unknown | undefined>(null);

  useEffect(() => {
    const user = userStore.user;
    if (_.isEmpty(user)) {
      userApi.getCurrentUser().then((res) => {
        const { code, data } = res;
        if (code === 200) {
          userStore.setUser(data);
        }
      });
    }
    tourStore.register(1, {
      title: '在线文档协作平台',
      description: '该平台提供在线编辑office文档,管理,协作,下载等功能',
      placement: 'top',
      target: () => logoRef?.current,
    });
    tourStore.register(4, {
      title: '建议箱',
      description: '您的建议能够为我们更好的完善产品!',
      placement: 'top',
      target: () => adviceRef?.current,
    });
  }, [pathname]);

  const mineMenus: ItemType[] = useMemo(
    () => [
      {
        label: '个人中心',
        key: 'center',
        icon: <UserOutlined />,
        onClick: () => unImplementation(),
      },
      userStore.user?.administrator && {
        label: '管理中心',
        key: 'administration',
        icon: <TeamOutlined />,
        onClick: () => {
          router.push('/admin/doc');
        },
      },
    ],
    [userStore.user]
  );

  return (
    <header className='h-12 p-2 border-[#f5f5f5] border-b-2 bg-[#f6f8fb] shadow-md'>
      <Row>
        <Col span={6}>
          <div
            className='cursor-pointer hover:bg-[#f5f5f5] rounded-md flex gap-1 text-center'
            onClick={() => {
              router.push('/');
            }}
            ref={logoRef}
          >
            <Image src={logo.src} preview={false} width={100}></Image>
          </div>
        </Col>
        <Col span={18}>
          <Row>
            <Col span={14}>
              <DocSearch
                appId='R2IYF7ETH7'
                apiKey=''
                indexName=''
                searchParameters={{
                  facetFilters: ['language:ch', 'version:1.0.0'],
                }}
                placeholder='通过文件名、所有者搜索文档'
                transformSearchClient={(searchClient) => {
                  return {
                    ...searchClient,
                    search(queries, requestOptions) {
                      const pattern = queries[0]!.query!;
                      return docUserApi
                        .searchMineDocument(pattern)
                        .then((res) => {
                          const { code, data } = res;
                          if (code === 200) {
                            const res: MultipleQueriesResponse<DocUser> = {
                              results: [
                                {
                                  hits: data.map((doc) => {
                                    return {
                                      ...doc,
                                      objectID: doc.id,
                                      _highlightResult: pattern,
                                      hierarchy: 1,
                                    };
                                  }),
                                },
                              ],
                            };
                            return res;
                          }
                        });
                    },
                  };
                }}
                hitComponent={({ hit }: { hit: Hit<DocUser> }) => {
                  return (
                    <div
                      className='hover:bg-[#f0f0f0] flex items-center rounded-md w-[100%] h-16'
                      onClick={() => window.open(`/editor/${hit.id}`)}
                    >
                      <Space className='p-2'>
                        {hit.type && chooseDocumentIcon(hit.type)}
                        <div className='flex flex-col gap-1'>
                          <HighlightText
                            text={hit.title}
                            highlight={hit._highlightResult as string}
                            style={{ fontSize: '16px' }}
                          />

                          <Typography.Text
                            type='secondary'
                            style={{ fontSize: '12px' }}
                          >
                            所有者:
                            <HighlightText
                              text={hit.createName}
                              highlight={hit._highlightResult as string}
                              type='secondary'
                              style={{ fontSize: '12px' }}
                            />
                          </Typography.Text>
                        </div>
                      </Space>
                    </div>
                  );
                }}
              />
            </Col>
            <Col span={10}>
              <div className='flex ml-auto w-[100%]'>
                <div className='ml-auto'>
                  <Space size='middle'>
                    <Button
                      className='w-24'
                      type='dashed'
                      onClick={() => {
                        unImplementation();
                      }}
                    >
                      <Space>
                        <IconTemplateRepository width='1em' height='1em' />
                        <Typography.Text>模版库</Typography.Text>
                      </Space>
                    </Button>

                    <Tooltip title='您的建议是我们不断进步的动力!'>
                      <Button
                        ref={adviceRef}
                        className='w-24'
                        type='dashed'
                        onClick={() => {
                          const modalRef = modal.confirm({
                            icon: null,
                            closable: true,
                            footer: null,
                            width: '40%',
                            content: (
                              <div className='p-4'>
                                <ProForm<{ content: string }>
                                  onFinish={async (values) => {
                                    appApi
                                      .reportAdvice({ content: values.content })
                                      .then((res) => {
                                        const { code, data } = res;
                                        if (code === 200 && data) {
                                          message.success('建议成功!');
                                          modalRef.destroy();
                                        } else {
                                          message.error(res.message);
                                        }
                                      });
                                  }}
                                >
                                  <ProFormTextArea
                                    name='content'
                                    label='建议内容'
                                    placeholder='请输入建议内容!'
                                    rules={[{ required: true }]}
                                  />
                                </ProForm>
                              </div>
                            ),
                          });
                        }}
                        icon={<InboxOutlined />}
                      >
                        <Typography.Text>建议箱</Typography.Text>
                      </Button>
                    </Tooltip>
                    <Dropdown
                      menu={{
                        items: [
                          { label: '中文', key: 'chinese' },
                          { label: 'english', key: 'english' },
                        ],
                        activeKey: 'chinese',
                      }}
                    >
                      <Button type='text' icon={<TranslationOutlined />} />
                    </Dropdown>
                    <Dropdown
                      menu={{
                        items: [{ label: '默认', key: 'default' }],
                        activeKey: 'default',
                      }}
                    >
                      <Button type='text' icon={<SkinOutlined />} />
                    </Dropdown>
                    <Button type='text' icon={<BellOutlined />} />
                    <Dropdown
                      menu={{
                        items: mineMenus,
                      }}
                    >
                      <Button type='text' icon={<MenuOutlined />} />
                    </Dropdown>
                    <Popover
                      content={
                        <div className='w-64 p-2 bg-[#f0f5ff] flex flex-col gap-2'>
                          <div className='h-[75%] bg-white rounded-r-sm'>
                            <Space className='p-2'>
                              <Avatar className='bg-[#f56a00]'>
                                {userStore.user?.nickname?.substring(0, 1) ||
                                  userStore.user?.username?.substring(0, 1)}
                              </Avatar>
                              <Typography.Text>
                                {userStore.user?.nickname ||
                                  userStore.user?.username}
                              </Typography.Text>
                            </Space>
                            <StatisticCard.Group direction='column'>
                              <StatisticCard
                                statistic={{
                                  title: '我的文档数量',
                                  value: 0,
                                }}
                              />
                              <StatisticCard
                                statistic={{
                                  title: '我创建文档数量',
                                  value: 0,
                                }}
                              />
                              <StatisticCard
                                statistic={{
                                  title: '我使用文档总空间大小',
                                  value: 0,
                                }}
                              />
                            </StatisticCard.Group>
                          </div>
                          <Button
                            type='text'
                            block
                            icon={<SettingOutlined />}
                            className='bg-white'
                            onClick={() => unImplementation()}
                          >
                            个人设置
                          </Button>
                          <Button
                            type='text'
                            block
                            className='bg-white'
                            icon={<LogoutOutlined />}
                            onClick={() => {
                              modal.confirm({
                                content: '是否确定退出登录',
                                okText: '确定',
                                cancelText: '取消',
                                onOk: () => {
                                  token.clearToken();
                                  router.push('/login');
                                  message.success('退出成功');
                                },
                              });
                            }}
                          >
                            退出登录
                          </Button>
                        </div>
                      }
                    >
                      <Avatar
                        className='bg-[#f56a00] cursor-pointer'
                        size='default'
                      >
                        {userStore.user?.nickname?.substring(0, 1) ||
                          userStore.user?.username?.substring(0, 1)}
                      </Avatar>
                    </Popover>
                  </Space>
                </div>
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </header>
  );
});

export default Header;
