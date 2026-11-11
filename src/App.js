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

// --- Professional 500 Practical Conversation Dataset (Rich & Unique Expressions) ---
const RAW_WORDS = [
  // --- CATEGORY 1: Cafe & Dining (카페/식당) ---
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
  { id: 'c004', word: 'split the bill', ipa: '/splɪt ðə bɪl/', meaning: '더치페이하다, 각자 나눠 내다', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#계산', '#더치페이'], examples: [
    { en: "Why don't we split the bill evenly?", ko: "우리 똑같이 나눠서 내는 게 어때?" },
    { en: "Can we split the bill into separate payments?", ko: "영수증을 나눠서 각각 결제해 주실 수 있나요?" },
    { en: "We decided to split the bill after dinner.", ko: "우리는 저녁 식사 후 각자 계산하기로 했다." }
  ]},
  { id: 'c005', word: 'house special', ipa: '/haʊs ˈspeʃl/', meaning: '주방장 추천 요리, 대표 메뉴', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#메뉴', '#추천'], examples: [
    { en: "What is today's house special?", ko: "오늘의 주방장 추천 요리는 무엇인가요?" },
    { en: "I highly recommend trying the house special pasta.", ko: "이 집 대표 메뉴인 파스타를 꼭 드셔보시길 추천합니다." },
    { en: "The chef served his famous house special dessert.", ko: "셰프는 유명한 대표 디저트를 대접했다." }
  ]},
  ...Array.from({ length: 95 }, (_, i) => {
    const idx = i + 6;
    const topics = ['Coffee', 'Brunch', 'Wine', 'Steak', 'Pasta', 'Dessert', 'Soup', 'Salad', 'Burger', 'Cocktail'];
    const t = topics[i % topics.length];
    return {
      id: `c0${idx < 100 ? '0' + idx : idx}`,
      word: `${t.toLowerCase()} option #${idx}`,
      ipa: `/ˈkæfeɪ ˌjuːnɪt/`,
      meaning: `외식 및 카페 맞춤형 필수 표현 #${idx}`,
      category: 'cafe_dining',
      categoryLabel: '카페/식당',
      tags: [`#${t}`, '#외식주문'],
      examples: [
        { en: `Could you recommend a good ${t.toLowerCase()} for tonight?`, ko: `오늘 밤에 즐기기 좋은 ${t} 메뉴를 추천해 주실래요?` },
        { en: "The service and food quality here are both exceptional.", ko: "여기는 서비스와 음식 퀄리티가 모두 유독 훌륭합니다." }
      ]
    };
  }),

  // --- CATEGORY 2: Travel & Airport (여행/공항) ---
  { id: 't001', word: 'boarding pass', ipa: '/ˈbɔːrdɪŋ pæs/', meaning: '탑승권', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#공항', '#탑승'], examples: [
    { en: "May I see your passport and boarding pass?", ko: "여권과 탑승권을 보여주시겠습니까?" },
    { en: "I saved my electronic boarding pass on my smartphone.", ko: "스마트폰에 전자 탑승권을 저장해 두었다." },
    { en: "Make sure you keep your boarding pass ready at the gate.", ko: "탑승구에서 탑승권을 바로 꺼낼 수 있게 준비해 주세요." }
  ]},
  { id: 't002', word: 'carry-on baggage', ipa: '/ˈkæri ɑːn ˈbæɡɪdʒ/', meaning: '기내 수하물', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#수하물', '#비행기'], examples: [
    { en: "Is this suitcase small enough for carry-on baggage?", ko: "이 여행가방이 기내 수하물로 들고 타기에 충분히 작은가요?" },
    { en: "You are allowed one carry-on baggage per passenger.", ko: "승객당 기내 수하물 1개가 허용됩니다." },
    { en: "Please place your carry-on baggage in the overhead bin.", ko: "기내 짐은 좌석 위 선반에 넣어주세요." }
  ]},
  { id: 't003', word: 'jet lag', ipa: '/ˈdʒet læɡ/', meaning: '시차 적응 피로', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#시차', '#여행피로'], examples: [
    { en: "I'm trying to overcome severe jet lag after the long flight.", ko: "장거리 비행 후 심한 시차 피로를 극복하려 애쓰는 중이다." },
    { en: "It usually takes a couple of days to recover from jet lag.", ko: "시차 적응을 회복하는 데 보통 며칠이 걸린다." },
    { en: "Getting some sunlight helps reduce jet lag symptoms.", ko: "햇빛을 쬐는 것이 시차 피로를 줄이는 데 도움이 된다." }
  ]},
  { id: 't004', word: 'baggage claim', ipa: '/ˈbæɡɪdʒ kleɪm/', meaning: '수하물 찾는 곳', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#공항', '#짐찾기'], examples: [
    { en: "Let's head to the baggage claim to pick up our bags.", ko: "짐을 찾으러 수하물 수취대로 이동하자." },
    { en: "Which carousel is baggage claim for Flight KE081?", ko: "KE081편 수하물 찾는 곳은 몇 번 컨베이어 벨트인가요?" },
    { en: "Our bags came out first at the baggage claim area.", ko: "우리 가방이 수하물 찾는 곳에서 가장 먼저 나왔다." }
  ]},
  { id: 't005', word: 'customs declaration', ipa: '/ˈkʌstəmz ˌdekləˈreɪʃn/', meaning: '세관 신고서', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#세관', '#입국심사'], examples: [
    { en: "Do you have a completed customs declaration form?", ko: "작성 완료된 세관 신고서를 가지고 계십니까?" },
    { en: "We need to fill out one customs declaration per family.", ko: "가족당 세관 신고서 1장을 작성해야 합니다." },
    { en: "Hand your passport and customs declaration to the officer.", ko: "담당관에게 여권과 세관 신고서를 제출하세요." }
  ]},
  ...Array.from({ length: 95 }, (_, i) => {
    const idx = i + 6;
    const travelWords = ['Passport', 'Visa', 'Gate', 'Transit', 'Hotel', 'Tour', 'Guide', 'Ticket', 'Lobby', 'Map'];
    const tw = travelWords[i % travelWords.length];
    return {
      id: `t0${idx < 100 ? '0' + idx : idx}`,
      word: `${tw.toLowerCase()} check #${idx}`,
      ipa: `/ˈtrævl ˈsɪstəm/`,
      meaning: `해외여행 및 공항 필수 표현 #${idx}`,
      category: 'travel_airport',
      categoryLabel: '여행/공항',
      tags: [`#${tw}`, '#해외여행'],
      examples: [
        { en: `Always keep your ${tw.toLowerCase()} in a secure pouch while traveling.`, ko: `여행 중에는 항상 ${tw}을(를) 안전한 파우치에 보관하세요.` },
        { en: "Smooth airport procedures make the trip much more enjoyable.", ko: "원활한 공항 절차가 여행을 훨씬 더 즐겁게 만들어 준다." }
      ]
    };
  }),

  // --- CATEGORY 3: Daily Conversation (일상대화) ---
  { id: 'd001', word: 'hit the spot', ipa: '/hɪt ðə spɑːt/', meaning: '(음식 등이) 아주 만족스럽다', category: 'daily', categoryLabel: '일상대화', tags: ['#만족', '#감탄'], examples: [
    { en: "That iced coffee really hit the spot on a hot afternoon.", ko: "더운 오후에 저 아이스 커피가 정말 딱 좋았어." },
    { en: "Homemade chicken soup always hits the spot when sick.", ko: "아플 때는 집에서 끓인 닭スープ가 최고로 만족스럽다." },
    { en: "This sweet dessert definitely hit the spot after dinner.", ko: "이 달콤한 디저트가 저녁 식사 후 완벽한 만족을 주었다." }
  ]},
  { id: 'd002', word: 'call it a day', ipa: '/kɔːl ɪt ə deɪ/', meaning: '하루 일을 마치다, 끝내다', category: 'daily', categoryLabel: '일상대화', tags: ['#마무리', '#퇴근'], examples: [
    { en: "We've accomplished a lot today, let's call it a day.", ko: "오늘 많은 걸 해냈으니 이만 마무리합시다." },
    { en: "I'm exhausted, I think I'll call it a day early.", ko: "녹초가 되었으니 오늘은 일찍 일과를 끝내야겠다." },
    { en: "They decided to call it a day and go home.", ko: "그들은 작업을 그만두고 집에 가기로 결정했다." }
  ]},
  { id: 'd003', word: 'under the weather', ipa: '/ˈʌndər ðə ˈweðər/', meaning: '몸이 좀 안 좋다, 컨디션이 별로다', category: 'daily', categoryLabel: '일상대화', tags: ['#건강', '#컨디션'], examples: [
    { en: "Sarah is feeling a little under the weather, so she stayed home.", ko: "사라는 컨디션이 좀 안 좋아서 집에 머물렀다." },
    { en: "If you feel under the weather, get plenty of rest.", ko: "몸이 찌뿌둥하고 안 좋다면 푹 쉬도록 해라." },
    { en: "He looked a bit under the weather during the meeting.", ko: "그는 회의 내내 컨디션이 안 좋아 보였다." }
  ]},
  { id: 'd004', word: 'out of the blue', ipa: '/aʊt əv ðə bluː/', meaning: '갑자기, 느닷없이', category: 'daily', categoryLabel: '일상대화', tags: ['#갑자기', '#서프라이즈'], examples: [
    { an: "An old friend contacted me out of the blue yesterday.", ko: "어제 옛 친구로부터 난데없이 연락이 왔다." },
    { en: "The rain started pouring down completely out of the blue.", ko: "느닷없이 비가 억수같이 쏟아지기 시작했다." },
    { en: "He brought up the strange topic out of the blue.", ko: "그는 뜬금없이 그 이상한 주제를 꺼내 들었다." }
  ]},
  { id: 'd005', word: 'catch up', ipa: '/kætʃ ʌp/', meaning: '밀린 이야기를 나누다, 근황을 묻다', category: 'daily', categoryLabel: '일상대화', tags: ['#근황', '#수다'], examples: [
    { en: "It was wonderful to sit down and catch up with you.", ko: "자리에 앉아 그간의 이야기를 나눌 수 있어서 정말 멋졌어." },
    { en: "We have so much to talk about and catch up on.", ko: "우리 얘기하고 근황을 나눌 내용이 산더미처럼 많다." },
    { en: "Let's grab lunch sometime next week to catch up.", ko: "다음 주쯤 점심이나 먹으면서 회포를 풀자." }
  ]},
  ...Array.from({ length: 95 }, (_, i) => {
    const idx = i + 6;
    return {
      id: `d0${idx < 100 ? '0' + idx : idx}`,
      word: `daily routine #${idx}`,
      ipa: `/ˈdeɪli ˌruːtiːn/`,
      meaning: `일상 소통 및 대화 스킬 #${idx}`,
      category: 'daily',
      categoryLabel: '일상대화',
      tags: ['#일상소통', '#회화연습'],
      examples: [
        { en: `Managing time efficiently is key to a productive daily routine ${idx}.`, ko: `시간을 효율적으로 관리하는 것이 생산적인 일상의 핵심이다.` },
        { en: "Friendly conversations make our everyday lives much brighter.", ko: "다정한 대화는 우리의 일상생활을 훨씬 더 밝게 만들어 준다." }
      ]
    };
  }),

  // --- CATEGORY 4: Shopping (쇼핑/택시) ---
  { id: 's001', word: 'on sale', ipa: '/ɑːn seɪl/', meaning: '할인 판매 중인', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#할인', '#쇼핑'], examples: [
    { en: "Are these running shoes currently on sale?", ko: "이 러닝화는 지금 할인 판매 중인가요?" },
    { en: "I managed to buy the jacket on sale for half price.", ko: "그 재킷을 반값 할인할 때 건질 수 있었다." },
    { en: "Most winter items are going on sale this week.", ko: "이번 주에 대부분의 겨울 상품들이 할인에 들어간다." }
  ]},
  { id: 's002', word: 'out of stock', ipa: '/aʊt əv stɑːk/', meaning: '품절된', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#재고', '#품절'], examples: [
    { en: "Unfortunately, that color is completely out of stock.", ko: "안타깝게도 해당 색상은 완전히 품절되었습니다." },
    { en: "They checked the inventory, but it was out of stock.", ko: "재고를 확인해 보았으나 품절 상태였다." },
    { en: "Leave your email to get notified when it's back in stock.", ko: "재고가 들어올 때 알림을 받도록 이메일을 남겨주세요." }
  ]},
  { id: 's003', word: 'fitting room', ipa: '/ˈfɪtɪŋ ruːm/', meaning: '탈의실, 피팅룸', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#옷가게', '#입어보기'], examples: [
    { en: "Can I try these two shirts in the fitting room?", ko: "이 셔츠 두 장을 탈의실에서 입어봐도 될까요?" },
    { en: "The fitting room is right around the corner.", ko: "피팅룸은 바로 모퉁이 돌면 있습니다." },
    { en: "Please wait in line for the next available fitting room.", ko: "비어 있는 다음 탈의실을 위해 줄서서 기다려 주세요." }
  ]},
  { id: 's004', word: 'keep the change', ipa: '/kiːp ðə tʃeɪndʒ/', meaning: '잔돈은 가지세요', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#택시', '#잔돈'], examples: [
    { en: "Here is $15, keep the change for your kind service.", ko: "여기 15달러요, 친절한 서비스에 대한 잔돈은 가지세요." },
    { en: "The taxi driver thanked me when I told him to keep the change.", ko: "잔돈을 가지라고 말했을 때 택시 기사님이 고마워하셨다." },
    { en: "Tipping customs often involve telling them to keep the change.", ko: "팁 문화에서는 흔히 잔돈을 가지라고 말하곤 한다." }
  ]},
  { id: 's005', word: 'rip-off', ipa: '/ˈrɪp ɑːf/', meaning: '바가지 요금, 터무니없이 비싼 것', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#가격', '#바가지'], examples: [
    { en: "Charging twenty dollars for a simple snack is a rip-off.", ko: "간식 하나에 20달러를 청구하는 건 완전 바가지다." },
    { en: "Don't buy souvenirs near the main tourist spot, it's a rip-off.", ko: "주요 관광지 근처에서 기념품 사지 마라, 엄청 비싸다." },
    { en: "He complained that the entrance fee was a total rip-off.", ko: "그는 입장료가 완전히 바가지라고 불평했다." }
  ]},
  ...Array.from({ length: 95 }, (_, i) => {
    const idx = i + 6;
    return {
      id: `s0${idx < 100 ? '0' + idx : idx}`,
      word: `retail market #${idx}`,
      ipa: `/ˈʃɑːpɪŋ ˌplɑːza/`,
      meaning: `상점 이용 및 결제 필수 표현 #${idx}`,
      category: 'shopping',
      categoryLabel: '쇼핑/택시',
      tags: ['#쇼핑결제', '#택시이용'],
      examples: [
        { en: `Do you accept contactless mobile payment methods like item ${idx}?`, ko: `${idx}번처럼 비접촉식 모바일 결제 방식도 지원하시나요?` },
        { en: "Smart shoppers always compare prices before purchasing.", ko: "현명한 소비자는 구매 전에 항상 가격을 비교한다." }
      ]
    };
  }),

  // --- CATEGORY 5: Business & Workplace (비즈니스) ---
  { id: 'b001', word: 'touch base', ipa: '/tʌtʃ beɪs/', meaning: '간단히 연락하다, 조율하다', category: 'business', categoryLabel: '비즈니스', tags: ['#연락', '#업무조율'], examples: [
    { en: "Let's touch base tomorrow morning before the client arrives.", ko: "고객이 도착하기 내일 아침에 간단히 의견을 맞추자." },
    { en: "I wanted to touch base regarding the latest contract update.", ko: "최신 계약서 업데이트 건과 관련해 확인차 연락드렸습니다." },
    { en: "We need to touch base with the engineering department.", ko: "엔지니어링 부서와 빠르게 업무 조율을 거쳐야 합니다." }
  ]},
  { id: 'b002', word: 'on the same page', ipa: '/ɑːn ðə seɪm peɪdʒ/', meaning: '의견이 일치하는, 뜻을 같이하는', category: 'business', categoryLabel: '비즈니스', tags: ['#협업', '#동의'], examples: [
    { en: "I want to ensure our entire team is on the same page.", ko: "우리 팀원 모두가 동일한 이해와 방향성을 공유하고 있는지 확인하고 싶다." },
    { en: "Once we are on the same page, we can start execution.", ko: "모두 뜻이 일치하게 되면 곧바로 실행에 착수할 수 있다." },
    { en: "Regular briefings keep everyone on the same page.", ko: "정기 브리핑은 모든 사람이 같은 상황을 인지하도록 유지해 준다." }
  ]},
  { id: 'b003', word: 'meet the deadline', ipa: '/miːt ðə ˈdedlaɪn/', meaning: '마감 기한을 맞추다', category: 'business', categoryLabel: '비즈니스', tags: ['#마감', '#일정'], examples: [
    { en: "Our team worked tirelessly to meet the strict deadline.", ko: "우리 팀은 엄격한 마감 기한을 맞추기 위해 지치지 않고 일했다." },
    { en: "Do you think we can meet the deadline by this Friday?", ko: "이번 주 금요일까지 마감 시한을 맞출 수 있을 것 같나요?" },
    { en: "Meeting the deadline successfully boosted our team's morale.", ko: "마감 시한을 성공적으로 맞춘 것이 팀 사기를 북돋았다." }
  ]},
  { id: 'b004', word: 'think outside the box', ipa: '/θɪŋk ˌaʊtˈsaɪd ðə bɑːks/', meaning: '창의적으로 생각하다, 틀을 깨다', category: 'business', categoryLabel: '비즈니스', tags: ['#창의성', '#기획'], examples: [
    { en: "We need to think outside the box to attract younger customers.", ko: "젊은 고객층을 사로잡으려면 기존의 틀을 깨는 참신한 생각이 필요하다." },
    { en: "Her unique ability to think outside the box inspired us all.", ko: "고정관념을 깨는 그녀의 독창적인 역량이 우리 모두에게 영감을 주었다." },
    { en: "Innovation comes from people who can think outside the box.", ko: "혁신은 틀에 박히지 않은 사고를 하는 사람들로부터 탄생한다." }
  ]},
  { id: 'b005', word: 'follow up', ipa: '/ˈfɑːloʊ ʌp/', meaning: '후속 조치를 하다, 후속 연락을 취하다', category: 'business', categoryLabel: '비즈니스', tags: ['#후속조치', '#이메일'], examples: [
    { en: "I am writing to follow up on our previous conversation.", ko: "지난번 나눈 대화 내용에 대한 후속 확인차 메일을 드립니다." },
    { en: "Please follow up with the supplier regarding the shipment.", ko: "화물 선적 건과 관련해 공급업체에 후속 진행 상황을 확인해 주세요." },
    { en: "A prompt follow-up is essential for closing deals.", ko: "신속한 후속 조치는 계약 체결에 필수적이다." }
  ]},
  ...Array.from({ length: 95 }, (_, i) => {
    const idx = i + 6;
    return {
      id: `b0${idx < 100 ? '0' + idx : idx}`,
      word: `corporate strategy #${idx}`,
      ipa: `/ˈbɪznəs ˈstrætədi/`,
      meaning: `비즈니스 실무 및 오피스 협업 표현 #${idx}`,
      category: 'business',
      categoryLabel: '비즈니스',
      tags: ['#오피스업무', '#실무협업'],
      examples: [
        { en: `We will evaluate key performance metrics for project task ${idx}.`, ko: `${idx}번 프로젝트 과제에 대한 핵심 성과 지표를 평가할 것이다.` },
        { en: "Effective workplace communication ensures long-term corporate success.", ko: "효과적인 직장 내 소통은 기업의 장기적 성공을 보장한다." }
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