// import { prototype } from 'events';

import { config } from 'process';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ///////
  webpack: (config)=> {
    config.external.push({
      "utf-8-validate": "commonjs utf-8-validate",
      "bufferutil": "commonjs bufferutil",
      canvas: "commonjs canvas"
    })
    return config;
  },
  ///////
    images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "liveblocks.io",
        port: "",
      },
    ],
  },
  /////
  typescript:{
    ignoreBuildErrors: true,
  }
  // /////
};

export default nextConfig;

