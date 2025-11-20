
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Heart, MessageCircle, Settings, HelpCircle, ChevronRight, ChevronLeft, Plus, MapPin, Camera, CheckCircle, Zap, Share2, RotateCcw, Calendar, Bell, MoreVertical, ImageIcon, Trash2, ExternalLink, X, Edit3, Image as ImageIconLucide, Grid, Scissors, Bookmark } from 'lucide-react';
import { 
  MobileLayout, TabBar, TopNav, ButtonPrimary, ButtonSecondary, ButtonGhost, 
  SegmentedControl, FilterChip, TagChip, LoadingSpinner 
} from './components/ui';
import { Hairstyle, Store, Barber, Gender, ChatSession, Message, TryOnHistoryItem, User, Topic, UserShow } from './types';
import { api } from './services/api'; // 引入 API 服务

// 定义导航函数类型
type NavigateFunction = (page: string, data?: any, replace?: boolean) => void;

// --- 子页面组件 (Sub-Pages) ---

// 1. 首页 (HOME PAGE)
// 功能：展示发型列表，支持筛选，作为主要流量入口
const Home: React.FC<{ 
  onNavigate: NavigateFunction; 
  filters: { gender: string; category: string }; 
  setFilters: (f: { gender: string; category: string }) => void;
}> = ({ onNavigate, filters, setFilters }) => {
  const [hairstyles, setHairstyles] = useState<Hairstyle[]>([]);
  const [loading, setLoading] = useState(true);
  
  // 映射筛选标签到 API 参数 (中文 -> API代码)
  const filterOptions = ['全部', '长发', '短发', '卷发', '直发', '染色'];
  const categoryMap: {[key: string]: string} = {
    '全部': 'all', '长发': 'long', '短发': 'short', '卷发': 'curly', '直发': 'straight', '染色': 'color'
  };

  // 从后端加载发型数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await api.getHairstyles(filters.gender, categoryMap[filters.category]);
        setHairstyles(data);
      } catch (error) {
        console.error("Failed to fetch hairstyles", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  return (
    <div className="flex flex-col h-full pb-24 overflow-y-auto hide-scrollbar">
      {/* 顶部 Hero 区域 */}
      <div className="relative h-[240px] bg-gradient-to-br from-[#FF8A00] to-[#FF3D81] text-white p-6 pt-12 rounded-b-[32px] shadow-lg shrink-0">
        <div className="flex justify-between items-start mb-6">
           <div className="w-6"></div> 
           <h1 className="text-xl font-bold">HairMatch AI</h1>
           <div className="w-6"></div> 
        </div>
        
        <div className="text-center mt-2">
          <h2 className="text-2xl font-bold mb-1">AI 智能匹配发型</h2>
          <p className="text-white/80 text-sm mb-6">上传自拍，一键虚拟换发</p>
          <button 
            onClick={() => onNavigate('tryOnEntry')}
            className="bg-white text-[#FF3D81] px-8 py-3 rounded-full font-bold shadow-md active:scale-95 transition-transform"
          >
            立即试戴
          </button>
        </div>
      </div>

      {/* 筛选器容器 - 紧凑化设计 */}
      <div className="bg-white -mt-8 mx-4 rounded-2xl px-3 py-3 shadow-sm mb-4 relative z-10">
        <div className="mb-2">
          <SegmentedControl 
            options={['Male', 'Female']} 
            selected={filters.gender} 
            onChange={(val) => setFilters({ ...filters, gender: val })} 
          />
        </div>
        <div className="flex space-x-2 overflow-x-auto hide-scrollbar pb-1">
          {filterOptions.map(f => (
            <FilterChip 
              key={f} 
              label={f} 
              active={filters.category === f} 
              onClick={() => setFilters({ ...filters, category: f })} 
            />
          ))}
        </div>
      </div>

      {/* 发型列表网格 - 改为3列 */}
      <div className="grid grid-cols-3 gap-2 px-4 min-h-[200px]">
        {loading ? (
          <div className="col-span-3 flex justify-center pt-10">
             <LoadingSpinner size={30} color="border-[#FF3D81]" />
          </div>
        ) : (
          hairstyles.map(style => (
            <div key={style.id} onClick={() => onNavigate('hairstyleDetail', style)} className="bg-white rounded-xl overflow-hidden shadow-sm pb-2 flex flex-col relative group">
              <div className="relative aspect-[3/4] bg-gray-200">
                <img src={style.imageUrl} alt={style.name} className="w-full h-full object-cover" />
                {/* 热度展示 - 左下角 */}
                <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-1.5 pt-4">
                   <div className="flex items-center gap-0.5 text-[9px] text-white font-medium">
                      <Zap className="w-3 h-3 fill-orange-400 text-orange-400" />
                      <span>{style.heat > 1000 ? (style.heat/1000).toFixed(1) + 'k' : style.heat}</span>
                   </div>
                </div>
              </div>
              <div className="px-2 pt-2 flex-1 flex flex-col justify-between">
                <h3 className="font-bold text-[11px] text-gray-900 line-clamp-1">{style.name}</h3>
                <div className="flex flex-wrap gap-1 mt-1">
                  {style.tags.slice(0, 1).map(tag => (
                    <span key={tag} className="text-[9px] bg-pink-50 text-pink-600 px-1 py-0.5 rounded">{tag}</span>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

// 2. 发型详情页 (HAIRSTYLE DETAIL)
const HairstyleDetail: React.FC<{ data: Hairstyle; onNavigate: NavigateFunction; onBack: () => void }> = ({ data, onNavigate, onBack }) => {
  const [isCollected, setIsCollected] = useState(data.isCollected);

  const toggleCollect = () => {
    // 这里可以调用 API 更新状态
    setIsCollected(!isCollected);
  };

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* 发型大图 */}
      <div className="relative h-[55vh]">
        <img src={data.imageUrl} className="w-full h-full object-cover" alt={data.name} />
        <div className="absolute top-0 w-full bg-gradient-to-b from-black/30 to-transparent h-24 p-4 pt-12 flex justify-between items-start">
          <button onClick={onBack} className="bg-white/20 backdrop-blur-md p-2 rounded-full text-white">
            <ChevronLeft />
          </button>
        </div>
        <div className="absolute bottom-6 left-4">
           <div className="inline-block bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-[#FF3D81]">
             {data.gender} · {data.category}
           </div>
        </div>
      </div>

      {/* 详情内容区 */}
      <div className="flex-1 bg-white -mt-6 rounded-t-[32px] relative z-10 p-6 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h1 className="text-2xl font-bold text-gray-900">{data.name}</h1>
          {/* 收藏按钮 */}
          <div className="flex gap-2">
            <button 
              onClick={toggleCollect}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${isCollected ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-600'}`}
            >
              <Heart className={`w-4 h-4 ${isCollected ? 'fill-red-500' : ''}`} />
              {isCollected ? '已收藏' : '收藏'}
            </button>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
          <div className="flex items-center gap-1"><Zap className="w-4 h-4 text-orange-500 fill-orange-500" /> 热度 {data.heat}</div>
        </div>

        <div className="flex gap-2 mb-6 flex-wrap">
          {data.tags.map(t => <TagChip key={t} label={`#${t}`} />)}
        </div>

        <p className="text-gray-600 leading-relaxed mb-8">{data.description}</p>

        <div className="mt-auto">
           <div className="text-center text-xs text-gray-400 mb-3">上传一张自拍，几秒钟生成试戴效果</div>
           <ButtonPrimary onClick={() => onNavigate('tryOnEntry', { targetHairstyle: data })}>
             试戴这个发型
           </ButtonPrimary>
        </div>
      </div>
    </div>
  );
};

// 3. 试戴入口页 (TRY ON ENTRY)
const TryOnEntry: React.FC<{ 
  targetHairstyle?: Hairstyle | Partial<Hairstyle>; 
  savedImage: string | null; 
  onImageUpdate: (img: string | null) => void; 
  onNavigate: NavigateFunction; 
  onBack: () => void 
}> = ({ targetHairstyle, savedImage, onImageUpdate, onNavigate, onBack }) => {
  
  const [image, setImage] = useState<string | null>(savedImage);

  useEffect(() => {
    if (savedImage) setImage(savedImage);
  }, [savedImage]);

  // 处理文件上传
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const result = ev.target?.result as string;
        setImage(result);
        onImageUpdate(result); // 同步状态到父组件
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleCamera = () => {
    alert("在真机上将打开相机功能");
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F7F9]">
      <TopNav title="AI 智能试戴" onBack={onBack} rightIcon={<HelpCircle className="text-gray-400" />} />
      
      <div className="flex-1 p-4 flex flex-col items-center">
        {/* 上传卡片区域 */}
        <div className="w-full bg-white rounded-3xl aspect-[3/4] mb-4 shadow-sm flex flex-col items-center justify-center relative overflow-hidden">
          {image ? (
            <>
              <img src={image} className="w-full h-full object-cover" alt="Uploaded" />
              <button 
                onClick={() => { setImage(null); onImageUpdate(null); }}
                className="absolute top-2 right-2 bg-black/50 p-2 rounded-full text-white"
              >
                <Trash2 size={16} />
              </button>
            </>
          ) : (
            <label className="flex flex-col items-center cursor-pointer p-8 text-center">
               <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                 <Plus size={40} />
               </div>
               <span className="text-gray-900 font-medium mb-1">上传一张清晰的正脸照片</span>
               <input type="file" className="hidden" accept="image/*" onChange={handleFileChange} />
            </label>
          )}
          
          {targetHairstyle && (
             <div className="absolute top-4 left-4 bg-gradient-to-r from-[#FF8A00] to-[#FF3D81] text-white text-xs px-3 py-1 rounded-full font-medium shadow-md">
               当前试戴: {targetHairstyle.name}
             </div>
          )}
        </div>

        {/* 拍摄指南 */}
        <div className="w-full bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm">
           <div className="w-12 h-16 bg-gray-200 rounded-md overflow-hidden shrink-0">
             <img src="https://picsum.photos/seed/guide/100/100" className="w-full h-full object-cover opacity-60" />
           </div>
           <div className="space-y-1 text-xs text-gray-600">
             <div className="flex items-center gap-1 text-green-600"><CheckCircle size={12}/> 正对镜头，光线均匀</div>
             <div className="flex items-center gap-1 text-green-600"><CheckCircle size={12}/> 面部无遮挡，表情自然</div>
             <div className="flex items-center gap-1 text-green-600"><CheckCircle size={12}/> 建议使用纯色背景</div>
           </div>
        </div>

        <div className="mt-auto w-full pb-6">
           <ButtonPrimary 
             disabled={!image} 
             onClick={() => onNavigate('tryOnLoading', { image, targetHairstyle })}
           >
             开始 AI 生成
           </ButtonPrimary>
           <div className="mt-3 text-center">
             <button onClick={handleCamera} className="text-[#FF3D81] font-medium text-sm flex items-center justify-center w-full gap-1">
               <Camera size={16} /> 拍照试戴
             </button>
           </div>
        </div>
      </div>
    </div>
  );
};

// 4. 生成等待页 (TRY ON LOADING)
const TryOnLoading: React.FC<{ onNavigate: NavigateFunction; inputData: any }> = ({ onNavigate, inputData }) => {
  useEffect(() => {
    const generate = async () => {
      try {
        // 如果没有指定发型，使用通用描述
        const description = inputData.targetHairstyle 
          ? (inputData.targetHairstyle.description || `发型: ${inputData.targetHairstyle.name}`) 
          : "一个适合脸型的时尚发型，专业剪裁。";
          
        // 调用 API 服务生成
        const resultUrl = await api.generateTryOn(inputData.image, description);

        // 生成完成后，使用 replace 模式跳转到结果页，防止用户回退到 loading 页
        onNavigate('tryOnResult', { 
          original: inputData.image, 
          result: resultUrl, 
          targetHairstyle: inputData.targetHairstyle 
        }, true); 

      } catch (e) {
        console.error(e);
        alert("生成失败，请重试。");
        onNavigate('home', undefined, true);
      }
    };
    generate();
  }, []);

  return (
    <div className="h-full w-full relative bg-black">
      {/* 背景模糊图 */}
      <img src={inputData.image} className="w-full h-full object-cover opacity-40 blur-sm" />
      
      {/* 中央 Loading 卡片 */}
      <div className="absolute inset-0 flex items-center justify-center z-10">
         <div className="w-4/5 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center text-white flex flex-col items-center">
            <h3 className="text-xl font-bold mb-6">正在为你生成试戴效果...</h3>
            {/* 使用 LoadingSpinner 替代进度条 */}
            <div className="mb-6">
              <LoadingSpinner size={48} color="border-[#FF3D81]" />
            </div>
            <p className="text-sm text-gray-300">大约需要几秒钟，请稍候</p>
         </div>
      </div>
    </div>
  );
};

// 5. 试戴结果页 (TRY ON RESULT)
const TryOnResult: React.FC<{ 
  data: any; 
  onNavigate: NavigateFunction; 
  onBack: () => void;
  onSaveToHistory: (item: TryOnHistoryItem) => void;
}> = ({ data, onNavigate, onBack, onSaveToHistory }) => {
  const { original, result, targetHairstyle } = data;
  
  // 保存功能
  const handleSave = async () => {
    if (!result) return;
    
    const newItem: TryOnHistoryItem = {
      id: Date.now().toString(),
      date: new Date().toLocaleDateString(),
      hairstyleName: targetHairstyle?.name || 'AI 智能推荐',
      imageUrl: result,
      originalImageUrl: original // 保存原图以便对比
    };

    // 调用 API 保存到云端历史
    await api.saveToHistory(newItem);
    // 更新本地状态
    onSaveToHistory(newItem);
    alert("已保存到我的历史记录！");
    
    // 创建临时链接下载图片
    const link = document.createElement('a');
    link.href = result;
    link.download = `HairMatch-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // 分享功能
  const handleShare = async () => {
    if (navigator.share) {
      try {
        const response = await fetch(result);
        const blob = await response.blob();
        const file = new File([blob], 'hairstyle.png', { type: 'image/png' });
        await navigator.share({
          title: '我的新发型',
          text: '快来看看用 HairMatch AI 生成的新造型！',
          files: [file],
        });
      } catch (err) {
        console.error('Share failed:', err);
        try {
          await navigator.clipboard.writeText('快来看看我的新造型！');
          alert('分享链接已复制！');
        } catch (e) {
          alert('当前设备不支持分享功能。');
        }
      }
    } else {
      alert("浏览器不支持原生分享。");
    }
  };

  // 重新生成
  const handleRegenerate = () => {
    onNavigate('tryOnLoading', { image: original, targetHairstyle }, true);
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F7F9]">
      <TopNav title="试戴结果" onBack={onBack} />
      
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm relative mb-4">
           <img src={result} className="w-full aspect-[3/4] object-cover" alt="Result" />
           {targetHairstyle && (
              <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full flex items-center gap-2 shadow-sm">
                {targetHairstyle.imageUrl && (
                   <img src={targetHairstyle.imageUrl} className="w-6 h-6 rounded-full object-cover" />
                )}
                <span className="text-xs font-bold text-gray-800">{targetHairstyle.name}</span>
              </div>
           )}
        </div>

        <div className="bg-white rounded-xl p-4 text-center mb-6">
           <h3 className="font-bold text-gray-800 mb-1">本次试戴：{targetHairstyle ? targetHairstyle.name : 'AI 智能推荐'}</h3>
           <p className="text-xs text-gray-500">当前发型效果</p>
        </div>

        <div className="grid grid-cols-3 gap-4 mb-4">
           <ButtonGhost onClick={handleRegenerate} className="flex flex-col items-center justify-center h-16 text-xs gap-1">
             <RotateCcw size={18} /> 重新生成
           </ButtonGhost>
           <ButtonGhost onClick={handleShare} className="flex flex-col items-center justify-center h-16 text-xs gap-1">
             <Share2 size={18} /> 分享
           </ButtonGhost>
           <ButtonGhost onClick={handleSave} className="flex flex-col items-center justify-center h-16 text-xs gap-1">
             <Heart size={18} /> 保存
           </ButtonGhost>
        </div>
        
        <ButtonPrimary 
          onClick={() => onNavigate('storeSelect', { 
             originalImage: original, 
             resultImage: result, 
             hairName: targetHairstyle?.name || '新发型' 
          })}
          className="mb-2"
        >
          一键咨询门店 / 发型师
        </ButtonPrimary>
        <p className="text-center text-[10px] text-gray-400 pb-6">可以跟 Tony 老师确认是否可以完成效果哦</p>
      </div>
    </div>
  );
};

// 6. 广场页 (SQUARE)
// 功能：社区内容、发友秀、门店列表
const Square: React.FC<{ onNavigate: NavigateFunction }> = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState('话题');
  const [city, setCity] = useState('杭州');
  
  // 状态数据
  const [topics, setTopics] = useState<Topic[]>([]);
  const [shows, setShows] = useState<UserShow[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCreateTopic, setShowCreateTopic] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState('');
  const [showRefImage, setShowRefImage] = useState<string | null>(null);

  // 切换 Tab 时加载对应数据
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        if (activeTab === '话题') {
           setTopics(await api.getTopics());
        } else if (activeTab === '发友秀') {
           setShows(await api.getUserShows());
        } else {
           setStores(await api.getStores());
        }
      } catch(e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [activeTab]);

  const handleCreateTopic = () => {
    if (!newTopicTitle.trim()) return;
    // 模拟发布
    const newTopic: Topic = {
      id: Date.now().toString(),
      title: newTopicTitle,
      participants: 1,
      color: 'bg-blue-100 text-blue-600'
    };
    setTopics([newTopic, ...topics]);
    setNewTopicTitle('');
    setShowCreateTopic(false);
    alert("话题发布成功！");
  };

  // 处理门店收藏
  const handleToggleStore = async (e: React.MouseEvent, storeId: string) => {
    e.stopPropagation();
    await api.toggleStoreSave(storeId);
    setStores(prev => prev.map(s => s.id === storeId ? { ...s, isSaved: !s.isSaved } : s));
  };

  const renderContent = () => {
    if (loading) {
      return <div className="flex justify-center pt-10"><LoadingSpinner color="border-[#FF3D81]" /></div>;
    }

    if (activeTab === '话题') {
      return (
        <div className="px-4 pb-24 space-y-3 pt-4 overflow-y-auto hide-scrollbar h-full relative">
          <div className="bg-gradient-to-r from-orange-100 to-pink-100 p-4 rounded-2xl flex items-center gap-4 mb-4">
             <div className="w-16 h-16 bg-white rounded-xl shrink-0 overflow-hidden">
                <img src="https://picsum.photos/seed/banner/200/200" className="w-full h-full object-cover" />
             </div>
             <div>
                <h3 className="font-bold text-gray-900">王大妈的理发岁月</h3>
                <p className="text-xs text-gray-600">轮播图，展示理发、时尚的精选故事</p>
             </div>
          </div>
          {topics.map(t => (
            <div key={t.id} className="bg-white p-4 rounded-xl shadow-sm flex items-center gap-3">
               <div className={`w-10 h-10 rounded-full ${t.color} flex items-center justify-center font-bold shrink-0`}>#</div>
               <div>
                 <h4 className="font-bold text-gray-800 text-sm mb-1">{t.title}</h4>
                 <p className="text-xs text-gray-400">{t.participants.toLocaleString()} participants</p>
               </div>
            </div>
          ))}

          {/* 浮动发布按钮 - 圆形样式，位置调整 */}
          <div className="fixed bottom-28 right-6 z-30">
            <button 
              onClick={() => setShowCreateTopic(true)}
              className="bg-gradient-to-r from-[#FF8A00] to-[#FF3D81] text-white p-4 rounded-full shadow-lg flex items-center justify-center active:scale-95 transition-transform"
            >
              <Plus className="w-6 h-6" />
            </button>
          </div>
        </div>
      );
    }
    if (activeTab === '发友秀') {
      return (
        <div className="px-4 pb-24 pt-4 space-y-4 overflow-y-auto hide-scrollbar">
           <div className="text-center text-xs text-gray-400 mb-2">看看大家的真实发型效果，支持一键试戴同款。</div>
           {shows.map(u => (
             <div key={u.id} className="bg-white rounded-2xl p-4 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                   <img src={u.userAvatar} className="w-8 h-8 rounded-full" />
                   <span className="text-sm font-bold">{u.userName}</span>
                </div>
                <div className="flex gap-2 mb-3">
                   <div className="flex-1 relative rounded-lg overflow-hidden aspect-square">
                     <img src={u.beforeImage} className="w-full h-full object-cover" />
                     <div className="absolute bottom-0 left-0 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-tr-lg">AI 试戴效果</div>
                   </div>
                   <div className="flex-1 relative rounded-lg overflow-hidden aspect-square">
                     <img src={u.afterImage} className="w-full h-full object-cover" />
                     <div className="absolute bottom-0 left-0 bg-[#FF3D81] text-white text-[10px] px-2 py-0.5 rounded-tr-lg">实际效果</div>
                   </div>
                </div>
                
                <div className="flex justify-between items-center mt-3 border-t border-gray-50 pt-3">
                   <div className="flex gap-4 text-gray-400 text-xs">
                      <span className="flex items-center gap-1"><Heart size={16} className="text-red-500 fill-red-500"/> {u.likes}</span>
                   </div>
                   <div className="flex items-center gap-3">
                     {/* 参考发型缩略图与按钮组合 */}
                     <div className="flex items-center gap-2 bg-gray-50 p-1 rounded-lg pr-2">
                         <div 
                            className="w-8 h-8 rounded bg-gray-200 overflow-hidden cursor-pointer border border-pink-200 relative"
                            onClick={() => setShowRefImage(u.referenceHairstyleUrl)}
                         >
                            <img src={u.referenceHairstyleUrl} className="w-full h-full object-cover" alt="ref" />
                         </div>
                         <button 
                            className="text-xs font-bold text-[#FF3D81]"
                            onClick={() => onNavigate('tryOnEntry', { 
                               targetHairstyle: { 
                                  name: u.referenceHairstyleName, 
                                  imageUrl: u.referenceHairstyleUrl,
                                  description: u.referenceHairstyleName 
                               }
                            })}
                         >
                            试戴同款
                         </button>
                     </div>
                   </div>
                </div>
             </div>
           ))}
        </div>
      );
    }
    // 门店精选
    return (
      <div className="px-4 pb-24 pt-4 space-y-4 overflow-y-auto hide-scrollbar">
         {/* 门店榜单轮播图 Banner */}
         <div 
           className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-2xl mb-4 relative overflow-hidden cursor-pointer active:opacity-90 transition-opacity"
           onClick={() => onNavigate('storeRanking')}
         >
            <div className="relative z-10">
               <h3 className="font-bold text-xl mb-1">本月门店人气榜</h3>
               <p className="text-sm opacity-90">发现全城最热 TOP 10 沙龙</p>
               <div className="mt-4 inline-block bg-white/20 backdrop-blur-md rounded-full px-3 py-1 text-xs font-bold">点击查看榜单 &gt;</div>
            </div>
            <div className="absolute right-0 bottom-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -mr-8 -mb-8"></div>
            <div className="absolute top-0 right-0 p-4 opacity-20">
               <Grid size={64} />
            </div>
         </div>

         {stores.map(s => (
           <div key={s.id} className="bg-white rounded-2xl p-3 shadow-sm flex gap-3 relative">
              <img src={s.imageUrl} className="w-20 h-20 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                 <div className="flex justify-between items-start">
                    <h4 className="font-bold text-gray-900 truncate pr-6">{s.name}</h4>
                    {s.isBookable && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded mt-1">可预约</span>}
                 </div>
                 <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                    <span className="font-bold text-orange-500">★ {s.rating}</span>
                    <span>¥{s.price}/人</span>
                 </div>
                 <p className="text-xs text-gray-400 mt-1 truncate">{s.description}</p>
                 <div className="flex justify-between items-center mt-2">
                    <div className="flex-1"></div>
                    {/* 收藏与咨询按钮组 - 放置于咨询入口旁 */}
                    <div className="flex gap-2 items-center ml-auto">
                       <button 
                         onClick={(e) => handleToggleStore(e, s.id)}
                         className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors whitespace-nowrap ${s.isSaved ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500'}`}
                       >
                         <Heart className={`w-3 h-3 ${s.isSaved ? 'fill-red-500' : ''}`} />
                         {s.isSaved ? '已收藏' : '收藏'}
                       </button>
                       <ButtonPrimary 
                         onClick={() => onNavigate('chat', { target: s, isNewSession: false })} 
                         className="!py-1 !px-3 !text-xs !w-auto whitespace-nowrap"
                       >
                         咨询
                       </ButtonPrimary>
                    </div>
                 </div>
              </div>
           </div>
         ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="h-[44px] flex items-center justify-between px-4 bg-white sticky top-0 z-20">
         <button className="flex items-center text-sm font-bold text-gray-800">{city} <ChevronRight size={14}/></button>
         <span className="text-lg font-bold">广场</span>
         {/* 顶部导航保留一个入口 */}
         {activeTab === '话题' ? (
           <div className="w-6"></div>
         ) : (
           <div className="w-6 h-6 flex items-center justify-center">
             <Search className="w-5 h-5 text-gray-600" />
           </div>
         )}
      </div>
      <div className="px-12 py-2 bg-white">
        <SegmentedControl options={['话题', '发友秀', '门店精选']} selected={activeTab} onChange={setActiveTab} />
      </div>
      {renderContent()}

      {/* 发布话题 Modal */}
      {showCreateTopic && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
           <div className="bg-white w-full max-w-sm rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-4">发布新话题</h3>
              <input 
                 className="w-full bg-gray-50 p-3 rounded-xl mb-4 outline-none focus:ring-2 focus:ring-pink-200" 
                 placeholder="输入话题标题 (例如: #春季新发色)"
                 value={newTopicTitle}
                 onChange={(e) => setNewTopicTitle(e.target.value)}
              />
              <div className="flex gap-3">
                 <ButtonGhost className="flex-1" onClick={() => setShowCreateTopic(false)}>取消</ButtonGhost>
                 <ButtonPrimary className="flex-1" onClick={handleCreateTopic}>发布</ButtonPrimary>
              </div>
           </div>
        </div>
      )}

      {/* 参考发型大图 Modal */}
      {showRefImage && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-6 animate-in fade-in" onClick={() => setShowRefImage(null)}>
           <div className="max-w-full max-h-full relative">
              <img src={showRefImage} className="rounded-xl max-h-[80vh] object-contain" />
              <p className="text-white text-center mt-4 font-bold">参考发型</p>
           </div>
        </div>
      )}
    </div>
  );
};

// 新增页面: 门店榜单 (STORE RANKING)
const StoreRanking: React.FC<{ onNavigate: NavigateFunction; onBack: () => void }> = ({ onNavigate, onBack }) => {
  const [stores, setStores] = useState<Store[]>([]);
  
  useEffect(() => {
    api.getStores().then(setStores);
  }, []);

  const handleToggleStore = async (e: React.MouseEvent, storeId: string) => {
    e.stopPropagation();
    await api.toggleStoreSave(storeId);
    setStores(prev => prev.map(s => s.id === storeId ? { ...s, isSaved: !s.isSaved } : s));
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F7F9]">
       <TopNav title="本月门店榜" onBack={onBack} />
       <div className="bg-gradient-to-b from-pink-500 to-[#F7F7F9] h-32 shrink-0"></div>
       <div className="px-4 -mt-28 pb-24 overflow-y-auto space-y-4">
          <div className="text-white mb-4">
             <h2 className="text-2xl font-bold">全城热榜 TOP 10</h2>
             <p className="opacity-90 text-sm">根据真实用户评价与试戴热度生成</p>
          </div>
          {stores.map((s, index) => (
            <div key={s.id} className="bg-white rounded-2xl p-3 shadow-sm flex gap-3 relative">
               <img src={s.imageUrl} className="w-20 h-20 rounded-lg object-cover shrink-0" />
               
               {/* Ranking Badge Overlay on Image */}
               <div className={`absolute top-2 left-2 w-6 h-6 rounded-full flex items-center justify-center font-bold text-white text-xs z-10 ${index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-300' : index === 2 ? 'bg-orange-300' : 'bg-gray-100 text-gray-400'}`}>
                  {index + 1}
               </div>

               <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                     <h4 className="font-bold text-gray-900 truncate pr-6">{s.name}</h4>
                     {s.isBookable && <span className="text-[10px] bg-green-100 text-green-700 px-1.5 py-0.5 rounded mt-1">可预约</span>}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                     <span className="font-bold text-orange-500">★ {s.rating}</span>
                     <span>¥{s.price}/人</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 truncate">{s.description}</p>
                  <div className="flex justify-between items-center mt-2">
                     <div className="flex-1"></div>
                     <div className="flex gap-2 items-center ml-auto">
                        <button 
                          onClick={(e) => handleToggleStore(e, s.id)}
                          className={`flex items-center gap-1 px-2 py-1 rounded text-[10px] font-medium transition-colors whitespace-nowrap ${s.isSaved ? 'bg-red-50 text-red-500' : 'bg-gray-100 text-gray-500'}`}
                        >
                          <Heart className={`w-3 h-3 ${s.isSaved ? 'fill-red-500' : ''}`} />
                          {s.isSaved ? '已收藏' : '收藏'}
                        </button>
                        <ButtonPrimary 
                           onClick={() => onNavigate('chat', { target: s })} 
                           className="!py-1 !px-3 !text-xs !w-auto whitespace-nowrap"
                        >
                           咨询
                        </ButtonPrimary>
                     </div>
                  </div>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
};

// 7. 门店选择页 (STORE SELECT) - (保持不变)
const StoreSelect: React.FC<{ data: any; onNavigate: NavigateFunction; onBack: () => void }> = ({ data, onNavigate, onBack }) => {
  const [mode, setMode] = useState('门店'); // 门店 | 发型师
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [list, setList] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  
  // 加载列表数据
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setSelectedId(null);
      try {
        if (mode === '门店') {
          setList(await api.getStores());
        } else {
          setList(await api.getBarbers());
        }
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [mode]);

  const handleConfirm = () => {
    if (!selectedId) return;
    const target = list.find(i => i.id === selectedId);
    onNavigate('chat', {
      target,
      contrastData: {
        originalImage: data.originalImage,
        resultImage: data.resultImage,
        hairName: data.hairName
      },
      isNewSession: true
    });
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F7F9]">
       <TopNav title="选择门店 / 发型师" onBack={onBack} />
       
       <div className="px-4 py-2 bg-white sticky top-[44px] z-10">
          <SegmentedControl options={['门店', '发型师']} selected={mode} onChange={setMode} />
       </div>

       {/* 发送内容预览 */}
       <div className="px-4 py-3">
          <div className="bg-white p-3 rounded-xl flex items-center gap-3 border border-orange-100">
             <img src={data.resultImage} className="w-10 h-10 rounded-full object-cover border border-pink-200" />
             <div className="flex-1">
                <div className="text-xs font-bold text-gray-800">已生成试戴效果</div>
                <div className="text-[10px] text-gray-500">选择门店或发型师来帮你落地实现</div>
             </div>
          </div>
       </div>

       {/* 列表区域 */}
       <div className="flex-1 px-4 space-y-3 overflow-y-auto pb-32">
          {loading ? <div className="flex justify-center pt-4"><LoadingSpinner color="border-[#FF3D81]" size={24}/></div> : 
            list.map((item: any) => (
             <div 
               key={item.id} 
               onClick={() => setSelectedId(item.id)}
               className={`bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border transition-all ${selectedId === item.id ? 'border-[#FF3D81] ring-1 ring-pink-100' : 'border-transparent'}`}
             >
               <img src={item.imageUrl} className="w-14 h-14 rounded-full object-cover" />
               <div className="flex-1">
                  <div className="flex justify-between">
                     <h4 className="font-bold text-sm text-gray-900">{item.name}</h4>
                     <span className="text-xs text-orange-500 font-bold">★ {item.rating}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{item.description}</p>
                  {mode === '门店' && <p className="text-xs text-gray-400 mt-0.5">¥{item.price}/人 · {item.distance}</p>}
               </div>
               <div className="w-5 h-5 rounded-full border flex items-center justify-center hover:border-[#FF3D81] transition-colors">
                  {selectedId === item.id && <div className="w-2 h-2 bg-[#FF3D81] rounded-full"></div>}
               </div>
             </div>
          ))}
       </div>

       {/* 底部确认按钮 */}
       <div className="fixed bottom-0 w-full max-w-[390px] bg-white border-t border-gray-100 p-4 pb-8 z-20">
          <div className="flex justify-between items-center mb-3">
             <span className="font-bold text-sm text-gray-900">已选择: {selectedId ? list.find(i => i.id === selectedId)?.name : '未选择'}</span>
          </div>
          <ButtonPrimary disabled={!selectedId} onClick={handleConfirm}>
             确认发送给{mode}
          </ButtonPrimary>
       </div>
    </div>
  );
};

// 8. 聊天页 (CHAT PAGE)
const Chat: React.FC<{ data: any; onBack: () => void }> = ({ data, onBack }) => {
  const { target, contrastData, isNewSession } = data;
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [showPicker, setShowPicker] = useState(false);
  const [history, setHistory] = useState<TryOnHistoryItem[]>([]);
  const [attachment, setAttachment] = useState<TryOnHistoryItem | null>(null);

  // 修正 Header 显示，优先显示 target.name (门店/发型师对象)，其次 targetName (聊天会话对象)
  const title = target.name || target.targetName || '聊天';

  // 初始化聊天记录
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
       }, 2000);
    } else if (target.messages) {
      initialMessages.push(...target.messages);
    }
    setMessages(initialMessages);

    // 加载历史记录以备选择
    api.getTryOnHistory().then(setHistory);
  }, []);

  // 发送消息（包含文本和可能的附件）
  const handleSend = () => {
    if (!inputText.trim() && !attachment) return;

    // 1. 发送附件卡片
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

    // 2. 发送文本
    if (inputText.trim()) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(), senderId: 'user', type: 'text', text: inputText, timestamp: '刚刚'
      }]);
      api.sendMessage(target.id, inputText);
      setInputText('');
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F7F9]">
      <TopNav title={title} onBack={onBack} rightIcon={<MoreVertical className="text-gray-600" />} />
      
      <div className="flex-1 p-4 overflow-y-auto space-y-4 pb-4" onClick={() => setShowPicker(false)}>
        {messages.map(msg => {
          const isUser = msg.senderId === 'user';
          if (msg.type === 'system') {
            return <div key={msg.id} className="text-center text-[10px] text-gray-400 my-2">{msg.text}</div>;
          }
          if (msg.type === 'card' && msg.cardData) {
             return (
               <div key={msg.id} className="flex justify-end mb-4">
                  <div className="bg-white p-3 rounded-2xl rounded-tr-sm shadow-sm max-w-[85%] border border-pink-100">
                     <div className="flex gap-2 mb-2">
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                           <img src={msg.cardData.originalImage} className="w-full h-full object-cover" />
                           <span className="absolute top-0 left-0 bg-black/50 text-white text-[9px] px-1">原图</span>
                        </div>
                        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                           <img src={msg.cardData.resultImage} className="w-full h-full object-cover" />
                           <span className="absolute top-0 left-0 bg-[#FF3D81] text-white text-[9px] px-1">AI 效果</span>
                        </div>
                     </div>
                     <div className="flex justify-between items-center border-t border-gray-100 pt-2">
                        <span className="text-xs font-bold text-gray-800">{msg.cardData.hairName}</span>
                        <TagChip label="AI 试戴" />
                     </div>
                  </div>
               </div>
             );
          }
          return (
            <div key={msg.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
               {!isUser && <img src={target.imageUrl || target.targetImage} className="w-8 h-8 rounded-full mr-2 mt-1" />}
               <div className={`max-w-[75%] p-3 rounded-2xl text-sm ${isUser ? 'bg-gradient-to-br from-[#FF8A00] to-[#FF3D81] text-white rounded-tr-none' : 'bg-white text-gray-800 rounded-tl-none shadow-sm'}`}>
                 {msg.text}
               </div>
            </div>
          );
        })}
      </div>

      {/* 输入区域 */}
      <div className="bg-white border-t border-gray-100 pb-8 relative z-30">
         {/* 附件预览 */}
         {attachment && (
           <div className="px-4 py-2 bg-gray-50 flex items-center justify-between border-b border-gray-100">
              <div className="flex items-center gap-3">
                 <img src={attachment.imageUrl} className="w-10 h-10 rounded-lg object-cover border border-pink-200" />
                 <div className="text-xs text-gray-600">
                    <div className="font-bold">即将发送: {attachment.hairstyleName}</div>
                    <div className="text-[10px] text-gray-400">包含原图与效果图对比</div>
                 </div>
              </div>
              <button onClick={() => setAttachment(null)} className="text-gray-400 p-1"><X size={16}/></button>
           </div>
         )}

         {/* 快捷回复 */}
         {!attachment && (
            <div className="p-3 pb-0">
               <div className="flex gap-2 overflow-x-auto hide-scrollbar">
                  {['我的头发比较软', '想保持现在的长度', '希望更自然一点'].map(t => (
                     <button key={t} onClick={() => setInputText(t)} className="bg-gray-100 px-3 py-1 rounded-full text-xs text-gray-600 whitespace-nowrap hover:bg-gray-200">
                       {t}
                     </button>
                  ))}
               </div>
            </div>
         )}

         <div className="flex gap-2 items-center p-3">
            <button 
               className={`p-2 rounded-full transition-colors ${showPicker ? 'bg-pink-100 text-pink-500' : 'text-gray-400'}`} 
               onClick={() => setShowPicker(!showPicker)}
            >
               <Plus />
            </button>
            <input 
              className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm outline-none focus:ring-1 focus:ring-pink-300" 
              placeholder="和发型师聊聊你的需求..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
            />
            <button onClick={handleSend} className="bg-[#FF3D81] text-white px-4 py-2 rounded-full text-sm font-bold">发送</button>
         </div>

         {/* 更多功能 Picker 面板 */}
         {showPicker && (
            <div className="h-48 bg-gray-50 overflow-y-auto p-4 grid grid-cols-4 gap-4 animate-in slide-in-from-bottom-10 fade-in duration-200 border-t border-gray-200">
               {/* 我的试戴历史选项 */}
               {history.length > 0 ? history.map(item => (
                  <div key={item.id} onClick={() => { setAttachment(item); setShowPicker(false); }} className="flex flex-col items-center gap-2 cursor-pointer">
                     <div className="w-14 h-14 rounded-xl overflow-hidden border border-gray-200 relative">
                        <img src={item.imageUrl} className="w-full h-full object-cover" />
                     </div>
                     <span className="text-[10px] text-gray-500 truncate w-full text-center">{item.hairstyleName}</span>
                  </div>
               )) : (
                  <div className="col-span-4 text-center text-gray-400 text-xs py-4">暂无试戴历史</div>
               )}
            </div>
         )}
      </div>
    </div>
  );
};

