import { withSentryConfig } from '@sentry/nextjs'

/** @type {import('next').NextConfig} */
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin()

const nextConfig = {
  productionBrowserSourceMaps: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/**',
      },
      {
        hostname: 'lh3.googleusercontent.com'
      },
      {
        hostname: 'images.unsplash.com'
      },
      {
        hostname: 'randomuser.me'
      },
      {
        protocol: 'https',
        hostname: '**.us-east-1.amazonaws.com',
        port: '',
        pathname: '/**'
      },
      {
        protocol: 'https',
        hostname: '**.us-east-2.amazonaws.com',
        port: '',
        pathname: '/**'
      },
      {
        hostname: 'www.yiqi.lat'
      }
    ]
  }
}

// Check if we're in CI environment or if Sentry should be disabled
const isCi = process.env.CI === 'true'
const shouldSkipSentry =
  isCi ||
  process.env.SENTRY_DISABLED === 'true' ||
  process.env.SKIP_SENTRY === 'true' ||
  !process.env.SENTRY_AUTH_TOKEN

// Create the final config based on whether Sentry should be skipped
const finalConfig = shouldSkipSentry
  ? nextConfig
  : withSentryConfig(nextConfig, {
      org: 'andino-labs-sac',
      project: 'javascript-nextjs',
      silent: true, // Always silent to avoid warnings
      telemetry: false, // Disable telemetry
      widenClientFileUpload: true,
      reactComponentAnnotation: {
        enabled: true
      },
      tunnelRoute: '/monitoring',
      hideSourceMaps: false,
      disableLogger: true,
      automaticVercelMonitors: true,
      sourcemaps: true
    })

export default withNextIntl(finalConfig)
