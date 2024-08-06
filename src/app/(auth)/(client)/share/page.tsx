'use client';

import DocumentPanel from '@/components/Document/Panel';
import useDocUserApi from '@/services/docUser';

const Share = () => {
  const userDocApi = useDocUserApi();

  return (
    <DocumentPanel title='分享给我' api={userDocApi.getShareToMeDocument} />
  );
};

export default Share;
