/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  images: {
    domains: [
      'p2.trrsf.com',
      'marettimo.com.br',
      'nunesbebidas.com.br',
      'cdn.awsli.com.br',
    ],
  },
}

export default nextConfig
