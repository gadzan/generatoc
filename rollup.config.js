import path from 'path';
// import typescript from '@rollup/plugin-typescript';
import typescript from 'rollup-plugin-typescript2';
import babel from '@rollup/plugin-babel'
import postcss from 'rollup-plugin-postcss';
import { terser } from "rollup-plugin-terser";

const babelOptions = {
  presets: ['@babel/preset-env'],
}

export default [
  {
    input: [
      path.resolve(__dirname, 'src', 'index.ts'),
    ],
    output: [
      {
        file: path.resolve(__dirname, 'dist','index.js'),
        format: 'esm',
      },
    ],
    plugins: [
      typescript({
        typescript: require('typescript'),
        tsconfigOverride: {
          include: [
            path.resolve(__dirname, 'src', 'index.ts') 
          ],
        }
      }),
      babel(babelOptions)
    ]
  },
  {
    input: {
      'generatoc.min': path.resolve(__dirname, 'src','build.ts'),
    },
    output: [
      {
        dir: 'build',
        // file: path.resolve(__dirname, 'build','generatoc.min.js'),
        format: 'iife',
        name: 'generatoc',
        plugins: [ terser() ]
      }
    ],
    plugins: [
      typescript({
        typescript: require('typescript'),
        tsconfigOverride: { compilerOptions: { declaration: false } }
      }),
      postcss({
        extract: true,
        minimize: true,
      }),
      babel(babelOptions),
      // terser()
    ]
  }
]

