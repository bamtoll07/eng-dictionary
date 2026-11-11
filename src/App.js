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

// --- 100% 고유한 핵심 영단어/숙어 영한사전 데이터셋 ---
const RAW_WORDS = [
  // --- CAFE & DINING (카페/식당) ---
  { id: 'c001', word: 'appetizer', ipa: '/ˈæpɪtaɪzər/', meaning: '애피타이저, 전식', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#식사', '#메뉴'], examples: [
    { en: "Would you like to order an appetizer before the main course?", ko: "메인 요리 전에 애피타이저를 주문하시겠어요?" },
    { en: "We shared a delicious garlic bread as an appetizer.", ko: "우리는 애피타이저로 맛있는 마늘빵을 나눠 먹었다." }
  ]},
  { id: 'c002', word: 'beverage', ipa: '/ˈbevərɪdʒ/', meaning: '음료', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#음료', '#카페'], examples: [
    { en: "Hot and cold beverages are served in the lounge.", ko: "라운지에서는 뜨겁고 찬 음료가 제공됩니다." },
    { en: "Please select one complimentary beverage with your meal.", ko: "식사와 함께 무료 음료를 하나 선택해 주세요." }
  ]},
  { id: 'c003', word: 'cutlery', ipa: '/ˈkʌtləri/', meaning: '(나이프·포크·숟가락 등의) 식기류', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#식기', '#테이블'], examples: [
    { en: "Could you bring clean cutlery for our table, please?", ko: "저희 테이블에 깨끗한 식기류 좀 가져다주시겠어요?" },
    { en: "The waiter laid out the cutlery neatly on the cloth.", ko: "웨이터가 식탁보 위에 식기류를 깔끔하게 놓았다." }
  ]},
  { id: 'c004', word: 'gratuity', ipa: '/ɡrəˈtuːəti/', meaning: '팁, 봉사료', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#팁', '#계산'], examples: [
    { en: "A standard gratuity of 15% is included in the bill.", ko: "계산서에 15%의 표준 봉사료가 포함되어 있습니다." },
    { en: "Leaving a gratuity is customary for exceptional service.", ko: "훌륭한 서비스에 대해 팁을 남기는 것은 관례이다." }
  ]},
  { id: 'c005', word: 'ingredient', ipa: '/ɪnˈɡriːdiənt/', meaning: '재료, 성분', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#음식재료', '#요리'], examples: [
    { en: "This soup is made with fresh organic ingredients.", ko: "이 수프는 신선한 유기농 재료로 만들어졌습니다." },
    { en: "Always check the ingredient list if you have food allergies.", ko: "음식 알레르기가 있다면 항상 재료 목록을 확인하세요." }
  ]},
  { id: 'c006', word: 'menu', ipa: '/ˈmenjuː/', meaning: '메뉴판, 차림표', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#메뉴판', '#주문'], examples: [
    { en: "May I see the dessert menu, please?", ko: "디저트 메뉴판을 볼 수 있을까요?" },
    { en: "The restaurant updates its seasonal menu every three months.", ko: "그 식당은 3개월마다 계절 메뉴를 새로 바꾼다." }
  ]},
  { id: 'c007', word: 'receipt', ipa: '/rɪˈsiːt/', meaning: '영수증', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#영수증', '#결제'], examples: [
    { en: "Would you like your receipt or should I throw it away?", ko: "영수증을 드릴까요, 아니면 버려드릴까요?" },
    { en: "Keep your receipt in case you need to exchange the item.", ko: "상품을 교환해야 할 경우를 대비해 영수증을 보관하세요." }
  ]},
  { id: 'c008', word: 'specialty', ipa: '/ˈspeʃəlti/', meaning: '명물, 특산품, 전문 요리', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#추천요리', '#특산품'], examples: [
    { en: "Seafood pasta is the chef's specialty here.", ko: "해산물 파스타가 이곳 셰프의 특선 요리입니다." },
    { en: "What is the local specialty of this region?", ko: "이 지역의 향토 특산품은 무엇인가요?" }
  ]},
  { id: 'c009', word: 'reservation', ipa: '/ˌrezərˈveɪʃn/', meaning: '예약', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#예약', '#식당'], examples: [
    { en: "I have a table reservation under the name of Kim.", ko: "김 이름으로 테이블 예약이 되어 있습니다." },
    { en: "Making a reservation in advance is highly recommended.", ko: "사전에 미리 예약하는 것을 강력히 추천합니다." }
  ]},
  { id: 'c010', word: 'vegetarian', ipa: '/ˌvedʒəˈteriən/', meaning: '채식주의자의, 채식주의자', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#채식', '#식단'], examples: [
    { en: "Do you have any vegetarian options on the menu?", ko: "메뉴에 채식주의자용 요리가 따로 있나요?" },
    { en: "She has been a strict vegetarian for over five years.", ko: "그녀는 5년 넘게 엄격한 채식주의자로 지내고 있다." }
  ]},

  // --- TRAVEL & AIRPORT (여행/공항) ---
  { id: 't001', word: 'boarding pass', ipa: '/ˈbɔːrdɪŋ pæs/', meaning: '탑승권', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#공항', '#탑승'], examples: [
    { en: "Please have your passport and boarding pass ready.", ko: "여권과 탑승권을 준비해 주시기 바랍니다." },
    { en: "You can print your boarding pass at the kiosk.", ko: "무인 키오스크에서 탑승권을 인쇄할 수 있습니다." }
  ]},
  { id: 't002', word: 'customs', ipa: '/ˈkʌstəmz/', meaning: '세관', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#세관', '#입국'], examples: [
    { en: "Declare any taxable items before passing through customs.", ko: "세관을 통과하기 전에 과세 대상 물품을 신고하세요." },
    { en: "We had to wait in a long line at customs.", ko: "우리는 세관에서 긴 줄을 서서 기다려야 했다." }
  ]},
  { id: 't003', word: 'departure', ipa: '/dɪˈpɑːrtʃər/', meaning: '출발', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#출발', '#비행기'], examples: [
    { en: "Check the flight status board for departure time changes.", ko: "출발 시간 변경 여부를 운항 현황판에서 확인하세요." },
    { en: "Our departure was delayed due to heavy fog.", ko: "짙은 안개 때문에 우리 출발이 지연되었다." }
  ]},
  { id: 't004', word: 'destination', ipa: '/ˌdestɪˈneɪʃn/', meaning: '목적지', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#목적지', '#여행'], examples: [
    { en: "What is your final destination for this trip?", ko: "이번 여행의 최종 목적지가 어디인가요?" },
    { en: "We finally reached our destination after a 10-hour flight.", ko: "10시간 비행 끝에 드디어 목적지에 도착했다." }
  ]},
  { id: 't005', word: 'itinerary', ipa: '/aɪˈtɪnəreri/', meaning: '여행 일정표', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#일정표', '#여행계획'], examples: [
    { en: "I printed out a detailed itinerary for our vacation.", ko: "휴가를 위한 상세한 여행 일정표를 출력해 두었다." },
    { en: "Feel free to change the itinerary if you get tired.", ko: "피곤하면 여행 일정표는 언제든 자유롭게 바꾸세요." }
  ]},

  // --- DAILY CONVERSATION (일상대화) ---
  { id: 'd001', word: 'appointment', ipa: '/əˈpɔɪntmənt/', meaning: '(만남의) 약속, 예약', category: 'daily', categoryLabel: '일상대화', tags: ['#약속', '#일정'], examples: [
    { en: "I have a dentist appointment tomorrow afternoon.", ko: "내일 오후에 치과 예약이 잡혀 있습니다." },
    { en: "Make sure to cancel the appointment ahead of time.", ko: "약속은 사전에 미리 취소해 주시기 바랍니다." }
  ]},
  { id: 'd002', word: 'convenient', ipa: '/kənˈviːniənt/', meaning: '편리한', category: 'daily', categoryLabel: '일상대화', tags: ['#편리', '#생활'], examples: [
    { en: "Public transportation here is very clean and convenient.", ko: "여기는 대중교통이 매우 깨끗하고 편리하다." },
    { en: "Let me know what time is convenient for you.", ko:언제 시간이 편하신지 알려주세요." }
  ]},
  { id: 'd003', word: 'frequent', ipa: '/ˈfriːkwənt/', meaning: '자주 일어나는, 빈번한', category: 'daily', categoryLabel: '일상대화', tags: ['#빈도', '#일상'], examples: [
    { en: "Traffic jams are frequent during rush hours.", ko: "출퇴근 시간대에는 교통 체증이 빈번하게 발생한다." },
    { en: "He is a frequent visitor to this local library.", ko: "그는 이 동네 도서관에 자주 드나드는 단골이다." }
  ]},
  { id: 'd004', word: 'patient', ipa: '/ˈpeɪʃnt/', meaning: '참을성 있는, 환자', category: 'daily', categoryLabel: '일상대화', tags: ['#성격', '#인내'], examples: [
    { en: "Please be patient while we process your request.", ko: "요청 사항을 처리하는 동안 조금만 참아주세요." },
    { en: "Teaching young children requires a lot of patience.", ko: "어린아이들을 가르치는 것은 많은 인내심을 요구한다." }
  ]},
  { id: 'd005', word: 'schedule', ipa: '/ˈskedʒuːl/', meaning: '일정, 스케줄', category: 'daily', categoryLabel: '일상대화', tags: ['#일정', '#계획'], examples: [
    { en: "My schedule is completely packed for this week.", ko: "이번 주는 제 스케줄이 완전히 꽉 차 있습니다." },
    { en: "We need to check our schedules before fixing a date.", ko: "날짜를 확정하기 전에 서로 일정을 확인해 봐야 한다." }
  ]},

  // --- SHOPPING (쇼핑/택시) ---
  { id: 's001', word: 'bargain', ipa: '/ˈbɑːrɡən/', meaning: '흥정하다, 값싸게 산 물건', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#흥정', '#할인'], examples: [
    { en: "You can bargain for lower prices at the open market.", ko: "재래시장에 가면 더 낮은 가격으로 흥정할 수 있다." },
    { en: "This winter coat was an absolute bargain.", ko: "이 겨울 코트는 정말 헐값에 건진 대단한 물건이었다." }
  ]},
  { id: 's002', word: 'discount', ipa: '/ˈdɪskaʊnt/', meaning: '할인', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#할인', '#가격'], examples: [
    { en: "Do you offer a student discount for these tickets?", ko: "이 표들에 대해 학생 할인을 제공하나요?" },
    { en: "Members get an extra 10% discount on all items.", ko: "회원들은 모든 품목에 대해 10% 추가 할인을 받습니다." }
  ]},
  { id: 's003', word: 'exchange', ipa: '/eksˈtʃeɪndʒ/', meaning: '교환하다, 환전하다', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#교환', '#환전'], examples: [
    { en: "Can I exchange this shirt for a larger size?", ko: "이 셔츠를 더 큰 사이즈로 교환할 수 있나요?" },
    { en: "Where is the best place to exchange currency?", ko: "환전하기 가장 좋은 장소가 어디인가요?" }
  ]},
  { id: 's004', word: 'refund', ipa: '/ˈriːfʌnd/', meaning: '환불, 환불하다', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#환불', '#반품'], examples: [
    { en: "I would like to request a full refund for this defective product.", ko: "이 불량 제품에 대해 전액 환불을 요청하고 싶습니다." },
    { en: "Refunds are only available within 14 days of purchase.", ko: "환불은 구매일로부터 14일 이내에만 가능합니다." }
  ]},
  { id: 's005', word: 'warranty', ipa: '/ˈwɔːrənti/', meaning: '품질 보증서, 보증', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#보증', '#AS'], examples: [
    { en: "This laptop comes with a two-year manufacturer warranty.", ko: "이 노트북은 2년 제조사 품질 보증이 제공됩니다." },
    { en: "Accidental damage is not covered under the standard warranty.", ko: "과실로 인한 파손은 기본 보증 범위에 포함되지 않습니다." }
  ]},

  // --- BUSINESS & WORKPLACE (비즈니스) ---
  { id: 'b001', word: 'colleague', ipa: '/ˈkɑːliːɡ/', meaning: '동료', category: 'business', categoryLabel: '비즈니스', tags: ['#동료', '#직장'], examples: [
    { en: "I went out for lunch with my colleagues from work.", ko: "나는 직장 동료들과 함께 점심을 먹으러 나갔다." },
    { en: "She is a trusted colleague and a great team player.", ko: "그녀는 신뢰할 수 있는 동료이자 훌륭한 팀플레이어이다." }
  ]},
  { id: 'b002', word: 'negotiation', ipa: '/nɪˌɡoʊʃiˈeɪʃn/', meaning: '협상, 절충', category: 'business', categoryLabel: '비즈니스', tags: ['#협상', '#계약'], examples: [
    { en: "The contract negotiation took over three hours.", ko: "계약 협상이 3시간 넘게 소요되었다." },
    { en: "Good communication skills are essential in business negotiations.", ko: "비즈니스 협상에서는 원활한 소통 능력이 필수적이다." }
  ]},
  { id: 'b003', word: 'presentation', ipa: '/ˌpriːznˈteɪʃn/', meaning: '발표, 프레젠테이션', category: 'business', categoryLabel: '비즈니스', tags: ['#발표', '#보고'], examples: [
    { en: "He prepared a brilliant slide deck for his presentation.", ko: "그는 발표를 위해 훌륭한 슬라이드 자료를 준비했다." },
    { en: "We have a team presentation scheduled for Friday morning.", ko: "금요일 아침에 팀 발표 일정이 잡혀 있습니다." }
  ]},
  { id: 'b004', word: 'productivity', ipa: '/ˌproʊdʌkˈtɪvəti/', meaning: '생산성', category: 'business', categoryLabel: '비즈니스', tags: ['#생산성', '#업무효율'], examples: [
    { en: "Taking short breaks can significantly boost daily productivity.", ko: "잠깐의 휴식은 일일 업무 생산성을 크게 높여줄 수 있다." },
    { en: "The company aims to improve overall work productivity.", ko: "회사는 전반적인 업무 생산성 향상을 목표로 하고 있다." }
  ]},
  { id: 'b005', word: 'quarterly', ipa: '/ˈkwɔːrtərli/', meaning: '분기별의, 분기마다', category: 'business', categoryLabel: '비즈니스', tags: ['#분기', '#실적'], examples: [
    { en: "The management team reviews financial performance on a quarterly basis.", ko: "경영진은 분기별로 재무 실적을 검토한다." },
    { en: "We achieved our quarterly sales targets successfully.", ko: "우리는 분기별 매출 목표를 성공적으로 달성했다." }
  ]}
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

  // Text-to-Speech Engine (useCallback)
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
    { id: 'all', label: `전체 (${words.length})`, icon: Grid },
    { id: 'cafe_dining', label: '카페/식당', icon: Coffee },
    { id: 'travel_airport', label: '여행/공항', icon: Plane },
    { id: 'daily', label: '일상대화', icon: MessageCircle },
    { id: 'shopping', label: '쇼핑/택시', icon: ShoppingBag },
    { id: 'business', label: '비즈니스', icon: Briefcase },
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
                <h1 className="text-lg font-extrabold tracking-tight">상황별 영한사전</h1>
                <span className="text-[10px] font-extrabold bg-indigo-600 text-white px-2 py-0.5 rounded-full">PRO</span>
              </div>
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>핵심 영단어 & 실생활 예문 사전</p>
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
            단어 사전 ({words.length})
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
                placeholder="영단어, 뜻, 예문, 태그(#식사) 검색..."
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
                <Filter className="w-3.5 h-3.5" /> 분류:
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
                    ▶ 단어 & 뜻 연속 듣기 (운전 모드)
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
                검색된 단어: <strong className="text-indigo-600 font-bold">{filteredWords.length}개</strong> (페이지 {currentPage} / {totalPages})
              </span>
              {activeTab === 'bookmarks' && bookmarks.length === 0 && (
                <span className="text-rose-500 font-semibold">저장된 북마크 단어가 없습니다.</span>
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
                            title="영단어 발음 듣기"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        <p className={`text-base font-bold mb-4 ${darkMode ? 'text-indigo-300' : 'text-indigo-950'}`}>
                          {item.meaning}
                        </p>

                        <div className="space-y-2 pt-3 border-t border-slate-200/40">
                          <p className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">단어 예문</p>
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
                <p className="text-xs text-slate-400 mt-1">검색어를 수정하거나 다른 분류를 선택해 보세요.</p>
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
                          <p className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider text-center">예문 확인</p>
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
                <p className="text-sm text-slate-400">학습할 단어가 없습니다.</p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}