// 9. 消息列表页 (MESSAGES LIST) - (保持不变)
const MessageList: React.FC<{ onNavigate: NavigateFunction }> = ({ onNavigate }) => {
  const [tab, setTab] = useState('咨询');
  const [chats, setChats] = useState<ChatSession[]>([]);
  
  useEffect(() => {
    api.getChats().then(setChats);
  }, []);
  
  return (
    <div className="flex flex-col h-full bg-[#F7F7F9] pb-24">
      <div className="h-[44px] flex items-center justify-center bg-white relative">
         <span className="font-bold text-lg">消息</span>
         <Settings className="w-5 h-5 absolute right-4 text-gray-600" />
      </div>
      <div className="px-12 py-2 bg-white mb-2">
         <SegmentedControl options={['咨询', '系统通知']} selected={tab} onChange={setTab} />
      </div>
      
      <div className="px-4 space-y-2 overflow-y-auto">
         {tab === '咨询' ? chats.map(chat => (
            <div key={chat.id} onClick={() => onNavigate('chat', { target: chat })} className="bg-white p-4 rounded-2xl flex gap-3 shadow-sm">
               <div className="relative">
                 <img src={chat.targetImage} className="w-12 h-12 rounded-full object-cover" />
                 {chat.unreadCount > 0 && <div className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{chat.unreadCount}</div>}
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex justify-between">
                     <h4 className="font-bold text-sm truncate">{chat.targetName}</h4>
                     <span className="text-[10px] text-gray-400">{chat.timestamp}</span>
                  </div>
                  <p className="text-xs text-gray-500 mt-1 truncate">{chat.lastMessage}</p>
               </div>
            </div>
         )) : (
            <>
             <div className="bg-white p-4 rounded-2xl flex gap-3 shadow-sm items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><Calendar size={20} /></div>
                <div className="flex-1">
                   <h4 className="font-bold text-sm">预约已确认</h4>
                   <p className="text-xs text-gray-500">您在震轩美发沙龙的预约已确认。</p>
                </div>
             </div>
             <div className="bg-white p-4 rounded-2xl flex gap-3 shadow-sm items-center">
                <div className="w-12 h-12 bg-pink-100 rounded-full flex items-center justify-center text-pink-600"><Zap size={20} /></div>
                <div className="flex-1">
                   <h4 className="font-bold text-sm">AI 结果已生成</h4>
                   <p className="text-xs text-gray-500">点击查看您的新造型。</p>
                </div>
             </div>
            </>
         )}
      </div>
    </div>
  );
};

