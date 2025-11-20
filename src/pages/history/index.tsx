import React, { useState } from 'react';
import { View as TaroView, Text as TaroText, Image as TaroImage, Button as TaroButton } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { TopNav, ButtonGhost } from '../../components/ui';
import { api } from '../../services/api';
import { TryOnHistoryItem } from '../../types';

const View = TaroView as any;
const Text = TaroText as any;
const Image = TaroImage as any;
const Button = TaroButton as any;

const HistoryPage = () => {
  const [history, setHistory] = useState<TryOnHistoryItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<TryOnHistoryItem | null>(null);

  useDidShow(() => {
    api.getTryOnHistory().then(setHistory);
  });

  const handleDelete = async (id: string) => {
    await api.deleteHistoryItem(id);
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  return (
    <View className="flex flex-col h-full bg-gray-50 min-h-screen">
      <TopNav title="我的试戴" onBack={() => Taro.navigateBack()} />
      <View className="p-4 flex flex-wrap justify-between">
        {history.length === 0 ? (
          <Text className="w-full text-center text-gray-400 mt-10">暂无历史记录。</Text>
        ) : (
           history.map(item => (
             <View key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm pb-2 mb-3" style={{width: '48%'}}>
               <View className="relative h-48 bg-gray-100">
                  <Image src={item.imageUrl} className="w-full h-full" mode="aspectFill" />
               </View>
               <View className="px-2 pt-2">
                  <Text className="font-bold text-xs text-gray-800 mb-1 block truncate">{item.hairstyleName}</Text>
                  <View className="flex flex-row justify-between items-center mt-2">
                     <View onClick={() => setSelectedItem(item)} className="bg-gray-50 px-2 py-1 rounded"><Text className="text-xs">查看详情</Text></View>
                     <View onClick={() => handleDelete(item.id)} className="p-1"><Text className="text-red-500 text-xs">删除</Text></View>
                  </View>
               </View>
             </View>
           ))
        )}
      </View>

      {/* Modal Simulation */}
      {selectedItem && (
        <View className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-6" style={{backgroundColor: 'rgba(0,0,0,0.6)'}}>
           <View className="bg-white w-full rounded-3xl overflow-hidden p-4">
              <View className="flex flex-row justify-between items-center mb-4">
                 <Text className="font-bold">{selectedItem.hairstyleName}</Text>
                 <View onClick={() => setSelectedItem(null)}><Text>X</Text></View>
              </View>
              <View className="flex flex-row gap-2 mb-4">
                 <Image src={selectedItem.originalImageUrl || ''} className="flex-1 h-40 bg-gray-200 rounded" mode="aspectFill" />
                 <Image src={selectedItem.imageUrl} className="flex-1 h-40 bg-gray-200 rounded" mode="aspectFill" />
              </View>
              <Button onClick={() => setSelectedItem(null)}>关闭</Button>
           </View>
        </View>
      )}
    </View>
  );
}
export default HistoryPage;