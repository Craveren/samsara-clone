const path = require('path')

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.alias['@woodpecker/ui'] = path.join(__dirname, 'lib/stubs/ui')
    config.resolve.alias['@woodpecker/utils'] = path.join(__dirname, 'lib/stubs/utils')
    return config
  },
}

module.exports = nextConfig















