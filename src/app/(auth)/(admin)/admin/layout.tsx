'use client';

import { useStore } from '@/hook/useStore';
import {
  FileWordOutlined,
  HomeOutlined,
  InboxOutlined,
  MessageOutlined,
  ProfileOutlined,
  ProjectOutlined,
  SettingOutlined,
  SolutionOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { PageContainer, ProCard, ProLayout } from '@ant-design/pro-components';
import { Button, Tooltip } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

import logo from '@/assets/logo.png';

export default function Layout({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();

  const { userStore } = useStore();

  const [selectRouteKey, setSelectRouteKey] = useState<string>('doc');

  return (
    <div className='h-[100vh]'>
      <ProLayout
        logo={logo.src}
        fixSiderbar
        title='在线文档协作平台'
        selectedKeys={[selectRouteKey]}
        route={{
          path: '/admin/doc',
          routes: [
            {
              key: 'doc',
              name: '文档管理',
              path: '/admin',
              icon: <FileWordOutlined />,
            },
            {
              key: 'template',
              name: '模板管理',
              icon: <SolutionOutlined />,
              path: '/admin/template',
            },
            {
              key: 'user',
              path: '/admin/user',
              name: '人员管理',
              icon: <UserOutlined />,
            },
            {
              key: 'advice',
              name: '建议箱',
              icon: <InboxOutlined />,
              path: '/admin/advice',
            },
            {
              key: 'message',
              name: '消息管理',
              icon: <MessageOutlined />,
              path: '/admin/message',
              routes: [
                {
                  key: 'messageTemplate',
                  path: '/admin/message/template',
                  name: '消息模板',
                  icon: <ProjectOutlined />,
                },
                {
                  key: 'messageConfig',
                  path: '/admin/message/config',
                  name: '消息配置',
                  icon: <SettingOutlined />,
                },
                {
                  key: 'messageLog',
                  path: '/admin/message/log',
                  name: '消息日志',
                  icon: <ProfileOutlined />,
                },
              ],
            },
          ],
        }}
        menu={{
          type: 'group',
          defaultOpenAll: true,
        }}
        location={{
          pathname,
        }}
        avatarProps={{
          icon: <UserOutlined />,
          size: 'small',
          title: userStore.user?.userName,
        }}
        actionsRender={(props) => {
          return [
            <Tooltip title='回到首页' key='backHome'>
              <HomeOutlined onClick={() => router.push('/')} />
            </Tooltip>,
          ];
        }}
        menuFooterRender={(props) => {
          if (props?.collapsed) return undefined;
          return (
            <p
              style={{
                textAlign: 'center',
                color: 'rgba(0,0,0,0.6)',
                paddingBlockStart: 12,
              }}
            >
              Power by ClearXs
            </p>
          );
        }}
        onMenuHeaderClick={(e) => console.log(e)}
        menuItemRender={(item, dom) => {
          return (
            <a
              onClick={() => {
                if (item.children === undefined) {
                  router.push(item.path as string);
                  setSelectRouteKey(item.key as string);
                }
              }}
            >
              {dom}
            </a>
          );
        }}
      >
        <PageContainer>
          <ProCard className='h-[100%]'>{children}</ProCard>
        </PageContainer>
      </ProLayout>
    </div>
  );
}
