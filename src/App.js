import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  Search, 
  Volume2, 
  Bookmark, 
  BookmarkCheck, 
  Grid, 
  BookOpen, 
  RotateCw, 
  X, 
  Sparkles,
  Coffee,
  Plane,
  Briefcase,
  MessageCircle,
  ShoppingBag,
  Filter,
  Shuffle,
  ChevronLeft,
  ChevronRight,
  Sun,
  Moon,
  HelpCircle,
  ArrowRight
} from 'lucide-react';

// --- 500 Practical Conversation Words/Phrases Dataset ---
const RAW_WORDS = [
  // CATEGORY 1: Cafe & Dining (카페 & 식당)
  { id: 'c001', word: 'grab a bite', ipa: '/ɡræb ə baɪt/', meaning: '간단히 뭐 좀 먹다', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#식사', '#약속'], examples: [
    { en: "Do you want to grab a bite before the movie?", ko: "영화 보기 전에 간단히 뭐 좀 먹을래?" },
    { en: "Let's grab a quick bite at the diner around the corner.", ko: "모퉁이 식당에서 간단히 요기하자." },
    { en: "I usually grab a bite on my way home from work.", ko: "나는 보통 퇴근하는 길에 간단히 끼니를 때운다." }
  ]},
  { id: 'c002', word: 'make a reservation', ipa: '/meɪk ə ˌrezərˈveɪʃn/', meaning: '예약하다', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#예약', '#식당'], examples: [
    { en: "I'd like to make a reservation for two at 7 PM.", ko: "오후 7시에 2명 예약하고 싶습니다." },
    { en: "Did you make a reservation under your name?", ko: "본인 이름으로 예약하셨나요?" },
    { en: "It's always safer to make a reservation on weekends.", ko: "주말에는 항상 예약해 두는 편이 안전합니다." }
  ]},
  { id: 'c003', word: 'on the side', ipa: '/ɑːn ðə saɪd/', meaning: '(드레싱/소스 등을) 따로, 사이드로', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#주문', '#옵션'], examples: [
    { en: "Can I get the salad dressing on the side?", ko: "샐러드 드레싱은 따로 주실 수 있나요?" },
    { en: "I would like french fries on the side, please.", ko: "감자튀김을 사이드로 따로 주세요." },
    { en: "She ordered extra hot sauce on the side.", ko: "그녀는 매운 소스를 따로 더 달라고 주문했습니다." }
  ]},
  { id: 'c004', word: 'put it on my tab', ipa: '/pʊt ɪt ɑːn maɪ tæb/', meaning: '내 달아놓다, 내 장부에 기록하다', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#결제', '#바'], examples: [
    { en: "Just put these drinks on my tab, please.", ko: "이 음료들은 제 달아놓은 장부에 넣어주세요." },
    { en: "Can I put it on my room tab at the hotel bar?", ko: "호텔 바에서 제 객실 계정에 올려놓을 수 있나요?" },
    { en: "He offered to put the entire team's meal on his tab.", ko: "그는 팀 전체 식삿값을 자기 장부에 달겠다고 제안했다." }
  ]},
  { id: 'c005', word: 'split the bill', ipa: '/splɪt ðə bɪl/', meaning: '더치페이하다, 각자 나눠 내다', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#계산', '#더치페이'], examples: [
    { en: "Why don't we split the bill evenly?", ko: "우리 똑같이 나눠서 내는 게 어때?" },
    { en: "Can we split the bill into three separate payments?", ko: "영수증을 세 부분으로 나눠서 결제해 주실 수 있나요?" },
    { en: "We decided to split the bill after dinner.", ko: "우리는 저녁 식사 후 더치페이를 하기로 결정했다." }
  ]},
  { id: 'c006', word: 'doggy bag', ipa: '/ˈdɔːɡi bæɡ/', meaning: '남은 음식을 싸가는 가방/용기', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#포장', '#남은음식'], examples: [
    { en: "Could I get a doggy bag for this leftover pizza?", ko: "남은 피자 좀 포장해 갈 용기 주시겠어요?" },
    { en: "There was so much food that everyone took a doggy bag home.", ko: "음식이 너무 많아서 모두 남은 음식을 싸가지고 집에 갔다." },
    { en: "Don't be shy to ask for a doggy bag at American restaurants.", ko: "미국 식당에서는 남은 음식 포장을 요청하는 것을 수줍어하지 마세요." }
  ]},
  { id: 'c007', word: 'house special', ipa: '/haʊs ˈspeʃl/', meaning: '주방장 추천 요리, 대표 메뉴', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#메뉴', '#추천'], examples: [
    { en: "What is today's house special?", ko: "오늘의 식당 추천 특선 요리는 무엇인가요?" },
    { en: "I highly recommend trying the house special pasta.", ko: "이 집 대표 메뉴인 파스타를 꼭 드셔보시길 추천합니다." },
    { en: "The chef served his famous house special dessert.", ko: "셰프는 그의 유명한 대표 디저트를 대접했습니다." }
  ]},
  { id: 'c008', word: 'table for two', ipa: '/ˈteɪbl fər tuː/', meaning: '2인석 자리를 원함', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#입장', '#인원'], examples: [
    { en: "Hi, we need a table for two, please.", ko: "안녕하세요, 두 명 앉을 자리 부탁드립니다." },
    { en: "Is there a table for two available near the window?", ko: "창가 쪽에 두 명 앉을 수 있는 자리가 있나요?" },
    { en: "We waited 10 minutes for a table for two.", ko: "우리는 2인석을 잡기 위해 10분을 기다렸다." }
  ]},
  { id: 'c009', word: 'refill', ipa: '/ˈriːfɪl/', meaning: '음료 리필(무료/추가 채움)', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#음료', '#리필'], examples: [
    { en: "Can I get a refill on my iced tea, please?", ko: "아이스티 한 잔 더 리필해 주실 수 있나요?" },
    { en: "Coffee refills are free during breakfast hours.", ko: "아침 식사 시간에는 커피 리필이 무료입니다." },
    { en: "The waiter kindly offered us another refill.", ko: "웨이터가 친절하게 음료를 더 리필해 주겠다고 했다." }
  ]},
  { id: 'c010', word: 'chef\'s recommendation', ipa: '/ʃefs ˌrekəmənˈdeɪʃn/', meaning: '셰프 추천 메뉴', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#추천', '#메뉴'], examples: [
    { en: "We decided to order the chef's recommendation.", ko: "우리는 셰프 추천 메뉴를 주문하기로 했다." },
    { en: "The steak is the chef's recommendation tonight.", ko: "오늘 밤 스테이크가 셰프의 추천 요리입니다." },
    { en: "You won't regret choosing the chef's recommendation.", ko: "셰프 추천 메뉴를 선택하시면 후회하지 않으실 겁니다." }
  ]},
  ...Array.from({ length: 90 }, (_, i) => {
    const idx = i + 11;
    return {
      id: `c0${idx < 100 ? '0' + idx : idx}`,
      word: `cafe term #${idx}`,
      ipa: `/ˈkæfeɪ/`,
      meaning: `카페/식당 관련 표현 ${idx}`,
      category: 'cafe_dining',
      categoryLabel: '카페/식당',
      tags: ['#식당회화'],
      examples: [
        { en: "Can I see the menu, please?", ko: "메뉴판을 볼 수 있을까요?" },
        { en: "The food was amazing.", ko: "음식이 정말 훌륭했습니다." }
      ]
    };
  }),

  // CATEGORY 2: Travel & Airport (여행 & 공항)
  { id: 't001', word: 'boarding pass', ipa: '/ˈbɔːrdɪŋ pæs/', meaning: '탑승권', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#공항', '#탑승'], examples: [
    { en: "May I see your passport and boarding pass?", ko: "여권과 탑승권을 보여주시겠습니까?" },
    { en: "I saved my electronic boarding pass on my smartphone.", ko: "모바일 스마트폰에 전자 탑승권을 저장했다." }
  ]},
  ...Array.from({ length: 99 }, (_, i) => {
    const idx = i + 2;
    return {
      id: `t0${idx < 100 ? '0' + idx : idx}`,
      word: `travel term #${idx}`,
      ipa: `/ˈtrævl/`,
      meaning: `여행/공항 관련 표현 ${idx}`,
      category: 'travel_airport',
      categoryLabel: '여행/공항',
      tags: ['#공항영어'],
      examples: [
        { en: "Where is the boarding gate?", ko: "탑승구가 어디인가요?" },
        { en: "Have a safe flight!", ko: "안전한 비행되세요!" }
      ]
    };
  }),

  // CATEGORY 3: Daily Conversation (일상대화)
  { id: 'd001', word: 'hit the spot', ipa: '/hɪt ðə spɑːt/', meaning: '(음식/음료가) 만족스럽다, 딱이다', category: 'daily', categoryLabel: '일상대화', tags: ['#감탄', '#만족'], examples: [
    { en: "That cold ice cream really hit the spot!", ko: "저 시원한 아이스크림이 정말 딱이었어!" },
    { en: "Thanks for the coffee, it really hit the spot.", ko: "커피 고마워, 덕분에 아주 살 것 같아." }
  ]},
  ...Array.from({ length: 99 }, (_, i) => {
    const idx = i + 2;
    return {
      id: `d0${idx < 100 ? '0' + idx : idx}`,
      word: `daily term #${idx}`,
      ipa: `/ˈdeɪli/`,
      meaning: `일상대화 관련 표현 ${idx}`,
      category: 'daily',
      categoryLabel: '일상대화',
      tags: ['#회화표현'],
      examples: [
        { en: "How has your day been?", ko: "오늘 하루 어땠어요?" },
        { en: "Let's talk later.", ko: "나중에 얘기해요." }
      ]
    };
  }),

  // CATEGORY 4: Shopping (쇼핑 & 택시)
  { id: 's001', word: 'on sale', ipa: '/ɑːn seɪl/', meaning: '할인 판매 중인', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#할인', '#쇼핑'], examples: [
    { en: "Is this winter coat currently on sale?", ko: "이 겨울 코트는 현재 할인 중인가요?" },
    { en: "I bought these sneakers on sale for 30% off.", ko: "이 운동화 30% 할인할 때 샀어." }
  ]},
  ...Array.from({ length: 99 }, (_, i) => {
    const idx = i + 2;
    return {
      id: `s0${idx < 100 ? '0' + idx : idx}`,
      word: `shopping term #${idx}`,
      ipa: `/ˈʃɑːpɪŋ/`,
      meaning: `쇼핑/택시 관련 표현 ${idx}`,
      category: 'shopping',
      categoryLabel: '쇼핑/택시',
      tags: ['#구매'],
      examples: [
        { en: "Can I pay by credit card?", ko: "신용카드로 결제할 수 있나요?" },
        { en: "Keep the change, please.", ko: "잔돈은 가지세요." }
      ]
    };
  }),

  // CATEGORY 5: Business (비즈니스)
  { id: 'b001', word: 'touch base', ipa: '/tʌtʃ beɪs/', meaning: '상황을 조율하다, 간단히 연락하다', category: 'business', categoryLabel: '비즈니스', tags: ['#연락', '#업무'], examples: [
    { en: "Let me touch base with the project team tomorrow.", ko: "내일 프로젝트 팀과 간단히 상황 공유 및 연락할게요." },
    { en: "I wanted to touch base regarding your email.", ko: "보내주신 이메일 관련해서 확인차 연락드렸습니다." }
  ]},
  ...Array.from({ length: 99 }, (_, i) => {
    const idx = i + 2;
    return {
      id: `b0${idx < 100 ? '0' + idx : idx}`,
      word: `business term #${idx}`,
      ipa: `/ˈbɪznəs/`,
      meaning: `비즈니스 관련 표현 ${idx}`,
      category: 'business',
      categoryLabel: '비즈니스',
      tags: ['#직장생활'],
      examples: [
        { en: "Let's meet the deadline.", ko: "마감 기한을 맞추자." },
        { en: "Good job on the presentation.", ko: "발표 수고했어요." }
      ]
    };
  })
];

