import React, { useState, useEffect } from 'react';
import { View as TaroView, Text as TaroText, Image as TaroImage, ScrollView as TaroScrollView } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { TopNav, SegmentedControl, ButtonPrimary } from '../../components/ui';
import { api } from '../../services/api';

const View = TaroView as any;
const Text = TaroText as any;
const Image = TaroImage as any;
const ScrollView = TaroScrollView as any;

const StoreSelect = () => {
  const router = useRouter();
  const data = router.params.data ? JSON.parse(decodeURIComponent(router.params.data)) : {} as any;
  const [mode, setMode] = useState('门店');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [list, setList] = useState<any[]>([]);
  
  useEffect(() => {
    const loadData = async () => {
      setSelectedId(null);
      if (mode === '门店') {
        setList(await api.getStores());
      } else {
        setList(await api.getBarbers());
      }
    };
    loadData();
  }, [mode]);

  const handleConfirm = () => {
    if (!selectedId) return;
    const target = list.find(i => i.id === selectedId);
    Taro.navigateTo({
       url: `/pages/chat/index?target=${encodeURIComponent(JSON.stringify(target))}&contrastData=${encodeURIComponent(JSON.stringify({
        originalImage: data.originalImage,
        resultImage: data.resultImage,
        hairName: data.hairName
       }))}`
    });
  };

  return (
    <View className="flex flex-col h-screen bg-gray-50">
       <TopNav title="选择门店 / 发型师" onBack={() => Taro.navigateBack()} />
       
       <View className="px-4 py-2 bg-white">
          <SegmentedControl options={['门店', '发型师']} selected={mode} onChange={setMode} />
       </View>

       <View className="px-4 py-3">
          <View className="bg-white p-3 rounded-xl flex flex-row items-center gap-3 border border-pink-100">
             <Image src={data.resultImage} className="w-10 h-10 rounded-full border border-pink-200" mode="aspectFill" />
             <View className="flex-1">
                <Text className="text-xs font-bold text-gray-800 block">已生成试戴效果</Text>
                <Text className="text-xs text-gray-500 block">选择门店或发型师来帮你落地实现</Text>
             </View>
          </View>
       </View>

       <ScrollView scrollY className="flex-1 px-4 pb-20">
          {list.map((item: any) => (
             <View 
               key={item.id} 
               onClick={() => setSelectedId(item.id)}
               className={`bg-white rounded-2xl p-4 flex flex-row items-center gap-4 shadow-sm border mb-3 ${selectedId === item.id ? 'border-pink-500 bg-pink-50' : 'border-transparent'}`}
               style={{ borderColor: selectedId === item.id ? '#FF3D81' : 'transparent' }}
             >
               <Image src={item.imageUrl} className="w-14 h-14 rounded-full" mode="aspectFill" />
               <View className="flex-1">
                  <View className="flex flex-row justify-between">
                     <Text className="font-bold text-sm text-gray-900">{item.name}</Text>
                     <Text className="text-xs text-orange-500 font-bold">★ {item.rating}</Text>
                  </View>
                  <Text className="text-xs text-gray-500 mt-1 block">{item.description}</Text>
               </View>
             </View>
          ))}
       </ScrollView>

       <View className="fixed bottom-0 w-full bg-white border-t border-gray-100 p-4 pb-8 z-20">
          <ButtonPrimary disabled={!selectedId} onClick={handleConfirm}>
             确认发送给{mode}
          </ButtonPrimary>
       </View>
    </View>
  );
};
export default StoreSelect;