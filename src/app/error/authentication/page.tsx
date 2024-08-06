'use client';

import Copyright from '@/components/Copyright';
import warningLottie from '@/lottie/warning.json';
import { HomeOutlined, RollbackOutlined } from '@ant-design/icons';
import { Button, Space, Typography } from 'antd';
import { useLottie } from 'lottie-react';
import { usePathname, useRouter } from 'next/navigation';

const AuthenticateError = () => {
  const router = useRouter();
  const pathname = usePathname();
  const WarningView = useLottie({ animationData: warningLottie });

  return (
    <div className='h-[100vh] w-[100vw] flex flex-col gap-2 items-center justify-center'>
      <div className='h-36 w-36'>{WarningView.View}</div>
      <Typography.Title
        style={{
          fontSize: 16,
        }}
      >
        您没有权限访问❗
      </Typography.Title>
      <Space>
        <Button
          type='dashed'
          onClick={() => router.back()}
          icon={<RollbackOutlined />}
          className='w-36'
        >
          回到上一步
        </Button>
        <Button
          type='dashed'
          onClick={() => router.push('/')}
          icon={<HomeOutlined />}
          className='w-36'
        >
          回到首页
        </Button>
      </Space>
      <Copyright />
    </div>
  );
};

export default AuthenticateError;
