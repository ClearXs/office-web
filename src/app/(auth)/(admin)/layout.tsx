import AdminLayout from '@/components/layouts/Admin';

export default function Layout({
  children,
  ...props
}: {
  children: React.ReactNode;
}) {
  return <AdminLayout>{children}</AdminLayout>;
}
