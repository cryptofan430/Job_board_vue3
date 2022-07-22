module.exports = {
  devServer: {
    open: true,
    host: 'localhost',
    port: 8080,
    https: true,
    hotOnly: false,
  },
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import '@/assets/styles/mixins.scss';
          @import '@/assets/styles/variables.scss';
        `,
      },
    },
  },
  publicPath: '/',
}
