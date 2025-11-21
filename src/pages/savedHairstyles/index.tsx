
import React, { useState } from 'react';
import { View as TaroView, Text as TaroText, Image as TaroImage } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { TopNav, ButtonSecondary } from '../../components/ui';
import { api } from '../../services/api';
import { Hairstyle } from '../../types';
import styles from './index.module.scss';

const View = TaroView as any;
const Text = TaroText as any;
const Image = TaroImage as any;

const SavedHairstyles = () => {
  const [list, setList] = useState<Hairstyle[]>([]);

  useDidShow(() => {
    api.getSavedHairstyles().then(setList);
  });

  const handleTryOn = (style: Hairstyle) => {
    Taro.navigateTo({ url: `/pages/tryOnEntry/index?targetHairstyle=${encodeURIComponent(JSON.stringify(style))}` });
  };

  return (
    <View className={styles.page}>
       <TopNav title="收藏的发型" onBack={() => Taro.navigateBack()} />
       <View className="p-4 flex flex-wrap justify-between">
          {list.length === 0 ? (
             <Text className="w-full text-center text-gray-400 mt-10">暂无收藏。</Text>
          ) : (
            list.map(style => (
               <View key={style.id} className="bg-white rounded-xl overflow-hidden shadow-sm pb-3 mb-3" style={{width: '48%'}}>
                 <View className="relative h-48 bg-gray-200">
                   <Image src={style.imageUrl} className="w-full h-full" mode="aspectFill" />
                 </View>
                 <View className="px-3 pt-3">
                   <Text className="font-bold text-sm text-gray-900 line-clamp-1 block mb-2">{style.name}</Text>
                   <ButtonSecondary className="!py-1 !px-2 !text-xs w-full" onClick={() => handleTryOn(style)}>
                      试戴
                   </ButtonSecondary>
                 </View>
               </View>
             ))
          )}
       </View>
    </View>
  );
}
export default SavedHairstyles;