import React, { useState, useEffect } from 'react';
import { View as TaroView, Text as TaroText, Image as TaroImage, ScrollView as TaroScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { api } from '@/services/api';
import { Hairstyle } from '@/types';
import { LoadingSpinner } from '@/components/ui';

// Cast Taro components to any to avoid Vue/React type conflicts
const View = TaroView as any;
const Text = TaroText as any;
const Image = TaroImage as any;
const ScrollView = TaroScrollView as any;

// In Taro, pages are separate files. 
// We use Taro.navigateTo instead of internal state routing.

const Home = () => {
  const [hairstyles, setHairstyles] = useState<Hairstyle[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ gender: 'Male', category: '全部' });
  
  const filterOptions = ['全部', '长发', '短发', '卷发', '直发', '染色'];
  const categoryMap: {[key: string]: string} = {
    '全部': 'all', '长发': 'long', '短发': 'short', '卷发': 'curly', '直发': 'straight', '染色': 'color'
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await api.getHairstyles(filters.gender, categoryMap[filters.category]);
        setHairstyles(data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  const goDetail = (style: Hairstyle) => {
    // Pass data via encoded URL params or event channel
    Taro.navigateTo({
      url: `/pages/hairstyleDetail/index?data=${encodeURIComponent(JSON.stringify(style))}`
    });
  };

  const goTryOn = () => {
    Taro.navigateTo({ url: '/pages/tryOnEntry/index' });
  };

  return (
    <View className="flex flex-col h-full bg-gray-100 min-h-screen pb-5">
      {/* Hero */}
      <View className="relative h-60 bg-gradient-to-br from-orange-500 to-pink-500 p-6 pt-12 rounded-b-3xl shadow-lg" style={{ background: 'linear-gradient(to bottom right, #FF8A00, #FF3D81)' }}>
        <View className="text-center mt-8">
          <Text className="text-2xl font-bold text-white block mb-1">AI 智能匹配发型</Text>
          <Text className="text-white text-sm block mb-6 opacity-80">上传自拍，一键虚拟换发</Text>
          <View 
            onClick={goTryOn}
            className="bg-white text-pink-500 px-8 py-3 rounded-full font-bold shadow-md inline-block"
            style={{ backgroundColor: 'white', color: '#FF3D81', padding: '12px 32px', borderRadius: '999px', display: 'inline-block' }}
          >
            立即试戴
          </View>
        </View>
      </View>

      {/* Filters */}
      <View className="bg-white -mt-8 mx-4 rounded-xl p-3 shadow-sm mb-4 relative z-10">
        <View className="flex mb-2 bg-gray-100 rounded p-1">
          {['Male', 'Female'].map(g => (
             <View key={g} onClick={() => setFilters({...filters, gender: g})} className={`flex-1 text-center py-1 ${filters.gender === g ? 'bg-white text-pink-500 shadow' : 'text-gray-500'}`}>
               {g}
             </View>
          ))}
        </View>
        <ScrollView scrollX className="whitespace-nowrap">
          <View className="flex flex-row">
          {filterOptions.map(f => (
            <View 
              key={f} 
              onClick={() => setFilters({...filters, category: f})}
              className={`px-3 py-1 rounded-full text-xs mr-2 inline-block ${filters.category === f ? 'bg-pink-500 text-white' : 'bg-gray-100 text-gray-600'}`}
              style={{ backgroundColor: filters.category === f ? '#FF3D81' : '#f3f4f6', color: filters.category === f ? 'white' : '#4b5563' }}
            >
              {f}
            </View>
          ))}
          </View>
        </ScrollView>
      </View>

      {/* Grid */}
      <View className="px-4">
         {loading ? <LoadingSpinner /> : (
           <View className="flex flex-wrap justify-between">
             {hairstyles.map(style => (
               <View key={style.id} onClick={() => goDetail(style)} className="bg-white rounded-xl overflow-hidden shadow-sm mb-2" style={{ width: '31%' }}>
                 <Image src={style.imageUrl} className="w-full h-24 object-cover" mode="aspectFill" style={{ width: '100%', height: '100px' }} />
                 <View className="p-2">
                    <View className="flex items-center mb-1">
                       <Text className="text-xs text-orange-400">⚡ {style.heat}</Text>
                    </View>
                    <Text className="font-bold text-xs block truncate">{style.name}</Text>
                 </View>
               </View>
             ))}
           </View>
         )}
      </View>
    </View>
  );
};

export default Home;