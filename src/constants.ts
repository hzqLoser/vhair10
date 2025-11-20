import { Barber, ChatSession, Gender, Hairstyle, Store, Topic, User, UserShow, TryOnHistoryItem } from "@/types";

export const APP_NAME = "HairMatch AI";

export const MOCK_USER: User = {
  id: 'u1',
  name: 'Sophia Lin',
  avatar: 'https://picsum.photos/seed/user_avatar/200/200',
  tryOnCount: 12,
  aiQuota: 5,
  bio: '热爱生活，追求时尚，寻找最适合自己的发型！'
};

export const HAIRSTYLES: Hairstyle[] = [
  {
    id: 'h1',
    name: 'Airy Medium Curl',
    imageUrl: 'https://picsum.photos/seed/hair1/400/500',
    tags: ['Round Face', 'Student', 'Natural'],
    gender: Gender.Female,
    category: 'curly',
    heat: 1200,
    isCollected: false,
    description: 'Light and fluffy overall, with airy bangs modifying the face shape, looking gentle and temperament.'
  },
  {
    id: 'h2',
    name: 'French Bob',
    imageUrl: 'https://picsum.photos/seed/hair2/400/500',
    tags: ['Chic', 'Easy Care', 'Volume'],
    gender: Gender.Female,
    category: 'short',
    heat: 950,
    isCollected: true,
    description: 'Classic French Bob, adding visual volume through layers, simple to manage, with effortless elegance.'
  },
  {
    id: 'h3',
    name: 'Korean Texture Cut',
    imageUrl: 'https://picsum.photos/seed/hair3/400/500',
    tags: ['Trendy', 'Clean'],
    gender: Gender.Male,
    category: 'short',
    heat: 800,
    isCollected: false,
    description: 'Neat sides with textured top, similar to K-drama leads, suitable for most young men.'
  },
  {
    id: 'h4',
    name: 'Elegant Long Wavy',
    imageUrl: 'https://picsum.photos/seed/hair4/400/500',
    tags: ['Elegant', 'Dating'],
    gender: Gender.Female,
    category: 'long',
    heat: 1500,
    isCollected: true,
    description: 'Long hair with large waves, adding flow and layers, full of goddess vibes, suitable for formal occasions.'
  },
   {
    id: 'h5',
    name: 'Edgy Wolf Cut',
    imageUrl: 'https://picsum.photos/seed/hair5/400/500',
    tags: ['Cool', 'Street'],
    gender: Gender.Female,
    category: 'curly',
    heat: 600,
    isCollected: false,
    description: 'Modified Wolf Cut, rich layers, thin ends, a rebellious and personalized fashion choice.'
  },
  {
    id: 'h6',
    name: 'Pixie Cut',
    imageUrl: 'https://picsum.photos/seed/hair6/400/500',
    tags: ['Short', 'Bold'],
    gender: Gender.Female,
    category: 'short',
    heat: 1100,
    isCollected: false,
    description: 'A bold short style that highlights facial features.'
  }
];

export const STORES: Store[] = [
  {
    id: 's1',
    name: 'Zenith Salon (West Lake)',
    imageUrl: 'https://picsum.photos/seed/store1/200/200',
    rating: 4.9,
    price: 120,
    distance: '1.2km',
    tags: ['Perm/Dye', 'Japanese Cut', 'Popular'],
    description: 'Senior stylists, enthusiastic service, no hard selling, comfortable environment.',
    isBookable: true,
    isSaved: true
  },
  {
    id: 's2',
    name: 'Artisan Studio (KKMall)',
    imageUrl: 'https://picsum.photos/seed/store2/200/200',
    rating: 4.8,
    price: 228,
    distance: '2.5km',
    tags: ['Japanese Cut', 'High-end Care'],
    description: 'Focus on high-end hair experience, aesthetic design team.',
    isBookable: true,
    isSaved: false
  },
  {
    id: 's3',
    name: 'Style Aesthetics (Center)',
    imageUrl: 'https://picsum.photos/seed/store3/200/200',
    rating: 4.8,
    price: 158,
    distance: '3.1km',
    tags: ['Care Master', 'Color Expert'],
    description: 'Focus on hair health and color design, excellent dyeing.',
    isBookable: false,
    isSaved: true
  }
];

