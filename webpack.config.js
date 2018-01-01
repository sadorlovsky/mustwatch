const path = require('path')

module.exports = {
  target: 'electron',
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
      }
    ]
  }
}
