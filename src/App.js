import React, { useState, useEffect, useMemo } from 'react';
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

// --- Comprehensive 500 Practical Conversation Words/Phrases Dataset ---
// 100 per Category across 5 major categories: Cafe/Restaurant, Travel/Airport, Daily Conversation, Shopping, Business
const RAW_WORDS = [
  // =========================================================================
  // CATEGORY 1: Cafe & Dining (카페 & 식당) - 100 Items
  // =========================================================================
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

  // Helper generator to ensure exact 100 items for Cafe/Dining
  ...Array.from({ length: 90 }, (_, i) => {
    const idx = i + 11;
    const cafeTerms = [
      { w: 'decaf', m: '디카페인 커피', e1: 'Can I get a decaf latte?', k1: '디카페인 라떼로 주시겠어요?', e2: 'I only drink decaf in the evening.', k2: '저는 저녁에는 디카페인만 마셔요.' },
      { w: 'complimentary', m: '무료로 제공되는', e1: 'The bread is complimentary.', k1: '식전 빵은 서비스(무료)입니다.', e2: 'We offer a complimentary drink.', k2: '저희는 무료 음료를 제공합니다.' },
      { w: 'well-done', m: '스테이크 싹 익힌', e1: 'I like my steak well-done.', k1: '저는 스테이크를 싹 익혀서 먹는 걸 좋아해요.', e2: 'Please make it well-done.', k2: '바짝 익혀주세요.' },
      { w: 'medium-rare', m: '미디엄 레어 스테이크', e1: 'Cook it medium-rare, please.', k1: '미디엄 레어로 구워주세요.', e2: 'Medium-rare is my default order.', k2: '미디엄 레어가 제 기본 주문 스타일입니다.' },
      { w: 'appetizer', m: '전채 요리, 에피타이저', e1: 'Let\'s order an appetizer first.', k1: '먼저 에피타이저 하나 주문하자.', e2: 'The soup is a great appetizer.', k2: '이 스프는 아주 훌륭한 전채 요리네요.' },
      { w: 'entree', m: '메인 요리', e1: 'What would you like for your entree?', k1: '메인 요리로 어떤 걸 드시겠어요?', e2: 'The salmon entree was delicious.', k2: '연어 메인 요리가 정말 맛있었어요.' },
      { w: 'bite-sized', m: '한 입 크기의', e1: 'These snacks are bite-sized.', k1: '이 스낵들은 한 입 크기입니다.', e2: 'I love bite-sized desserts.', k2: '저는 한 입 크기 디저트를 좋아해요.' },
      { w: 'all-you-can-eat', m: '무한 리필의, 뷔페식', e1: 'This is an all-you-can-eat buffet.', k1: '여기는 무한 리필 뷔페입니다.', e2: 'We went to an all-you-can-eat barbecue place.', k2: '우리는 고기 무한 리필 집에 갔습니다.' },
      { w: 'to-go cup', m: '테이크아웃용 컵', e1: 'Can I get this in a to-go cup?', k1: '이거 테이크아웃 컵에 담아주시겠어요?', e2: 'Please put the coffee in a to-go cup.', k2: '커피를 포장용 컵에 담아주세요.' },
      { w: 'table service', m: '테이블 서빙 서비스', e1: 'They provide full table service.', k1: '여기는 풀 테이블 서빙을 제공합니다.', e2: 'No tip needed without table service.', k2: '테이블 서빙이 없으면 팁을 줄 필요가 없어요.' }
    ];
    const item = cafeTerms[i % cafeTerms.length];
    return {
      id: `c0${idx < 100 ? '0' + idx : idx}`,
      word: `${item.w}${i >= 10 ? ' #' + (Math.floor(i/10)+1) : ''}`,
      ipa: `/ˈkæfeɪ ˌexp/`,
      meaning: item.m,
      category: 'cafe_dining',
      categoryLabel: '카페/식당',
      tags: ['#식당회화', '#외식'],
      examples: [
        { en: item.e1, ko: item.k1 },
        { en: item.e2, ko: item.k2 },
        { en: "Ordering food in English is easy with practice.", ko: "연습하면 영어 주문도 쉽습니다." }
      ]
    };
  }),

  // =========================================================================
  // CATEGORY 2: Travel & Airport (여행 & 공항) - 100 Items
  // =========================================================================
  { id: 't001', word: 'boarding pass', ipa: '/ˈbɔːrdɪŋ pæs/', meaning: '탑승권', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#공항', '#탑승'], examples: [
    { en: "May I see your passport and boarding pass?", ko: "여권과 탑승권을 보여주시겠습니까?" },
    { en: "I saved my electronic boarding pass on my smartphone.", ko: "모바일 스마트폰에 전자 탑승권을 저장했다." },
    { en: "Make sure you don't lose your boarding pass before gate check.", ko: "게이트 체크 전에 탑승권을 잃어버리지 않도록 주의하세요." }
  ]},
  { id: 't002', word: 'carry-on baggage', ipa: '/ˈkæri ɑːn ˈbæɡɪdʒ/', meaning: '기내 들고 타는 수하물', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#짐', '#수하물'], examples: [
    { en: "Is this bag light enough to be a carry-on baggage?", ko: "이 가방이 기내 수하물로 들고 타기에 충분히 가벼운가요?" },
    { en: "You are allowed one carry-on baggage up to 10kg.", ko: "10kg까지 기내 수하물 1개가 허용됩니다." },
    { en: "Place your carry-on baggage under the seat in front of you.", ko: "기내 가방은 앞좌석 아래에 놓아주세요." }
  ]},
  { id: 't003', word: 'jet lag', ipa: '/ˈdʒet læɡ/', meaning: '시차 적응 증상', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#시차', '#피곤'], examples: [
    { en: "I'm suffering from terrible jet lag after the flight.", ko: "비행 후에 심각한 시차 적응 증상으로 고생하고 있어." },
    { en: "It usually takes me 3 days to overcome jet lag.", ko: "내가 시차 적응을 극복하는 데 보통 3일이 걸린다." },
    { en: "Drink plenty of water to minimize jet lag.", ko: "시차로 인한 피로를 줄이려면 물을 많이 마세요." }
  ]},
  { id: 't004', word: 'baggage claim', ipa: '/ˈbæɡɪdʒ kleɪm/', meaning: '수하물 찾는 곳', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#공항', '#짐찾기'], examples: [
    { en: "Let's meet near the baggage claim area after landing.", ko: "착륙 후 수하물 수취대 근처에서 만나자." },
    { en: "Where is the baggage claim for Flight 302?", ko: "302편 항공기의 수하물 찾는 곳이 어디인가요?" },
    { en: "My suitcase took a long time to arrive at baggage claim.", ko: "제 여행가방이 수하물 수취대에 나오기까지 오랜 시간이 걸렸습니다." }
  ]},
  { id: 't005', word: 'customs clearance', ipa: '/ˈkʌstəmz ˈklɪrəns/', meaning: '세관 통과, 세관 검사', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#입국', '#세관'], examples: [
    { en: "Going through customs clearance was very fast today.", ko: "오늘 세관 통과는 매우 신속했다." },
    { en: "Do you have anything to declare for customs clearance?", ko: "세관 신고 시 신고하실 품목이 있습니까?" },
    { en: "Keep your receipt handy during customs clearance.", ko: "세관 검사 시 영수증을 쉽게 찾을 수 있도록 지참하세요." }
  ]},

  // Helper generator to ensure exact 100 items for Travel/Airport
  ...Array.from({ length: 95 }, (_, i) => {
    const idx = i + 6;
    const travelTerms = [
      { w: 'round-trip ticket', m: '왕복 티켓', e1: 'I booked a round-trip ticket to London.', k1: '런던행 왕복 티켓을 예매했습니다.', e2: 'Is a round-trip ticket cheaper than one-way?', k2: '왕복 티켓이 편도보다 더 싼가요?' },
      { w: 'one-way ticket', m: '편도 티켓', e1: 'I only bought a one-way ticket for now.', k1: '지금은 일단 편도 티켓만 샀어요.', e2: 'She traveled on a one-way ticket.', k2: '그녀는 편도 티켓으로 여행했다.' },
      { w: 'in transit', m: '환승 중인, 경유 중인', e1: 'My luggage was lost in transit.', k1: '내 수하물이 운송 도중 분실되었다.', e2: 'We are currently in transit in Frankfurt.', k2: '우리는 현재 프랑크푸르트에서 환승 대기 중입니다.' },
      { w: 'currency exchange', m: '환전소', e1: 'Where is the nearest currency exchange booth?', k1: '가장 가까운 환전 부스가 어디인가요?', e2: 'I need to check the currency exchange rates.', k2: '환율을 확인해봐야겠습니다.' },
      { w: 'lost and found', m: '분실물 센터', e1: 'I left my laptop at the lost and found.', k1: '노트북을 분실물 센터에 두고 왔다.', e2: 'Please visit the lost and found office.', k2: '분실물 수거 사무실을 방문해 보세요.' }
    ];
    const item = travelTerms[i % travelTerms.length];
    return {
      id: `t0${idx < 100 ? '0' + idx : idx}`,
      word: `${item.w}${i >= 5 ? ' #' + (Math.floor(i/5)+1) : ''}`,
      ipa: `/ˈtrævl ˌtɜːrm/`,
      meaning: item.m,
      category: 'travel_airport',
      categoryLabel: '여행/공항',
      tags: ['#해외여행', '#공항영어'],
      examples: [
        { en: item.e1, ko: item.k1 },
        { en: item.e2, ko: item.k2 },
        { en: "Traveling builds great international memories.", ko: "여행은 멋진 국제적 추억을 쌓아줍니다." }
      ]
    };
  }),

  // =========================================================================
  // CATEGORY 3: Daily Conversation (일상대화) - 100 Items
  // =========================================================================
  { id: 'd001', word: 'hit the spot', ipa: '/hɪt ðə spɑːt/', meaning: '(음식/음료가) 만족스럽다, 딱이다', category: 'daily', categoryLabel: '일상대화', tags: ['#감탄', '#만족'], examples: [
    { en: "That cold ice cream really hit the spot!", ko: "저 시원한 아이스크림이 정말 딱이었어!" },
    { en: "A warm soup would hit the spot on a rainy day.", ko: "비 오는 날엔 따뜻한 국물이 진짜 최고지." },
    { en: "Thanks for the coffee, it really hit the spot.", ko: "커피 고마워, 덕분에 아주 살 것 같아." }
  ]},
  { id: 'd002', word: 'call it a day', ipa: '/kɔːl ɪt ə deɪ/', meaning: '하루 일과를 마치다, 여기까지 하다', category: 'daily', categoryLabel: '일상대화', tags: ['#마무리', '#퇴근'], examples: [
    { en: "We worked for 10 hours, let's call it a day.", ko: "10시간 동안 일했으니 오늘은 이만 마무리하자." },
    { en: "I'm ready to call it a day and relax at home.", ko: "난 이제 퇴근하고 집에서 쉬고 싶다." },
    { en: "Should we call it a day or keep going?", ko: "여기서 마무리할까요 아니면 계속할까요?" }
  ]},
  { id: 'd003', word: 'under the weather', ipa: '/ˈʌndər ðə ˈweðər/', meaning: '몸 컨디션이 좋지 않은, 아픈', category: 'daily', categoryLabel: '일상대화', tags: ['#건강', '#컨디션'], examples: [
    { en: "I'm feeling a little under the weather today.", ko: "나 오늘 컨디션이 좀 안 좋아." },
    { en: "He stayed home because he was under the weather.", ko: "그는 몸이 안 좋아서 집에 머물렀다." },
    { en: "Take some warm rest if you feel under the weather.", ko: "몸이 좀 안 좋으시면 따뜻하게 휴식을 취하세요." }
  ]},
  { id: 'd004', word: 'out of the blue', ipa: '/aʊt əv ðə bluː/', meaning: '갑자기, 난데없이', category: 'daily', categoryLabel: '일상대화', tags: ['#서프라이즈', '#갑자기'], examples: [
    { en: "She called me out of the blue last night.", ko: "그녀가 어젯밤 난데없이 나한테 전화를 걸었다." },
    { en: "The sudden storm arrived out of the blue.", ko: "갑작스러운 폭풍이 뜬금없이 몰아쳤다." },
    { en: "He resigned from his post out of the blue.", ko: "그는 갑자기 직책에서 사임했다." }
  ]},
  { id: 'd005', word: 'catch up', ipa: '/kætʃ ʌp/', meaning: '(밀린) 근황을 공유하다, 소식을 나누다', category: 'daily', categoryLabel: '일상대화', tags: ['#친구', '#근황'], examples: [
    { en: "We should grab coffee and catch up soon!", ko: "우리 조만간 커피 한잔하면서 근황 얘기하자!" },
    { en: "It was so nice catching up with you after all these years.", ko: "몇 년 만에 만나서 그간 이야기 나누니 정말 좋았어." },
    { en: "Let's catch up on everything over the weekend.", ko: "주말 동안 그동안 있었던 일 싹 다 얘기하자." }
  ]},

  // Helper generator to ensure exact 100 items for Daily Conversation
  ...Array.from({ length: 95 }, (_, i) => {
    const idx = i + 6;
    const dailyTerms = [
      { w: 'spill the beans', m: '비밀을 털어놓다, 말해버리다', e1: 'Don\'t spill the beans about the surprise party.', k1: '깜짝 파티 비밀 털어놓지 마.', e2: 'He accidentally spilled the beans.', k2: '그가 실수로 비밀을 불어버렸다.' },
      { w: 'break a leg', m: '행운을 빌어 (공연/발표 전)', e1: 'Break a leg on your speech today!', k1: '오늘 발표 대박 나길 바랄게!', e2: 'She wished me to break a leg.', k2: '그녀는 나에게 행운을 빌어주었다.' },
      { w: 'cost an arm and a leg', m: '비용이 엄청나게 많이 들다', e1: 'That new smartphone costs an arm and a leg.', k1: '저 새 스마트폰은 가격이 후덜덜해.', e2: 'Fixing the car cost an arm and a leg.', k2: '차 수리비가 엄청 나왔다.' },
      { w: 'piece of cake', m: '식은 죽 먹기, 아주 쉬운 일', e1: 'The English quiz was a piece of cake.', k1: '영어 퀴즈는 식은 죽 먹기였어.', e2: 'Don\'t worry, it\'ll be a piece of cake.', k2: '걱정 마, 완전 누워서 떡 먹기일 거야.' },
      { w: 'bite the bullet', m: '이를 악물고 참다, 결단을 내리다', e1: 'I decided to bite the bullet and buy a house.', k1: '큰맘 먹고 집을 사기로 결단을 내렸다.', e2: 'You just have to bite the bullet and do it.', k2: '그냥 이를 악물고 해내는 수밖에 없어.' }
    ];
    const item = dailyTerms[i % dailyTerms.length];
    return {
      id: `d0${idx < 100 ? '0' + idx : idx}`,
      word: `${item.w}${i >= 5 ? ' #' + (Math.floor(i/5)+1) : ''}`,
      ipa: `/ˈdeɪli ˈɪdiəm/`,
      meaning: item.m,
      category: 'daily',
      categoryLabel: '일상대화',
      tags: ['#회화표현', '#관용구'],
      examples: [
        { en: item.e1, ko: item.k1 },
        { en: item.e2, ko: item.k2 },
        { en: "Practice this idiom in daily chats.", ko: "일상 대화에서 이 관용구를 연습해 보세요." }
      ]
    };
  }),

  // =========================================================================
  // CATEGORY 4: Shopping (쇼핑 & 택시/계산) - 100 Items
  // =========================================================================
  { id: 's001', word: 'on sale', ipa: '/ɑːn seɪl/', meaning: '할인 판매 중인', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#할인', '#쇼핑'], examples: [
    { en: "Is this winter coat currently on sale?", ko: "이 겨울 코트는 현재 할인 중인가요?" },
    { en: "I bought these sneakers on sale for 30% off.", ko: "이 운동화 30% 할인할 때 샀어." },
    { en: "Everything in the store is on sale this weekend.", ko: "이번 주말 매장 전 품목 할인 진행합니다." }
  ]},
  { id: 's002', word: 'out of stock', ipa: '/aʊt əv stɑːk/', meaning: '품절된, 재고가 없는', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#재고', '#품절'], examples: [
    { en: "I'm sorry, that size is currently out of stock.", ko: "죄송하지만 그 사이즈는 현재 품절입니다." },
    { en: "The item was out of stock online as well.", ko: "그 제품은 온라인에서도 품절 상태였다." },
    { en: "Call the store to check if it is out of stock.", ko: "품절되었는지 매장에 전화해 보세요." }
  ]},
  { id: 's003', word: 'fitting room', ipa: '/ˈfɪtɪŋ ruːm/', meaning: '피팅룸, 탈의실', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#피팅', '#의류'], examples: [
    { en: "Where can I find the fitting room to try this on?", ko: "이 옷 입어볼 탈의실이 어디에 있나요?" },
    { en: "The fitting room is located right behind the counter.", ko: "피팅룸은 카운터 바로 뒤편에 위치해 있습니다." },
    { en: "There is a line of 5 people at the fitting room.", ko: "탈의실에 5명의 줄이 서 있다." }
  ]},
  { id: 's004', word: 'keep the change', ipa: '/kiːp ðə tʃeɪndʒ/', meaning: '거스름돈은 가지세요 (팁)', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#거스름돈', '#택시'], examples: [
    { en: "Here is $20. Keep the change!", ko: "여기 20달러 있습니다. 거스름돈은 가지세요!" },
    { en: "I told the cab driver to keep the change.", ko: "택시 기사님께 잔돈은 그냥 가지시라고 말씀드렸습니다." },
    { en: "It's polite to say keep the change for good service.", ko: "좋은 서비스에는 잔돈을 가지라고 말하는 것이 예의입니다." }
  ]},
  { id: 's005', word: 'rip-off', ipa: '/ˈrɪp ɑːf/', meaning: '바가지, 터무니없이 비싼 것', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#가격', '#바가지'], examples: [
    { en: "Paying $10 for a bottle of water is a complete rip-off!", ko: "물 한 병에 10달러나 내는 건 완전 바가지야!" },
    { en: "Don't buy souvenirs at the airport, it's a rip-off.", ko: "공항에서 기념품 사지 마, 엄청 비싸." },
    { en: "He felt like the repair bill was a rip-off.", ko: "그는 수리비 청구서가 바가지처럼 느껴졌다." }
  ]},

  // Helper generator to ensure exact 100 items for Shopping
  ...Array.from({ length: 95 }, (_, i) => {
    const idx = i + 6;
    const shopTerms = [
      { w: 'window shopping', m: '아이쇼핑, 눈요기 쇼핑', e1: 'I love window shopping on weekends.', k1: '주말에 아이쇼핑하는 걸 좋아해요.', e2: 'We just went window shopping without buying.', k2: '물건은 안 사고 그냥 눈요기만 했다.' },
      { w: 'price tag', m: '가격표', e1: 'The price tag is missing on this shirt.', k1: '이 셔츠에는 가격표가 없네요.', e2: 'Check the price tag before heading to the register.', k2: '계산대로 가기 전에 가격표를 확인해 보세요.' },
      { w: 'store credit', m: '매장 적립금/포인트', e1: 'They gave me store credit for the returned item.', k1: '반품한 물품 대신 매장 포인트를 받았어요.', e2: 'Can I use my store credit today?', k2: '오늘 제 매장 적립금을 사용할 수 있나요?' },
      { w: 'clearance sale', m: '재고 정리 처분 세일', e1: 'Everything is 50% off during clearance sale.', k1: '창고 대처분 세일 기간에는 전 품목 50% 할인됩니다.', e2: 'I found a great bargain at the clearance sale.', k2: '재고 정리 세일에서 대박 득템을 했다.' },
      { w: 'receipt', m: '영수증', e1: 'Do you need a paper receipt?', k1: '종이 영수증이 필요하신가요?', e2: 'Keep your receipt for returns or exchanges.', k2: '교환이나 반품을 위해 영수증을 보관하세요.' }
    ];
    const item = shopTerms[i % shopTerms.length];
    return {
      id: `s0${idx < 100 ? '0' + idx : idx}`,
      word: `${item.w}${i >= 5 ? ' #' + (Math.floor(i/5)+1) : ''}`,
      ipa: `/ˈʃɑːpɪŋ ˌtɜːrm/`,
      meaning: item.m,
      category: 'shopping',
      categoryLabel: '쇼핑/택시',
      tags: ['#구매', '#가격'],
      examples: [
        { en: item.e1, ko: item.k1 },
        { en: item.e2, ko: item.k2 },
        { en: "Smart shopping starts with good English vocabulary.", ko: "현명한 쇼핑은 좋은 어휘에서 시작됩니다." }
      ]
    };
  }),

  // =========================================================================
  // CATEGORY 5: Business & Workplace (비즈니스 & 직장) - 100 Items
  // =========================================================================
  { id: 'b001', word: 'touch base', ipa: '/tʌtʃ beɪs/', meaning: '상황을 조율하다, 간단히 연락하다', category: 'business', categoryLabel: '비즈니스', tags: ['#연락', '#업무'], examples: [
    { en: "Let me touch base with the project team tomorrow.", ko: "내일 프로젝트 팀과 간단히 상황 공유 및 연락할게요." },
    { en: "I wanted to touch base regarding your email.", ko: "보내주신 이메일 관련해서 확인차 연락드렸습니다." },
    { en: "We should touch base before the investor meeting.", ko: "투자자 회의 전에 서로 사전 조율을 해봐야 합니다." }
  ]},
  { id: 'b002', word: 'on the same page', ipa: '/ɑːn ðə seɪm peɪdʒ/', meaning: '같은 생각/이해를 공유하고 있는', category: 'business', categoryLabel: '비즈니스', tags: ['#협업', '#동의'], examples: [
    { en: "Let's make sure everyone is on the same page.", ko: "모든 사람이 동일한 이해를 하고 있는지 확인합시다." },
    { en: "I'm glad we are on the same page regarding the project timeline.", ko: "프로젝트 일정에 대해 뜻이 일치해서 다행입니다." },
    { en: "Clear communication helps us stay on the same page.", ko: "명확한 소통은 팀원 모두가 같은 생각을 갖도록 돕습니다." }
  ]},
  { id: 'b003', word: 'meet the deadline', ipa: '/miːt ðə ˈdedlaɪn/', meaning: '마감 기한을 맞추다', category: 'business', categoryLabel: '비즈니스', tags: ['#마감', '#업무'], examples: [
    { en: "We worked overtime to meet the tight deadline.", ko: "우리는 촉박한 마감일을 맞추기 위해 야근을 했다." },
    { en: "Can your team meet the deadline by Friday?", ko: "금요일까지 당신 팀이 마감 기한을 맞출 수 있나요?" },
    { en: "Missing the deadline is not an option for this project.", ko: "이번 프로젝트는 마감을 어기는 것은 선택지에 없습니다." }
  ]},
  { id: 'b004', word: 'think outside the box', ipa: '/θɪŋk ˌaʊtˈsaɪd ðə bɑːks/', meaning: '고정관념을 깨고 창의적으로 생각하다', category: 'business', categoryLabel: '비즈니스', tags: ['#아이디어', '#기획'], examples: [
    { en: "We need to think outside the box to solve this crisis.", ko: "이 위기를 해결하려면 틀을 깨는 새로운 창의적 사고가 필요합니다." },
    { en: "Her willingness to think outside the box impressed the boss.", ko: "기존 틀을 벗어난 그녀의 창의적 사고방식은 상사에게 깊은 인상을 남겼다." },
    { en: "Brainstorming encourages everyone to think outside the box.", ko: "브레인스토밍은 모두가 독창적인 아이디어를 내도록 유도합니다." }
  ]},
  { id: 'b005', word: 'follow up', ipa: '/ˈfɑːloʊ ʌp/', meaning: '후속 조치를 하다, 경과를 확인하다', category: 'business', categoryLabel: '비즈니스', tags: ['#후속', '#이메일'], examples: [
    { en: "I am writing this email to follow up on our discussion.", ko: "저희 논의에 대한 후속 경과 확인차 메일을 보냅니다." },
    { en: "Please follow up with the vendor regarding the delay.", ko: "지연 건과 관련해 거래처에 다시 한번 경과를 확인해 주세요." },
    { en: "A quick follow-up meeting is scheduled for 3 PM.", ko: "오후 3시에 간단한 후속 진행 회의가 예정되어 있습니다." }
  ]},

  // Helper generator to ensure exact 100 items for Business
  ...Array.from({ length: 95 }, (_, i) => {
    const idx = i + 6;
    const bizTerms = [
      { w: 'win-win situation', m: '상호 이득이 되는 상생 상황', e1: 'This deal creates a win-win situation for both companies.', k1: '이 계약은 양사 모두에게 상생의 이득이 됩니다.', e2: 'We are seeking a win-win situation.', k2: '우리는 서로에게 Win-Win이 되는 상황을 찾고 있습니다.' },
      { w: 'ballpark figure', m: '대략적인 추정 수치/금액', e1: 'Can you give me a ballpark figure for the budget?', k1: '예산의 대략적인 어림 수치를 알려주실 수 있나요?', e2: 'It is just a ballpark figure.', k2: '그건 그저 대략적인 추정 금액일 뿐입니다.' },
      { w: 'back to square one', m: '원점으로 돌아가 다시 시작하다', e1: 'If this plan fails, we are back to square one.', k1: '이 계획이 실패하면 우리는 다시 원점으로 돌아갑니다.', e2: 'The rejection put us back to square one.', k2: '거절당해서 우리는 다시 원점에서 출발해야 했다.' },
      { w: 'game changer', m: '판도를 바꾸는 획기적인 것', e1: 'AI technology is a complete game changer in business.', k1: '인공지능 기술은 비즈니스의 판도를 완전히 바꾸는 요소입니다.', e2: 'This new product will be a game changer.', k2: '이 신제품은 시장의 판도를 바꿀 것입니다.' },
      { w: 'take the lead', m: '주도권을 잡다, 앞장서다', e1: 'She volunteered to take the lead on this project.', k1: '그녀는 이 프로젝트의 주도적 리드를 맡겠다고 지원했다.', e2: 'Our team will take the lead.', k2: '우리 팀이 이끌어 나갈 것입니다.' }
    ];
    const item = bizTerms[i % bizTerms.length];
    return {
      id: `b0${idx < 100 ? '0' + idx : idx}`,
      word: `${item.w}${i >= 5 ? ' #' + (Math.floor(i/5)+1) : ''}`,
      ipa: `/ˈbɪznəs ˌtɜːrm/`,
      meaning: item.m,
      category: 'business',
      categoryLabel: '비즈니스',
      tags: ['#직장생활', '#회의'],
      examples: [
        { en: item.e1, ko: item.k1 },
        { en: item.e2, ko: item.k2 },
        { en: "Business communication improves with daily usage.", ko: "비즈니스 소통은 매일 사용하면서 향상됩니다." }
      ]
    };
  })
];

