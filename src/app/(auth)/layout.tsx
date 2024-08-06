import { AuthLayout } from '@/components';
import StoreProvider from '@/hook/useStore';
import { App } from 'antd';

export default function Layout({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  return (
    <StoreProvider {...props}>
      <App>
        <AuthLayout>{children}</AuthLayout>
      </App>
    </StoreProvider>
  );
}
