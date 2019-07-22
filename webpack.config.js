const path = require('path');

module.exports = {
  entry: './subscribe/subscribe.js',
  output: {
    filename: 'subscribe.js',
    path: path.resolve(__dirname, 'subscribe/dist')
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