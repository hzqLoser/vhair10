import React, { useMemo, useState } from 'react'
import Taro from '@tarojs/taro'
import { api } from '@/services/api'
import { Hairstyle, Gender } from '@/types'
import { HOME_CATEGORY_MAP, HOME_FILTERS } from '@/constants/home'
import { useAsyncRequest } from '@/hooks/useAsyncRequest'
import { LoadingSpinner } from '@/components/ui'
import { Image, ScrollView, Text, View } from '@/utils/taro'

/**
 * Feature entry for the home tab. The page is intentionally split into
 * self-contained sub-components (hero, filters, grid) so new sections can be
 * dropped in without growing one massive render function.
 */
const Home = () => {
  const [gender, setGender] = useState<Gender>(Gender.Male)
  const [category, setCategory] = useState<(typeof HOME_FILTERS)['categories'][number]>('全部')

  const { data: hairstyles = [], loading, error, refresh } = useAsyncRequest(
    () => api.getHairstyles(gender, HOME_CATEGORY_MAP[category]),
    [gender, category],
  )

  const subtitle = useMemo(
    () => `${gender === Gender.Female ? '女性' : '男性'} · ${category === '全部' ? '所有风格' : category}`,
    [category, gender],
  )

  const goDetail = (style: Hairstyle) => {
    Taro.navigateTo({ url: `/pages/hairstyleDetail/index?data=${encodeURIComponent(JSON.stringify(style))}` })
  }

  const goTryOn = () => Taro.navigateTo({ url: '/pages/tryOnEntry/index' })

  return (
    <View className="flex flex-col min-h-screen bg-gray-100 pb-5">
      <HeroBanner onTryOn={goTryOn} subtitle={subtitle} />
      <FilterPanel
        gender={gender}
        category={category}
        onGenderChange={setGender}
        onCategoryChange={setCategory}
        onRefresh={refresh}
      />

      <View className="px-4">
        {loading && (
          <View className="py-10">
            <LoadingSpinner />
          </View>
        )}

        {!loading && error && (
          <View className="text-center text-sm text-red-500 bg-red-50 py-3 rounded-lg">
            加载失败，请稍后重试
          </View>
        )}

        {!loading && !error && <HairstyleGrid hairstyles={hairstyles} onSelect={goDetail} />}
      </View>
    </View>
  )
}

interface HeroBannerProps {
  subtitle: string
  onTryOn: () => void
}

/** Hero CTA that introduces the try-on capability. */
const HeroBanner: React.FC<HeroBannerProps> = ({ onTryOn, subtitle }) => (
  <View
    className="relative h-60 p-6 pt-12 rounded-b-3xl shadow-lg"
    style={{ background: 'linear-gradient(to bottom right, #ff8a00, #ff3d81)' }}
  >
    <View className="text-center mt-8">
      <Text className="text-2xl font-bold text-white block mb-1">AI 智能匹配发型</Text>
      <Text className="text-white text-sm block mb-6 opacity-80">{subtitle}</Text>
      <View onClick={onTryOn} className="inline-block bg-white text-pink-500 px-8 py-3 rounded-full font-bold shadow-md" style={{ color: '#ff3d81' }}>
        立即试戴
      </View>
    </View>
  </View>
)

interface FilterPanelProps {
  gender: Gender
  category: (typeof HOME_FILTERS)['categories'][number]
  onGenderChange: (g: Gender) => void
  onCategoryChange: (c: (typeof HOME_FILTERS)['categories'][number]) => void
  onRefresh: () => void
}

const FilterPanel: React.FC<FilterPanelProps> = ({ gender, category, onGenderChange, onCategoryChange, onRefresh }) => (
  <View className="bg-white -mt-8 mx-4 rounded-xl p-3 shadow-sm mb-4 relative z-10">
    <View className="flex mb-2 bg-gray-100 rounded p-1">
      {HOME_FILTERS.genders.map(g => (
        <View
          key={g}
          onClick={() => onGenderChange(g)}
          className={`flex-1 text-center py-1 text-gray-500 ${gender === g ? 'bg-white text-pink-500 shadow' : ''}`}
        >
          {g}
        </View>
      ))}
    </View>
    <ScrollView scrollX>
      <View className="flex flex-row whitespace-nowrap">
        {HOME_FILTERS.categories.map(f => (
          <View
            key={f}
            onClick={() => onCategoryChange(f)}
            className={`px-3 py-1 rounded-full text-xs mr-2 inline-block bg-gray-100 text-gray-600 ${category === f ? 'bg-pink-500 text-white' : ''
              }`}
          >
            {f}
          </View>
        ))}
      </View>
    </ScrollView>
    <View className="text-right text-xs text-gray-400 mt-1" onClick={onRefresh}>
      刷新推荐
    </View>
  </View>
)

interface HairstyleGridProps {
  hairstyles: Hairstyle[]
  onSelect: (style: Hairstyle) => void
}

const HairstyleGrid: React.FC<HairstyleGridProps> = ({ hairstyles, onSelect }) => (
  <View className="grid grid-cols-3 gap-2 pt-2">
    {hairstyles.map(style => (
      <View key={style.id} onClick={() => onSelect(style)} className="bg-white rounded-xl overflow-hidden shadow-sm">
        <Image src={style.imageUrl} className="w-full h-32 object-cover" mode="aspectFill" />
        <View className="px-2 py-0.5 h-6 flex items-center justify-center text-center">
          <Text className="block font-semibold text-xs leading-4 truncate text-center">
            {style.name}
          </Text>
        </View>
      </View>
    ))}
  </View>
)

export default Home
