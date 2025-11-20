import { defineConfig, type UserConfigExport } from '@tarojs/cli'
import path from 'path'

export default defineConfig(async (merge, { command, mode }) => {
  const apiKey = process.env.API_KEY || '';
  
  const baseConfig: UserConfigExport = {
    projectName: 'hairmatch-ai-taro',
    date: '2023-10-27',
    designWidth: 750,
    deviceRatio: {
      640: 2.34 / 2,
      750: 1,
      828: 1.81 / 2,
    },
    sourceRoot: 'src',
    outputRoot: 'dist',
    alias: {
      '@': path.resolve(__dirname, '..', 'src'),
    },
    plugins: [],
    defineConstants: {
      'process.env.API_KEY': JSON.stringify(apiKey)
    },
    copy: {
      patterns: [
        // Ensure the root HTML template is available to the dev server
        { from: 'index.html', to: 'dist/index.html' }
      ],
      options: {},
    },
    framework: 'react',
    compiler: 'webpack5',
    cache: {
      enable: false
    },
    mini: {
      postcss: {
        pxtransform: {
          enable: true,
          config: {},
        },
        url: {
          enable: true,
          config: {
            limit: 1024,
          },
        },
        cssModules: {
          enable: true,
          config: {
            namingPattern: 'module',
            generateScopedName: '[name]__[local]___[hash:base64:5]',
          },
        },
      },
    },
    h5: {
      // Explicitly use the project root HTML template so dev server serves the Taro app
      template: path.resolve(__dirname, '..', 'index.html'),
      publicPath: '/',
      staticDirectory: 'static',
      postcss: {
        autoprefixer: {
          enable: true,
          config: {},
        },
        cssModules: {
          enable: true,
          config: {
            namingPattern: 'module',
            generateScopedName: '[name]__[local]___[hash:base64:5]',
          },
        },
      },
    },
  }
  if (process.env.NODE_ENV === 'development') {
    return merge({}, baseConfig, { env: { NODE_ENV: '"development"' } })
  }
  return merge({}, baseConfig, { env: { NODE_ENV: '"production"' } })
})