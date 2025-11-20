import React, { useState, useEffect } from 'react';
import { View as TaroView, Text as TaroText, Image as TaroImage } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { LoadingSpinner } from '../../components/ui';
import { api } from '../../services/api';
import { User } from '../../types';
import styles from './index.module.scss';

const View = TaroView as any;
const Text = TaroText as any;
const Image = TaroImage as any;

const Profile = () => {
  const [user, setUser] = useState<User | null>(null);

  useDidShow(() => {
    api.getUserProfile().then(setUser);
  });

  const nav = (url: string) => Taro.navigateTo({ url });

  if (!user) return <LoadingSpinner color="text-gray-300" />;

  return (
    <View className={styles.page}>
      <View className="bg-white p-6 pb-8 rounded-b-3xl shadow-sm mb-4">
         <View className="flex flex-row items-center gap-4 mb-6">
            <Image src={user.avatar} className="w-16 h-16 rounded-full border-2 border-pink-100" mode="aspectFill" />
            <View className="flex-1">
               <Text className="text-xl font-bold text-gray-900 block">{user.name}</Text>
               <Text className="text-xs text-gray-400 line-clamp-1 block">{user.bio || '完善个人信息'}</Text>
            </View>
            <View onClick={() => nav('/pages/profileEdit/index')} className="p-2">
               <Text className="text-gray-400">⚙️</Text>
            </View>
         </View>
         <View className="flex flex-row gap-4">
            <View className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
               <Text className="text-lg font-bold text-gray-900 block">{user.tryOnCount}</Text>
               <Text className="text-xs text-gray-500 block">试戴次数</Text>
            </View>
            <View className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
               <Text className="text-lg font-bold text-gray-900 block">{user.aiQuota}</Text>
               <Text className="text-xs text-gray-500 block">剩余试戴次数</Text>
            </View>
         </View>
      </View>

      <View className="bg-white mx-4 rounded-2xl p-4 shadow-sm mb-4">
         <View className="flex flex-col gap-1">
            <View onClick={() => nav('/pages/history/index')} className="flex flex-row items-center justify-between p-3 active:bg-gray-50">
               <View className="flex flex-row items-center gap-3">
                  <View className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center"><Text className="text-orange-500">🖼</Text></View>
                  <Text className="text-sm text-gray-700">我的试戴</Text>
               </View>
               <Text className="text-gray-300">{'>'}</Text>
            </View>
            <View onClick={() => nav('/pages/savedHairstyles/index')} className="flex flex-row items-center justify-between p-3 active:bg-gray-50">
               <View className="flex flex-row items-center gap-3">
                  <View className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center"><Text className="text-pink-500">♥</Text></View>
                  <Text className="text-sm text-gray-700">收藏的发型</Text>
               </View>
               <Text className="text-gray-300">{'>'}</Text>
            </View>
            <View onClick={() => nav('/pages/savedStores/index')} className="flex flex-row items-center justify-between p-3 active:bg-gray-50">
               <View className="flex flex-row items-center gap-3">
                  <View className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center"><Text className="text-purple-500">📍</Text></View>
                  <Text className="text-sm text-gray-700">收藏的门店</Text>
               </View>
               <Text className="text-gray-300">{'>'}</Text>
            </View>
         </View>
      </View>
      
      <View className="bg-white mx-4 rounded-2xl p-4 shadow-sm mb-4">
         <View className="flex flex-col gap-1">
            <View onClick={() => nav('/pages/help/index')} className="flex flex-row items-center justify-between p-3 active:bg-gray-50">
               <Text className="text-sm text-gray-700">帮助与反馈</Text>
               <Text className="text-gray-300">{'>'}</Text>
            </View>
         </View>
      </View>
    </View>
  );
};

export default Profile;