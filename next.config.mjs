// import { prototype } from 'events';

import { config } from 'process';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ///////
  webpack: function (config) {
    config.externals = config.externals || {};
    config.externals["utf-8-validate"] = "commonjs utf-8-validate";
    config.externals["bufferutil"] = "commonjs bufferutil";
    config.externals["canvas"] = "commonjs canvas";

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

