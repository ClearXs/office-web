'use client';

import DocumentPanel from '@/components/Document/Panel';
import useDocUserApi from '@/services/docUser';

const Trash = () => {
  const userDocApi = useDocUserApi();

  return (
    <DocumentPanel title='回收站' api={userDocApi.getMineFavoriteDocument} />
  );
};

export default Trash;
