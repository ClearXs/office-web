'use client';

import { Button, Space, Typography } from 'antd';
import { useLottie } from 'lottie-react';
import { usePathname, useRouter } from 'next/navigation';

import notFoundLottie from '@/lottie/404.json';
import Copyright from '@/components/Copyright';
import { HomeOutlined, RollbackOutlined } from '@ant-design/icons';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  const pathname = usePathname();

  const NotFoundView = useLottie({ animationData: notFoundLottie });

  return (
    <div className='h-[100vh] w-[100vw] flex flex-col gap-2 items-center justify-center'>
      <div className='h-64 w-64'>{NotFoundView.View}</div>
      <Typography.Title
        style={{
          fontSize: 16,
        }}
      >
        <Typography.Text keyboard> {pathname}</Typography.Text>页面未找到❗
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
}
