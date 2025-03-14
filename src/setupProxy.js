// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  // Proxy requests to Supabase API
  app.use(
    '/supabase-api',
    createProxyMiddleware({
      target: 'https://imykwqkjiphztfyolsmn.supabase.co',
      changeOrigin: true,
      pathRewrite: {
        '^/supabase-api': ''
      }
    })
  );
};