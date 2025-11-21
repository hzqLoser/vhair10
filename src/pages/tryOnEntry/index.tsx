import React, { useState } from 'react';
import { View as TaroView, Text as TaroText, Image as TaroImage, Button as TaroButton } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { TopNav, ButtonPrimary } from '@/components/ui';

// Cast Taro components to any to avoid Vue/React type conflicts
const View = TaroView as any;
const Text = TaroText as any;
const Image = TaroImage as any;
const Button = TaroButton as any;

const TryOnEntry = () => {
  const router = useRouter();
  // In Taro, params are strings. Parse if sending object.
  // const targetHairstyle = router.params.targetHairstyle ? JSON.parse(decodeURIComponent(router.params.targetHairstyle)) : null;
  
  const [image, setImage] = useState<string | null>(null);

  const chooseImage = () => {
    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        // tempFilePath can be used to display image
        const tempFilePaths = res.tempFilePaths;
        setImage(tempFilePaths[0]);
        
        // In real app, upload file here to get a URL or Base64
        // Taro.getFileSystemManager().readFile({ ... }) for base64
      }
    })
  }

  const startGenerate = () => {
     if(!image) return;
     Taro.navigateTo({
       url: `/pages/tryOnLoading/index?image=${encodeURIComponent(image)}`
     })
  }

  return (
    <View className="flex flex-col h-screen bg-gray-50">
      <TopNav title="AI 智能试戴" onBack={() => Taro.navigateBack()} />
      
      <View className="p-4 flex flex-col items-center">
        <View className="w-full bg-white rounded-3xl h-96 mb-4 flex items-center justify-center relative overflow-hidden" onClick={chooseImage}>
           {image ? (
             <Image src={image} mode="aspectFill" className="w-full h-full" />
           ) : (
             <View className="flex flex-col items-center">
                <View className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-4xl">+</View>
                <Text>上传一张清晰的正脸照片</Text>
             </View>
           )}
        </View>

        <View className="w-full mt-auto pb-10">
           <ButtonPrimary disabled={!image} onClick={startGenerate}>开始 AI 生成</ButtonPrimary>
        </View>
      </View>
    </View>
  )
}
export default TryOnEntry;