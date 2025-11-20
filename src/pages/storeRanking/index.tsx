
import React, { useState, useEffect } from 'react';
import { View as TaroView, Text as TaroText, Image as TaroImage } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { TopNav, ButtonPrimary } from '../../components/ui';
import { api } from '../../services/api';
import { Store } from '../../types';

const View = TaroView as any;
const Text = TaroText as any;
const Image = TaroImage as any;

const StoreRanking = () => {
  const [stores, setStores] = useState<Store[]>([]);
  
  useEffect(() => {
    api.getStores().then(setStores);
  }, []);

  const goChat = (store: Store) => {
     Taro.navigateTo({
       url: `/pages/chat/index?target=${encodeURIComponent(JSON.stringify(store))}`
    });
  };

  return (
    <View className="flex flex-col h-full bg-gray-50 min-h-screen">
       <TopNav title="本月门店榜" onBack={() => Taro.navigateBack()} />
       <View className="bg-gradient-to-b from-pink-500 to-gray-50 h-32" style={{background: 'linear-gradient(to bottom, #ec4899, #f9fafb)'}}></View>
       <View className="px-4 -mt-28 pb-10">
          <View className="mb-4">
             <Text className="text-2xl font-bold text-white block">全城热榜 TOP 10</Text>
          </View>
          {stores.map((s, index) => (
            <View key={s.id} className="bg-white rounded-2xl p-4 shadow-sm flex flex-row gap-4 relative mb-3">
               <View className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center font-bold text-white text-xs z-10 ${index === 0 ? 'bg-yellow-400' : 'bg-gray-300'}`}>
                  <Text>{index + 1}</Text>
               </View>
               <Image src={s.imageUrl} className="w-24 h-24 rounded-xl shrink-0" mode="aspectFill" />
               <View className="flex-1">
                  <Text className="font-bold text-lg text-gray-900 block">{s.name}</Text>
                  <View className="flex flex-row gap-2 mt-1">
                     <Text className="font-bold text-orange-500 text-xs">★ {s.rating}</Text>
                     <Text className="text-xs">¥{s.price}/人</Text>
                  </View>
                  <Text className="text-xs text-gray-400 mt-2 line-clamp-1 block">{s.description}</Text>
                  <View className="flex justify-end mt-2">
                     <ButtonPrimary onClick={() => goChat(s)} className="!py-1 !px-3 !text-xs !w-auto">咨询</ButtonPrimary>
                  </View>
               </View>
            </View>
          ))}
       </View>
    </View>
  );
};
export default StoreRanking;