import type { Metadata } from 'next';
import { PT_Sans } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';
import { cn } from '@/lib/utils';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-sans',
});

export const metadata: Metadata = {
  title: 'TaskFlow',
  description: 'Gerencie as tarefas da sua equipe com facilidade e eficiência.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
       <body className={cn("min-h-screen bg-background font-body antialiased", ptSans.variable)}>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </body>
    </html>
  );
}
