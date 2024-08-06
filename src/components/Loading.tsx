'use client';

import loadingLottie from '@/lottie/loading.json';
import { useLottie } from 'lottie-react';
import Copyright from './Copyright';
import { Typography } from 'antd';

const Loading = () => {
  const LoadingView = useLottie({ animationData: loadingLottie });

  return (
    <div className='h-[100vh] w-[100vw] flex flex-col justify-center items-center'>
      {LoadingView.View}
      <Typography.Title style={{ fontSize: '16px' }}>
        Loading...
      </Typography.Title>
      <Copyright />
    </div>
  );
};

export default Loading;
