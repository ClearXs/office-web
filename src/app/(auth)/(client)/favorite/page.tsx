'use client';

import DocumentPanel from '@/components/Document/Panel';
import useDocUserApi from '@/services/docUser';

const Favorite = () => {
  const userDocApi = useDocUserApi();

  return (
    <DocumentPanel title='我的收藏' api={userDocApi.getMineFavoriteDocument} />
  );
};

export default Favorite;
