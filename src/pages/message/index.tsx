import React, { useState, useEffect } from 'react';
import { View as TaroView, Text as TaroText, Image as TaroImage, ScrollView as TaroScrollView } from '@tarojs/components';
import Taro, { useDidShow } from '@tarojs/taro';
import { SegmentedControl } from '../../components/ui';
import { api } from '../../services/api';
import { ChatSession } from '../../types';
import styles from './index.module.scss';

const View = TaroView as any;
const Text = TaroText as any;
const Image = TaroImage as any;
const ScrollView = TaroScrollView as any;

const MessageList = () => {
  const [tab, setTab] = useState('咨询');
  const [chats, setChats] = useState<ChatSession[]>([]);

  useDidShow(() => {
    api.getChats().then(setChats);
  });

  const goChat = (chat: ChatSession) => {
    Taro.navigateTo({
       url: `/pages/chat/index?target=${encodeURIComponent(JSON.stringify(chat))}`
    });
  };

  return (
    <View className={styles.page}>
      <View className="h-11 flex items-center justify-center bg-white sticky top-0 z-20">
         <Text className="font-bold text-lg">消息</Text>
      </View>
      
      <View className="px-12 py-2 bg-white mb-2">
         <SegmentedControl options={['咨询', '系统通知']} selected={tab} onChange={setTab} />
      </View>
      
      <ScrollView scrollY className="px-4 pb-5 flex-1">
         {tab === '咨询' ? chats.map(chat => (
            <View key={chat.id} onClick={() => goChat(chat)} className="bg-white p-4 rounded-2xl flex flex-row gap-3 shadow-sm mb-2">
               <View className="relative">
                 <Image src={chat.targetImage} className="w-12 h-12 rounded-full" mode="aspectFill" />
                 {chat.unreadCount > 0 && (
                    <View className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
                      <Text>{chat.unreadCount}</Text>
                    </View>
                 )}
               </View>
               <View className="flex-1">
                  <View className="flex flex-row justify-between">
                     <Text className="font-bold text-sm">{chat.targetName}</Text>
                     <Text className="text-xs text-gray-400">{chat.timestamp}</Text>
                  </View>
                  <Text className="text-xs text-gray-500 mt-1 line-clamp-1 block">{chat.lastMessage}</Text>
               </View>
            </View>
         )) : (
            <View>
               <View className="bg-white p-4 rounded-2xl flex flex-row gap-3 shadow-sm mb-2 items-center">
                  <View className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center"><Text className="text-blue-600">📅</Text></View>
                  <View>
                     <Text className="font-bold text-sm block">预约已确认</Text>
                     <Text className="text-xs text-gray-500 block">您在震轩美发沙龙的预约已确认。</Text>
                  </View>
               </View>
               <View className="bg-white p-4 rounded-2xl flex flex-row gap-3 shadow-sm mb-2 items-center">
                  <View className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center"><Text className="text-pink-600">⚡</Text></View>
                  <View>
                     <Text className="font-bold text-sm block">AI 结果已生成</Text>
                     <Text className="text-xs text-gray-500 block">点击查看您的新造型。</Text>
                  </View>
               </View>
            </View>
         )}
      </ScrollView>
    </View>
  );
};

export default MessageList;