/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@farmhith/ui', '@farmhith/auth', '@farmhith/utils', '@farmhith/types', '@farmhith/firebase'],
  serverExternalPackages: ['firebase-admin'],
};

export default nextConfig;
