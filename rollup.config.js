import typescript from '@rollup/plugin-typescript';
// import pkg from './package.json';
// import {terser} from "rollup-plugin-terser";

export default {
  input: 'src/index.ts',
  output: [
    {
      file: './build/commonjs.js',
      format: 'cjs'
    },
    {
      file: './build/es.js',
      format: 'es'
    },
    {
      file: './build/browser.js',
      format: 'iife',
      name: 'generatoc'
    }
  ],
  plugins: [
    typescript(),
    // terser()
  ]
}