import type { Metadata } from 'next';
import './globals.css';
import '@docsearch/css';

export const metadata: Metadata = {
  title: 'ClearX',
  description: 'CollabSapce',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body style={{ margin: '0px' }}>{children}</body>
    </html>
  );
}