// 10. 历史记录页 (HISTORY PAGE)
const HistoryPage: React.FC<{ 
  history: TryOnHistoryItem[]; 
  onNavigate: NavigateFunction; 
  onBack: () => void;
  onDeleteHistory: (id: string) => void;
}> = ({ history, onNavigate, onBack, onDeleteHistory }) => {
  
  const [selectedItem, setSelectedItem] = useState<TryOnHistoryItem | null>(null);

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.stopPropagation(); // 阻止事件冒泡
    if (window.confirm("确定要删除这条试戴记录吗？")) {
       onDeleteHistory(id);
    }
  };

  const openDetail = (item: TryOnHistoryItem) => {
    setSelectedItem(item);
  };

  const closeDetail = () => {
    setSelectedItem(null);
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F7F9] relative">
      <TopNav title="我的试戴" onBack={onBack} />
      <div className="p-4 grid grid-cols-2 gap-3 overflow-y-auto pb-20">
        {history.length === 0 ? (
          <div className="col-span-2 text-center text-gray-400 mt-10">暂无历史记录。</div>
        ) : (
           history.map(item => (
             <div key={item.id} className="bg-white rounded-xl overflow-hidden shadow-sm pb-2 group relative">
               <div className="aspect-[4/5] bg-gray-100 relative">
                  <img src={item.imageUrl} className="w-full h-full object-cover" />
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full">{item.date}</div>
               </div>
               <div className="px-2 pt-2">
                  <div className="font-bold text-xs text-gray-800 mb-1 truncate">{item.hairstyleName}</div>
                  <div className="flex justify-between items-center mt-2">
                     <ButtonGhost className="!text-[10px] !py-1 !px-2 h-6 bg-gray-50" onClick={() => openDetail(item)}>查看详情</ButtonGhost>
                     {/* 删除按钮 */}
                     <button 
                       onClick={(e) => handleDelete(e, item.id)} 
                       className="text-red-500 hover:bg-red-50 rounded p-1 transition-colors"
                       title="删除"
                     >
                        <Trash2 size={14} />
                     </button>
                  </div>
               </div>
             </div>
           ))
        )}
      </div>

      {/* 悬浮对比卡片 Modal */}
      {selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-6 animate-in fade-in duration-200">
           <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl relative flex flex-col">
              <div className="p-4 border-b border-gray-100 flex justify-between items-center">
                 <h3 className="font-bold text-gray-900">{selectedItem.hairstyleName}</h3>
                 <button onClick={closeDetail} className="p-1 bg-gray-100 rounded-full text-gray-500">
                    <X size={20} />
                 </button>
              </div>
              <div className="p-4 bg-[#F7F7F9]">
                 <div className="flex gap-3 justify-center">
                    {/* 原图 */}
                    <div className="flex-1 flex flex-col gap-2">
                       <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-200 relative shadow-sm">
                          {selectedItem.originalImageUrl ? (
                             <img src={selectedItem.originalImageUrl} className="w-full h-full object-cover" />
                          ) : (
                             <div className="w-full h-full flex items-center justify-center text-gray-400 text-xs">原图已丢失</div>
                          )}
                          <span className="absolute top-0 left-0 bg-black/50 text-white text-[10px] px-2 py-1 rounded-br-lg">原图</span>
                       </div>
                    </div>
                    {/* 效果图 */}
                    <div className="flex-1 flex flex-col gap-2">
                       <div className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-200 relative shadow-sm border-2 border-pink-100">
                          <img src={selectedItem.imageUrl} className="w-full h-full object-cover" />
                          <span className="absolute top-0 left-0 bg-[#FF3D81] text-white text-[10px] px-2 py-1 rounded-br-lg">AI 效果</span>
                       </div>
                    </div>
                 </div>
              </div>
              <div className="p-4">
                 <ButtonPrimary onClick={closeDetail}>关闭</ButtonPrimary>
              </div>
           </div>
        </div>
      )}
    </div>
  );
}

