'use client';

import { GitlabOutlined } from '@ant-design/icons';
import { Button, Layout, Typography } from 'antd';

export default function Copyright() {
  return (
    <Layout.Footer
      className='absolute bottom-0 w-[100vw] text-center'
      style={{ padding: '6px 10px' }}
    >
      <Typography.Text>
        Copyright @ 2024-2024 ClearX All rights reserved Simple · Practical ·
        Leading Edge · Innovation
      </Typography.Text>
      <Button icon={<GitlabOutlined />} type='text' />
    </Layout.Footer>
  );
}
