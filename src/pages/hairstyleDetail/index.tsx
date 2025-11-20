import React, { useState } from 'react';
import { View as TaroView, Text as TaroText, Image as TaroImage, ScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { ButtonPrimary, TagChip, TopNav } from '../../components/ui';
import { Hairstyle } from '../../types';

const View = TaroView as any;
const Text = TaroText as any;
const Image = TaroImage as any;

const HairstyleDetail = () => {
  const router = useRouter();
  const data: Hairstyle = router.params.data ? JSON.parse(decodeURIComponent(router.params.data)) : {} as any;
  const [isCollected, setIsCollected] = useState(data.isCollected);

  const toggleCollect = () => setIsCollected(!isCollected);

  const goTryOn = () => {
    Taro.navigateTo({
      url: `/pages/tryOnEntry/index?targetHairstyle=${encodeURIComponent(JSON.stringify(data))}`
    });
  };

  return (
    <View className="flex flex-col h-full bg-white relative min-h-screen">
      {/* 顶部透明导航，这里简单处理，实际可使用自定义导航栏组件 */}
      <View className="relative h-96">
        <Image src={data.imageUrl} className="w-full h-full" mode="aspectFill" />
        <View className="absolute top-0 left-0 w-full p-4 pt-12 flex justify-between z-10">
           <View 
             className="bg-black/30 rounded-full p-2 w-8 h-8 flex items-center justify-center" 
             style={{backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '50%'}}
             onClick={() => Taro.navigateBack()}
           >
             <Text className="text-white font-bold">{'<'}</Text>
           </View>
        </View>
        <View className="absolute bottom-6 left-4">
           <View className="bg-white/90 px-3 py-1 rounded-full" style={{backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '999px'}}>
             <Text className="text-xs font-bold text-pink-500">{data.gender} · {data.category}</Text>
           </View>
        </View>
      </View>

      <View className="flex-1 bg-white -mt-6 rounded-t-3xl relative z-10 p-6 flex flex-col" style={{borderTopLeftRadius: '24px', borderTopRightRadius: '24px', marginTop: '-24px'}}>
        <View className="flex justify-between items-start mb-2">
          <Text className="text-2xl font-bold text-gray-900">{data.name}</Text>
          <View 
            onClick={toggleCollect}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full ${isCollected ? 'bg-pink-50' : 'bg-gray-100'}`}
            style={{backgroundColor: isCollected ? '#fdf2f8' : '#f3f4f6', borderRadius: '999px', padding: '6px 12px'}}
          >
            <Text className={`text-xs font-bold ${isCollected ? 'text-red-500' : 'text-gray-600'}`}>
              {isCollected ? '♥ 已收藏' : '♡ 收藏'}
            </Text>
          </View>
        </View>
        
        <View className="flex items-center gap-4 mb-4">
          <Text className="text-sm text-gray-500">⚡ 热度 {data.heat}</Text>
        </View>

        <View className="flex flex-row flex-wrap mb-6">
          {data.tags.map(t => <TagChip key={t} label={`#${t}`} />)}
        </View>

        <Text className="text-gray-600 mb-8 block leading-relaxed text-sm">{data.description}</Text>

        <View className="mt-auto pb-8">
           <Text className="text-center text-xs text-gray-400 mb-3 block">上传一张自拍，几秒钟生成试戴效果</Text>
           <ButtonPrimary onClick={goTryOn}>
             试戴这个发型
           </ButtonPrimary>
        </View>
      </View>
    </View>
  );
};

export default HairstyleDetail;