// 11. 收藏的发型页 (SAVED HAIRSTYLES PAGE)
const SavedHairstylesPage: React.FC<{ onNavigate: NavigateFunction; onBack: () => void }> = ({ onNavigate, onBack }) => {
  const [savedList, setSavedList] = useState<Hairstyle[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.getSavedHairstyles().then(data => {
      setSavedList(data);
      setLoading(false);
    });
  }, []);

  // 处理试戴跳转
  const handleTryOn = (style: Hairstyle) => {
    onNavigate('tryOnEntry', { targetHairstyle: style });
  };

  // 处理删除收藏
  const handleRemove = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('确定取消收藏该发型吗？')) {
       await api.deleteSavedHairstyle(id);
       setSavedList(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F7F9]">
       <TopNav title="收藏的发型" onBack={onBack} />
       <div className="p-4 grid grid-cols-2 gap-3 overflow-y-auto">
          {loading ? (
            <div className="col-span-2 flex justify-center mt-10"><LoadingSpinner color="border-[#FF3D81]" /></div>
          ) : savedList.length === 0 ? (
             <div className="col-span-2 text-center text-gray-400 mt-10">暂无收藏。</div>
          ) : (
            savedList.map(style => (
               <div key={style.id} onClick={() => onNavigate('hairstyleDetail', style)} className="bg-white rounded-xl overflow-hidden shadow-sm pb-3 group">
                 <div className="relative aspect-[4/5] bg-gray-200">
                   <img src={style.imageUrl} alt={style.name} className="w-full h-full object-cover" />
                   <button className="absolute top-2 right-2 bg-white/80 p-1.5 rounded-full backdrop-blur-sm text-red-500">
                     <Heart className="w-4 h-4 fill-red-500" />
                   </button>
                 </div>
                 <div className="px-3 pt-3">
                   <h3 className="font-bold text-sm text-gray-900 line-clamp-1">{style.name}</h3>
                   <div className="flex flex-wrap gap-1 mt-1.5 mb-3">
                     {style.tags.slice(0, 2).map(tag => (
                       <span key={tag} className="text-[10px] bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded">{tag}</span>
                     ))}
                   </div>
                   
                   {/* 操作按钮区 */}
                   <div className="flex items-center gap-2 mt-auto border-t border-gray-50 pt-2">
                      <ButtonSecondary className="!py-1 !px-2 !text-[10px] flex-1 flex justify-center" onClick={(e) => { e.stopPropagation(); handleTryOn(style); }}>
                         <Scissors size={12} className="mr-1" /> 试戴
                      </ButtonSecondary>
                      <button 
                        onClick={(e) => handleRemove(e, style.id)} 
                        className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                   </div>
                 </div>
               </div>
             ))
          )}
       </div>
    </div>
  );
}

