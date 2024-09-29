import withPWA from 'next-pwa';

// NODE_ENV가 'production'일 때만 PWA 활성화
const isProd = process.env.NODE_ENV === 'production';

const pwaConfig = {
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: !isProd, // 개발 모드에서는 PWA 비활성화
  buildExcludes: [
    /app-build-manifest\.json$/,
    /_buildManifest\.js$/,
  ],
};

const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone', // 독립 실행을 위한 설정

  // 외부 이미지 도메인 허용 설정 추가
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'k.kakaocdn.net',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'img1.kakaocdn.net',
        pathname: '/**',
      },
    ],
  },

  // Webpack 설정 추가
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'rc-util': 'commonjs rc-util',
      });
    }

    config.module.rules.push({
      test: /\.(js|jsx|ts|tsx)$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['next/babel'],
          plugins: [
            '@babel/plugin-transform-private-methods',
            '@babel/plugin-transform-runtime',
          ],
        },
      },
    });

    return config;
  },
};

// PWA 설정과 Next.js 설정을 통합하여 export
export default withPWA(pwaConfig)(nextConfig);
