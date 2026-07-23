﻿/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React strict mode for better development warnings
  reactStrictMode: true,
  
  // Optimize images for production
  images: {
    domains: ['zllhqxngartwlymcqozg.supabase.co', 'picsum.photos'],
    formats: ['image/avif', 'image/webp'],
  },
  
  // Enable gzip/brotli compression
  compress: true,
  
  // Disable x-powered-by header for security
  poweredByHeader: false,
  
  // Configure environment variables validation
  env: {
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  },
}

module.exports = nextConfig