// 12. 收藏的门店页 (SAVED STORES PAGE)
const SavedStoresPage: React.FC<{ onNavigate: NavigateFunction; onBack: () => void }> = ({ onNavigate, onBack }) => {
  const [savedStores, setSavedStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.getSavedStores().then(data => {
      setSavedStores(data);
      setLoading(false);
    });
  }, []);

  const handleRemove = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('确定取消收藏该门店吗？')) {
      await api.deleteSavedStore(id);
      setSavedStores(prev => prev.filter(s => s.id !== id));
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#F7F7F9]">
      <TopNav title="收藏的门店" onBack={onBack} />
      <div className="p-4 space-y-3 overflow-y-auto">
        {loading ? (
           <div className="flex justify-center mt-10"><LoadingSpinner color="border-[#FF3D81]" /></div>
        ) : savedStores.length === 0 ? (
           <div className="text-center text-gray-400 mt-10">暂无收藏门店。</div>
        ) : (
           savedStores.map(s => (
            <div key={s.id} className="bg-white rounded-2xl p-3 shadow-sm flex gap-3 relative">
               <img src={s.imageUrl} className="w-20 h-20 rounded-lg object-cover shrink-0" />
               <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                     <h4 className="font-bold text-gray-900 truncate">{s.name}</h4>
                     <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600 mt-1">
                     <span className="font-bold text-orange-500">★ {s.rating}</span>
                     <span>¥{s.price}/人</span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1 truncate">{s.description}</p>
                  <div className="flex justify-between items-center mt-2">
                     <div className="flex gap-1">{s.tags.slice(0, 2).map(t => <TagChip key={t} label={`#${t}`} color="bg-gray-100 text-gray-500"/>)}</div>
                     <div className="flex items-center gap-2">
                        <button 
                          onClick={(e) => handleRemove(e, s.id)}
                          className="text-gray-400 hover:text-red-500 p-1"
                        >
                           <Trash2 size={14} />
                        </button>
                        <ButtonPrimary 
                          onClick={() => onNavigate('chat', { target: s, isNewSession: false })} 
                          className="!py-1 !px-3 !text-xs !w-auto"
                        >
                          咨询
                        </ButtonPrimary>
                     </div>
                  </div>
               </div>
            </div>
           ))
        )}
      </div>
    </div>
  );
}

