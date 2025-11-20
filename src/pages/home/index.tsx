import React, { useMemo, useState } from 'react'
import Taro from '@tarojs/taro'
import { api } from '@/services/api'
import { Hairstyle, Gender } from '@/types'
import { HOME_CATEGORY_MAP, HOME_FILTERS } from '@/constants/home'
import { useAsyncRequest } from '@/hooks/useAsyncRequest'
import { LoadingSpinner } from '@/components/ui'
import { Image, ScrollView, Text, View } from '@/utils/taro'
import styles from './index.module.scss'

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
    <View className={styles.homePage}>
      <HeroBanner onTryOn={goTryOn} subtitle={subtitle} />
      <FilterPanel
        gender={gender}
        category={category}
        onGenderChange={setGender}
        onCategoryChange={setCategory}
        onRefresh={refresh}
      />

      <View className={styles.gridSection}>
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
  <View className={styles.heroBanner}>
    <View className={styles.heroContent}>
      <Text className={styles.heroTitle}>AI 智能匹配发型</Text>
      <Text className={styles.heroSubtitle}>{subtitle}</Text>
      <View onClick={onTryOn} className={styles.heroButton}>
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
  <View className={styles.filterCard}>
    <View className={styles.genderTabs}>
      {HOME_FILTERS.genders.map(g => (
        <View
          key={g}
          onClick={() => onGenderChange(g)}
          className={`${styles.genderTab} ${gender === g ? styles.genderTabActive : ''}`}
        >
          {g}
        </View>
      ))}
    </View>
    <ScrollView scrollX>
      <View className={styles.categoryRow}>
        {HOME_FILTERS.categories.map(f => (
          <View
            key={f}
            onClick={() => onCategoryChange(f)}
            className={`${styles.categoryPill} ${category === f ? styles.categoryPillActive : ''}`}
          >
            {f}
          </View>
        ))}
      </View>
    </ScrollView>
    <View className={styles.refreshLink} onClick={onRefresh}>
      刷新推荐
    </View>
  </View>
)

interface HairstyleGridProps {
  hairstyles: Hairstyle[]
  onSelect: (style: Hairstyle) => void
}

const HairstyleGrid: React.FC<HairstyleGridProps> = ({ hairstyles, onSelect }) => (
  <View className={styles.gridList}>
    {hairstyles.map(style => (
      <View key={style.id} onClick={() => onSelect(style)} className={styles.card}>
        <Image src={style.imageUrl} className={styles.cardImage} mode="aspectFill" />
        <View className={styles.cardBody}>
          <View className={styles.cardHeat}>
            <Text className="text-xs text-orange-400">⚡ {style.heat}</Text>
          </View>
          <Text className={styles.cardName}>{style.name}</Text>
        </View>
      </View>
    ))}
  </View>
)

export default Home
