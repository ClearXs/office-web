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
