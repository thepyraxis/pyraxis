import type { NextConfig } from "next";
import path from "path";
import bundleAnalyzer from "@next/bundle-analyzer";

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Pin the workspace root to this project directory. Next.js was inferring
  // C:\Users\amand as the root because a stray package-lock.json sits there
  // (outside this repo), which produced the "multiple lockfiles" warning.
  outputFileTracingRoot: path.join(__dirname),
  // next/image blocks SVGs by default (SVG can carry <script>). The wordmark
  // asset is a trusted, checked-in local file — not user-supplied — so it's
  // safe to allow. Without this, /pyraxis-wordmark.svg 400s through the
  // image optimizer.
  images: {
    dangerouslyAllowSVG: true,
    contentDispositionType: "attachment",
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
};

export default withBundleAnalyzer(nextConfig);
