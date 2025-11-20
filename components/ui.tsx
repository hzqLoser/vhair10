
import React from 'react';
import { ChevronLeft, Home, Grid, MessageSquare, User } from 'lucide-react';

// --- 按钮组件 (Buttons) ---

export const ButtonPrimary: React.FC<{ children: React.ReactNode; onClick?: React.MouseEventHandler<HTMLButtonElement>; className?: string; disabled?: boolean }> = ({ children, onClick, className = '', disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`bg-gradient-to-r from-[#FF8A00] to-[#FF3D81] text-white font-semibold py-3.5 px-6 rounded-full shadow-lg active:opacity-90 transition-all w-full flex justify-center items-center ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
  >
    {children}
  </button>
);

export const ButtonSecondary: React.FC<{ children: React.ReactNode; onClick?: React.MouseEventHandler<HTMLButtonElement>; className?: string }> = ({ children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`bg-white border border-[#FF3D81] text-[#FF3D81] font-medium py-2 px-4 rounded-full active:bg-pink-50 transition-all ${className}`}
  >
    {children}
  </button>
);

export const ButtonGhost: React.FC<{ children: React.ReactNode; onClick?: React.MouseEventHandler<HTMLButtonElement>; className?: string }> = ({ children, onClick, className = '' }) => (
  <button
    onClick={onClick}
    className={`bg-gray-100 text-gray-600 font-medium py-2 px-4 rounded-full active:bg-gray-200 transition-all ${className}`}
  >
    {children}
  </button>
);

// --- 加载组件 (Loading) ---

export const LoadingSpinner: React.FC<{ size?: number; color?: string }> = ({ size = 40, color = 'border-white' }) => (
  <div 
    className={`animate-spin rounded-full border-4 border-t-transparent ${color}`} 
    style={{ width: size, height: size }}
  ></div>
);

// --- 导航组件 (Navigation) ---

export const TopNav: React.FC<{ title?: string; onBack?: () => void; rightIcon?: React.ReactNode }> = ({ title, onBack, rightIcon }) => (
  <div className="h-[44px] flex items-center justify-between px-4 bg-white/80 backdrop-blur-md sticky top-0 z-20 border-b border-gray-50">
    <div className="w-10 flex justify-start">
      {onBack && (
        <button onClick={onBack} className="p-1">
          <ChevronLeft className="w-6 h-6 text-gray-800" />
        </button>
      )}
    </div>
    <div className="font-bold text-lg text-gray-800 truncate max-w-[200px]">{title}</div>
    <div className="w-10 flex justify-end">
      {rightIcon}
    </div>
  </div>
);

export const TabBar: React.FC<{ currentTab: string; onTabChange: (tab: string) => void }> = ({ currentTab, onTabChange }) => {
  const tabs = [
    { id: 'hairstyle', label: '发型', icon: Home },
    { id: 'square', label: '广场', icon: Grid },
    { id: 'message', label: '消息', icon: MessageSquare },
    { id: 'profile', label: '我的', icon: User },
  ];

  return (
    <div className="fixed bottom-0 w-full max-w-[390px] bg-white border-t border-gray-100 h-[83px] pb-[20px] flex justify-around items-center z-50">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = currentTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="flex flex-col items-center justify-center w-16 pt-2"
          >
            <Icon 
              className={`w-6 h-6 mb-1 transition-colors duration-200 ${isActive ? 'stroke-[#FF3D81]' : 'stroke-gray-400'}`} 
              strokeWidth={isActive ? 2.5 : 2} 
            />
            <span className={`text-[10px] font-medium transition-colors duration-200 ${isActive ? 'text-[#FF3D81]' : 'text-gray-400'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  );
};

export const SegmentedControl: React.FC<{ options: string[]; selected: string; onChange: (val: string) => void }> = ({ options, selected, onChange }) => (
  <div className="bg-gray-100 p-1 rounded-lg flex relative">
    {options.map((opt) => {
      const isSelected = selected === opt;
      return (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all relative z-10 ${isSelected ? 'text-[#FF3D81] bg-white shadow-sm' : 'text-gray-500'}`}
        >
          {opt}
        </button>
      );
    })}
  </div>
);

// --- 筛选与标签 (Chips) ---

export const FilterChip: React.FC<{ label: string; active?: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded-full text-[11px] font-medium whitespace-nowrap transition-colors ${active ? 'bg-gradient-to-r from-[#FF8A00] to-[#FF3D81] text-white shadow-sm' : 'bg-gray-100 text-gray-600'}`}
  >
    {label}
  </button>
);

export const TagChip: React.FC<{ label: string; color?: string }> = ({ label, color = 'bg-pink-50 text-pink-600' }) => (
  <span className={`px-2 py-0.5 rounded-md text-[10px] font-medium ${color} mr-1.5`}>
    {label}
  </span>
);

// --- 布局容器 (Layout) ---

export const MobileLayout: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <div className={`w-full max-w-[390px] min-h-screen bg-[#F7F7F9] relative mx-auto shadow-2xl overflow-hidden flex flex-col ${className}`}>
    {children}
  </div>
);
