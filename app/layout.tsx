import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: "Alberta's Voice | Messaging Tool",
  description: 'Campaign messaging consistency tool — No to the Nine. Stay in Canada.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full font-sans">{children}</body>
    </html>
  );
}
