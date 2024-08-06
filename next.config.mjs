import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import path from 'path';

// 获取当前文件路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 动态加载 .env 文件中的环境变量
dotenv.config({ path: path.resolve(__dirname, '.env') });

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack(config) {
    // handle svg
    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://localhost:8700/:path*',
      },
    ];
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  output: 'standalone',
};

export default nextConfig;
