'use client';

import ClientLayout from '@/components/layouts/Client';
import { useStore } from '@/hook/useStore';
import { Tour } from 'antd';
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { observer } from 'mobx-react-lite';
import { usePathname } from 'next/navigation';
import _ from 'lodash';
import Main from '@/components/layouts/client/Main';
import Header from '@/components/layouts/client/Header';

const Layout = observer(
  ({ children, ...props }: { children: React.ReactNode }) => {
    const { tourStore, menuStore } = useStore();
    const [openTour, setOpenTour] = useState<boolean>(false);

    const pathname = usePathname();

    useEffect(() => {
      const isTour = Cookies.get('IS_TOUR');
      if (!isTour || Boolean(isTour) === false) {
        setOpenTour(true);
      }
      const menu = pathname.substring(1);
      if (_.isEmpty(menu)) {
        menuStore.setMenu('recently');
      } else {
        menuStore.setMenu(menu);
      }
    }, [pathname]);

    return (
      <ClientLayout>
        <div className='h-[100vh] w-[100vw] flex flex-col'>
          <Header />
          <Main {...props}>{children}</Main>
        </div>
        <Tour
          steps={tourStore.steps
            .slice(0, -1)
            .sort((a, b) => a.num - b.num)
            .map((a) => a.step)}
          open={openTour}
          onClose={() => {
            Cookies.set('IS_TOUR', 'true');
            setOpenTour(false);
          }}
        />
      </ClientLayout>
    );
  }
);

export default Layout;
