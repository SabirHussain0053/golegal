import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'GoLegal Editor',
  description: 'Rich text editor for legal documents',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
