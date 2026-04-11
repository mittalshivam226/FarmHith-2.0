import type { Metadata } from 'next';
import './globals.css';
import { ToastContainer } from '@farmhith/ui';
import { AuthProvider } from '@farmhith/auth';

export const metadata: Metadata = {
  title: 'FarmHith — Bio-Pellet Plant Portal',
  description: 'Browse crop residue listings and manage procurement orders on FarmHith.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider requiredRole="BIOPELLET">
          <ToastContainer>
            {children}
          </ToastContainer>
        </AuthProvider>
      </body>
    </html>
  );
}
