import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // tesseract.js requires its worker script and core at runtime, which Next's
  // build-time tracing cannot detect. Force them into the serverless bundle for
  // the routes that run OCR.
  outputFileTracingIncludes: {
    "/api/analyze": [
      "./node_modules/tesseract.js/src/worker-script/**/*",
      "./node_modules/tesseract.js-core/**/*",
    ],
    "/api/compare": [
      "./node_modules/tesseract.js/src/worker-script/**/*",
      "./node_modules/tesseract.js-core/**/*",
    ],
  },
};

export default nextConfig;
