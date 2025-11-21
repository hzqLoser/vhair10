import { ComponentType, PropsWithChildren } from 'react'
import {
  View as TaroView,
  Text as TaroText,
  Image as TaroImage,
  ScrollView as TaroScrollView,
  Button as TaroButton,
  Swiper as TaroSwiper,
  SwiperItem as TaroSwiperItem,
  ViewProps,
  TextProps,
  ImageProps,
  ScrollViewProps,
  ButtonProps,
  SwiperProps,
  SwiperItemProps,
} from '@tarojs/components'

/**
 * A tiny shim around commonly used Taro components.
 *
 * Taro ships React and Vue typings together, which can confuse TS when
 * components are consumed from plain TS/JSX files. By re-exporting them as
 * `ComponentType`, we avoid the need for `as any` casts at each call site and
 * keep the JSX authoring experience clean.
 */
export const View = TaroView as ComponentType<ViewProps>
export const Text = TaroText as ComponentType<TextProps>
export const Image = TaroImage as ComponentType<ImageProps>
export const ScrollView = TaroScrollView as ComponentType<ScrollViewProps>
export const Button = TaroButton as ComponentType<ButtonProps>
export const Swiper = TaroSwiper as ComponentType<SwiperProps>
export const SwiperItem = TaroSwiperItem as ComponentType<SwiperItemProps>

/**
 * Helper type for standard page wrappers that just render children.
 */
export type FCWithChildren<T = Record<string, unknown>> = ComponentType<PropsWithChildren<T>>
