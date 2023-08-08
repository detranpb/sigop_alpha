const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    proxy: {
      '/detran-webservice': {
        target: 'http://10.255.243.162:80/', // Replace with the API URL
        ws: true,
        changeOrigin: true
      }
    }
  }
})
