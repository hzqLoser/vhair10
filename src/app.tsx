import { PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'
import './app.scss'

/**
 * Global app shell required by Taro.
 *
 * We intentionally keep this file minimal: it only hooks into the Taro launch
 * lifecycle and renders the current page via `children`. Any cross-cutting
 * providers (state, theme, analytics) can be added here later without touching
 * individual pages.
 */
function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')
  })

  // children 是将要会渲染的页面
  return children
}

export default App
