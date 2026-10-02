import { dirname } from "path";
import { fileURLToPath } from "url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  // puppeteer + ffmpeg run only on the server and must not be bundled
  devIndicators: false,
  outputFileTracingRoot: dirname(fileURLToPath(import.meta.url)),
  serverExternalPackages: ["puppeteer-core", "ffmpeg-static"],
};
export default nextConfig;
