'use client';

import useToken from '@/hook/useToken';
import _ from 'loadsh';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import Loading from '../Loading';
import LocationFinder from '@/util/location';
import { useStore } from '@/hook/useStore';
import useUserApi from '@/services/user';
import { observer } from 'mobx-react-lite';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

const SKIP_URLS: string[] = [];
interface RouterInterceptor {
  order: number;
  onIntercept: (context: InterceptorContext, chain: RouterChain) => void;
}

type InterceptorContext = {
  router: AppRouterInstance;
  path: string;
};

class RouterChain {
  num: number = 0;
  interceptorList: RouterInterceptor[];
  constructor(interceptors: RouterInterceptor[]) {
    this.interceptorList = interceptors.sort((a, b) => a.order - b.order);
  }
  proceed = (context: InterceptorContext) => {
    try {
      if (this.num <= this.interceptorList.length) {
        const count = this.num;
        this.num += 1;
        this.interceptorList[count]?.onIntercept(context, this);
      }
    } catch (err) {
      console.error('failed to trigger router interceptor', err);
    }
  };

  finish = () => {
    this.num = 0;
  };
}

const AuthLayout = observer(({ children }: { children: React.ReactNode }) => {
  const userApi = useUserApi();

  const pathname = usePathname();
  const { getToken } = useToken();
  const router = useRouter();
  const [isAuth, setAuth] = useState<boolean>(false);

  const { userStore } = useStore();

  const skipInterceptor = useMemo<RouterInterceptor>(() => {
    return {
      order: -1,
      onIntercept(context, chain) {
        if (SKIP_URLS.includes(context.path)) {
          setAuth(true);
        } else {
          chain.proceed(context);
        }
      },
    };
  }, []);

  const tokenInterceptor = useMemo<RouterInterceptor>(() => {
    return {
      order: 0,
      onIntercept(context, chain) {
        const token = getToken();
        if (_.isEmpty(token)) {
          // if the editor then judge contains preview
          const search = window.location.search;
          const locationFinder = new LocationFinder(search);
          if (
            pathname.startsWith('/editor') &&
            Boolean(locationFinder.get('preview')) === true
          ) {
            setAuth(true);
            return;
          } else {
            router.push('/login');
            setAuth(false);
          }
        } else {
          chain.proceed(context);
        }
      },
    };
  }, [pathname]);

  const userInterceptor = useMemo<RouterInterceptor>(() => {
    return {
      order: 1,
      onIntercept(context, chain) {
        if (userStore.user === undefined) {
          userApi
            .getCurrentUser()
            .then((res) => {
              const { code, data } = res;
              if (code === 200) {
                userStore.setUser(data);
              }
              chain.proceed(context);
            })
            .catch((err) => {
              // whatever continue router chain. it will be go to error
              chain.proceed(context);
            });
        } else {
          chain.proceed(context);
        }
      },
    };
  }, [pathname]);

  const plainInterceptor = useMemo<RouterInterceptor>(() => {
    return {
      order: 2,
      onIntercept(context, chain) {
        if (pathname === '/login') {
          router.push('/');
        }
        setAuth(true);
      },
    };
  }, [pathname]);

  useEffect(() => {
    const chain = new RouterChain([
      skipInterceptor,
      tokenInterceptor,
      userInterceptor,
      plainInterceptor,
    ]);
    chain.proceed({ router, path: pathname });
  }, [pathname]);

  return isAuth === true ? (
    children
  ) : pathname === '/login' ? (
    children
  ) : (
    <Loading />
  );
});

export default AuthLayout;
