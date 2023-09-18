const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  devtool: 'inline-source-map',
  entry: {
    battleship:'./battleship.js', 
    initialize:'./initialize-game.js',

  }, // replace with the path to your main JS file
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'battleship.html', // This will be the output file name
      template: './battleship.html', 
      chunks: ['battleship']
    }),
    new HtmlWebpackPlugin({
      filename: 'initializeGame.html', // This will be the output file name
      template: './initializeGame.html', // Source HTML file for your initialize game
      chunks: ['initializeGame']
    })
],
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
        },
    ]
  }
};