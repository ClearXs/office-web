import * as dotenv from 'dotenv';
import {fileURLToPath} from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 根据 NODE_ENV 加载相应的 .env 文件
dotenv.config({path: path.resolve(__dirname, '.env')});

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
        const rewrites = [];
        if (process.env.NEXT_PUBLIC_API_URL) {
            const API_URL = process.env.NEXT_PUBLIC_API_URL
            rewrites.push({
                source: '/api/:path*',
                destination: `${API_URL}/:path*`,
            },)
        }
        return rewrites;
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    output: 'standalone',
};

export default nextConfig;
