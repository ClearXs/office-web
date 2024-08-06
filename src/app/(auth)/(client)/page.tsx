'use client';

import DocumentPanel from '@/components/Document/Panel';
import useDocUserApi from '@/services/docUser';

export default function Recently() {
  const userDocApi = useDocUserApi();

  return (
    <DocumentPanel title='最近更新' api={userDocApi.getMineRecentlyDocument} />
  );
}
