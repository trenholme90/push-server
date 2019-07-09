const path = require('path');

module.exports = {
  entry: './index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist')
  },
  mode: 'development',
  module :{
    rules:[{
      // use : 'babel-loader',
      loader: 'babel-loader',
      query :{
        presets:['@babel/env']
        // ,'es2017'
      }
    }
   ]
 }
};