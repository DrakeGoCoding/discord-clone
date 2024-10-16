import './globals.css';

import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';

import { ModalProvider } from '@/components/providers/modal-provider';
import { ThemeProvider } from '@/components/providers/theme-provider';
import { cn } from '@/lib/utils';

const inter = Inter({
  subsets: ['latin']
});

export const metadata: Metadata = {
  title: 'Discord',
  description: 'Generated by create next app'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider afterSignOutUrl="/">
      <html lang="en" suppressHydrationWarning>
        <body className={cn(inter.className, 'bg-white dark:bg-[#313338]')}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            storageKey="discord-theme"
          >
            <ModalProvider />
            {children}
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
