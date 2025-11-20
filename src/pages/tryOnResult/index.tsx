import React, { useEffect } from 'react';
import { View as TaroView, Text as TaroText, Image as TaroImage } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { TopNav, ButtonPrimary, ButtonGhost } from '../../components/ui';
import { api } from '../../services/api';

const View = TaroView as any;
const Text = TaroText as any;
const Image = TaroImage as any;

const TryOnResult = () => {
  const router = useRouter();
  const original = router.params.original ? decodeURIComponent(router.params.original) : '';
  const result = router.params.result ? decodeURIComponent(router.params.result) : '';
  // Optional hairstyle info if passed
  const targetHairstyle = router.params.targetHairstyle ? JSON.parse(decodeURIComponent(router.params.targetHairstyle)) : null;

  const handleSave = async () => {
    try {
      await api.saveToHistory({
        id: Date.now().toString(),
        date: new Date().toLocaleDateString(),
        hairstyleName: targetHairstyle?.name || 'AI 智能推荐',
        imageUrl: result,
        originalImageUrl: original
      });
      Taro.showToast({ title: '已保存到历史', icon: 'success' });
      
      // In Mini Program, use Taro.saveImageToPhotosAlbum
      // Taro.downloadFile({ url: result, success: (res) => Taro.saveImageToPhotosAlbum({ filePath: res.tempFilePath }) })
    } catch (e) {
      Taro.showToast({ title: '保存失败', icon: 'none' });
    }
  };

  const handleShare = () => {
    Taro.showShareMenu({}); // Only works in Mini Program context usually
    Taro.showToast({ title: '请使用右上角分享功能', icon: 'none' });
  };

  const handleRegenerate = () => {
    Taro.navigateBack();
  };

  const goConsult = () => {
    Taro.navigateTo({
      url: `/pages/storeSelect/index?data=${encodeURIComponent(JSON.stringify({
        originalImage: original,
        resultImage: result,
        hairName: targetHairstyle?.name || '新发型'
      }))}`
    });
  };

  return (
    <View className="flex flex-col h-full bg-gray-50 min-h-screen">
      <TopNav title="试戴结果" onBack={() => Taro.navigateBack()} />
      
      <View className="flex-1 p-4">
        <View className="bg-white rounded-3xl overflow-hidden shadow-sm relative mb-4">
           <Image src={result} className="w-full h-96 object-cover" mode="aspectFill" />
           {targetHairstyle && (
              <View className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full flex flex-row items-center gap-2" style={{backgroundColor: 'rgba(255,255,255,0.9)', borderRadius: '999px'}}>
                <Text className="text-xs font-bold text-gray-800">{targetHairstyle.name}</Text>
              </View>
           )}
        </View>

        <View className="bg-white rounded-xl p-4 text-center mb-6">
           <Text className="font-bold text-gray-800 mb-1 block text-sm">本次试戴：{targetHairstyle ? targetHairstyle.name : 'AI 智能推荐'}</Text>
           <Text className="text-xs text-gray-500 block">当前发型效果</Text>
        </View>

        <View className="flex flex-row justify-around mb-6">
           <ButtonGhost onClick={handleRegenerate} className="flex-1 mr-2">
             <Text>↺ 重新生成</Text>
           </ButtonGhost>
           <ButtonGhost onClick={handleSave} className="flex-1 ml-2">
             <Text>♥ 保存</Text>
           </ButtonGhost>
        </View>
        
        <ButtonPrimary onClick={goConsult} className="mb-2">
          一键咨询门店 / 发型师
        </ButtonPrimary>
        <Text className="text-center text-xs text-gray-400 pb-6 block mt-2">可以跟 Tony 老师确认是否可以完成效果哦</Text>
      </View>
    </View>
  );
};

export default TryOnResult;