/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['media.giphy.com', 'i.giphy.com'],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "imgs.search.brave.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn4.iconfinder.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "jzhgfowuznosxtwzkbkx.supabase.co",
        pathname: "/**",
      }
    ],
  },
};

export default nextConfig;
