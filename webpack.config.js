const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  mode: 'production',
  devtool: 'source-map',
  entry: {
    main: [
      './src/index.ts',
      './src/style/css.ts'
    ]
  },
  output: {
    path: path.resolve(__dirname, './build'),
    filename: 'generatoc.min.js'
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
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
  ],

  resolve: {
    extensions: [ '.ts', '.js', 'css' ]
  },

  optimization: {
    minimize: false
  }
}
