/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@farmhith/ui', '@farmhith/auth', '@farmhith/utils', '@farmhith/types', '@farmhith/firebase'],
  // firebase-admin uses Node.js built-ins — must NOT be bundled by webpack (Next.js 14 syntax)
  experimental: {
    serverComponentsExternalPackages: ['firebase-admin'],
  },
};

export default nextConfig;
