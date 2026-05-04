import type { Metadata } from 'next';
import Script from 'next/script';
import './globals.css';
import { ToastContainer } from '@farmhith/ui';
import { AuthProvider } from '@farmhith/auth';

export const metadata: Metadata = {
  title: 'FarmHith — Modern Farming Platform for Indian Farmers',
  description: 'Book soil tests, consult expert Soil-Mitras, and sell crop residue — all in one platform built for the modern Indian farmer.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          strategy="beforeInteractive"
        />
        {/* No requiredRole here — public pages are accessible to all.
            Auth guards are enforced at /dashboard/layout.tsx */}
        <AuthProvider>
          <ToastContainer>
            {children}
          </ToastContainer>
        </AuthProvider>
      </body>
    </html>
  );
}

