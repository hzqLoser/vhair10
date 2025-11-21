import React, { useState } from 'react'
import { View as TaroView, Text as TaroText, Image as TaroImage, Button as TaroButton } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { TopNav, ButtonPrimary } from '@/components/ui'

// Cast Taro components to any to avoid Vue/React type conflicts
const View = TaroView as any
const Text = TaroText as any
const Image = TaroImage as any
const Button = TaroButton as any

const TryOnEntry = () => {
  const [image, setImage] = useState<string | null>(null)

  const chooseImage = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        // tempFilePath can be used to display image
        const tempFilePaths = res.tempFilePaths
        setImage(tempFilePaths[0])

        // In real app, upload file here to get a URL or Base64
        // Taro.getFileSystemManager().readFile({ ... }) for base64
      }
    })
  }

  const startGenerate = () => {
    if (!image) return
    Taro.navigateTo({
      url: `/pages/tryOnLoading/index?image=${encodeURIComponent(image)}`,
    })
  }

  return (
    <View className="flex flex-col h-screen">
      <TopNav title="AI 智能试戴" onBack={() => Taro.navigateBack()} />

      <View className="p-4 flex flex-col items-center">
        <View
          className="w-full h-96 mb-4 flex items-center justify-center relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#d9e8ff] via-[#f2e5ff] to-[#ffe4f6] p-[2px] shadow-[0_20px_50px_rgba(124,111,247,0.15)]"
          onClick={chooseImage}
        >
          <View className="w-full h-full bg-white rounded-[26px] flex items-center justify-center overflow-hidden">
            {image ? (
              <Image src={image} mode="aspectFill" className="w-full h-full" />
            ) : (
              <View className="flex flex-col items-center gap-3">
                <View className="w-24 h-24 bg-gradient-to-br from-[#eff3ff] via-[#f7ecff] to-[#ffe8f9] rounded-full flex items-center justify-center text-4xl text-[#9F8BFF] shadow-[0_10px_30px_rgba(146,119,255,0.2)]">
                  +
                </View>
                <Text className="text-[#6b6f8f]">上传一张清晰的正脸照片</Text>
              </View>
            )}
          </View>
        </View>

        <View className="w-full mt-auto pb-10">
          <ButtonPrimary disabled={!image} onClick={startGenerate}>
            开始 AI 生成
          </ButtonPrimary>
        </View>
      </View>
    </View>
  )
}
export default TryOnEntry
