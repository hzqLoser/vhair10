import React, { useEffect } from 'react';
import { View as TaroView, Text as TaroText, Image as TaroImage } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { LoadingSpinner } from '@/components/ui';
import { api } from '@/services/api';

// Cast Taro components to any to avoid Vue/React type conflicts
const View = TaroView as any;
const Text = TaroText as any;
const Image = TaroImage as any;

const TryOnLoading = () => {
  const router = useRouter();
  const userImage = router.params.image ? decodeURIComponent(router.params.image) : '';

  useEffect(() => {
    const run = async () => {
       try {
         // Convert image to base64 if needed or pass URL
         const resultUrl = await api.generateTryOn(userImage, "New Hairstyle");
         
         Taro.redirectTo({
           url: `/pages/tryOnResult/index?result=${encodeURIComponent(resultUrl)}&original=${encodeURIComponent(userImage)}`
         });
       } catch(e) {
         Taro.showToast({ title: '生成失败', icon: 'none' });
         setTimeout(() => Taro.navigateBack(), 1500);
       }
    };
    run();
  }, []);

  return (
    <View className="h-screen bg-black relative flex items-center justify-center">
       <Image src={userImage} className="absolute inset-0 w-full h-full opacity-30" mode="aspectFill" />
       <View className="relative z-10 bg-white/10 p-8 rounded-2xl text-center">
          <Text className="text-white text-xl font-bold mb-6 block">正在生成...</Text>
          <LoadingSpinner color="#FF3D81" size={50} />
       </View>
    </View>
  )
}
export default TryOnLoading;