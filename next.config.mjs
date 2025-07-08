/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack(config) {
      config.module.rules.push({
        test: /\.(glsl|vert|frag)$/,
        use: 'raw-loader',
        type: 'javascript/auto',
      });
      return config;
    },
  };

export default nextConfig;
