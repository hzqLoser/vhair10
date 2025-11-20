
import React, { useState } from 'react';
import { View as TaroView, Text as TaroText, Image as TaroImage } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { TopNav, ButtonPrimary } from '../../components/ui';
import { api } from '../../services/api';
import { Store } from '../../types';

const View = TaroView as any;
const Text = TaroText as any;
const Image = TaroImage as any;

const SavedStores = () => {
  const [list, setList] = useState<Store[]>([]);

  useDidShow(() => {
    api.getSavedStores().then(setList);
  });

  const goChat = (s: Store) => Taro.navigateTo({ url: `/pages/chat/index?target=${encodeURIComponent(JSON.stringify(s))}` });

  return (
    <View className="flex flex-col h-full bg-gray-50 min-h-screen">
      <TopNav title="收藏的门店" onBack={() => Taro.navigateBack()} />
      <View className="p-4">
        {list.length === 0 ? (
           <Text className="text-center text-gray-400 mt-10 block">暂无收藏门店。</Text>
        ) : (
           list.map(s => (
            <View key={s.id} className="bg-white rounded-2xl p-3 shadow-sm flex flex-row gap-3 mb-3">
               <Image src={s.imageUrl} className="w-20 h-20 rounded-lg shrink-0" mode="aspectFill" />
               <View className="flex-1">
                  <View className="flex flex-row justify-between items-start">
                     <Text className="font-bold text-gray-900">{s.name}</Text>
                  </View>
                  <Text className="text-xs text-gray-600 block mt-1">★ {s.rating} · ¥{s.price}/人</Text>
                  <View className="flex justify-end mt-2">
                     <ButtonPrimary onClick={() => goChat(s)} className="!py-1 !px-3 !text-xs !w-auto">咨询</ButtonPrimary>
                  </View>
               </View>
            </View>
           ))
        )}
      </View>
    </View>
  );
}
export default SavedStores;