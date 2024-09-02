
export default {
    reactStrictMode: true,
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'image.tmdb.org',
          pathname: '/t/p/**',
        },
      ],
    },
  };
  