// 13. 帮助与支持页 (HELP PAGE) - (保持不变)
const HelpPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  return (
     <div className="flex flex-col h-full bg-[#F7F7F9]">
        <TopNav title="帮助与支持" onBack={onBack} />
        <div className="p-4 space-y-4 overflow-y-auto">
           <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">常见问题</h3>
              <div className="space-y-3">
                 <div className="border-b border-gray-100 pb-2">
                    <div className="text-sm font-medium text-gray-800 mb-1">如何获得最佳 AI 效果？</div>
                    <div className="text-xs text-gray-500">确保照片光线充足，正对镜头，且头发不要遮挡面部轮廓。</div>
                 </div>
                 <div className="border-b border-gray-100 pb-2">
                    <div className="text-sm font-medium text-gray-800 mb-1">我的照片隐私安全吗？</div>
                    <div className="text-xs text-gray-500">是的，您的照片仅用于即时生成，未经允许不会被公开或分享。</div>
                 </div>
                 <div>
                    <div className="text-sm font-medium text-gray-800 mb-1">价格准确吗？</div>
                    <div className="text-xs text-gray-500">显示价格为门店参考价，具体请通过聊天功能与门店确认。</div>
                 </div>
              </div>
           </div>
           
           <div className="bg-white rounded-2xl p-4 shadow-sm">
              <h3 className="font-bold text-gray-900 mb-2">联系我们</h3>
              <button className="w-full flex items-center justify-between py-2 text-sm text-gray-700">
                 <span>邮件支持</span>
                 <ExternalLink size={16} className="text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between py-2 text-sm text-gray-700">
                 <span>服务条款</span>
                 <ExternalLink size={16} className="text-gray-400" />
              </button>
              <button className="w-full flex items-center justify-between py-2 text-sm text-gray-700">
                 <span>隐私政策</span>
                 <ExternalLink size={16} className="text-gray-400" />
              </button>
           </div>
        </div>
     </div>
  );
}

