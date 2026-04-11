import type { Metadata } from 'next';
import './globals.css';
import { ToastContainer } from '@farmhith/ui';
import { AuthProvider } from '@farmhith/auth';

export const metadata: Metadata = {
  title: 'FarmHith — Admin',
  description: 'Platform administration dashboard for FarmHith.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-900 text-gray-100">
        <AuthProvider requiredRole="ADMIN">
          <ToastContainer>
            {children}
          </ToastContainer>
        </AuthProvider>
      </body>
    </html>
  );
}
