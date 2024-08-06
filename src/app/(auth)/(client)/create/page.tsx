'use client';

import DocumentPanel from '@/components/Document/Panel';
import useDocUserApi from '@/services/docUser';

const Create = () => {
  const userDocApi = useDocUserApi();

  return (
    <DocumentPanel title='我的创建' api={userDocApi.getMineCreateDocument} />
  );
};

export default Create;