// 新增：个人资料编辑页 (PROFILE EDIT)
const ProfileEdit: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    api.getUserProfile().then(u => {
      setName(u.name);
      setBio(u.bio || '');
      setAvatar(u.avatar);
    });
  }, []);

  const handleSave = async () => {
    setLoading(true);
    await api.updateUserProfile({ name, bio, avatar });
    setLoading(false);
    onBack();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setAvatar(ev.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
     <div className="flex flex-col h-full bg-[#F7F7F9]">
        <TopNav title="编辑个人资料" onBack={onBack} />
        <div className="p-4">
           {/* Avatar */}
           <div className="flex flex-col items-center mb-6">
              <div className="relative w-24 h-24 mb-3">
                 <img src={avatar} className="w-full h-full rounded-full object-cover border-2 border-white shadow-md" />
                 <label className="absolute bottom-0 right-0 bg-[#FF3D81] p-1.5 rounded-full text-white cursor-pointer shadow-sm">
                    <Edit3 size={14} />
                    <input type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
                 </label>
              </div>
              <span className="text-xs text-gray-400">点击修改头像</span>
           </div>

           {/* Form */}
           <div className="bg-white rounded-2xl p-4 shadow-sm space-y-4">
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-1">昵称</label>
                 <input 
                   value={name}
                   onChange={e => setName(e.target.value)}
                   className="w-full bg-gray-50 rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-pink-300"
                   placeholder="请输入昵称"
                 />
              </div>
              <div>
                 <label className="block text-sm font-bold text-gray-700 mb-1">个人简介</label>
                 <textarea 
                   value={bio}
                   onChange={e => setBio(e.target.value)}
                   className="w-full bg-gray-50 rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-pink-300 min-h-[100px]"
                   placeholder="介绍一下你自己..."
                 />
              </div>
           </div>

           <div className="mt-8">
              <ButtonPrimary onClick={handleSave} disabled={loading}>
                 {loading ? '保存中...' : '保存修改'}
              </ButtonPrimary>
           </div>
        </div>
     </div>
  )
}


