import React from 'react'
import { Button, Text, View } from '@/utils/taro'

/**
 * Small set of opinionated UI helpers shared across the app. They deliberately
 * avoid heavy styling logic so pages can still compose Tailwind utility classes
 * freely while keeping consistent base colours and spacing.
 */
export const ButtonPrimary: React.FC<{ children: React.ReactNode; onClick?: any; className?: string; disabled?: boolean }> = ({
  children,
  onClick,
  className = '',
  disabled,
}) => (
  <Button
    onClick={onClick}
    disabled={disabled}
    className={`text-white font-semibold py-3 px-6 rounded-full shadow-lg w-full flex justify-center items-center transition-all ${
      disabled ? 'opacity-50' : 'shadow-[0_10px_30px_rgba(124,111,247,0.4)]'
    } ${className}`}
    style={{
      background: 'linear-gradient(130deg, #7AC8FF 0%, #9F8BFF 55%, #FF7DEB 100%)',
      color: 'white',
      borderRadius: '999px',
      border: 'none',
      boxShadow: disabled ? 'none' : '0 15px 40px rgba(125, 108, 247, 0.35)',
      filter: disabled ? undefined : 'drop-shadow(0 0 18px rgba(146,119,255,0.45))',
    }}
  >
    {children}
  </Button>
)

export const ButtonSecondary: React.FC<{ children: React.ReactNode; onClick?: any; className?: string }> = ({ children, onClick, className = '' }) => (
  <Button
    onClick={onClick}
    className={`bg-white border border-[#9F8BFF] text-[#7C6FF7] font-medium py-2 px-4 rounded-full ${className}`}
    style={{ background: 'white', border: '1px solid #9F8BFF', color: '#7C6FF7', borderRadius: '999px' }}
  >
    {children}
  </Button>
)

export const ButtonGhost: React.FC<{ children: React.ReactNode; onClick?: any; className?: string }> = ({ children, onClick, className = '' }) => (
  <Button
    onClick={onClick}
    className={`bg-[#f3f5ff] text-[#5b6b95] font-medium py-2 px-4 rounded-full ${className}`}
    style={{ background: '#f3f5ff', color: '#5b6b95', borderRadius: '999px', border: 'none' }}
  >
    {children}
  </Button>
)

export const LoadingSpinner: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = '#7C6FF7' }) => (
  <View className="flex items-center justify-center">
    <View
      style={{ width: size, height: size, borderRadius: '50%', border: `4px solid #f3f3f3`, borderTop: `4px solid ${color}` }}
      className="animate-spin"
    ></View>
  </View>
)

export const TagChip: React.FC<{ label: string; color?: string }> = ({ label, color = 'bg-pink-50 text-pink-600' }) => (
  <View
    className={`px-2 py-0.5 rounded-md text-xs font-medium mr-1.5 mb-1 inline-block ${color}`}
    style={{ backgroundColor: '#eef2ff', color: '#6b7bd8', padding: '2px 6px', borderRadius: '4px', display: 'inline-block' }}
  >
    <Text>{label}</Text>
  </View>
)

export const SegmentedControl: React.FC<{ options: string[]; selected: string; onChange: (val: string) => void }> = ({ options, selected, onChange }) => (
  <View className="bg-gray-100 p-1 rounded-lg flex flex-row relative" style={{ backgroundColor: '#f3f4f6', padding: '4px', borderRadius: '8px' }}>
    {options.map(opt => {
      const isSelected = selected === opt
      return (
        <View
          key={opt}
          onClick={() => onChange(opt)}
          className={`flex-1 py-1.5 text-sm font-medium rounded-md text-center transition-all relative z-10 ${
            isSelected ? 'bg-white shadow-sm text-pink-500' : 'text-gray-500'
          }`}
          style={{
            flex: 1,
            padding: '6px 0',
            textAlign: 'center',
            borderRadius: '6px',
            backgroundColor: isSelected ? 'white' : 'transparent',
            color: isSelected ? '#FF3D81' : '#6b7280',
            boxShadow: isSelected ? '0 1px 2px 0 rgba(0, 0, 0, 0.05)' : 'none',
          }}
        >
          <Text>{opt}</Text>
        </View>
      )
    })}
  </View>
)

/**
 * Simple top navigation bar for H5 builds. Taro can render native bars on mini
 * apps, but in the browser we need our own header. Pass `onBack` to show a
 * clickable back affordance.
 */
export const TopNav: React.FC<{ title?: string; onBack?: () => void }> = ({ title, onBack }) => (
  <View className="h-11 flex flex-row items-center justify-between px-4 bg-white/80 backdrop-blur sticky top-0 z-20 border-b border-gray-100">
    <View className="w-10" onClick={onBack}>
      {onBack && <Text className="text-lg text-gray-700">{'<'}</Text>}
    </View>
    <Text className="font-semibold text-base text-gray-900">{title}</Text>
    <View className="w-10"></View>
  </View>
)