export const BARBERS: Barber[] = [
  {
    id: 'b1',
    name: 'Stylist A',
    storeName: 'Zenith Salon',
    imageUrl: 'https://picsum.photos/seed/barber1/200/200',
    rating: 4.9,
    tags: ['Short Hair', 'Trendy Color'],
    description: 'Senior Stylist, served 500+ clients, expert in face shape matching.',
    yearsExperience: 5
  },
  {
    id: 'b2',
    name: 'Stylist B',
    storeName: 'Artisan Studio',
    imageUrl: 'https://picsum.photos/seed/barber2/200/200',
    rating: 5.0,
    tags: ['Men\'s Hair', 'Texture Perm'],
    description: 'Chief Designer, 8 years exp, specializes in natural fluffy styles.',
    yearsExperience: 8
  }
];

export const TOPICS: Topic[] = [
  { id: 't1', title: 'My Hometown: Finding the "Best" Barber', participants: 1234, color: 'bg-orange-100 text-orange-600' },
  { id: 't2', title: 'What hairstyle fits a round face?', participants: 8456, color: 'bg-pink-100 text-pink-600' },
  { id: 't3', title: '2024 Autumn/Winter Color Trends', participants: 10982, color: 'bg-purple-100 text-purple-600' },
];

export const USERSHOWS: UserShow[] = [
  {
    id: 'us1',
    userName: 'Cathy',
    userAvatar: 'https://picsum.photos/seed/user1/100/100',
    beforeImage: 'https://picsum.photos/seed/before1/300/300',
    afterImage: 'https://picsum.photos/seed/after1/300/300',
    comment: 'The effect is really natural, recommended to friends!',
    likes: 972,
    replies: 45,
    saved: true,
    referenceHairstyleUrl: 'https://picsum.photos/seed/hair1/400/500',
    referenceHairstyleName: 'Airy Medium Curl'
  },
  {
    id: 'us2',
    userName: 'Alex',
    userAvatar: 'https://picsum.photos/seed/user2/100/100',
    beforeImage: 'https://picsum.photos/seed/before2/300/300',
    afterImage: 'https://picsum.photos/seed/after2/300/300',
    comment: 'Pretty close, awesome, want to change hair every day.',
    likes: 1200,
    replies: 88,
    saved: false,
    referenceHairstyleUrl: 'https://picsum.photos/seed/hair3/400/500',
    referenceHairstyleName: 'Korean Texture Cut'
  }
];

export const MOCK_CHATS: ChatSession[] = [
  {
    id: 'c1',
    targetId: 's1',
    targetName: 'Zenith Salon · West Lake',
    targetImage: 'https://picsum.photos/seed/store1/200/200',
    targetRole: 'Store',
    lastMessage: 'Okay, see you Saturday afternoon!',
    unreadCount: 1,
    timestamp: '10:45',
    messages: [
        {
            id: 'm1',
            senderId: 's1',
            timestamp: '10:40',
            type: 'text',
            text: 'Hello! Received your try-on effect. This Japanese curl suits your face shape well.'
        },
        {
            id: 'm2',
            senderId: 'user',
            timestamp: '10:42',
            type: 'text',
            text: 'Great! I like it too. How long does it take and what is the price?'
        }
    ]
  }
];

export const MOCK_HISTORY: TryOnHistoryItem[] = [
  { 
    id: 'hist1', 
    date: '2023-10-24', 
    hairstyleName: 'French Bob', 
    imageUrl: 'https://picsum.photos/seed/hair2/300/400',
    originalImageUrl: 'https://picsum.photos/seed/user_face1/300/400'
  },
  { 
    id: 'hist2', 
    date: '2023-10-20', 
    hairstyleName: 'Airy Medium Curl', 
    imageUrl: 'https://picsum.photos/seed/hair1/300/400',
    originalImageUrl: 'https://picsum.photos/seed/user_face2/300/400'
  },
  { 
    id: 'hist3', 
    date: '2023-10-15', 
    hairstyleName: 'Elegant Long Wavy', 
    imageUrl: 'https://picsum.photos/seed/hair4/300/400',
    originalImageUrl: 'https://picsum.photos/seed/user_face3/300/400'
  },
];