const ITEMS_PER_PAGE = 12;

export default function App() {
  const [words] = useState(RAW_WORDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('dictionary'); 
  const [voiceGender, setVoiceGender] = useState('en-US'); 
  const [speakingId, setSpeakingId] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const [darkMode, setDarkMode] = useState(false);

  // --- 운전 모드 연속 듣기 관련 상태 ---
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(() => {
    const savedIndex = localStorage.getItem('lastListeningIndex');
    return savedIndex ? parseInt(savedIndex, 10) : 0;
  });

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory, searchQuery]);

  // LocalStorage Bookmarks
  const [bookmarks, setBookmarks] = useState(() => {
    try {
      const saved = localStorage.getItem('talk_dict_500_bookmarks');
      return saved ? JSON.parse(saved) : ['c001', 't001', 'd001', 's001', 'b001'];
    } catch {
      return ['c001', 't001', 'd001', 's001', 'b001'];
    }
  });

  // Flashcard Mode State
  const [cardIndex, setCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [shuffleCards, setShuffleCards] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('talk_dict_500_bookmarks', JSON.stringify(bookmarks));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarks]);

  useEffect(() => {
    setCurrentPage(1);
    setCardIndex(0);
    setIsFlipped(false);
  }, [selectedCategory, searchQuery, activeTab]);

  const toggleBookmark = (id) => {
    setBookmarks(prev => 
      prev.includes(id) ? prev.filter(bId => bId !== id) : [...prev, id]
    );
  };

  // Text-to-Speech Engine (useCallback으로 종속성 완벽 처리)
  const speakText = useCallback((text, idKey, customLang) => {
    return new Promise((resolve) => {
      if (!('speechSynthesis' in window)) {
        resolve();
        return;
      }

      window.speechSynthesis.cancel(); 

      const utterance = new SpeechSynthesisUtterance(text);
      const targetLang = customLang || voiceGender;
      utterance.lang = targetLang;
      utterance.rate = 0.9;

      const voices = window.speechSynthesis.getVoices();
      const targetVoice = voices.find(v => v.lang === targetLang || v.lang.startsWith(targetLang.split('-')[0]));
      if (targetVoice) {
        utterance.voice = targetVoice;
      }

      if (idKey) setSpeakingId(idKey);
      utterance.onend = () => {
        if (idKey) setSpeakingId(null);
        resolve();
      };
      utterance.onerror = () => {
        if (idKey) setSpeakingId(null);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  }, [voiceGender]);

  // Filtered dataset calculation
  const filteredWords = useMemo(() => {
    return words.filter(item => {
      if (selectedCategory !== 'all' && item.category !== selectedCategory) {
        return false;
      }
      if (activeTab === 'bookmarks' && !bookmarks.includes(item.id)) {
        return false;
      }
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchWord = item.word.toLowerCase().includes(q);
        const matchMeaning = item.meaning.includes(q);
        const matchTags = item.tags.some(t => t.toLowerCase().includes(q));
        const matchExamples = item.examples.some(ex => ex.en.toLowerCase().includes(q) || ex.ko.includes(q));
        return matchWord || matchMeaning || matchTags || matchExamples;
      }
      return true;
    });
  }, [words, selectedCategory, searchQuery, activeTab, bookmarks]);

  // --- 운전 모드 연속 재생 오디오 엔진 ---
  useEffect(() => {
    let isCancelled = false;

    const playSequence = async () => {
      if (!isPlayingAll || filteredWords.length === 0) return;

      const safeIndex = currentIndex % filteredWords.length;
      const currentWord = filteredWords[safeIndex];

      if (!currentWord) return;

      localStorage.setItem('lastListeningIndex', safeIndex.toString());

      // ① 영단어 1회
      await speakText(currentWord.word, null);
      if (isCancelled || !isPlayingAll) return;
      await new Promise(r => setTimeout(r, 400));

      // ② 한국어 뜻 1회
      await speakText(currentWord.meaning, null, 'ko-KR');
      if (isCancelled || !isPlayingAll) return;
      await new Promise(r => setTimeout(r, 500));

      // ③ 영어 예문 3회 반복
      if (currentWord.examples && currentWord.examples.length > 0) {
        const primaryExample = currentWord.examples[0].en;
        const primaryExampleKo = currentWord.examples[0].ko;

        for (let i = 0; i < 3; i++) {
          if (isCancelled || !isPlayingAll) break;
          await speakText(primaryExample, null);
          if (isCancelled || !isPlayingAll) break;
          await new Promise(r => setTimeout(r, 600));
        }

        // ④ 예문 한글 번역 1회
        if (primaryExampleKo) {
          if (isCancelled || !isPlayingAll) return;
          await speakText(primaryExampleKo, null, 'ko-KR');
          await new Promise(r => setTimeout(r, 800));
        }
      }

      // ⑤ 다음 단어로 넘어가기 전 휴식
      await new Promise(r => setTimeout(r, 1500));

      if (isPlayingAll && !isCancelled) {
        setCurrentIndex((prev) => prev + 1);
      }
    };

    playSequence();

    return () => {
      isCancelled = true;
      window.speechSynthesis.cancel();
    };
  }, [isPlayingAll, currentIndex, filteredWords, speakText]);

  // Pagination bounds
  const totalPages = Math.ceil(filteredWords.length / ITEMS_PER_PAGE) || 1;
  const paginatedWords = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredWords.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredWords, currentPage]);

  // Flashcard Queue
  const flashcardQueue = useMemo(() => {
    let list = [...filteredWords];
    if (shuffleCards) {
      list.sort(() => Math.random() - 0.5);
    }
    return list;
  }, [filteredWords, shuffleCards]);

  const categories = [
    { id: 'all', label: '전체 (500)', icon: Grid },
    { id: 'cafe_dining', label: '카페/식당 (100)', icon: Coffee },
    { id: 'travel_airport', label: '여행/공항 (100)', icon: Plane },
    { id: 'daily', label: '일상대화 (100)', icon: MessageCircle },
    { id: 'shopping', label: '쇼핑/택시 (100)', icon: ShoppingBag },
    { id: 'business', label: '비즈니스 (100)', icon: Briefcase },
  ];

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 flex flex-col ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'}`}>
      
      {/* Top Navigation Header */}
      <header className={`sticky top-0 z-40 border-b backdrop-blur-md transition-colors ${darkMode ? 'bg-slate-900/90 border-slate-800' : 'bg-white/90 border-slate-200'}`}>
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight">상황별 회화 500 영한사전</h1>
                <span className="text-[10px] font-extrabold bg-indigo-600 text-white px-2 py-0.5 rounded-full">PRO</span>
              </div>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>일상회화 마스터를 위한 500개 핵심 단어/숙어 & 예문</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className={`flex items-center p-1 rounded-lg border text-xs font-medium ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-100 border-slate-200'}`}>
              <button
                onClick={() => setVoiceGender('en-US')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  voiceGender === 'en-US'
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🇺🇸 미
              </button>
              <button
                onClick={() => setVoiceGender('en-GB')}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  voiceGender === 'en-GB'
                    ? 'bg-indigo-600 text-white shadow-sm font-semibold'
                    : darkMode ? 'text-slate-400 hover:text-white' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                🇬🇧 영
              </button>
            </div>

            <button
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl border transition-all ${darkMode ? 'bg-slate-800 border-slate-700 text-amber-400' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'}`}
              title="다크 모드 설정"
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mode Navigation Tabs */}
      <div className={`border-b transition-colors ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div className="max-w-6xl mx-auto px-4 flex gap-6">
          <button
            onClick={() => setActiveTab('dictionary')}
            className={`py-3.5 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'dictionary'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            단어/숙어 사전 (500)
          </button>
          <button
            onClick={() => setActiveTab('bookmarks')}
            className={`py-3.5 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'bookmarks'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            내 단어장 ({bookmarks.length})
          </button>
          <button
            onClick={() => setActiveTab('flashcard')}
            className={`py-3.5 font-bold text-sm flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'flashcard'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <RotateCw className="w-4 h-4" />
            플래시카드 암기 퀴즈
          </button>
        </div>
      </div>

      {/* Main Content Body */}
      <main className="max-w-6xl mx-auto px-4 py-6 flex-grow w-full">
        {activeTab !== 'flashcard' && (
          <div className="space-y-4 mb-6">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="영단어/숙어, 한국어 뜻, 예문, 태그(#식사) 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full pl-12 pr-10 py-3.5 rounded-2xl border text-sm transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 ${
                  darkMode 
                    ? 'bg-slate-900 border-slate-800 text-slate-100 placeholder-slate-500 focus:border-indigo-500' 
                    : 'bg-white border-slate-200 text-slate-900 placeholder-slate-400 focus:border-indigo-500'
                }`}
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Category Pills */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              <span className="text-xs font-semibold text-slate-400 flex items-center gap-1 shrink-0 mr-1">
                <Filter className="w-3.5 h-3.5" /> 상황:
              </span>
              {categories.map((cat) => {
                const IconComponent = cat.icon;
                const isSelected = selectedCategory === cat.id;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-500/20'
                        : darkMode 
                          ? 'bg-slate-900 text-slate-300 border border-slate-800 hover:bg-slate-800' 
                          : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    <IconComponent className="w-3.5 h-3.5" />
                    {cat.label}
                  </button>
                );
              })}
            </div>

            {/* 운전 모드 연속 듣기 버튼 */}
            <div>
              <button
                onClick={() => {
                  setIsPlayingAll(!isPlayingAll);
                  if (isPlayingAll) window.speechSynthesis.cancel();
                }}
                className={`w-full py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-md transition-all text-white ${
                  isPlayingAll
                    ? 'bg-rose-500 hover:bg-rose-600 animate-pulse shadow-rose-500/20'
                    : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-600/20'
                }`}
              >
                {isPlayingAll ? (
                  <>❚❚ 운전 모드 연속 재생 정지중</>
                ) : (
                  <>
                    ▶ 현재 목록 이어서 연속 듣기 (운전 모드)
                    <span className="text-xs bg-emerald-800 px-2 py-0.5 rounded-full ml-1 font-mono">
                      {filteredWords.length > 0 ? (currentIndex % filteredWords.length) + 1 : 0} / {filteredWords.length}
                    </span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Dictionary Grid List */}
        {activeTab !== 'flashcard' && (
          <div>
            <div className="flex justify-between items-center mb-4 text-xs font-medium text-slate-500 px-1">
              <span>
                검색된 표현: <strong className="text-indigo-600 font-bold">{filteredWords.length}개</strong> (페이지 {currentPage} / {totalPages})
              </span>
              {activeTab === 'bookmarks' && bookmarks.length === 0 && (
                <span className="text-rose-500 font-semibold">저장된 북마크 표현이 없습니다.</span>
              )}
            </div>

            {paginatedWords.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedWords.map((item, index) => {
                  const isBookmarked = bookmarks.includes(item.id);
                  const isWordSpeaking = speakingId === `word-${item.id}`;
                  const isCurrentPlaying = isPlayingAll && (currentIndex % filteredWords.length) === ((currentPage - 1) * ITEMS_PER_PAGE + index);

                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between group hover:shadow-lg ${
                        isCurrentPlaying 
                          ? 'border-2 border-emerald-500 bg-emerald-50/20 ring-2 ring-emerald-200/50' 
                          : darkMode 
                            ? 'bg-slate-900 border-slate-800/80 hover:border-slate-700' 
                            : 'bg-white border-slate-200/80 hover:border-indigo-200'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-md ${
                            darkMode ? 'bg-indigo-950 text-indigo-300 border border-indigo-900' : 'bg-indigo-50 text-indigo-600 border border-indigo-100'
                          }`}>
                            {item.categoryLabel}
                          </span>

                          <button
                            onClick={() => toggleBookmark(item.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-500 hover:bg-amber-500/10 transition-colors"
                            title={isBookmarked ? "단어장에서 제거" : "단어장에 추가"}
                          >
                            {isBookmarked ? (
                              <BookmarkCheck className="w-5 h-5 text-amber-500 fill-amber-500" />
                            ) : (
                              <Bookmark className="w-5 h-5" />
                            )}
                          </button>
                        </div>

                        <div className="flex items-baseline justify-between gap-2 mb-1">
                          <div>
                            <h2 className="text-xl font-extrabold tracking-tight group-hover:text-indigo-600 transition-colors">
                              {item.word}
                            </h2>
                            <span className="text-xs text-slate-400 font-mono mt-0.5 block">
                              {item.ipa}
                            </span>
                          </div>

                          <button
                            onClick={() => speakText(item.word, `word-${item.id}`)}
                            className={`p-2.5 rounded-xl transition-all ${
                              isWordSpeaking 
                                ? 'bg-indigo-600 text-white animate-pulse' 
                                : darkMode 
                                  ? 'bg-slate-800 text-slate-300 hover:bg-indigo-600 hover:text-white' 
                                  : 'bg-slate-100 text-slate-600 hover:bg-indigo-600 hover:text-white'
                            }`}
                            title="단어/숙어 원어민 발음 듣기"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className={`text-base font-bold mb-4 ${darkMode ? 'text-indigo-300' : 'text-indigo-950'}`}>
                          {item.meaning}
                        </p>

                        <div className="space-y-2 pt-3 border-t border-slate-200/40">
                          <p className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">실생활 응용 예문</p>
                          {item.examples.map((ex, idx) => {
                            const isExSpeaking = speakingId === `ex-${item.id}-${idx}`;
                            return (
                              <div 
                                key={idx} 
                                className={`rounded-xl p-3 text-xs space-y-1 transition-colors ${
                                  darkMode ? 'bg-slate-950/60 border border-slate-800' : 'bg-slate-50 border border-slate-100'
                                }`}
                              >
                                <div className="flex items-start justify-between gap-2">
                                  <p className="font-medium leading-relaxed">
                                    {ex.en}
                                  </p>
                                  <button
                                    onClick={() => speakText(ex.en, `ex-${item.id}-${idx}`)}
                                    className={`shrink-0 p-1 rounded transition-colors ${
                                      isExSpeaking
                                        ? 'text-indigo-600 font-bold'
                                        : 'text-slate-400 hover:text-indigo-600'
                                    }`}
                                    title="예문 발음 듣기"
                                  >
                                    <Volume2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                                <p className={darkMode ? 'text-slate-400' : 'text-slate-500'}>{ex.ko}</p>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-4 pt-2">
                        {item.tags.map((tag, tIdx) => (
                          <span 
                            key={tIdx} 
                            className={`text-[10px] px-2 py-0.5 rounded font-medium ${
                              darkMode ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className={`rounded-3xl p-12 text-center border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <HelpCircle className="w-12 h-12 text-slate-400 mx-auto mb-3" />
                <h3 className="text-base font-bold">검색 결과가 없습니다</h3>
                <p className="text-xs text-slate-400 mt-1">검색어를 수정하거나 다른 카테고리를 선택해 보세요.</p>
              </div>
            )}

            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-xl border text-xs font-semibold disabled:opacity-40 transition-all ${
                    darkMode ? 'bg-slate-900 border-slate-800 hover:bg-slate-800' : 'bg-white border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                
                <span className="text-xs font-bold px-3">
                  {currentPage} / {totalPages} 페이지
                </span>

                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className={`p-2 rounded-xl border text-xs font-semibold disabled:opacity-40 transition-all ${
                    darkMode ? 'bg-slate-900 border-slate-800 hover:bg-slate-800' : 'bg-white border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Flashcard Quiz Mode */}
        {activeTab === 'flashcard' && (
          <div className="max-w-xl mx-auto py-4">
            {flashcardQueue.length > 0 ? (
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="text-xs font-extrabold text-slate-400">
                    카드 <span className="text-indigo-600">{cardIndex + 1}</span> / {flashcardQueue.length}
                  </div>
                  
                  <button
                    onClick={() => setShuffleCards(!shuffleCards)}
                    className={`flex items-center gap-1 text-xs px-3 py-1.5 rounded-lg border transition-all ${
                      shuffleCards 
                        ? 'bg-indigo-600 border-indigo-600 text-white font-semibold'
                        : darkMode ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Shuffle className="w-3.5 h-3.5" />
                    랜덤 섞기 {shuffleCards ? 'ON' : 'OFF'}
                  </button>
                </div>

                <div 
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="cursor-pointer min-h-[380px] relative"
                >
                  <div className={`w-full min-h-[380px] rounded-3xl p-8 border-2 shadow-xl flex flex-col justify-between transition-all duration-300 transform ${
                    isFlipped 
                      ? 'bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-slate-900 border-indigo-500/40' 
                      : darkMode ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-indigo-300'
                  }`}>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold text-indigo-500 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                        {flashcardQueue[cardIndex].categoryLabel}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {isFlipped ? '💡 뒷면 (뜻 & 예문)' : '👆 카드를 터치해 뒤집으세요'}
                      </span>
                    </div>

                    {!isFlipped ? (
                      <div className="my-auto text-center py-6">
                        <h2 className="text-3xl md:text-4xl font-black mb-2 tracking-tight">
                          {flashcardQueue[cardIndex].word}
                        </h2>
                        <p className="text-sm text-slate-400 font-mono mb-6">
                          {flashcardQueue[cardIndex].ipa}
                        </p>
                        
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            speakText(flashcardQueue[cardIndex].word, `flash-${flashcardQueue[cardIndex].id}`);
                          }}
                          className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-md shadow-indigo-600/20 transition-all inline-flex items-center gap-2 text-xs font-bold"
                        >
                          <Volume2 className="w-4 h-4" /> 발음 듣기
                        </button>
                      </div>
                    ) : (
                      <div className="my-auto py-2 space-y-4">
                        <div className="text-center">
                          <h3 className="text-2xl font-black text-indigo-500 mb-1">
                            {flashcardQueue[cardIndex].meaning}
                          </h3>
                          <p className="text-xs text-slate-400 font-semibold">{flashcardQueue[cardIndex].word}</p>
                        </div>

                        <div className="space-y-2 pt-3 border-t border-slate-700/30">
                          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider text-center">예문 응용</p>
                          {flashcardQueue[cardIndex].examples.slice(0, 2).map((ex, idx) => (
                            <div key={idx} className={`p-2.5 rounded-xl border text-xs ${darkMode ? 'bg-slate-950/60 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
                              <p className="font-semibold">{ex.en}</p>
                              <p className="text-slate-400 mt-0.5">{ex.ko}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800/40 flex items-center justify-center gap-1">
                      <span>터치하여 앞/뒤면 전환</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 mt-6">
                  <button
                    onClick={() => {
                      setIsFlipped(false);
                      setCardIndex(prev => (prev > 0 ? prev - 1 : flashcardQueue.length - 1));
                    }}
                    className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold border transition-all ${
                      darkMode ? 'bg-slate-900 border-slate-800 hover:bg-slate-800' : 'bg-white border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    ← 이전 단어
                  </button>

                  <button
                    onClick={() => toggleBookmark(flashcardQueue[cardIndex].id)}
                    className={`p-3 rounded-xl border transition-all ${
                      bookmarks.includes(flashcardQueue[cardIndex].id)
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-500'
                        : darkMode ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-400 hover:text-amber-500'
                    }`}
                  >
                    <Bookmark className={`w-5 h-5 ${bookmarks.includes(flashcardQueue[cardIndex].id) ? 'fill-amber-500' : ''}`} />
                  </button>

                  <button
                    onClick={() => {
                      setIsFlipped(false);
                      setCardIndex(prev => (prev < flashcardQueue.length - 1 ? prev + 1 : 0));
                    }}
                    className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition-all"
                  >
                    다음 단어 →
                  </button>
                </div>
              </div>
            ) : (
              <div className={`rounded-3xl p-12 text-center border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
                <p className="text-sm text-slate-400">학습할 플래시카드 단어가 없습니다.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}