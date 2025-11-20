
import React from 'react';
import { View as TaroView, Text as TaroText } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { TopNav } from '../../components/ui';

const View = TaroView as any;
const Text = TaroText as any;

const HelpPage = () => (
  <View className="flex flex-col h-full bg-gray-50 min-h-screen">
    <TopNav title="帮助与支持" onBack={() => Taro.navigateBack()} />
    <View className="p-4">
       <View className="bg-white rounded-2xl p-4 shadow-sm mb-4">
          <Text className="font-bold text-gray-900 mb-2 block">常见问题</Text>
          <View className="mb-3 border-b border-gray-100 pb-2">
            <Text className="text-sm font-medium text-gray-800 block mb-1">如何获得最佳 AI 效果？</Text>
            <Text className="text-xs text-gray-500 block">确保照片光线充足，正对镜头。</Text>
          </View>
       </View>
    </View>
  </View>
);
export default HelpPage;