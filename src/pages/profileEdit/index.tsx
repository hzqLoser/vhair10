import React, { useState, useEffect } from 'react';
import { View as TaroView, Text as TaroText, Image as TaroImage, Input as TaroInput, Textarea as TaroTextarea } from '@tarojs/components';
import Taro, { useRouter } from '@tarojs/taro';
import { TopNav, ButtonPrimary } from '../../components/ui';
import { api } from '../../services/api';

const View = TaroView as any;
const Text = TaroText as any;
const Image = TaroImage as any;
const Input = TaroInput as any;
const Textarea = TaroTextarea as any;

const ProfileEdit = () => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    api.getUserProfile().then(u => {
      setName(u.name);
      setBio(u.bio || '');
      setAvatar(u.avatar);
    });
  }, []);

  const handleSave = async () => {
    await api.updateUserProfile({ name, bio, avatar });
    Taro.navigateBack();
  };

  return (
     <View className="flex flex-col h-full bg-gray-50 min-h-screen">
        <TopNav title="编辑资料" onBack={() => Taro.navigateBack()} />
        <View className="p-4">
           <View className="flex flex-col items-center mb-6">
              <Image src={avatar} className="w-24 h-24 rounded-full mb-3" mode="aspectFill" />
              <Text className="text-xs text-gray-400">点击修改头像(暂不支持)</Text>
           </View>
           <View className="bg-white rounded-2xl p-4 shadow-sm">
              <View className="mb-4">
                 <Text className="block text-sm font-bold text-gray-700 mb-1">昵称</Text>
                 <Input value={name} onInput={e => setName(e.detail.value)} className="bg-gray-50 p-2 rounded" />
              </View>
              <View>
                 <Text className="block text-sm font-bold text-gray-700 mb-1">简介</Text>
                 <Textarea value={bio} onInput={e => setBio(e.detail.value)} className="bg-gray-50 p-2 rounded w-full h-24" />
              </View>
           </View>
           <View className="mt-8">
              <ButtonPrimary onClick={handleSave}>保存修改</ButtonPrimary>
           </View>
        </View>
     </View>
  )
}
export default ProfileEdit;