/** @type {import('next').NextConfig} */
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const nextConfig = {
  // This repo contains multiple lockfiles (client/admin/server). Setting this avoids
  // Next.js incorrectly inferring the workspace root and breaking output tracing.
  outputFileTracingRoot: __dirname,
  images: {
    remotePatterns: [
      {
        hostname: "res.cloudinary.com",
      },
    ],
  },
};

export default nextConfig;
