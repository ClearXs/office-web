'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { useStore } from '@/hook/useStore';

const AdminLayout = observer(({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { userStore } = useStore();

  const [isAdmin, setAdmin] = useState<boolean>(false);

  useEffect(() => {
    if (userStore.user === undefined || userStore.user?.isAdmin === false) {
      router.push('/error/authentication');
      setAdmin(false);
    } else {
      setAdmin(true);
    }
  }, [pathname]);

  return isAdmin && children;
});

export default AdminLayout;
