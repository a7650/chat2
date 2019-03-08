const path = require('path');

function resolve (dir) {
  console.log(__dirname)
  return path.join(__dirname, dir)
}
module.exports = {
    lintOnSave: false,
    //基本路径
    publicPath: './',
    //输出文件目录
    outputDir: './node/dist',
    //放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录。
    assetsDir: './',
    //以多页模式构建应用程序。
    pages: undefined,
    //是否使用包含运行时编译器的 Vue 构建版本
    runtimeCompiler: false,
    //是否为 Babel 或 TypeScript 使用 thread-loader。该选项在系统的 CPU 有多于一个内核时自动启用，仅作用于生产构建，在适当的时候开启几个子进程去并发的执行压缩
    parallel: require('os').cpus().length > 1,
    //生产环境是否生成 sourceMap 文件
    productionSourceMap: false,

    devServer:{
      host: "0.0.0.0",
      port: 9000, // 端口号
      https: false, // https:{type:Boolean}
      hotOnly: true, // 热更新
    },
    configureWebpack:{
        resolve: {
          alias: {
            'src':resolve('src'),
            'components':resolve('src/components'),
            'base':resolve('src/base')
          }
        }
      }
}
