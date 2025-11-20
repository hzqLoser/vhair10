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
    className={`bg-gradient-to-r from-[#FF8A00] to-[#FF3D81] text-white font-semibold py-3 px-6 rounded-full shadow-lg w-full flex justify-center items-center ${
      disabled ? 'opacity-50' : ''
    } ${className}`}
    style={{ background: 'linear-gradient(to right, #FF8A00, #FF3D81)', color: 'white', borderRadius: '999px', border: 'none' }}
  >
    {children}
  </Button>
)

export const ButtonSecondary: React.FC<{ children: React.ReactNode; onClick?: any; className?: string }> = ({ children, onClick, className = '' }) => (
  <Button
    onClick={onClick}
    className={`bg-white border border-[#FF3D81] text-[#FF3D81] font-medium py-2 px-4 rounded-full ${className}`}
    style={{ background: 'white', border: '1px solid #FF3D81', color: '#FF3D81', borderRadius: '999px' }}
  >
    {children}
  </Button>
)

export const ButtonGhost: React.FC<{ children: React.ReactNode; onClick?: any; className?: string }> = ({ children, onClick, className = '' }) => (
  <Button
    onClick={onClick}
    className={`bg-gray-100 text-gray-600 font-medium py-2 px-4 rounded-full ${className}`}
    style={{ background: '#f3f4f6', color: '#4b5563', borderRadius: '999px', border: 'none' }}
  >
    {children}
  </Button>
)

export const LoadingSpinner: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = '#FF3D81' }) => (
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
    style={{ backgroundColor: '#fdf2f8', color: '#db2777', padding: '2px 6px', borderRadius: '4px', display: 'inline-block' }}
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
  <View className="h-11 flex flex-row items-center justify-between px-4 bg-white sticky top-0 z-20 border-b border-gray-50">
    <View className="w-10" onClick={onBack}>
      {onBack && <Text>{'<'}</Text>}
    </View>
    <Text className="font-bold text-lg text-gray-800">{title}</Text>
    <View className="w-10"></View>
  </View>
)
