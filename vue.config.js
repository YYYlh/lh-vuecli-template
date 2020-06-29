const path = require('path');
const FilemanagerPlugin = require('filemanager-plugin').WebpackFilemanager;

function resolve(dir) {
  return path.join(__dirname, dir);
}

const name = 'mark-name';
const pakageName = path.basename(path.join(__dirname, '/'));
module.exports = {
  publicPath: './',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {},
  configureWebpack: {
    name: name,
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
    plugins: [
      new FilemanagerPlugin({
        events: {
          start: {
            del: {
              items: [path.join(__dirname, `./package/${pakageName}.zip`)]
            }
          },
          end: {
            zip: {
              items: [
                {
                  source: path.join(__dirname, './dist'),
                 destination: path.join(__dirname, `./package/${pakageName}.zip`),
                }
              ]
            }
          }
        }
      })
    ],
  },
  chainWebpack(config) {
    config.module
      .rule('vue')
      .use('vue-loader')
      .loader('vue-loader')
      .tap((options) => {
        options.compilerOptions.preserveWhitespace = true;
        return options;
      })
      .end();
  },
};
