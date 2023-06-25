module.exports = {
    baseUrl: './',
    assetsDir: 'static',
    productionSourceMap: false,
    devServer: {
        proxy: {
            '/api':{
                target:'http://129.226.12.17:8080',
                changeOrigin:true,
                // pathRewrite:{
                //     '/api':''
                // }
            }
        }
    }
}