const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  publicPath: process.env.NODE_ENV === 'production'
  ? 'http://paivaservices.com/detran-sigop/'
  : '/',
  devServer:    {
    proxy: {
        '/detran-webservice':   {
            target: 'https://10.255.243.162:80/', // Replace with the API URL
            ws: true,
            changeOrigin: true
        }
    }
  }
})
 
