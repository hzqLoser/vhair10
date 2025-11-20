import React, { useState, useEffect } from 'react';
import { View as TaroView, Text as TaroText, Image as TaroImage, ScrollView as TaroScrollView, Input as TaroInput } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { TopNav, TagChip } from '../../components/ui';
import { api } from '../../services/api';
import { Message, TryOnHistoryItem } from '../../types';

const View = TaroView as any;
const Text = TaroText as any;
const Image = TaroImage as any;
const ScrollView = TaroScrollView as any;
const Input = TaroInput as any;

const Chat = () => {
  const router = useRouter();
  // target could be Store or Barber or ChatSession
  const target = router.params.target ? JSON.parse(decodeURIComponent(router.params.target)) : {} as any;
  const contrastData = router.params.contrastData ? JSON.parse(decodeURIComponent(router.params.contrastData)) : null;
  const isNewSession = !!router.params.contrastData;

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [history, setHistory] = useState<TryOnHistoryItem[]>([]);
  const [attachment, setAttachment] = useState<TryOnHistoryItem | null>(null);

  const title = target.name || target.targetName || '聊天';

  useEffect(() => {
    const initialMessages: Message[] = [];
    if (isNewSession && contrastData) {
       initialMessages.push({
         id: 'sys1', senderId: 'system', type: 'system',
         text: '已将本次试戴效果发送给门店，方便发型师为你评估和报价。',
         timestamp: '刚刚'
       });
       initialMessages.push({
         id: 'card1', senderId: 'user', type: 'card',
         cardData: contrastData,
         timestamp: '刚刚'
       });
       setTimeout(() => {
         setMessages(prev => [...prev, {
           id: 'r1', senderId: target.id, type: 'text',
           text: `你好！我是${title}。先了解一下你的发质～ 你的头发偏软还是偏硬？平时有烫染过吗？`,
           timestamp: '刚刚'
         }]);
       }, 1000);
    } else if (target.messages) {
      initialMessages.push(...target.messages);
    }
    setMessages(initialMessages);
    api.getTryOnHistory().then(setHistory);
  }, []);

  const handleSend = () => {
    if (!inputText.trim() && !attachment) return;

    if (attachment) {
      setMessages(prev => [...prev, {
        id: Date.now().toString() + 'card',
        senderId: 'user',
        type: 'card',
        timestamp: '刚刚',
        cardData: {
          originalImage: attachment.originalImageUrl || '',
          resultImage: attachment.imageUrl,
          hairName: attachment.hairstyleName
        }
      }]);
      setAttachment(null);
    }

    if (inputText.trim()) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(), senderId: 'user', type: 'text', text: inputText, timestamp: '刚刚'
      }]);
      setInputText('');
    }
    setShowPicker(false);
  };

  return (
    <View className="flex flex-col h-screen bg-gray-50">
      <TopNav title={title} onBack={() => Taro.navigateBack()} />
      
      <ScrollView scrollY className="flex-1 p-4">
        {messages.map(msg => {
          const isUser = msg.senderId === 'user';
          if (msg.type === 'system') {
            return <View key={msg.id} className="text-center text-xs text-gray-400 my-2"><Text>{msg.text}</Text></View>;
          }
          if (msg.type === 'card' && msg.cardData) {
             return (
               <View key={msg.id} className="flex flex-row justify-end mb-4">
                  <View className="bg-white p-3 rounded-2xl shadow-sm w-64 border border-pink-100">
                     <View className="flex flex-row gap-2 mb-2">
                        <View className="relative w-24 h-24 rounded bg-gray-100">
                           <Image src={msg.cardData.originalImage} className="w-full h-full" mode="aspectFill" />
                        </View>
                        <View className="relative w-24 h-24 rounded bg-gray-100">
                           <Image src={msg.cardData.resultImage} className="w-full h-full" mode="aspectFill" />
                        </View>
                     </View>
                     <View className="flex flex-row justify-between items-center border-t border-gray-100 pt-2">
                        <Text className="text-xs font-bold text-gray-800">{msg.cardData.hairName}</Text>
                        <Text className="text-xs text-pink-500">AI 试戴</Text>
                     </View>
                  </View>
               </View>
             );
          }
          return (
            <View key={msg.id} className={`flex flex-row ${isUser ? 'justify-end' : 'justify-start'} mb-2`}>
               <View className={`max-w-[75%] p-3 rounded-xl text-sm ${isUser ? 'bg-pink-500 text-white' : 'bg-white text-gray-800 shadow-sm'}`} style={{maxWidth: '75%', backgroundColor: isUser ? '#FF3D81' : 'white', color: isUser ? 'white' : '#333'}}>
                 <Text>{msg.text}</Text>
               </View>
            </View>
          );
        })}
      </ScrollView>

      <View className="bg-white border-t border-gray-100 pb-safe">
         {attachment && (
           <View className="px-4 py-2 bg-gray-50 flex flex-row items-center justify-between border-b border-gray-100">
              <View className="flex flex-row items-center gap-3">
                 <Image src={attachment.imageUrl} className="w-10 h-10 rounded border border-pink-200" mode="aspectFill" />
                 <View>
                    <Text className="text-xs font-bold block">即将发送: {attachment.hairstyleName}</Text>
                 </View>
              </View>
              <View onClick={() => setAttachment(null)}><Text className="text-gray-400">X</Text></View>
           </View>
         )}

         <View className="flex flex-row gap-2 items-center p-3">
            <View 
               className={`p-2 rounded-full ${showPicker ? 'bg-pink-100' : 'bg-gray-100'}`} 
               onClick={() => setShowPicker(!showPicker)}
            >
               <Text className="text-2xl text-gray-500">+</Text>
            </View>
            <Input 
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm h-10"
              placeholder="输入消息..."
              value={inputText}
              onInput={e => setInputText(e.detail.value)}
            />
            <View onClick={handleSend} className="bg-pink-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center" style={{backgroundColor: '#FF3D81', borderRadius: '999px'}}>
               <Text>发送</Text>
            </View>
         </View>

         {showPicker && (
            <ScrollView scrollY className="h-48 bg-gray-50 p-4 border-t border-gray-200">
               <View className="flex flex-wrap">
               {history.length > 0 ? history.map(item => (
                  <View key={item.id} onClick={() => { setAttachment(item); setShowPicker(false); }} className="flex flex-col items-center gap-2 mb-4" style={{width: '25%'}}>
                     <View className="w-14 h-14 rounded-xl overflow-hidden border border-gray-200">
                        <Image src={item.imageUrl} className="w-full h-full" mode="aspectFill" />
                     </View>
                     <Text className="text-xs text-gray-500 truncate w-full text-center">{item.hairstyleName}</Text>
                  </View>
               )) : (
                  <Text className="text-center text-gray-400 text-xs w-full py-4">暂无试戴历史</Text>
               )}
               </View>
            </ScrollView>
         )}
      </View>
    </View>
  );
};
export default Chat;