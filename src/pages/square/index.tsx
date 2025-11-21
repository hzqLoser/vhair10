import React, { useState, useEffect } from 'react';
import { View as TaroView, Text as TaroText, Image as TaroImage, ScrollView as TaroScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { SegmentedControl, ButtonPrimary, TagChip, LoadingSpinner } from '../../components/ui';
import { api } from '../../services/api';
import { Topic, UserShow, Store } from '../../types';

const View = TaroView as any;
const Text = TaroText as any;
const Image = TaroImage as any;
const ScrollView = TaroScrollView as any;

const Square = () => {
  const [activeTab, setActiveTab] = useState('话题');
  const [loading, setLoading] = useState(false);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [shows, setShows] = useState<UserShow[]>([]);
  const [stores, setStores] = useState<Store[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === '话题') {
           setTopics(await api.getTopics());
        } else if (activeTab === '发友秀') {
           setShows(await api.getUserShows());
        } else {
           setStores(await api.getStores());
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  const goChat = (store: Store) => {
    Taro.navigateTo({
      url: `/pages/chat/index?target=${encodeURIComponent(JSON.stringify(store))}`
    });
  };

  const goStoreRanking = () => {
    Taro.navigateTo({ url: '/pages/storeRanking/index' });
  };

  const goTryOnSame = (show: UserShow) => {
     const target = { 
        name: show.referenceHairstyleName, 
        imageUrl: show.referenceHairstyleUrl,
        description: show.referenceHairstyleName 
     };
     Taro.navigateTo({
        url: `/pages/tryOnEntry/index?targetHairstyle=${encodeURIComponent(JSON.stringify(target))}`
     });
  };

  const toggleStoreSave = async (id: string) => {
    await api.toggleStoreSave(id);
    setStores(prev => prev.map(s => s.id === id ? { ...s, isSaved: !s.isSaved } : s));
  };

  return (
    <View className="flex flex-col min-h-screen bg-gray-50">
      <View className="h-11 flex flex-row items-center justify-between px-4 bg-white sticky top-0 z-20">
         <Text className="text-sm font-bold text-gray-800">杭州 ▾</Text>
         <Text className="text-lg font-bold">广场</Text>
         <View className="w-6"></View>
      </View>
      
      <View className="px-12 py-2 bg-white mb-2">
        <SegmentedControl options={['话题', '发友秀', '门店精选']} selected={activeTab} onChange={setActiveTab} />
      </View>

      <ScrollView scrollY className="flex-1 px-4 pb-24">
        {loading && <LoadingSpinner />}
        {!loading && activeTab === '话题' && (
           <View>
             <View className="bg-orange-100 p-4 rounded-xl flex flex-row items-center gap-4 mb-4" style={{backgroundColor: '#ffedd5', borderRadius: '16px'}}>
                <Image src="https://picsum.photos/seed/banner/200/200" className="w-16 h-16 rounded-xl shrink-0" mode="aspectFill" />
                <View>
                   <Text className="font-bold text-gray-900 block text-base">王大妈的理发岁月</Text>
                   <Text className="text-xs text-gray-600 block">轮播图，展示理发、时尚的精选故事</Text>
                </View>
             </View>
             {topics.map(t => (
               <View key={t.id} className="bg-white p-4 rounded-xl shadow-sm flex flex-row items-center gap-3 mb-3">
                  <View className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold shrink-0">
                     <Text>#</Text>
                  </View>
                  <View>
                    <Text className="font-bold text-gray-800 text-sm block">{t.title}</Text>
                    <Text className="text-xs text-gray-400 block">{t.participants} 参与</Text>
                  </View>
               </View>
             ))}
             {/* Floating Add Button */}
             <View className="fixed bottom-24 right-6 bg-pink-500 text-white w-12 h-12 rounded-full flex items-center justify-center shadow-lg z-50" style={{backgroundColor: '#FF3D81', borderRadius: '50%'}}>
               <Text className="text-2xl">+</Text>
             </View>
           </View>
        )}

        {!loading && activeTab === '发友秀' && (
           <View>
             <Text className="text-center text-xs text-gray-400 mb-2 block">看看大家的真实发型效果</Text>
             {shows.map(u => (
               <View key={u.id} className="bg-white rounded-2xl p-4 shadow-sm mb-4">
                  <View className="flex flex-row items-center gap-2 mb-3">
                     <Image src={u.userAvatar} className="w-8 h-8 rounded-full" />
                     <Text className="text-sm font-bold">{u.userName}</Text>
                  </View>
                  <View className="flex flex-row gap-2 mb-3">
                     <View className="flex-1 relative aspect-square bg-gray-100">
                       <Image src={u.beforeImage} className="w-full h-32 object-cover rounded" mode="aspectFill" />
                       <View className="absolute bottom-0 left-0 bg-black/50 text-white text-xs px-1">AI</View>
                     </View>
                     <View className="flex-1 relative aspect-square bg-gray-100">
                       <Image src={u.afterImage} className="w-full h-32 object-cover rounded" mode="aspectFill" />
                       <View className="absolute bottom-0 left-0 bg-pink-500 text-white text-xs px-1">实际</View>
                     </View>
                  </View>
                  <View className="flex flex-row justify-between items-center pt-3 border-t border-gray-100">
                     <Text className="text-xs text-gray-400">♥ {u.likes}</Text>
                     <View className="flex flex-row items-center gap-2 bg-gray-50 p-1 rounded pr-2" onClick={() => goTryOnSame(u)}>
                         <Image src={u.referenceHairstyleUrl} className="w-8 h-8 rounded" mode="aspectFill" />
                         <Text className="text-xs font-bold text-pink-500">试戴同款</Text>
                     </View>
                  </View>
               </View>
             ))}
           </View>
        )}

        {!loading && activeTab === '门店精选' && (
           <View>
              <View onClick={goStoreRanking} className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 rounded-2xl mb-4 relative overflow-hidden" style={{background: 'linear-gradient(to right, #a855f7, #ec4899)'}}>
                 <Text className="font-bold text-xl text-white block">本月门店人气榜</Text>
                 <Text className="text-sm text-white opacity-90 block">发现全城最热 TOP 10 沙龙</Text>
                 <View className="mt-4 bg-white/20 inline-block px-3 py-1 rounded-full"><Text className="text-xs font-bold text-white">查看榜单 {'>'}</Text></View>
              </View>

              {stores.map(s => (
                <View key={s.id} className="bg-white rounded-2xl p-3 shadow-sm flex flex-row gap-3 mb-3">
                   <Image src={s.imageUrl} className="w-20 h-20 rounded-lg shrink-0" mode="aspectFill" />
                   <View className="flex-1">
                      <View className="flex flex-row justify-between items-start">
                         <Text className="font-bold text-gray-900 truncate text-sm" style={{maxWidth: '150px'}}>{s.name}</Text>
                         {s.isBookable && <Text className="text-xs bg-green-100 text-green-700 px-1 rounded">可预约</Text>}
                      </View>
                      <View className="flex flex-row gap-2 mt-1">
                         <Text className="text-xs font-bold text-orange-500">★ {s.rating}</Text>
                         <Text className="text-xs text-gray-600">¥{s.price}/人</Text>
                      </View>
                      <Text className="text-xs text-gray-400 mt-1 line-clamp-1">{s.description}</Text>
                      <View className="flex flex-row justify-end items-center mt-2 gap-2">
                         <View onClick={() => toggleStoreSave(s.id)} className={`px-2 py-1 rounded ${s.isSaved ? 'bg-red-50' : 'bg-gray-100'}`}>
                            <Text className={`text-xs ${s.isSaved ? 'text-red-500' : 'text-gray-500'}`}>{s.isSaved ? '已收藏' : '收藏'}</Text>
                         </View>
                         <ButtonPrimary onClick={() => goChat(s)} className="!py-1 !px-3 text-xs !w-auto">咨询</ButtonPrimary>
                      </View>
                   </View>
                </View>
              ))}
           </View>
        )}
      </ScrollView>
    </View>
  );
};

export default Square;