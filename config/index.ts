import { defineConfig, type UserConfigExport } from '@tarojs/cli'
import path from 'path'
import { UnifiedWebpackPluginV5 } from 'weapp-tailwindcss-webpack-plugin'

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
        tailwindcss: {
          enable: true,
        },
        autoprefixer: {
          enable: true,
          config: {},
        },
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
      },
      webpackChain(chain) {
        chain.plugin('weapp-tailwindcss-webpack-plugin').use(UnifiedWebpackPluginV5, [
          {
            appType: 'taro',
          },
        ])
      },
    },
    h5: {
      // Explicitly use the project root HTML template so dev server serves the Taro app
      template: path.resolve(__dirname, '..', 'index.html'),
      publicPath: '/',
      staticDirectory: 'static',
      postcss: {
        tailwindcss: {
          enable: true,
        },
        autoprefixer: {
          enable: true,
          config: {},
        },
      },
      webpackChain(chain) {
        chain.plugin('weapp-tailwindcss-webpack-plugin').use(UnifiedWebpackPluginV5, [
          {
            appType: 'taro',
            disableWeappCheck: true,
          },
        ])
      },
    },
  }
  if (process.env.NODE_ENV === 'development') {
    return merge({}, baseConfig, { env: { NODE_ENV: '"development"' } })
  }
  return merge({}, baseConfig, { env: { NODE_ENV: '"production"' } })
})