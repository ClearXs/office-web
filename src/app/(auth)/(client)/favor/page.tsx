'use client';

import DocumentPanel from '@/components/Document/Panel';
import useDocUserApi from '@/services/docUser';

const Favor = () => {
  const userDocApi = useDocUserApi();

  return <DocumentPanel title='常用' api={userDocApi.getMineFavorDocument} />;
};

export default Favor;
