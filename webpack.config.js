const path = require('path')

module.exports = {
  target: 'electron-renderer',
  entry: './app/renderer/index.js',
  output: {
    path: path.join(__dirname, 'app/renderer/.dist'),
    publicPath: 'build/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.svg$/,
        loader: 'svg-react-loader'
      }
    ]
  }
}
