import React, { useMemo, useState } from 'react'
import Taro from '@tarojs/taro'
import { api } from '@/services/api'
import { Hairstyle, Gender } from '@/types'
import { HOME_CATEGORY_MAP, HOME_FILTERS } from '@/constants/home'
import { useAsyncRequest } from '@/hooks/useAsyncRequest'
import { ButtonPrimary, LoadingSpinner } from '@/components/ui'
import { Image, ScrollView, Swiper, SwiperItem, Text, View } from '@/utils/taro'

type GenderFilter = Gender | 'All'

/**
 * Feature entry for the home tab. The page is intentionally split into
 * self-contained sub-components (hero, filters, grid) so new sections can be
 * dropped in without growing one massive render function.
 */
const Home = () => {
  const [gender, setGender] = useState<GenderFilter>('All')
  const [category, setCategory] = useState<(typeof HOME_FILTERS)['categories'][number]>('全部')

  const { data: hairstyles = [], loading, error, refresh } = useAsyncRequest(
    () => api.getHairstyles(gender === 'All' ? undefined : gender, HOME_CATEGORY_MAP[category]),
    [gender, category],
  )

  const subtitle = useMemo(
    () => `${gender === 'All' ? '全部' : gender === Gender.Female ? '女性' : '男性'} · ${category === '全部' ? '所有风格' : category}`,
    [category, gender],
  )

  const goDetail = (style: Hairstyle) => {
    Taro.navigateTo({ url: `/pages/hairstyleDetail/index?data=${encodeURIComponent(JSON.stringify(style))}` })
  }

  const goTryOn = () => Taro.navigateTo({ url: '/pages/tryOnEntry/index' })

  return (
    <View className="flex flex-col min-h-screen pb-5">
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

const HERO_SLIDES = [
  {
    title: 'AI 智能匹配发型',
    cta: '立即试戴',
    gradient: 'linear-gradient(140deg, #8FD8FF 0%, #A98CFF 45%, #FF8AE6 100%)',
  },
  {
    title: '快速找到心仪新发型',
    cta: '开始体验',
    gradient: 'linear-gradient(140deg, #7AE5E7 0%, #8D9BFF 45%, #D98DFF 100%)',
  },
]

/** Hero CTA as a top-fill carousel. */
const HeroBanner: React.FC<HeroBannerProps> = ({ onTryOn, subtitle }) => (
  <View className="px-4 pt-5">
    <Swiper
      className="w-full h-72"
      indicatorDots
      circular
      autoplay
      indicatorColor="rgba(255,255,255,0.4)"
      indicatorActiveColor="#7C6FF7"
    >
      {HERO_SLIDES.map((slide, idx) => (
        <SwiperItem key={idx}>
          <View className="relative h-full rounded-3xl overflow-hidden shadow-lg" style={{ background: slide.gradient }}>
            <View
              className="absolute inset-0"
              style={{
                background:
                  'radial-gradient(120% 120% at 20% 20%, rgba(255,255,255,0.45), transparent), radial-gradient(100% 120% at 80% 0%, rgba(255,255,255,0.35), transparent)',
              }}
            />
            <View className="relative h-full flex flex-col justify-center px-6 py-8 gap-3">
              <Text className="text-white text-xl font-bold">{slide.title}</Text>
              <Text className="text-white text-sm opacity-80">{subtitle}</Text>
              <View className="w-max mt-1">
                <ButtonPrimary className="w-auto px-5 py-2" onClick={onTryOn}>
                  {slide.cta}
                </ButtonPrimary>
              </View>
            </View>
          </View>
        </SwiperItem>
      ))}
    </Swiper>
  </View>
)

const GENDER_OPTIONS: { value: GenderFilter; label: string }[] = [
  { value: Gender.Male, label: '男士' },
  { value: Gender.Female, label: '女士' },
  { value: 'All', label: '全部' },
]

interface FilterPanelProps {
  gender: GenderFilter
  category: (typeof HOME_FILTERS)['categories'][number]
  onGenderChange: (g: GenderFilter) => void
  onCategoryChange: (c: (typeof HOME_FILTERS)['categories'][number]) => void
  onRefresh: () => void
}

const FilterPanel: React.FC<FilterPanelProps> = ({ gender, category, onGenderChange, onCategoryChange, onRefresh }) => (
  <View className="px-4 mt-4">
    <View className="bg-white/90 rounded-2xl shadow-sm px-2 py-2 flex items-center gap-2">
      {GENDER_OPTIONS.map(opt => {
        const active = gender === opt.value
        return (
          <View
            key={opt.value}
            onClick={() => onGenderChange(opt.value)}
            className={`flex-1 text-center text-sm font-semibold py-2 rounded-full transition-all ${
              active
                ? 'bg-gradient-to-r from-[#d7e6ff] via-[#f2e5ff] to-[#ffe6fa] text-[#5a4fdc] shadow-md'
                : 'bg-gray-100/70 text-gray-600'
            }`}
          >
            {opt.label}
          </View>
        )
      })}
    </View>

    <ScrollView scrollX className="mt-3" showScrollbar={false}>
      <View className="flex flex-row whitespace-nowrap items-center gap-2">
        {HOME_FILTERS.categories.map(f => {
          const active = category === f
          return (
            <View
              key={f}
              onClick={() => onCategoryChange(f)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                active
                  ? 'bg-gradient-to-r from-[#7AC8FF] via-[#9F8BFF] to-[#FF7DEB] text-white border-transparent shadow-sm'
                  : 'bg-white text-gray-700 border-gray-200'
              }`}
            >
              {f}
            </View>
          )
        })}
      </View>
    </ScrollView>

    <View className="text-right text-[11px] text-gray-400 mt-2" onClick={onRefresh}>
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
