import { dirname } from 'path';
import { fileURLToPath } from 'url';

/** @type {import('next').NextConfig} */
const nextConfig = {
    // A lockfile in the home directory makes Next pick it as the workspace root.
    outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),
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
