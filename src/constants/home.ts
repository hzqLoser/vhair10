import { Gender } from '@/types'

export const HOME_FILTERS = {
  genders: [Gender.Male, Gender.Female],
  categories: ['全部', '长发', '短发', '卷发', '直发', '染色'],
} as const

/**
 * Mapping between Chinese UI labels and the internal category keys
 * consumed by the mock API layer.
 */
export const HOME_CATEGORY_MAP: Record<(typeof HOME_FILTERS)['categories'][number], string> = {
  全部: 'all',
  长发: 'long',
  短发: 'short',
  卷发: 'curly',
  直发: 'straight',
  染色: 'color',
}
