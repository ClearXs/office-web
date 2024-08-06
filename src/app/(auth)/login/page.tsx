'use client';
import useToken from '@/hook/useToken';
import useAuthApi from '@/services/auth';
import { useLottie } from 'lottie-react';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import {
  LoginFormPage,
  ProConfigProvider,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { App, Space, Typography, theme } from 'antd';
import { useRouter } from 'next/navigation';

type LoginProps = {
  username: string;
  password: string;
};

const Page = () => {
  const { message } = App.useApp();
  const { token } = theme.useToken();
  const { setToken } = useToken();
  const authApi = useAuthApi();
  const router = useRouter();

  return (
    <div
      style={{
        backgroundColor: 'white',
        height: '100vh',
      }}
    >
      <LoginFormPage<LoginProps>
        title='CollabSpace'
        backgroundVideoUrl='https://gw.alipayobjects.com/v/huamei_gcee1x/afts/video/jXRBRK_VAwoAAAAAAAAAAAAAK4eUAQBr'
        containerStyle={{
          backgroundColor: 'rgba(0, 0, 0,0.65)',
          backdropFilter: 'blur(4px)',
        }}
        activityConfig={{
          style: {
            boxShadow: '0px 0px 8px rgba(0, 0, 0, 0.2)',
            color: token.colorTextHeading,
            borderRadius: 8,
            backgroundColor: 'rgba(255,255,255,0.25)',
            backdropFilter: 'blur(4px)',
          },
          title: '在线文档平台-体验版',
          subTitle: (
            <>
              <Space direction='vertical'>
                <Typography.Title level={5}>体验账号:</Typography.Title>
                <div className='flex flex-row gap-2'>
                  <Typography.Text>管理端</Typography.Text>
                  <Typography.Text
                    copyable={{ tooltips: false, text: 'admin' }}
                  >
                    账号:admin
                  </Typography.Text>
                  <Typography.Text copyable={{ tooltips: false, text: '123' }}>
                    密码:123
                  </Typography.Text>
                </div>
                <div className='flex flex-row gap-2'>
                  <Typography.Text>普通账号</Typography.Text>
                  <Typography.Text
                    copyable={{ tooltips: false, text: 'dtest01' }}
                  >
                    账号:dtest01
                  </Typography.Text>
                  <Typography.Text
                    copyable={{ tooltips: false, text: '66666' }}
                  >
                    密码:66666
                  </Typography.Text>
                </div>
                <div className='flex flex-row gap-2'>
                  <Typography.Text>普通账号</Typography.Text>
                  <Typography.Text
                    copyable={{ tooltips: false, text: 'dtest02' }}
                  >
                    账号:dtest02
                  </Typography.Text>
                  <Typography.Text
                    copyable={{ tooltips: false, text: '66666' }}
                  >
                    密码:66666
                  </Typography.Text>
                </div>
              </Space>
            </>
          ),
        }}
        subTitle='在线协作平台'
        onFinish={async (values) => {
          authApi
            .login(values.username, values.password)
            .then((res) => {
              const { code, data } = res;
              if (code === 200) {
                setToken(data.tokenValue);
                router.push('/');
                message.success('登录成功!');
              } else {
                message.error(res.message);
              }
            })
            .catch((err) => {
              message.error(err.data?.message || '登录失败!');
            });
        }}
      >
        <ProFormText
          name='username'
          fieldProps={{
            size: 'large',
            prefix: (
              <UserOutlined
                style={{
                  color: token.colorText,
                }}
                className={'prefixIcon'}
              />
            ),
          }}
          placeholder={'请输入用户名!'}
          rules={[
            {
              required: true,
              message: '请输入用户名!',
            },
          ]}
        />
        <ProFormText.Password
          name='password'
          fieldProps={{
            size: 'large',
            prefix: (
              <LockOutlined
                style={{
                  color: token.colorText,
                }}
                className={'prefixIcon'}
              />
            ),
          }}
          placeholder={'请输入密码！'}
          rules={[
            {
              required: true,
              message: '请输入密码！',
            },
          ]}
        />
        <div
          style={{
            marginBlockEnd: 24,
          }}
        >
          <ProFormCheckbox noStyle name='autoLogin'>
            自动登录
          </ProFormCheckbox>
          <a
            style={{
              float: 'right',
            }}
          >
            忘记密码
          </a>
        </div>
      </LoginFormPage>
    </div>
  );
};

export default function Login() {
  return (
    <ProConfigProvider dark>
      <Page />
    </ProConfigProvider>
  );
}
