const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/api1': {													// 匹配所有以 '/api1'开头的请求路径
        target: 'http://localhost:8080',	// 代理目标的基础路径
        pathRewrite: { '^/api1': '' },				// 代理往后端服务器的请求去掉 /api1 前缀
        ws: true,													// WebSocket
        changeOrigin: true,
      },
    },
  }
})