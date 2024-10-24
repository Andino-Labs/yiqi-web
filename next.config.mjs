/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: config => {
    config.externals.push('@node-rs/argon2', '@node-rs/bcrypt')
    return config
  },
  images: {
    remotePatterns: [
      {
        hostname: 'lh3.googleusercontent.com'
      },
      {
        hostname: 'images.unsplash.com'
      },
      { hostname: 'randomuser.me' }
    ]
  },
  experimental: {
    serverComponentsExternalPackages: ['@node-rs/argon2']
  }
}

export default nextConfig
