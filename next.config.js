/** @type {import('next').NextConfig} */
// module.exports = {
//   reactStrictMode: true,
// };

const withPWA = require('next-pwa');
const runtimeCaching = require('next-pwa/cache');

module.exports = withPWA({
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: ['es', 'en'],
    defaultLocale: 'es'
  },
  pwa: {
    dest: 'public',
    runtimeCaching
  }
});