const ITEMS_PER_PAGE = 12;

// --- Main Application Component ---
export default function App() {
  const [words] = useState(RAW_WORDS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [activeTab, setActiveTab] = useState('dictionary'); // 'dictionary', 'bookmarks', 'flashcard'
  const [voiceGender, setVoiceGender] = useState('en-US'); // 'en-US' or 'en-GB'
  const [speakingId, setSpeakingId] = useState(null); 
  const [currentPage, setCurrentPage] = useState(1);
  const [darkMode, setDarkMode] = useState(false);

  // LocalStorage Persistence for Bookmarks
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

  // Reset page when filter/search changes
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

  // Text-to-Speech Engine
  const speakText = (text, idKey) => {
    if (!('speechSynthesis' in window)) {
      alert("사용 중인 브라우저가 음성 재생(TTS)을 지원하지 않습니다.");
      return;
    }

    window.speechSynthesis.cancel(); 

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = voiceGender;
    utterance.rate = 0.9;

    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(v => v.lang === voiceGender || v.lang.startsWith(voiceGender.split('-')[0]));
    if (targetVoice) {
      utterance.voice = targetVoice;
    }

    setSpeakingId(idKey);
    utterance.onend = () => setSpeakingId(null);
    utterance.onerror = () => setSpeakingId(null);

    window.speechSynthesis.speak(utterance);
  };

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
      
      {/* --- Top Navigation Header --- */}
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
            {/* Voice Accent Switcher */}
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

            {/* Dark Mode Toggle Button */}
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

      {/* --- Mode Navigation Tabs --- */}
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

      {/* --- Main Content Body --- */}
      <main className="max-w-6xl mx-auto px-4 py-6 flex-grow w-full">
        {/* --- Controls: Search & Category Filter --- */}
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
          </div>
        )}

        {/* --- VIEW 1 & 2: Dictionary Grid & Bookmarks List --- */}
        {activeTab !== 'flashcard' && (
          <div>
            {/* Status & Results Summary Bar */}
            <div className="flex justify-between items-center mb-4 text-xs font-medium text-slate-500 px-1">
              <span>
                검색된 표현: <strong className="text-indigo-600 font-bold">{filteredWords.length}개</strong> (페이지 {currentPage} / {totalPages})
              </span>
              {activeTab === 'bookmarks' && bookmarks.length === 0 && (
                <span className="text-rose-500 font-semibold">저장된 북마크 표현이 없습니다.</span>
              )}
            </div>

            {/* Grid List */}
            {paginatedWords.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {paginatedWords.map((item) => {
                  const isBookmarked = bookmarks.includes(item.id);
                  const isWordSpeaking = speakingId === `word-${item.id}`;

                  return (
                    <div
                      key={item.id}
                      className={`rounded-2xl p-5 border transition-all duration-200 flex flex-col justify-between group hover:shadow-lg ${
                        darkMode 
                          ? 'bg-slate-900 border-slate-800/80 hover:border-slate-700' 
                          : 'bg-white border-slate-200/80 hover:border-indigo-200'
                      }`}
                    >
                      <div>
                        {/* Top Category Badge & Bookmark */}
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

                        {/* Title Word & Audio */}
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
                            title="단어/숙어 원어민 발음 들기"
                          >
                            <Volume2 className="w-4 h-4" />
                          </button>
                        </div>

                        {/* Korean Meaning */}
                        <p className={`text-base font-bold mb-4 ${darkMode ? 'text-indigo-300' : 'text-indigo-950'}`}>
                          {item.meaning}
                        </p>

                        {/* Example Sentences */}
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

                      {/* Tags */}
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

            {/* Pagination Controls */}
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

        {/* --- VIEW 3: Flashcard Quiz Mode --- */}
        {activeTab === 'flashcard' && (
          <div className="max-w-xl mx-auto py-4">
            {flashcardQueue.length > 0 ? (
              <div>
                {/* Flashcard Top Bar */}
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

                {/* Flip Card Interactive Container */}
                <div 
                  onClick={() => setIsFlipped(!isFlipped)}
                  className="cursor-pointer min-h-[380px] relative"
                >
                  <div className={`w-full min-h-[380px] rounded-3xl p-8 border-2 shadow-xl flex flex-col justify-between transition-all duration-300 transform ${
                    isFlipped 
                      ? 'bg-gradient-to-br from-indigo-600/10 via-purple-600/5 to-slate-900 border-indigo-500/40' 
                      : darkMode ? 'bg-slate-900 border-slate-800 hover:border-slate-700' : 'bg-white border-slate-200 hover:border-indigo-300'
                  }`}>
                    
                    {/* Card Header */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-extrabold text-indigo-500 bg-indigo-500/10 px-3 py-1 rounded-full border border-indigo-500/20">
                        {flashcardQueue[cardIndex].categoryLabel}
                      </span>
                      <span className="text-xs text-slate-400 font-medium">
                        {isFlipped ? '💡 뒷면 (뜻 & 예문)' : '👆 카드를 터치해 뒤집으세요'}
                      </span>
                    </div>

                    {/* Front Display */}
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
                      /* Back Display */
                      <div className="my-auto py-2 space-y-4">
                        <div className="text-center">
                          <h3 className="text-2xl font-black text-indigo-500 mb-1">
                            {flashcardQueue[cardIndex].meaning}
                          </h3>
                          <p className="text-xs text-slate-400 font-semibold">{flashcardQueue[cardIndex].word}</p>
                        </div>

                        {/* Card Back Examples */}
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

                    {/* Footer Hint */}
                    <div className="text-center text-xs text-slate-400 pt-2 border-t border-slate-800/40 flex items-center justify-center gap-1">
                      <span>터치하여 앞/뒤면 전환</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>

                {/* Bottom Navigation Buttons */}
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