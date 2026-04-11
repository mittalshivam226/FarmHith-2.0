import type { Metadata } from 'next';
import './globals.css';
import { ToastContainer } from '@farmhith/ui';
import { AuthProvider } from '@farmhith/auth';

export const metadata: Metadata = {
  title: 'FarmHith — Lab Portal',
  description: 'Manage soil test bookings, upload reports, and track earnings on FarmHith.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider requiredRole="LAB">
          <ToastContainer>
            {children}
          </ToastContainer>
        </AuthProvider>
      </body>
    </html>
  );
}
