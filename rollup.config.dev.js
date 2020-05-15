import path from 'path';
import devServe from 'rollup-plugin-serve'
import sourceMaps from "rollup-plugin-sourcemaps"
import configList from './rollup.config'

const PORT = 3030;

const devConfig = configList
  .filter((_config, index) => index !== 0)
  .map((config, _index) => {
    config.output.sourcemap = true;
    config.plugins = [
      ...config.plugins,
      ...[
        devServe({
          open: true,
          openPage: '/demo/',
          port: PORT,
          contentBase: [
            path.resolve(__dirname, ''),
          ]
        })
      ],
      sourceMaps()
    ]
    return config;
  })

export default devConfig
