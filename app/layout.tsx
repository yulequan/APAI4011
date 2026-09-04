import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'APAI4011 Interactive Demos',
    template: '%s · APAI4011',
  },
  description:
    'Interactive demonstrations for APAI4011 Natural Language Processing.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