// 14. 个人中心页 (PROFILE)
const Profile: React.FC<{ onNavigate: NavigateFunction }> = ({ onNavigate }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    api.getUserProfile().then(setUser);
  }, []);

  if (!user) return <LoadingSpinner color="text-gray-300" />;

  return (
    <div className="flex flex-col h-full bg-[#F7F7F9] pb-24 overflow-y-auto hide-scrollbar">
      <div className="bg-white p-6 pb-8 rounded-b-[32px] shadow-sm mb-4">
         <div className="flex items-center gap-4 mb-6">
            <img src={user.avatar} className="w-16 h-16 rounded-full border-2 border-pink-100" />
            <div className="flex-1">
               <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
               <p className="text-xs text-gray-400 line-clamp-2">{user.bio || '完善个人信息，让发型推荐更懂你'}</p>
            </div>
            <button onClick={() => onNavigate('profileEdit')} className="p-2 rounded-full active:bg-gray-100">
               <Settings className="text-gray-400" />
            </button>
         </div>
         <div className="flex gap-4">
            <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
               <div className="text-lg font-bold text-gray-900">{user.tryOnCount}</div>
               <div className="text-xs text-gray-500">试戴次数</div>
            </div>
            <div className="flex-1 bg-gray-50 rounded-xl p-3 text-center">
               <div className="text-lg font-bold text-gray-900">{user.aiQuota}</div>
               <div className="text-xs text-gray-500">剩余试戴次数</div>
            </div>
         </div>
      </div>

      <div className="bg-white mx-4 rounded-2xl p-4 shadow-sm mb-4">
         {/* Removed Title: 我的资产 */}
         <div className="space-y-4">
            <div onClick={() => onNavigate('history')} className="flex items-center justify-between cursor-pointer active:bg-gray-50 p-1 rounded-lg transition-colors">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center text-orange-500"><ImageIcon size={16} /></div>
                  <span className="text-sm text-gray-700">我的试戴</span>
               </div>
               <ChevronRight className="text-gray-300 w-4 h-4" />
            </div>
            <div onClick={() => onNavigate('savedHairstyles')} className="flex items-center justify-between cursor-pointer active:bg-gray-50 p-1 rounded-lg transition-colors">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center text-pink-500"><Heart size={16} /></div>
                  <span className="text-sm text-gray-700">收藏的发型</span>
               </div>
               <ChevronRight className="text-gray-300 w-4 h-4" />
            </div>
            <div onClick={() => onNavigate('savedStores')} className="flex items-center justify-between cursor-pointer active:bg-gray-50 p-1 rounded-lg transition-colors">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-500"><MapPin size={16} /></div>
                  <span className="text-sm text-gray-700">收藏的门店</span>
               </div>
               <ChevronRight className="text-gray-300 w-4 h-4" />
            </div>
         </div>
      </div>
      
      <div className="bg-white mx-4 rounded-2xl p-4 shadow-sm mb-4">
         {/* Removed Title: 帮助与支持 */}
         <div className="space-y-4">
            <div onClick={() => onNavigate('help')} className="flex items-center justify-between cursor-pointer active:bg-gray-50 p-1 rounded-lg transition-colors">
               <span className="text-sm text-gray-700">帮助与反馈</span>
               <ChevronRight className="text-gray-300 w-4 h-4" />
            </div>
         </div>
      </div>
    </div>
  );
};

// --- 主入口组件 (APP ROOT) ---

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('hairstyle');
  const [viewStack, setViewStack] = useState<{ page: string; data?: any }[]>([]);
  
  // 全局状态：保留用户上传的照片，避免返回时丢失
  const [globalUserImage, setGlobalUserImage] = useState<string | null>(null);
  
  // 全局状态：保留首页筛选条件
  const [homeFilters, setHomeFilters] = useState({ gender: 'Male', category: '全部' });

  // 历史记录状态
  const [history, setHistory] = useState<TryOnHistoryItem[]>([]);

  // 初始化加载历史记录
  useEffect(() => {
    api.getTryOnHistory().then(setHistory);
  }, []);

  // 导航逻辑
  const navigate = (page: string, data?: any, replace: boolean = false) => {
    if (replace) {
      // 替换栈顶页面
      setViewStack(prev => [...prev.slice(0, -1), { page, data }]);
    } else {
      // 压入新页面
      setViewStack(prev => [...prev, { page, data }]);
    }
  };

  // 返回逻辑
  const goBack = () => {
    setViewStack(prev => prev.slice(0, -1));
  };
  
  // 添加历史记录（更新 UI）
  const addToHistory = (item: TryOnHistoryItem) => {
    setHistory(prev => [item, ...prev]);
  };
  
  // 删除历史记录 (更新 UI 并调用 API)
  const removeFromHistory = async (id: string) => {
    await api.deleteHistoryItem(id);
    setHistory(prev => prev.filter(item => item.id !== id));
  };

  // 计算当前视图
  const currentView = viewStack.length > 0 ? viewStack[viewStack.length - 1] : null;

  // 渲染路由逻辑
  const renderContent = () => {
    // 如果有视图栈，优先渲染栈顶视图（覆盖 Tab）
    if (currentView) {
      switch (currentView.page) {
        case 'hairstyleDetail':
          return <HairstyleDetail data={currentView.data} onNavigate={navigate} onBack={goBack} />;
        case 'tryOnEntry':
          return (
            <TryOnEntry 
              targetHairstyle={currentView.data?.targetHairstyle} 
              savedImage={globalUserImage}
              onImageUpdate={setGlobalUserImage}
              onNavigate={navigate} 
              onBack={goBack} 
            />
          );
        case 'tryOnLoading':
          return <TryOnLoading inputData={currentView.data} onNavigate={navigate} />;
        case 'tryOnResult':
          return <TryOnResult data={currentView.data} onNavigate={navigate} onBack={goBack} onSaveToHistory={addToHistory} />;
        case 'storeSelect':
          return <StoreSelect data={currentView.data} onNavigate={navigate} onBack={goBack} />;
        case 'storeRanking':
          return <StoreRanking onNavigate={navigate} onBack={goBack} />;
        case 'chat':
          return <Chat data={currentView.data} onBack={goBack} />;
        case 'history':
          return <HistoryPage history={history} onNavigate={navigate} onBack={goBack} onDeleteHistory={removeFromHistory} />;
        case 'savedHairstyles':
          return <SavedHairstylesPage onNavigate={navigate} onBack={goBack} />;
        case 'savedStores':
          return <SavedStoresPage onNavigate={navigate} onBack={goBack} />;
        case 'help':
          return <HelpPage onBack={goBack} />;
        case 'profileEdit':
          return <ProfileEdit onBack={goBack} />;
        default:
          return <div>Page not found</div>;
      }
    }

    // 否则渲染主 Tab 页面
    switch (activeTab) {
      case 'hairstyle':
        return <Home onNavigate={navigate} filters={homeFilters} setFilters={setHomeFilters} />;
      case 'square':
        return <Square onNavigate={navigate} />;
      case 'message':
        return <MessageList onNavigate={navigate} />;
      case 'profile':
        return <Profile onNavigate={navigate} />;
      default:
        return <Home onNavigate={navigate} filters={homeFilters} setFilters={setHomeFilters} />;
    }
  };

  return (
    <MobileLayout>
      {renderContent()}
      {/* 仅在根层级（无视图栈）显示 TabBar */}
      {viewStack.length === 0 && (
        <TabBar currentTab={activeTab} onTabChange={setActiveTab} />
      )}
    </MobileLayout>
  );
};

export default App;
