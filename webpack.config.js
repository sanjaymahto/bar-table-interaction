module.exports = {
  entry: './src/index.js',
  output: {
    filename: 'app.bundle.js',
  },
  module: {
    rules: [
      { test: /\.js$/, use: 'babel-loader' },
    ],
  },
};
