const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { CheckerPlugin } = require('awesome-typescript-loader')

module.exports = {
  mode: 'production',
  // devtool: 'source-map',
  entry: {
    main: [
      './src/index.ts',
      './src/style/css.ts'
    ]
  },
  output: {
    libraryTarget: 'umd',
    globalObject: 'this',
    path: path.resolve(__dirname, './build'),
    filename: 'generatoc.min.js',
    umdNamedDefine: true
  },

  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: 'awesome-typescript-loader',
        exclude: /node_modules/,
        query: {
          declaration: false,
        }
      },
      {
        test: /\.css$/,
        include: [
          path.resolve(__dirname, 'src/style'),
        ],
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('postcss-preset-env')(),
                require('cssnano')()
              ],
            },
          },
        ]
      }
    ]
  },

  plugins: [
    new MiniCssExtractPlugin({
      filename: 'generatoc.min.css'
    }),
    new CheckerPlugin()
  ],

  resolve: {
    extensions: [ '.ts', '.js', 'css' ]
  },

  optimization: {
    minimize: false
  }
}
