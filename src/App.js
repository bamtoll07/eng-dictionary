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

// --- 상황별 30개씩, 총 150개의 실생활 영단어 & 원어민 회화 예문 데이터셋 ---
const RAW_WORDS = [
  // =========================================================================
  // 1. 카페/식당 (Cafe & Dining) - 30개
  // =========================================================================
  { id: 'c001', word: 'appetizer', ipa: '/ˈæpɪtaɪzər/', meaning: '애피타이저, 식전 요리', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#식사', '#메뉴'], examples: [
    { en: "Should we share an appetizer before our mains come out?", ko: "메인 나오기 전에 애피타이저 하나 나눠 먹을까?" },
    { en: "The fried calamari was a great appetizer to kick off the meal.", ko: "오징어 튀김은 식사를 시작하기에 아주 좋은 애피타이저였어." }
  ]},
  { id: 'c002', word: 'beverage', ipa: '/ˈbevərɪdʒ/', meaning: '음료', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#음료', '#카페'], examples: [
    { en: "All meals come with a complimentary hot or cold beverage.", ko: "모든 식사에는 무료 음료(따뜻한 것 또는 찬 것 중 선택)가 포함되어 있습니다." },
    { en: "Would you like to order any additional beverages?", ko: "음료 추가로 더 주문하시겠어요?" }
  ]},
  { id: 'c003', word: 'cutlery', ipa: '/ˈkʌtləri/', meaning: '식기류 (나이프·포크·숟가락)', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#식기', '#테이블'], examples: [
    { en: "Excuse me, could we get another set of cutlery over here?", ko: "저기요, 여기 식기류 한 세트 더 주실 수 있나요?" },
    { en: "The waiter accidentally dropped the cutlery on the floor.", ko: "웨이터가 실수로 식기류를 바닥에 떨어뜨렸다." }
  ]},
  { id: 'c004', word: 'gratuity', ipa: '/ɡrəˈtuːəti/', meaning: '팁, 봉사료', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#팁', '#계산'], examples: [
    { en: "Is a gratuity automatically added to the bill for large groups?", ko: "단체 손님의 경우 계산서에 팁이 자동으로 포함되나요?" },
    { en: "We left a generous gratuity because the service was fantastic.", ko: "서비스가 너무 좋아서 넉넉하게 팁을 남겼다." }
  ]},
  { id: 'c005', word: 'ingredient', ipa: '/ɪnˈɡriːdiənt/', meaning: '재료, 성분', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#음식재료', '#요리'], examples: [
    { en: "I love this pasta because it uses super fresh ingredients.", ko: "이 파스타는 엄청 신선한 재료를 써서 정말 좋아해." },
    { en: "Can you tell me if this dish contains any dairy ingredients?", ko: "이 음식에 유제품 성분이 들어가는지 알려주실 수 있나요?" }
  ]},
  { id: 'c006', word: 'menu', ipa: '/ˈmenjuː/', meaning: '메뉴판, 차림표', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#메뉴판', '#주문'], examples: [
    { en: "Take your time looking over the menu. Let me know when you are ready.", ko: "천천히 메뉴판 보시고 고르시면 말씀해 주세요." },
    { en: "Do you have a kids menu available?", ko: "혹시 어린이용 메뉴판도 따로 있나요?" }
  ]},
  { id: 'c007', word: 'receipt', ipa: '/rɪˈsiːt/', meaning: '영수증', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#영수증', '#결제'], examples: [
    { en: "Could you print out the receipt for me, please?", ko: "영수증 좀 뽑아주시겠어요?" },
    { en: "I always check my receipt before leaving the cafe.", ko: "나는 카페를 나서기 전에 항상 영수증을 확인하는 버릇이 있다." }
  ]},
  { id: 'c008', word: 'specialty', ipa: '/ˈspeʃəlti/', meaning: '시그니처 메뉴, 특선 요리', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#추천요리', '#특산품'], examples: [
    { en: "What is the chef's specialty here tonight?", ko: "오늘 밤 이 집의 셰프 추천 메인 요리가 뭔가요?" },
    { en: "Their vanilla sweet cream cold brew is the cafe's specialty.", ko: "그 카페는 바닐라 스위트 크림 콜드브루가 시그니처 메뉴야." }
  ]},
  { id: 'c009', word: 'reservation', ipa: '/ˌrezərˈveɪʃn/', meaning: '예약', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#예약', '#식당'], examples: [
    { en: "Hi, I have a table reservation under the name David for 7 PM.", ko: "안녕하세요, 저녁 7시에 데이비드 이름으로 테이블 예약했어요." },
    { en: "It's almost impossible to get in on Friday nights without a reservation.", ko: "금요일 밤에는 예약 없이 들어가기가 거의 하늘의 별 따기야." }
  ]},
  { id: 'c010', word: 'vegetarian', ipa: '/ˌvedʒəˈteriən/', meaning: '채식주의자용의, 채식주의자', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#채식', '#식단'], examples: [
    { en: "Are there any good vegetarian options on this menu?", ko: "이 메뉴판에 괜찮은 채식 메뉴도 좀 있나요?" },
    { en: "My roommate is a strict vegetarian, so we chose this salad bar.", ko: "룸메이트가 엄격한 채식주의자라서 이 샐러드바로 골랐어." }
  ]},
  { id: 'c011', word: 'banquet', ipa: '/ˈbæŋkwɪt/', meaning: '연회, 만찬', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#행사', '#모임'], examples: [
    { en: "Our company is hosting a year-end banquet at this hotel restaurant.", ko: "우리 회사가 이 호텔 식당에서 송년 만찬을 열어요." },
    { en: "The banquet room was beautifully decorated with flowers.", ko: "연회장이 꽃들로 아주 예쁘게 꾸며져 있었다." }
  ]},
  { id: 'c012', word: 'caffeine', ipa: '/ˈkæfiːn/', meaning: '카페인', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#커피', '#음료'], examples: [
    { en: "I'm cutting back on caffeine, so I'll get a decaf latte.", ko: "나 카페인 줄이는 중이라 디카페인 라떼로 마실래." },
    { en: "Too much caffeine late at night keeps me wide awake.", ko: "밤늦게 카페인을 너무 많이 먹으면 잠이 완전히 달아나." }
  ]},
  { id: 'c013', word: 'condiment', ipa: '/ˈkɑːndɪmənt/', meaning: '조미료, 소스류', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#소스', '#양념'], examples: [
    { en: "Where can I find extra napkins and condiments?", ko: "여분의 냅킨이랑 소스류는 어디에 있나요?" },
    { en: "He loves putting all sorts of condiments on his hot dog.", ko: "그는 핫도그에 온갖 소스 뿌려 먹는 걸 엄청 좋아한다." }
  ]},
  { id: 'c014', word: 'delicatessen', ipa: '/ˌdelɪkəˈtesn/', meaning: '즉석 조리 식품 판매점 (델리)', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#델리', '#식료품'], examples: [
    { en: "Let's grab a quick pastrami sandwich from the corner delicatessen.", ko: "모퉁이에 있는 델리 가게에서 파스트라미 샌드위치나 가볍게 사자." },
    { en: "That delicatessen is famous for homemade sausages.", ko: "저 델리 가게는 수제 소시지로 엄청 유명해." }
  ]},
  { id: 'c015', word: 'entrepreneur', ipa: '/ˌɑːntrəprəˈnɜːr/', meaning: '사업가, 창업자', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#사업', '#인물'], examples: [
    { en: "Lots of young entrepreneurs hang out at this hipster coffee shop.", ko: "이 힙한 카페에는 젊은 창업가들이 많이 모여." },
    { en: "She started out as a small cafe owner and became a successful entrepreneur.", ko: "그녀는 작은 카페 사장으로 시작해 성공한 사업가로 거듭났다." }
  ]},
  { id: 'c016', word: 'brunch', ipa: '/brʌntʃ/', meaning: '브런치 (아침 겸 점심)', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#브런치', '#주말'], examples: [
    { en: "Do you want to grab some avocado toast for brunch tomorrow?", ko: "내일 아침에 브런치로 아보카도 토스트나 먹으러 갈래?" },
    { en: "Sunday brunch spots are always packed with people.", ko: "일요일 브런치 맛집들은 늘 사람들로 북적거려." }
  ]},
  { id: 'c017', word: 'buffet', ipa: '/bəˈfeɪ/', meaning: '뷔페식 식당', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#뷔페', '#무제한'], examples: [
    { en: "I ate way too much at the hotel breakfast buffet this morning.", ko: "오늘 아침 호텔 조식 뷔페에서 너무 과식했어." },
    { en: "Is the weekend lunch buffet all-you-can-eat?", ko: "주말 런치 뷔페는 무한 리필로 먹을 수 있는 건가요?" }
  ]},
  { id: 'c018', word: 'corkage', ipa: '/ˈkɔːrkɪdʒ/', meaning: '콜키지 (가져온 술을 마실 때 내는 요금)', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#와인', '#콜키지'], examples: [
    { en: "Do you guys charge a corkage fee if we bring our own wine?", ko: "저희가 와인을 직접 들고 가면 콜키지 비용이 따로 있나요?" },
    { en: "Their corkage fee is reasonable, so we brought a nice bottle.", ko: "여기는 콜키지 비용이 합리적이라 좋은 와인 한 병 들고 갔지." }
  ]},
  { id: 'c019', word: 'draft beer', ipa: '/dræft bɪr/', meaning: '생맥주', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#맥주', '#술집'], examples: [
    { en: "Nothing beats an ice-cold draft beer after a long workday.", ko: "일 오래 하고 나서 마시는 시원한 생맥주만 한 게 없지." },
    { en: "What kind of craft draft beers do you have on tap?", ko: "탭으로 나오는 수제 생맥주는 어떤 것들이 있나요?" }
  ]},
  { id: 'c020', word: 'gourmet', ipa: '/ˈɡʊrˌmeɪ/', meaning: '미식가의, 고급 요리의', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#미식', '#고급'], examples: [
    { en: "This burger joint uses gourmet ingredients like truffle mayo.", ko: "이 버거집은 트러플 마요 같은 고급 미식가용 재료를 쓴다네." },
    { en: "She loves exploring hidden gourmet restaurants in the city.", ko: "그녀는 도시 속 숨은 미식 맛집들을 찾아다니는 걸 좋아해." }
  ]},
  { id: 'c021', word: 'leftovers', ipa: '/ˈleftoʊvərz/', meaning: '먹다 남은 음식', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#포장', '#남은음식'], examples: [
    { en: "Could I get a to-go box for these leftovers, please?", ko: "이 남은 음식 담아갈 포장 용기 좀 주시겠어요?" },
    { en: "I'm planning to have last night's pizza leftovers for lunch.", ko: "점심으로 어제 밤에 먹다 남은 피자 데워 먹으려고." }
  ]},
  { id: 'c022', word: 'patron', ipa: '/ˈpeɪtrən/', meaning: '(식당 등의) 단골손님, 후원자', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#단골', '#손님'], examples: [
    { en: "This cozy bakery has many loyal patrons who visit every morning.", ko: "이 아늑한 빵집은 매일 아침 찾아오는 충성 단골들이 많다." },
    { en: "The owner greeted regular patrons with a warm smile.", ko: "사징님이 단골손님들을 따뜻한 미소로 맞아주었다." }
  ]},
  { id: 'c023', word: 'refreshment', ipa: '/rɪˈfreʃmənt/', meaning: '다과, 음료', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#다과', '#간식'], examples: [
    { en: "Light refreshments will be served during the seminar break.", ko: "세미나 쉬는 시간에 간단한 다과가 제공될 예정입니다." },
    { en: "Grab some refreshments from the table if you are thirsty.", ko: "목마르면 테이블에 있는 다과나 음료 좀 드세요." }
  ]},
  { id: 'c024', word: 'seasoning', ipa: '/ˈsiːzənɪŋ/', meaning: '양념, 조미료', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#간맞추기', '#양념'], examples: [
    { en: "The steak needs a little more salt and pepper seasoning.", ko: "스테이크에 소금이랑 후추 간이 조금 더 되어야겠어." },
    { en: "Too much artificial seasoning ruins the natural taste of food.", ko: "인공 조미료가 너무 많으면 음식 본연의 맛을 망쳐." }
  ]},
  { id: 'c025', word: 'smorgasbord', ipa: '/ˈsmɔːrɡəsbɔːrd/', meaning: '다양한 음식의 모음, 뷔페', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#다양함', '#뷔페'], examples: [
    { en: "The hotel breakfast offered a smorgasbord of international dishes.", ko: "호텔 조식이 전 세계 다양한 요리들로 진수성찬처럼 차려져 나왔다." },
    { en: "Life gives us a smorgasbord of unexpected choices.", ko: "인생은 우리에게 예상치 못한 다양한 선택지들을 선물해 준다." }
  ]},
  { id: 'c026', word: 'sommelier', ipa: '/ˌsʌməˈljeɪ/', meaning: '소믈리에 (와인 전문 가이드)', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#와인', '#전문가'], examples: [
    { en: "Let's ask the resident sommelier to recommend a good red wine.", ko: "상주하는 소믈리에한테 괜찮은 레드 와인 추천해달라고 하자." },
    { en: "The restaurant's sommelier paired our seafood course with a crisp white wine.", ko: "식당 소믈리에가 해산물 코스 요리에 상큼한 화이트 와인을 곁들여 주었다." }
  ]},
  { id: 'c027', word: 'teetotaler', ipa: '/ˌtiːˈtoʊlər/', meaning: '술을 전혀 안 마시는 사람', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#금주', '#음료'], examples: [
    { en: "Since I'm a teetotaler, I always order sparkling water at bars.", ko: "나는 술을 전혀 안 마셔서 바에 가면 늘 탄산수를 시켜." },
    { en: "He has been a lifelong teetotaler for health reasons.", ko: "그는 건강상의 이유로 평생 술을 입에 대지 않았다." }
  ]},
  { id: 'c028', word: 'vendor', ipa: '/ˈvendər/', meaning: '노점상, 행상인, 판매업체', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#길거리음식', '#푸드트럭'], examples: [
    { en: "Street food vendors near the beach sell amazing tacos.", ko: "해변 근처 길거리 푸드트럭에서 기가 막힌 타코를 팔아." },
    { en: "We bought fresh strawberries from a local farm vendor.", ko: "현지 농장 판매상한테서 싱싱한 딸기를 샀다." }
  ]},
  { id: 'c029', word: 'appetizing', ipa: '/ˈæpɪtaɪzɪŋ/', meaning: '입맛을 돋우는, 먹음직스러운', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#먹음직', '#비주얼'], examples: [
    { en: "The smell of freshly baked pastries is so appetizing.", ko: "갓 구워낸 빵 냄새가 정말 입맛을 돋우네." },
    { en: "That food looks colorful and extremely appetizing.", ko: "저 음식 색감이 아주 알록달록하고 군침이 도는데." }
  ]},
  { id: 'c030', word: 'authentic', ipa: '/ɔːˈθentɪk/', meaning: '정통의, 진짜의', category: 'cafe_dining', categoryLabel: '카페/식당', tags: ['#현지맛', '#오리지널'], examples: [
    { en: "If you want authentic Italian pizza, you should visit this pizzeria.", ko: "진짜 정통 이탈리안 피자 먹고 싶다면 이 피자집 가봐야 해." },
    { en: "This taco tastes just like the ones from an authentic street stand in Mexico.", ko: "이 타코 맛이 멕시코 현지 길거리 포장마차에서 먹던 거랑 똑같아." }
  ]},

  // =========================================================================
  // 2. 여행/공항 (Travel & Airport) - 30개
  // =========================================================================
  { id: 't001', word: 'boarding pass', ipa: '/ˈbɔːrdɪŋ pæs/', meaning: '탑승권', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#공항', '#탑승'], examples: [
    { en: "Have your passport and boarding pass ready as you approach the gate.", ko: "탑승구 다가갈 때 여권이랑 탑승권 미리 꺼내두세요." },
    { en: "I lost my physical boarding pass, but thankfully I have it on my phone.", ko: "종이 탑승권을 잃어버렸는데 다행히 스마트폰에 들어있어." }
  ]},
  { id: 't002', word: 'customs', ipa: '/ˈkʌstəmz/', meaning: '세관', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#세관', '#입국'], examples: [
    { en: "Do you have anything to declare to customs?", ko: "세관에 따로 신고할 물건 있으신가요?" },
    { en: "It took us nearly an hour to clear customs and get out.", ko: "세관 통과하고 나오는데 거의 한 시간이나 걸렸어." }
  ]},
  { id: 't003', word: 'departure', ipa: '/dɪˈpɑːrtʃər/', meaning: '출발', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#출발', '#비행기'], examples: [
    { en: "What time is our flight departure scheduled for?", ko: "우리 비행기 출발 시간이 몇 시로 잡혀 있지?" },
    { en: "Let's head to the departure lounge after grabbing a quick coffee.", ko: "간단히 커피 한잔 마시고 출발 라운지로 가자." }
  ]},
  { id: 't004', word: 'destination', ipa: '/ˌdestɪˈneɪʃn/', meaning: '목적지', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#목적지', '#여행'], examples: [
    { en: "Backpackers love choosing exotic destinations like Southeast Asia.", ko: "배낭여행객들은 동남아 같은 이국적인 여행지를 엄청 좋아해." },
    { en: "We finally touched down at our dream vacation destination.", ko: "드디어 꿈에 그리던 휴가 목적지에 착륙했다." }
  ]},
  { id: 't005', word: 'itinerary', ipa: '/aɪˈtɪnəreri/', meaning: '여행 일정표', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#일정표', '#여행계획'], examples: [
    { en: "Let me check the travel itinerary to see where we're going tomorrow.", ko: "내일 어디 가기로 했는지 여행 일정표 좀 확인해볼게." },
    { en: "She packed our itinerary with way too many activities.", ko: "그녀가 일정표에 너무 빡빡하게 액티비티를 짜 넣었어." }
  ]},
  { id: 't006', word: 'baggage', ipa: '/ˈbæɡɪdʒ/', meaning: '수하물, 짐', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#짐', '#공항'], examples: [
    { en: "Make sure your baggage doesn't exceed the weight limit.", ko: "짐 무게 제한 초과 안 되게 잘 확인해라." },
    { en: "We've been waiting at the baggage carousel for 20 minutes.", ko: "수하물 찾는 곳에서 20분째 기다리는 중이야." }
  ]},
  { id: 't007', word: 'immigration', ipa: '/ˌɪmɪˈɡreɪʃn/', meaning: '출입국 심사대', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#입국심사', '#여권'], examples: [
    { en: "The immigration officer asked me how long I'm planning to stay.", ko: "입국 심사관이 체류 기간이 얼마나 되는지 물어보더라." },
    { en: "Be prepared to show your return ticket at immigration.", ko: "입국 심사 때 리턴 티켓 보여줄 준비 하고 있어야 해." }
  ]},
  { id: 't008', word: 'layover', ipa: '/ˈleɪoʊvər/', meaning: '경유 대기', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#경유', '#비행기'], examples: [
    { en: "We have a 6-hour layover in Tokyo, so let's grab some ramen.", ko: "도쿄에서 6시간 경유 대기인데 라면이나 먹고 오자." },
    { en: "Booking a flight with a long layover can be exhausting.", ko: "경유 대기 시간이 긴 항공편을 끊으면 엄청 녹초가 돼." }
  ]},
  { id: 't009', word: 'terminal', ipa: '/ˈtɜːrmɪnl/', meaning: '(공항) 터미널', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#공항건물', '#탑승구'], examples: [
    { en: "Which terminal do international flights leave from?", ko: "국제선은 몇 번 터미널에서 출발하나요?" },
    { en: "We need to take an airport train to get to Terminal 2.", ko: "제2터미널로 가려면 공항 내부 열차를 타야 해." }
  ]},
  { id: 't010', word: 'turbulence', ipa: '/ˈtɜːrbjʊləns/', meaning: '난기류', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#비행', '#기상'], examples: [
    { en: "The plane shook violently when we hit some unexpected turbulence.", ko: "예상치 못한 난기류를 만나서 비행기가 엄청 흔들렸어." },
    { en: "Please keep your seatbelt buckled in case of turbulence.", ko: "난기류에 대비해 안전벨트를 계속 매고 계세요." }
  ]},
  { id: 't011', word: 'jet lag', ipa: '/ˈdʒet læɡ/', meaning: '시차 적응 피로', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#시차', '#피로'], examples: [
    { en: "I'm still suffering from jet lag after flying across the Pacific.", ko: "태평양 건너 비행기 타고 왔더니 아직도 시차 적응이 안 되네." },
    { en: "It takes me a few days to bounce back from severe jet lag.", ko: "심한 시차 피로를 극복하는 데는 며칠 걸려." }
  ]},
  { id: 't012', word: 'passport', ipa: '/ˈpæspɔːrt/', meaning: '여권', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#여권', '#신분증'], examples: [
    { en: "Always keep your passport in a secure pocket while traveling.", ko: "여행할 때는 여권을 항상 안전한 주머니에 넣어둬." },
    { en: "My passport expires in six months, so I need to renew it.", ko: "여권 만료일이 6개월 남아서 새로 재발급받아야 해." }
  ]},
  { id: 't013', word: 'souvenir', ipa: '/ˌsuːvəˈnɪr/', meaning: '기념품', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#기념품', '#쇼핑'], examples: [
    { en: "I bought some cute fridge magnets as souvenirs for my friends.", ko: "친구들 줄 기념품으로 귀여운 냉장고 자석 좀 샀어." },
    { en: "Let's stop by the gift shop to pick up some local souvenirs.", ko: "기념품 샵 들러서 현지 특산 기념품 좀 골라보자." }
  ]},
  { id: 't014', word: 'sightseeing', ipa: '/ˈsaɪtˌsiːɪŋ/', meaning: '관광', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#관광', '#여행코스'], examples: [
    { en: "We spent the whole afternoon sightseeing around historical old towns.", ko: "오후 내내 유서 깊은 구시가지 일대를 구경하며 돌아다녔다." },
    { en: "Are you up for some city sightseeing tomorrow morning?", ko: "내일 아침에 시내 관광 좀 하러 갈래?" }
  ]},
  { id: 't015', word: 'accommodation', ipa: '/əˌkɑːməˈdeɪʃn/', meaning: '숙박시설, 숙소', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#숙소', '#호텔'], examples: [
    { en: "Have you booked your accommodation for the summer vacation yet?", ko: "여름 휴가 숙소는 벌써 예약 끝냈어?" },
    { en: "The price includes daily breakfast and comfortable accommodation.", ko: "가격에 조식과 편안한 숙박이 포함되어 있어." }
  ]},
  { id: 't016', word: 'reservation', ipa: '/ˌrezərˈveɪʃn/', meaning: '예약', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#예약', '#호텔'], examples: [
    { en: "I'd like to confirm my hotel room reservation, please.", ko: "호텔 객실 예약 확인 좀 부탁드립니다." },
    { en: "Making reservations online in advance saves you a lot of hassle.", ko: "온라인으로 미리 예약을 해두면 엄청 번거로움을 덜 수 있어." }
  ]},
  { id: 't017', word: 'cancellation', ipa: '/ˌkænsəˈleɪʃn/', meaning: '취소', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#취소', '#변경'], examples: [
    { en: "Check their cancellation policy before booking the flight.", ko: "비행기 끊기 전에 취소 환불 규정 꼭 확인해 봐." },
    { en: "We had to deal with a sudden flight cancellation due to bad weather.", ko: "악천후 때문에 갑작스러운 결항(취소)을 겪어야 했다." }
  ]},
  { id: 't018', word: 'delay', ipa: '/dɪˈleɪ/', meaning: '지연, 연기', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#지연', '#대기'], examples: [
    { en: "Our train got a 30-minute delay due to track maintenance.", ko: "선로 보수 공사 때문에 기차가 30분 지연되었어." },
    { en: "I hate flight delays because they mess up my whole schedule.", ko: "일정이 다 꼬여버리기 때문에 비행기 지연되는 거 정말 딱 질색이야." }
  ]},
  { id: 't019', word: 'gateway', ipa: '/ˈɡeɪtˌweɪ/', meaning: '관문, 진입로', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#공항관문', '#도시'], examples: [
    { en: "Incheon International Airport is a major gateway to Asia.", ko: "인천국제공항은 아시아로 향하는 주요 관문이다." },
    { en: "This coastal town serves as a gateway to the national park.", ko: "이 해안 도시는 국립공원으로 통하는 관문 역할을 한다." }
  ]},
  { id: 't020', word: 'shuttle', ipa: '/ˈʃʌtl/', meaning: '셔틀버스, 왕복 이동수단', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#셔틀', '#교통'], examples: [
    { en: "Is there a free hotel shuttle running to the airport?", ko: "공항으로 가는 무료 호텔 셔틀버스가 운행되나요?" },
    { en: "We missed the terminal shuttle and had to walk.", ko: "터미널 셔틀버스를 놓쳐서 걸어가야만 했다." }
  ]},
  { id: 't021', word: 'transit', ipa: '/ˈtrænzɪt/', meaning: '환승, 통과, 대중교통', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#환승', '#이동'], examples: [
    { en: "Do we need to pick up our bags during transit?", ko: "환승할 때 짐을 직접 찾아서 부쳐야 하나요?" },
    { en: "Public transit in European cities is super easy to navigate.", ko: "유럽 도시들은 대중교통 이용하기가 정말 편리해." }
  ]},
  { id: 't022', word: 'upgrade', ipa: '/ˈʌpɡreɪd/', meaning: '업그레이드, 등급 상향', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#업그레이드', '#좌석'], examples: [
    { en: "We got a lucky free upgrade to business class!", ko: "운 좋게 비즈니스석으로 무료 업그레이드받았어!" },
    { en: "How much does it cost to upgrade my hotel room?", ko: "호텔 방 등급을 업그레이드하려면 비용이 얼마나 드나요?" }
  ]},
  { id: 't023', word: 'vacation', ipa: '/vəˈkeɪʃn/', meaning: '방학, 휴가', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#휴가', '#여행'], examples: [
    { en: "Where are you heading for your summer vacation?", ko: "이번 여름 휴가 어디로 떠날 계획이야?" },
    { en: "I'm counting down the days until my tropical vacation.", ko: "휴양지로 떠날 휴가 날짜만 손꼽아 기다리는 중이야." }
  ]},
  { id: 't024', word: 'wandering', ipa: '/ˈwɑːndərɪŋ/', meaning: '정처 없이 돌아다님, 방랑', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#골목여행', '#산책'], examples: [
    { en: "I love wandering around old European alleyways without a map.", ko: "나는 지도 없이 유럽 구시가지 골목골목을 정처 없이 돌아다니는 걸 좋아해." },
    { en: "Endless wandering helped us discover a cozy hidden coffee shop.", ko: "정처 없이 걷다 보니 아늑하고 숨은 카페를 우연히 발견하게 됐다." }
  ]},
  { id: 't025', word: 'excursion', ipa: '/ɪkˈskɜːrʒn/', meaning: '소풍, 짧은 여행, 견학', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#당일치기', '#투어'], examples: [
    { en: "We booked a boat excursion to explore the nearby coral reefs.", ko: "근처 산호초를 둘러보는 보트 투어(소풍)를 예약했다." },
    { en: "The resort offers daily guided excursions into the jungle.", ko: "리조트에서는 정글로 떠나는 일일 가이드 투어를 제공한다." }
  ]},
  { id: 't026', word: 'souvenir', ipa: '/ˌsuːvəˈnɪr/', meaning: '기념품', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#기념품', '#여행선물'], examples: [
    { en: "These handmade keychains make perfect little souvenirs.", ko: "이 수제 열쇠고리들은 가볍게 선물용 기념품으로 딱이야." },
    { en: "I bought way too many souvenirs and now my suitcase won't close.", ko: "기념품을 너무 많이 샀더니 캐리어가 안 닫혀." }
  ]},
  { id: 't027', word: 'overseas', ipa: '/ˌoʊvərˈsiːz/', meaning: '해외의, 외국으로', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#해외', '#국외'], examples: [
    { en: "Have you ever traveled overseas on your own?", ko: "혼자서 해외여행 가본 적 있어?" },
    { en: "My company is sending me on an overseas business trip next week.", ko: "다음 주에 회사가 나를 해외 출장 보낸대." }
  ]},
  { id: 't028', word: 'landscape', ipa: '/ˈlændskeɪp/', meaning: '풍경, 경치', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#풍경', '#자연'], examples: [
    { en: "The mountain landscape covered in snow was breathtaking.", ko: "눈으로 뒤덮인 산세 풍경이 정말 숨이 멎을 정도로 멋졌어." },
    { en: "I took loads of pictures of the gorgeous countryside landscape.", ko: "아름다운 시골 풍경 사진을 아주 실컷 찍었다." }
  ]},
  { id: 't029', word: 'horizon', ipa: '/həˈraɪzn/', meaning: '지평선, 수평선', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#바다', '#노을'], examples: [
    { en: "We watched the sun slowly sink below the ocean horizon.", ko: "바다 수평선 너머로 해가 서서히 저무는 것을 바라보았다." },
    { en: "The cruise ship disappeared over the distant horizon.", ko: "유람선이 아득한 지평선 너머로 사라져 갔다." }
  ]},
  { id: 't030', word: 'explorer', ipa: '/ɪkˈsplɔːrər/', meaning: '탐험가, 답사자', category: 'travel_airport', categoryLabel: '여행/공항', tags: ['#탐험', '#여행가'], examples: [
    { en: "He has the soul of an intrepid explorer traveling off the beaten path.", ko: "그는 남들이 안 가는 길을 여행하는 대담한 탐험가의 영혼을 지녔어." },
    { en: "Local guides shared stories of ancient explorers who crossed the desert.", ko: "현지 가이드들이 사막을 건넜던 고대 탐험가들의 이야기를 들려주었다." }
  ]},

  // =========================================================================
  // 3. 일상대화 (Daily Conversation) - 30개
  // =========================================================================
  { id: 'd001', word: 'appointment', ipa: '/əˈpɔɪntmənt/', meaning: '약속, (병원·상담 등의) 예약', category: 'daily', categoryLabel: '일상대화', tags: ['#약속', '#일정'], examples: [
    { en: "I need to reschedule my dental appointment to next week.", ko: "치과 예약 다음 주루 좀 미뤄야겠어." },
    { en: "Don't forget you have a hair salon appointment at 3 PM.", ko: "너 오후 3시에 미용실 예약 있는 거 잊지 마." }
  ]},
  { id: 'd002', word: 'convenient', ipa: '/kənˈviːniənt/', meaning: '편리한', category: 'daily', categoryLabel: '일상대화', tags: ['#편리', '#생활'], examples: [
    { en: "Living right next to a subway station is super convenient.", ko: "지하철역 바로 옆에 살면 엄청 편리하지." },
    { en: "Let me know whatever time is most convenient for you.", ko: "너한테 가장 편한 시간대로 편하게 알려줘." }
  ]},
  { id: 'd003', word: 'frequent', ipa: '/ˈfriːkwənt/', meaning: '자주 일어나는, 빈번한', category: 'daily', categoryLabel: '일상대화', tags: ['#빈도', '#일상'], examples: [
    { en: "Heavy rain showers are frequent during this time of year.", ko: "요맘때쯤에는 소나기가 자주 내려." },
    { en: "He is a frequent customer at our neighborhood bookstore.", ko: "그는 우리 동네 서점 단골손님이야." }
  ]},
  { id: 'd004', word: 'patient', ipa: '/ˈpeɪʃnt/', meaning: '참을성 있는, 환자', category: 'daily', categoryLabel: '일상대화', tags: ['#성격', '#인내'], examples: [
    { en: "Thanks for being so patient while I fix this computer issue.", ko: "컴퓨터 고치는 동안 이렇게 차분히 기다려줘서 고마워." },
    { en: "Working with young kids requires a ton of patience.", ko: "어린아이들 상대하는 건 엄청난 인내심이 필요해." }
  ]},
  { id: 'd005', word: 'schedule', ipa: '/ˈskedʒuːl/', meaning: '일정, 스케줄', category: 'daily', categoryLabel: '일상대화', tags: ['#일정', '#계획'], examples: [
    { en: "My schedule is completely jam-packed for the rest of the week.", ko: "이번 주 남은 기간은 내 스케줄이 완전히 꽉 찼어." },
    { en: "Let's look at our calendars and sync our schedules.", ko: "다이어리 펼쳐서 서로 일정을 맞춰보자." }
  ]},
  { id: 'd006', word: 'atmosphere', ipa: '/ˈætməsfɪr/', meaning: '분위기, 공기', category: 'daily', categoryLabel: '일상대화', tags: ['#분위기', '#환경'], examples: [
    { en: "I love the warm and cozy atmosphere of this small bookstore.", ko: "이 작은 서점의 따뜻하고 아늑한 분위기가 너무 좋아." },
    { en: "The party had a fun and lively atmosphere from the start.", ko: "파티는 시작부터 흥겹고 활기찬 분위기였다." }
  ]},
  { id: 'd007', word: 'curiosity', ipa: '/ˌkjʊriˈɑːsəti/', meaning: '호기심', category: 'daily', categoryLabel: '일상대화', tags: ['#호기심', '#생각'], examples: [
    { en: "Pure curiosity made me open that mysterious old box.", ko: "순수한 호기심에 그 수상쩍은 옛날 상자를 열어보게 됐다." },
    { en: "Kids have endless curiosity about how things work.", ko: "아이들은 사물이 어떻게 작동하는지 끝없는 호기심을 품는다." }
  ]},
  { id: 'd008', word: 'diligent', ipa: '/ˈdɪlɪdʒənt/', meaning: '성실한, 부지런한', category: 'daily', categoryLabel: '일상대화', tags: ['#성격', '#노력'], examples: [
    { en: "She's a very diligent worker who always beats her deadlines.", ko: "그녀는 마감 기한을 늘 칼같이 지키는 아주 성실한 직원이야." },
    { en: "Hard work and diligent habits lead to great success.", ko: "꾸준한 노력과 부지런한 습관이 큰 성공으로 이어진다." }
  ]},
  { id: 'd009', word: 'generous', ipa: '/ˈdʒenərəs/', meaning: '마음이 후한, 관대한', category: 'daily', categoryLabel: '일상대화', tags: ['#성격', '#나눔'], examples: [
    { en: "He was generous enough to pay for everyone's coffee.", ko: "그가 고맙게도 모두의 커피 값을 통 크게 쏴줬어." },
    { en: "Thank you so much for your generous help.", ko: "후하게 도와주셔서 정말 감사합니다." }
  ]},
  { id: 'd010', word: 'hospitality', ipa: '/ˌhɑːspɪˈtæləti/', meaning: '환대, 친절한 대접', category: 'daily', categoryLabel: '일상대화', tags: ['#환대', '#친절'], examples: [
    { en: "We were deeply moved by their warm hospitality.", ko: "그들의 따뜻한 환대에 우리 모두 감동을 받았어." },
    { en: "Thanks for the wonderful hospitality during our weekend stay.", ko: "주말 동안 머물며 베풀어주신 멋진 환대에 감사드려요." }
  ]},
  { id: 'd011', word: 'balance', ipa: '/ˈbæləns/', meaning: '균형, 조화', category: 'daily', categoryLabel: '일상대화', tags: ['#균형', '#워라밸'], examples: [
    { en: "It's hard to maintain a healthy work-life balance sometimes.", ko: "가끔은 건강한 워라밸(일과 삶의 균형)을 지키기가 참 어려워." },
    { en: "Try to keep a good balance between study and relaxation.", ko: "공부와 휴식 사이에 적당한 균형을 유지하려고 해봐." }
  ]},
  { id: 'd012', word: 'challenge', ipa: '/ˈtʃælɪndʒ/', meaning: '도전, 난관', category: 'daily', categoryLabel: '일상대화', tags: ['#도전', '#극복'], examples: [
    { en: "Learning a new language from scratch is a huge challenge.", ko: "바닥부터 새로운 언어를 배우는 건 엄청난 도전이야." },
    { en: "She loves taking on new challenges rather than staying safe.", ko: "그녀는 안주하기보다 새로운 도전을 마주하는 걸 좋아해." }
  ]},
  { id: 'd013', word: 'confidence', ipa: '/ˈkɑːnfɪdəns/', meaning: '자신감, 확신', category: 'daily', categoryLabel: '일상대화', tags: ['#자신감', '#멘탈'], examples: [
    { en: "Just speak English out loud without fear; you need more confidence.", ko: "두려워 말고 영어 크게 뱉어봐, 너한텐 자신감이 좀 더 필요해." },
    { en: "Practice makes perfect and builds up real confidence.", ko: "연습이 완벽을 만들고 진정한 자신감을 길러주지." }
  ]},
  { id: 'd014', word: 'destination', ipa: '/ˌdestɪˈneɪʃn/', meaning: '목적지, 운명', category: 'daily', categoryLabel: '일상대화', tags: ['#목표', '#삶'], examples: [
    { en: "Sometimes the journey matters much more than the final destination.", ko: "가끔은 최종 목적지보다 그곳으로 향하는 여정이 훨씬 더 중요하지." },
    { en: "We finally reached our camping destination after hours of driving.", ko: "몇 시간 운전한 끝에 드디어 캠핑 목적지에 도착했다." }
  ]},
  { id: 'd015', word: 'empathy', ipa: '/ˈempəθi/', meaning: '공감, 공감대', category: 'daily', categoryLabel: '일상대화', tags: ['#공감', '#소통'], examples: [
    { en: "Listening with true empathy is a great relationship skill.", ko: "진심 어린 공감으로 경청하는 건 엄청난 대인관계 스킬이야." },
    { en: "She showed deep empathy toward my stressful situation.", ko: "그녀는 내 스트레스 받는 상황에 깊은 공감을 표해주었다." }
  ]},
  { id: 'd016', word: 'flexibility', ipa: '/ˌfleksəˈbɪləti/', meaning: '융통성, 유연성', category: 'daily', categoryLabel: '일상대화', tags: ['#융통성', '#센스'], examples: [
    { en: "We need some flexibility in our schedule just in case.", ko: "만약을 대비해서 우리 일정에 약간의 융통성을 두자." },
    { en: "Good leaders show flexibility when dealing with unexpected problems.", ko: "훌륭한 리더들은 예상치 못한 문제를 마주할 때 유연함을 발휘한다." }
  ]},
  { id: 'd017', word: 'gratitude', ipa: '/ˈɡrætɪtuːd/', meaning: '감사, 고마움', category: 'daily', categoryLabel: '일상대화', tags: ['#감사', '#마음'], examples: [
    { en: "It's important to express gratitude to people who help you out.", ko: "너를 도와준 사람들에게 고마운 마음을 표현하는 건 중요해." },
    { en: "I wrote a small note to show my sincere gratitude.", ko: "내 진심 어린 고마움을 전하려고 작은 메모를 적었다." }
  ]},
  { id: 'd018', word: 'habit', ipa: '/ˈhæbɪt/', meaning: '습관, 버릇', category: 'daily', categoryLabel: '일상대화', tags: ['#습관', '#루틴'], examples: [
    { en: "Drinking a glass of warm water every morning is a great healthy habit.", ko: "매일 아침 미지근한 물 한 잔 마시는 건 아주 좋은 건강 습관이야." },
    { en: "It takes time to break an old bad habit.", ko: "오래된 나쁜 버릇을 고치는 데는 시간이 걸리는 법이지." }
  ]},
  { id: 'd019', word: 'inspiration', ipa: '/ˌɪnspəˈreɪʃn/', meaning: '영감', category: 'daily', categoryLabel: '일상대화', tags: ['#영감', '#아이디어'], examples: [
    { en: "Where do you usually find your daily creative inspiration?", ko: "너는 평소에 창의적인 영감을 주로 어디서 얻어?" },
    { en: "That breathtaking sunset gave me so much artistic inspiration.", ko: "저 숨 막히게 아름다운 노을 덕분에 예술적 영감을 아주 많이 받았어." }
  ]},
  { id: 'd020', word: 'journey', ipa: '/ˈdʒɜːrni/', meaning: '여정, 여행', category: 'daily', categoryLabel: '일상대화', tags: ['#여정', '#인생'], examples: [
    { en: "Learning a new skill is always a long and rewarding journey.", ko: "새로운 기술을 익히는 건 늘 길지만 보람찬 여정이지." },
    { en: "Enjoy every single moment of your life journey.", ko: "너의 인생 여정 속 모든 순간을 만끽하며 즐겨봐." }
  ]},
  { id: 'd021', word: 'knowledge', ipa: '/ˈnɑːlɪdʒ/', meaning: '지식, 알고 있음', category: 'daily', categoryLabel: '일상대화', tags: ['#지식', '#정보'], examples: [
    { en: "Reading books expands your general knowledge of the world.", ko: "책을 읽으면 세상에 대한 전반적인 지식이 넓어져." },
    { en: "He has deep knowledge about vintage cars.", ko: "그는 빈티지 자동차에 대해 아주 해박한 지식을 갖고 있어." }
  ]},
  { id: 'd022', word: 'lifestyle', ipa: '/ˈlaɪfstaɪl/', meaning: '생활 방식, 라이프스타일', category: 'daily', categoryLabel: '일상대화', tags: ['#삶의방식', '#건강'], examples: [
    { en: "Moving to the countryside completely changed my lifestyle.", ko: "시골로 이사 온 뒤로 내 라이프스타일이 완전히 바뀌었어." },
    { en: "Eating clean food is a crucial part of a healthy lifestyle.", ko: "클린 푸드를 먹는 건 건강한 생활 방식의 핵심이야." }
  ]},
  { id: 'd023', word: 'motivation', ipa: '/ˌmoʊtɪˈveɪʃn/', meaning: '동기부여, 의욕', category: 'daily', categoryLabel: '일상대화', tags: ['#동기부여', '#의욕'], examples: [
    { en: "I'm lacking motivation to hit the gym today.", ko: "오늘따라 헬스장 갈 의욕(동기부여)이 통 안 생기네." },
    { en: "Listening to podcasts gives me great morning motivation.", ko: "팟캐스트를 들으면 아침 운동 의욕이 샘솟아." }
  ]},
  { id: 'd024', word: 'opportunity', ipa: '/ˌɑːpərˈtuːnəti/', meaning: '기회', category: 'daily', categoryLabel: '일상대화', tags: ['#기회', '#행운'], examples: [
    { en: "Don't let this amazing career opportunity slip away.", ko: "이 기막힌 커리어 기회를 절대 놓치지 마." },
    { en: "Travel gives you a great opportunity to meet diverse people.", ko: "여행은 다양한 사람들을 만날 수 있는 멋진 기회를 선사하지." }
  ]},
  { id: 'd025', word: 'perspective', ipa: '/pərˈspektɪv/', meaning: '관점, 시각', category: 'daily', categoryLabel: '일상대화', tags: ['#시각', '#생각'], examples: [
    { en: "Traveling abroad really changes your perspective on the world.", ko: "해외여행을 다녀오면 세상을 바라보는 관점이 확 달라져." },
    { en: "Try looking at the problem from a different perspective.", ko: "문제를 다른 관점에서 한번 바라보려고 해봐." }
  ]},
  { id: 'd026', word: 'quality', ipa: '/ˈkwɑːləti/', meaning: '품질, 질', category: 'daily', categoryLabel: '일상대화', tags: ['#품질', '#가치'], examples: [
    { en: "I'd rather pay more for better quality clothes that last longer.", ko: "차라리 돈을 더 주더라도 오래 입는 질 좋은 옷을 살래." },
    { en: "Spending quality time with family is what truly matters.", ko: "가족과 함께 알찬 시간을 보내는 게 진짜 중요한 거지." }
  ]},
  { id: 'd027', word: 'relationship', ipa: '/rɪˈleɪʃnʃɪp/', meaning: '관계, 대인관', category: 'daily', categoryLabel: '일상대화', tags: ['#관계', '#소통'], examples: [
    { en: "Building trust takes time in any new relationship.", ko: "어떤 새로운 관계든 신뢰를 쌓는 데는 시간이 걸려." },
    { en: "Open and honest talk keeps a relationship healthy.", ko: "가슴 터놓는 솔직한 대화가 건강한 관계를 유지시켜 주지." }
  ]},
  { id: 'd028', word: 'solution', ipa: '/səˈluːʃn/', meaning: '해결책', category: 'daily', categoryLabel: '일상대화', tags: ['#해결', '#답'], examples: [
    { en: "Every difficult problem always has a smart solution.", ko: "어떤 어려운 문제든 항상 현명한 해결책은 있기 마련이야." },
    { en: "Let's brainstorm together to find a quick solution.", ko: "머리를 맞대고 빨리 해결책을 찾아보자고." }
  ]},
  { id: 'd029', word: 'tradition', ipa: '/trəˈdɪʃn/', meaning: '전통', category: 'daily', categoryLabel: '일상대화', tags: ['#전통', '#문화'], examples: [
    { en: "My family has a sweet tradition of making dumplings on New Year's.", ko: "우리 집은 새해마다 만두를 빚는 다정한 전통이 있어." },
    { en: "It's a local tradition to gather around the square for festivals.", ko: "축제 때 광장에 다 같이 모이는 건 이 동네 전통이야." }
  ]},
  { id: 'd030', word: 'understanding', ipa: '/ˌʌndərˈstændɪŋ/', meaning: '이해, 양해, 마음이 넓은', category: 'daily', categoryLabel: '일상대화', tags: ['#이해', '#배려'], examples: [
    { en: "Thank you so much for being so understanding about my delay.", ko: "늦은 거 너그럽게 이해해 줘서 정말 고마워." },
    { en: "Mutual understanding is the bedrock of friendship.", ko: "상호 간의 이해가 우정의 든든한 밑바탕이지." }
  ]},

  // =========================================================================
  // 4. 쇼핑/택시 (Shopping & Taxi) - 30개
  // =========================================================================
  { id: 's001', word: 'bargain', ipa: '/ˈbɑːrɡən/', meaning: '흥정하다, 싼 물건', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#흥정', '#할인'], examples: [
    { en: "You can usually bargain for a better price at flea markets.", ko: "플리마켓에 가면 보통 가격을 좀 깎아달라고 흥정할 수 있어." },
    { en: "I got this stylish winter coat at an absolute bargain.", ko: "이 멋진 겨울 코트를 진짜 말도 안 되게 헐값에 건졌어." }
  ]},
  { id: 's002', word: 'discount', ipa: '/ˈdɪskaʊnt/', meaning: '할인', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#할인', '#가격'], examples: [
    { en: "Do you guys offer any membership discounts here?", ko: "혹시 여기 멤버십 회원 할인 같은 거 되나요?" },
    { en: "Everything in the store is currently on a 20% discount.", ko: "지금 매장에 있는 모든 품목이 20% 할인 중이야." }
  ]},
  { id: 's003', word: 'exchange', ipa: '/eksˈtʃeɪndʒ/', meaning: '교환하다, 환전하다', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#교환', '#환전'], examples: [
    { en: "Can I exchange this sweater for a medium size?", ko: "이 스웨터 미디엄 사이즈로 교환할 수 있을까요?" },
    { en: "Where is the nearest bank to exchange some cash?", ko: "현금 환전하려면 가장 가까운 은행이 어디에 있나요?" }
  ]},
  { id: 's004', word: 'refund', ipa: '/ˈriːfʌnd/', meaning: '환불, 환불하다', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#환불', '#반품'], examples: [
    { en: "I'd like to get a full refund for this defective toaster.", ko: "이 불량 난 토스터기 전액 환불받고 싶은데요." },
    { en: "Store policy says refunds are only given with a valid receipt.", ko: "매장 규정상 영수증이 있어야만 환불이 가능합니다." }
  ]},
  { id: 's005', word: 'warranty', ipa: '/ˈwɔːrənti/', meaning: '품질 보증, 보증서', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#보증', '#AS'], examples: [
    { en: "Does this camera come with a one-year manufacturer warranty?", ko: "이 카메라 1년짜리 제조사 품질 보증 되나요?" },
    { en: "Keep your warranty card safe in case it breaks down.", ko: "나중에 고장 날지 모르니 보증서 잘 챙겨두세요." }
  ]},
  { id: 's006', word: 'cashier', ipa: '/kæˈʃɪr/', meaning: '계산원', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#계산', '#매장'], examples: [
    { en: "You can go pay over there at the cashier counter.", ko: "저기 계산대 카운터로 가서 결제하시면 됩니다." },
    { en: "The cashier forgot to bag my bottled water.", ko: "계산원이 생수를 봉투에 담아주는 걸 깜빡했어." }
  ]},
  { id: 's007', word: 'inventory', ipa: '/ˈɪnvəntɔːri/', meaning: '재고', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#재고', '#상점'], examples: [
    { en: "Let me check our computer inventory to see if we have your size.", ko: "고객님 사이즈 재고가 있는지 전산 재고 확인 좀 해볼게요." },
    { en: "They're running a weekend clearance sale to clear out old inventory.", ko: "지난 시즌 재고를 털어내려고 주말 떨이 세일을 진행 중이야." }
  ]},
  { id: 's008', word: 'merchandise', ipa: '/ˈmɜːrtʃəndaɪs/', meaning: '상품, 판매 물품', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#상품', '#판매'], examples: [
    { en: "All summer merchandise is marked down by 50%.", ko: "여름 상품 전 품목이 50% 파격 할인 중이다." },
    { en: "Please do not touch the fragile display merchandise.", ko: "잘 깨지는 진열 상품들은 손으로 만지지 말아 주세요." }
  ]},
  { id: 's009', word: 'receipt', ipa: '/rɪˈsiːt/', meaning: '영수증', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#영수증', '#확인'], examples: [
    { en: "Would you like me to email your receipt or print it?", ko: "영수증 이메일로 보내드릴까요, 아니면 뽑아드릴까요?" },
    { en: "I tossed my receipt, now I can't return this jacket.", ko: "영수증을 버려버려서 이 재킷 반품을 못 하네." }
  ]},
  { id: 's010', word: 'wholesale', ipa: '/ˈhoʊlseɪl/', meaning: '도매', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#도매', '#대량'], examples: [
    { en: "Buying clothes at wholesale prices saves a lot of money.", ko: "옷을 도매가로 대량 구매하면 돈을 엄청 아낄 수 있어." },
    { en: "This warehouse club sells groceries both retail and wholesale.", ko: "이 창고형 마트는 식료품을 소매랑 도매로 둘 다 팔아." }
  ]},
  { id: 's011', word: 'counterfeit', ipa: '/ˈkaʊntərfɪt/', meaning: '가짜의, 위조된', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#짝퉁', '#위조품'], examples: [
    { en: "Be careful not to buy counterfeit designer bags on street stalls.", ko: "길거리 가판대에서 명품 짝퉁(가짜) 가방 안 사게 조심해." },
    { en: "Selling counterfeit goods is strictly illegal.", ko: "위조 상품을 파는 건 명백한 불법이다." }
  ]},
  { id: 's012', word: 'deduction', ipa: '/dɪˈdʌkʃn/', meaning: '공제, 할인', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#할인', '#혜택'], examples: [
    { en: "Are there any special tax deductions for tourists shopping here?", ko: "여기서 쇼핑하는 관광객을 위한 특별 세금 감면 혜택 있나요?" },
    { en: "We got an extra deduction with our store credit card.", ko: "스토어 신용카드로 결제해서 추가 할인을 받았어." }
  ]},
  { id: 's013', word: 'endorsement', ipa: '/ɪnˈdɔːrsmənt/', meaning: '광고 모델 보증, 지지', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#광고', '#브랜드'], examples: [
    { en: "That celebrity endorsement made the sneakers sell out instantly.", ko: "그 유명 연예인이 광고 모델로 나선 덕분에 그 스니커즈가 순식간에 품절됐어." },
    { en: "Brand endorsements heavily influence teenage shoppers.", ko: "브랜드 셀럽 광고는 십대 쇼핑객들에게 엄청난 영향을 미친다." }
  ]},
  { id: 's014', word: 'frustration', ipa: '/frʌˈstreɪʃn/', meaning: '불만, 좌절감', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#불만', '#쇼핑고충'], examples: [
    { en: "I expressed my frustration to customer service about the broken delivery.", ko: "배송이 망가져서 온 것 때문에 고객센터에 단단히 불만을 털어놓았다." },
    { en: "Online shopping can sometimes lead to shipping frustrations.", ko: "온라인 쇼핑은 가끔 배송 지연 때문에 속 터지게 만들곤 하지." }
  ]},
  { id: 's015', word: 'gadget', ipa: '/ˈɡædʒɪt/', meaning: '재미있는 소형 기기, 전자기기', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#전자기기', '#아이템'], examples: [
    { en: "My dad loves buying all sorts of cool kitchen gadgets.", ko: "우리 아빠는 온갖 신기한 주방 소형 가전 사는 걸 엄청 좋아하셔." },
    { en: "Electronic stores are packed with smart home gadgets.", ko: "전자제품 매장에는 스마트홈 전자기기들이 가득하다." }
  ]},
  { id: 's016', word: 'handbag', ipa: '/ˈhændbæɡ/', meaning: '핸드백, 손가방', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#가방', '#패션'], examples: [
    { en: "She was looking at a leather designer handbag in the window.", ko: "그녀가 쇼윈도에 진열된 가죽 명품 핸드백을 구경하고 있었다." },
    { en: "My daily handbag needs to be spacious enough for a laptop.", ko: "내가 매일 들고 다니는 핸드백은 노트북이 들어갈 정도로 넉넉해야 해." }
  ]},
  { id: 's017', word: 'installment', ipa: '/ɪnˈstɔːlmənt/', meaning: '할부', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#할부', '#결제'], examples: [
    { en: "Can I pay for this TV in three monthly installments?", ko: "이 TV 3개월 할부로 결제해도 될까요?" },
    { en: "Buying expensive gadgets on installments makes it easier on the wallet.", ko: "비싼 전자기기를 할부로 사면 지갑 부담이 훨씬 덜하지." }
  ]},
  { id: 's018', word: 'junction', ipa: '/ˈdʒʌŋkʃn/', meaning: '교차로, 합류점', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#길찾기', '#택시'], examples: [
    { en: "Driver, please drop me off right past the traffic junction.", ko: "기사님, 저기 신호등 교차로 지나서 바로 내려주세요." },
    { en: "There's a massive shopping mall right by the highway junction.", ko: "고속도로 분기점 바로 옆에 엄청 큰 쇼핑몰이 있어." }
  ]},
  { id: 's019', word: 'kilometer', ipa: '/kɪˈlɑːmətər/', meaning: '킬로미터 (거리 단위)', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#거리', '#택시'], examples: [
    { en: "The department store is about two kilometers down this road.", ko: "백화점은 이 길 따라 쭉 2킬로미터 정도 가면 나와요." },
    { en: "How many kilometers away is the nearest convenience store?", ko: "가장 가까운 편의점까지 몇 킬로미터나 떨어져 있나요?" }
  ]},
  { id: 's020', word: 'luggage', ipa: '/ˈlʌɡɪdʒ/', meaning: '여행 짐, 캐리어', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#캐리어', '#택시트렁크'], examples: [
    { en: "Taxi driver, can you pop the trunk for my heavy luggage?", ko: "기사님, 무거운 짐 실어야 하니까 트렁크 좀 열어주실래요?" },
    { en: "Be careful not to scratch your luggage wheels on rough pavement.", ko: "울퉁불퉁한 바닥에서 캐리어 바퀴 긁히지 않게 조심해." }
  ]},
  { id: 's021', word: 'meter', ipa: '/ˈmiːtər/', meaning: '(택시) 미터기', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#택시미터기', '#요금'], examples: [
    { en: "Make sure the taxi driver turns on the meter before driving off.", ko: "택시 출발하기 전에 기사님이 미터기 켜는지 꼭 확인해." },
    { en: "The taxi meter is ticking up faster than I expected.", ko: "택시 미터기 올라가는 속도가 생각보다 엄청 빠르네." }
  ]},
  { id: 's022', word: 'navigator', ipa: '/ˈnævɪɡeɪtər/', meaning: '내비게이션, 길 안내 장치', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#내비', '#길찾기'], examples: [
    { en: "The taxi driver typed our destination into his dashboard navigator.", ko: "택시 기사님이 앞자리 내비게이션에 목적지를 꾹꾹 입력하셨다." },
    { en: "Turn on the navigator app to avoid heavy traffic jams.", ko: "꽉 막히는 교통체증 피하려면 길찾기 내비 앱 켜봐." }
  ]},
  { id: 's023', word: 'outlet', ipa: '/ˈaʊtlet/', meaning: '아울렛 (할인 매장)', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#아울렛', '#할인쇼핑'], examples: [
    { en: "We're driving down to the suburban designer outlet this Saturday.", ko: "우리 이번 토요일에 교외에 있는 명품 아울렛 쇼핑하러 가." },
    { en: "You can score great bargains on brand clothes at the outlet mall.", ko: "아울렛 몰에 가면 브랜드 옷들을 엄청 저렴하게 득템할 수 있어." }
  ]},
  { id: 's024', word: 'passenger', ipa: '/ˈpæsɪndʒər/', meaning: '승객', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#승객', '#탑승자'], examples: [
    { en: "Taxi drivers should always ensure their passengers buckle up.", ko: "택시 기사님들은 승객들이 안전벨트 맸는지 항상 확인해야 한다." },
    { en: "The back seat was comfortable for a tired passenger.", ko: "뒷좌석은 지친 승객이 쉬기에 아주 아늑했다." }
  ]},
  { id: 's025', word: 'queue', ipa: '/kjuː/', meaning: '줄, 대기열', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#줄서기', '#대기'], examples: [
    { en: "Look at the massive queue waiting to get into the flagship store.", ko: "플래그십 매장 들어가려고 서 있는 저 어마어마한 줄 좀 봐." },
    { en: "We had to wait in a long queue to pay for our groceries.", ko: "장 본 거 계산하려고 긴 줄을 서서 기다려야 했다." }
  ]},
  { id: 's026', word: 'route', ipa: '/ruːt/', meaning: '경로, 노선', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#이동경로', '#택시'], examples: [
    { en: "Can you take a faster route to avoid this traffic jam, driver?", ko: "기사님 이 막히는 길 말고 좀 더 빠른 경로로 가주실 수 있나요?" },
    { en: "Our delivery truck follows a strict morning route.", ko: "우리 배달 트럭은 철저히 아침 배송 노선을 따라 움직인다." }
  ]},
  { id: 's027', word: 'surplus', ipa: '/ˈsɜːrpləs/', meaning: '과잉, 잉여 물품', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#재고떨이', '#창고개방'], examples: [
    { en: "They're selling factory surplus shoes at half price this week.", ko: "이번 주에 공장 창고 털이(잉여 물품) 신발들을 반값에 판대." },
    { en: "Supermarkets donate surplus food items to local food banks.", ko: "대형마트들은 남는 잉여 식료품들을 지역 푸드뱅크에 기부한다." }
  ]},
  { id: 's028', word: 'transaction', ipa: '/trænˈzækʃn/', meaning: '거래, 결제', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#결제', '#카드'], examples: [
    { en: "Please wait a moment while your card transaction is processing.", ko: "카드 결제 승인 처리 중이니 잠시만 기다려 주세요." },
    { en: "Online banking makes financial transactions super fast and secure.", ko: "인터넷 뱅킹 덕분에 금융 거래가 엄청 빠르고 안전해졌다." }
  ]},
  { id: 's029', word: 'voucher', ipa: '/ˈvaʊtʃər/', meaning: '할인권, 상품권', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#상품권', '#할인쿠폰'], examples: [
    { en: "I received a shopping voucher as a birthday present.", ko: "생일 선물로 백화점 쇼핑 상품권을 받았어." },
    { en: "Don't forget to use your digital discount voucher at checkout.", ko: "결제할 때 디지털 할인 쿠폰 쓰는 거 깜빡하지 마세요." }
  ]},
  { id: 's030', word: 'wardrobe', ipa: '/ˈwɔːrdroʊb/', meaning: '옷장, 의류 컬렉션', category: 'shopping', categoryLabel: '쇼핑/택시', tags: ['#옷장', '#패션'], examples: [
    { en: "I desperately need to update my winter wardrobe with cozy sweaters.", ko: "포근한 스웨터들로 겨울 옷장 정비를 확 해야겠어." },
    { en: "She bought versatile capsule items for her daily wardrobe.", ko: "그녀는 매일 입기 좋은 실용적인 옷들로 옷장을 채웠다." }
  ]},

  // =========================================================================
  // 5. 비즈니스 (Business & Workplace) - 30개
  // =========================================================================
  { id: 'b001', word: 'colleague', ipa: '/ˈkɑːliːɡ/', meaning: '직장 동료', category: 'business', categoryLabel: '비즈니스', tags: ['#동료', '#직장'], examples: [
    { en: "I went out for a quick coffee break with my office colleagues.", ko: "회사 동료들이랑 잠시 바람 쐬면서 커피 한잔했다." },
    { en: "She is a trusted colleague who always has my back.", ko: "그녀는 늘 내 편이 되어주는 믿음직한 직장 동료야." }
  ]},
  { id: 'b002', word: 'negotiation', ipa: '/nɪˌɡoʊʃiˈeɪʃn/', meaning: '협상', category: 'business', categoryLabel: '비즈니스', tags: ['#협상', '#계약'], examples: [
    { en: "The salary negotiation with the HR manager went really well.", ko: "인사팀 매니저와의 연봉 협상이 아주 잘 풀렸어." },
    { en: "Patience and active listening are key in contract negotiations.", ko: "계약 협상에서는 인내심과 적극적인 경청이 가장 핵심이지." }
  ]},
  { id: 'b003', word: 'presentation', ipa: '/ˌpriːznˈteɪʃn/', meaning: '발표, 프레젠테이션', category: 'business', categoryLabel: '비즈니스', tags: ['#발표', '#보고'], examples: [
    { en: "I spent all night polishing my slides for tomorrow's big presentation.", ko: "내일 있을 큰 발표를 다듬느라 밤을 꼬딱 새웠어." },
    { en: "His confident presentation style really impressed the clients.", ko: "그의 자신감 넘치는 발표 태도가 클라이언트들에게 큰 인상을 남겼다." }
  ]},
  { id: 'b004', word: 'productivity', ipa: '/ˌproʊdʌkˈtɪvəti/', meaning: '생산성', category: 'business', categoryLabel: '비즈니스', tags: ['#생산성', '#업무효율'], examples: [
    { en: "Working remotely a couple of days a week boosts my productivity.", ko: "일주일에 이틀 정도 재택근무를 하니까 업무 생산성이 팍 오르더라." },
    { en: "Our team is always looking for ways to improve workflow productivity.", ko: "우리 팀은 업무 흐름 생산성을 높일 방법을 늘 고민한다." }
  ]},
  { id: 'b005', word: 'quarterly', ipa: '/ˈkwɔːrtərli/', meaning: '분기별의', category: 'business', categoryLabel: '비즈니스', tags: ['#분기', '#실적'], examples: [
    { en: "We have a quarterly performance review meeting this Friday afternoon.", ko: "이번 주 금요일 오후에 분기별 성과 평가 미팅이 있어요." },
    { en: "Our quarterly sales targets were smashed thanks to everyone's effort.", ko: "모두가 애써준 덕분에 분기 매출 목표를 초과 달성했다." }
  ]},
  { id: 'b006', word: 'budget', ipa: '/ˈbʌdʒɪt/', meaning: '예산', category: 'business', categoryLabel: '비즈니스', tags: ['#예산', '#재무'], examples: [
    { en: "We need to keep a close eye on our marketing project budget.", ko: "마케팅 프로젝트 예산이 초과되지 않게 바짝 신경 써야 해." },
    { en: "The new software purchase was approved within our IT budget.", ko: "새로운 소프트웨어 구입비는 IT 예산안 범위 내에서 승인되었다." }
  ]},
  { id: 'b007', word: 'client', ipa: '/ˈklaɪənt/', meaning: '고객, 거래처', category: 'business', categoryLabel: '비즈니스', tags: ['#고객', '#거래처'], examples: [
    { en: "I'm heading downtown to pitch our new proposal to a key client.", ko: "핵심 거래처 클라이언트에 신규 제안 피칭하러 시내에 가는 중이야." },
    { en: "Keeping clients happy is the top priority for our account managers.", ko: "고객들을 만족시키는 게 우리 계정 관리자들의 최우선 과제다." }
  ]},
  { id: 'b008', word: 'deadline', ipa: '/ˈdedlaɪn/', meaning: '마감 기한', category: 'business', categoryLabel: '비즈니스', tags: ['#마감', '#일정'], examples: [
    { en: "Can we push back the project deadline by just two days?", ko: "구체적인 프로젝트 마감 기한을 딱 이틀만 뒤로 미룰 수 있을까요?" },
    { en: "Everyone is rushing to wrap up their tasks before the Friday deadline.", ko: "모두가 금요일 마감 기한 전에 업무 마무리하려고 정신없이 뛰고 있어." }
  ]},
  { id: 'b009', word: 'enterprise', ipa: '/ˈentərpraɪz/', meaning: '기업, 회사', category: 'business', categoryLabel: '비즈니스', tags: ['#기업', '#회사'], examples: [
    { en: "Large enterprises are heavily investing in cloud security solutions.", ko: "대기업들은 클라우드 보안 솔루션에 막대한 투자를 쏟고 있다." },
    { en: "Our small startup grew into a thriving tech enterprise.", ko: "우리 작은 스타트업이 탄탄한 테크 기업으로 성장했다." }
  ]},
  { id: 'b010', word: 'strategy', ipa: '/ˈstrætədʒi/', meaning: '전략', category: 'business', categoryLabel: '비즈니스', tags: ['#전략', '#기획'], examples: [
    { en: "We need a clever digital marketing strategy to stand out.", ko: "경쟁에서 우위를 점하려면 기발한 디지털 마케팅 전략이 필요해." },
    { en: "The management board gathered to discuss our long-term growth strategy.", ko: "경영진 이사회가 모여 장기 성장 전략을 논의했다." }
  ]},
  { id: 'b011', word: 'benchmark', ipa: '/ˈbentʃmɑːrk/', meaning: '기준, 벤치마크', category: 'business', categoryLabel: '비즈니스', tags: ['#기준', '#분석'], examples: [
    { en: "Competitor analysis will serve as a benchmark for our new product.", ko: "경쟁사 분석이 우리 신제품의 기준(벤치마크)이 되어줄 거야." },
    { en: "We set high quality benchmarks for our customer service team.", ko: "우리 고객 서비스 팀은 높은 품질 기준을 설정해 두었다." }
  ]},
  { id: 'b012', word: 'collaboration', ipa: '/kəˌlæbəˈreɪʃn/', meaning: '협업, 공동 작업', category: 'business', categoryLabel: '비즈니스', tags: ['#협업', '#팀워크'], examples: [
    { en: "Successful product launches rely on smooth cross-team collaboration.", ko: "성공적인 신제품 런칭은 원활한 부서 간 협업에 달려 있어." },
    { en: "Thank you all for your hard work and great collaboration.", ko: "다들 고생 많았고 멋진 협업 보여줘서 감사합니다." }
  ]},
  { id: 'b013', word: 'dividend', ipa: '/ˈdɪvɪdend/', meaning: '배당금', category: 'business', categoryLabel: '비즈니스', tags: ['#배당', '#투자'], examples: [
    { en: "Our company announced a higher quarterly dividend payout this year.", ko: "우리 회사가 올해 더 높은 분기별 배당금 지급을 발표했다." },
    { en: "Long-term investors love stocks that pay steady cash dividends.", ko: "장기 투자자들은 꾸준히 현금 배당을 주는 주식을 아주 좋아하지." }
  ]},
  { id: 'b014', word: 'expertise', ipa: '/ˌekspɜːrˈtiːz/', meaning: '전문 지식, 전문성', category: 'business', categoryLabel: '비즈니스', tags: ['#전문성', '#능력'], examples: [
    { en: "She brings years of valuable technical expertise to our engineering team.", ko: "그녀는 우리 엔지니어링 팀에 수년간의 소중한 기술 전문성을 보태주었다." },
    { en: "Consulting firms are hired for their specialized market expertise.", ko: "컨설팅 회사들은 전문화된 시장 전문성 때문에 고용되는 것이다." }
  ]},
  { id: 'b015', word: 'headquarters', ipa: '/ˈhedkwɔːrtərz/', meaning: '본사', category: 'business', categoryLabel: '비즈니스', tags: ['#본사', '#오피스'], examples: [
    { en: "I have to fly up to our corporate headquarters in Seoul next week.", ko: "나 다음 주에 서울 본사로 출장 겸 올라가야 해." },
    { en: "The main headquarters oversees operations across all global branches.", ko: "메인 본사가 전 세계 모든 지점들의 운영을 총괄한다." }
  ]},
  { id: 'b016', word: 'incentive', ipa: '/ɪnˈsentɪv/', meaning: '장려책, 인센티브', category: 'business', categoryLabel: '비즈니스', tags: ['#인센티브', '#보상'], examples: [
    { en: "The company offers a performance incentive for hitting sales targets.", ko: "회사는 매출 목표 달성 시 성과 인센티브를 지급한다." },
    { en: "Financial incentives motivate employees to work with passion.", ko: "금전적 보상은 직원들이 열정적으로 일하게 만드는 원동력이 된다." }
  ]},
  { id: 'b017', word: 'logistics', ipa: '/ləˈdʒɪstɪks/', meaning: '물류, 유통 관리', category: 'business', categoryLabel: '비즈니스', tags: ['#물류', '#공급망'], examples: [
    { en: "Managing global shipping logistics requires meticulous planning.", ko: "글로벌 배송 물류를 관리하려면 꼼꼼한 계획이 필수적이다." },
    { en: "Our logistics team solved the delivery delay issue overnight.", ko: "우리 물류 팀이 밤새워 배송 지연 문제를 해결해 냈다." }
  ]},
  { id: 'b018', word: 'milestone', ipa: '/ˈmaɪlstoʊn/', meaning: '이정표, 중요한 단계', category: 'business', categoryLabel: '비즈니스', tags: ['#마일스톤', '#목표'], examples: [
    { en: "Releasing this beta app is a huge milestone for our startup.", ko: "이번 베타 앱 출시는 우리 스타트업에 엄청난 중요 이정표야." },
    { en: "We celebrated hitting our first major sales milestone as a team.", ko: "팀 차원에서 첫 번째 주요 매출 목표 달성을 자축했다." }
  ]},
  { id: 'b019', word: 'networking', ipa: '/ˈnetwɜːrkɪŋ/', meaning: '네트워킹, 인맥 쌓기', category: 'business', categoryLabel: '비즈니스', tags: ['#네트워킹', '#인맥'], examples: [
    { en: "Industry conferences are fantastic places for professional networking.", ko: "업계 컨퍼런스는 전문적인 네트워킹을 하기에 환상적인 장소야." },
    { en: "She expanded her business contacts through active networking.", ko: "그녀는 적극적인 네트워킹을 통해 비즈니스 인맥을 넓혔다." }
  ]},
  { id: 'b020', word: 'outsource', ipa: '/ˈaʊtsɔːrs/', meaning: '외주를 주다, 아웃소싱하다', category: 'business', categoryLabel: '비즈니스', tags: ['#외주', '#아웃소싱'], examples: [
    { en: "We decided to outsource our customer support to a specialized agency.", ko: "고객 응대 업무는 전문 대행사에 외주를 주기로 결정했다." },
    { en: "Outsourcing graphic design helps save internal creative hours.", ko: "그래픽 디자인을 아웃소싱하면 내부 크리에이티브 업무 시간을 아끼는 데 도움 이 된다." }
  ]},
  { id: 'b021', word: 'portfolio', ipa: '/pɔːrtˈfoʊlioʊ/', meaning: '포트폴리오, 작품 모음, 자산 목록', category: 'business', categoryLabel: '비즈니스', tags: ['#포트폴리오', '#경력'], examples: [
    { en: "Showcase your best design projects in your job interview portfolio.", ko: "취업 면접 포트폴리오에 너의 가장 자신 있는 디자인 프로젝트를 뽐내봐." },
    { en: "Investors like to diversify their financial asset portfolio.", ko: "투자자들은 자신들의 금융 자산 포트폴리오를 분산하는 걸 좋아한다." }
  ]},
  { id: 'b022', word: 'reputation', ipa: '/ˌrepjuˈteɪʃn/', meaning: '평판, 명성', category: 'business', categoryLabel: '비즈니스', tags: ['#평판', '#브랜드가치'], examples: [
    { en: "Building a solid brand reputation takes years of honest work.", ko: "탄탄한 브랜드 평판을 쌓는 데는 수년간의 정직한 노력이 걸린다." },
    { en: "One bad review can severely damage a small business's reputation.", ko: "나쁜 리뷰 하나가 소상공인 가게의 평판에 큰 타격을 줄 수 있다." }
  ]},
  { id: 'b023', word: 'stakeholder', ipa: '/ˈsteɪkhoʊldər/', meaning: '이해관계자, 주주', category: 'business', categoryLabel: '비즈니스', tags: ['#이해관계자', '#경영'], examples: [
    { en: "We need to present our financial results to the key stakeholders.", ko: "핵심 이해관계자들에게 이번 재무 실적을 브리핑해야 합니다." },
    { en: "Corporate decisions must balance the interests of all stakeholders.", ko: "기업의 의사결정은 모든 이해관계자들의 이익을 균형 있게 고려해야 한다." }
  ]},
  { id: 'b024', word: 'turnover', ipa: '/ˈtɜːrnˌoʊvər/', meaning: '이직률, 매출액, 회전율', category: 'business', categoryLabel: '비즈니스', tags: ['#이직률', '#회전율'], examples: [
    { en: "High employee turnover can hurt team morale and workflow continuity.", ko: "높은 직원 이직률은 팀 사기와 업무 연속성에 타격을 줄 수 있다." },
    { en: "The restaurant boasts a high table turnover rate on weekends.", ko: "그 식당은 주말마다 테이블 회전율이 엄청 높기로 유명하다." }
  ]},
  { id: 'b025', word: 'benchmark', ipa: '/ˈbentʃmɑːrk/', meaning: '기준 점검하다, 벤치마킹하다', category: 'business', categoryLabel: '비즈니스', tags: ['#벤치마킹', '#성능측정'], examples: [
    { en: "Our tech team benchmarked the new server against industry standards.", ko: "우리 기술 팀은 업계 표준에 맞춰 새 서버 성능을 벤치마킹 테스트했다." },
    { en: "We benchmarked our competitor's UI design to improve our app.", ko: "우리 앱을 개선하기 위해 경쟁사의 UI 디자인을 벤치마킹했다." }
  ]},
  { id: 'b026', word: 'workforce', ipa: '/ˈwɜːrkfɔːrs/', meaning: '노동력, 직원들', category: 'business', categoryLabel: '비즈니스', tags: ['#직원', '#인력'], examples: [
    { en: "Our company has a diverse and highly talented global workforce.", ko: "우리 회사는 다양하고 재능 넘치는 글로벌 임직원 인력을 자랑한다." },
    { en: "Training the existing workforce on AI tools is a major corporate goal.", ko: "기존 직원들을 대상으로 AI 툴 교육을 시키는 게 주요 기업 목표다." }
  ]},
  { id: 'b027', word: 'yield', ipa: '/jiːld/', meaning: '수익률, 산출하다', category: 'business', categoryLabel: '비즈니스', tags: ['#수익률', '#투자'], examples: [
    { en: "Real estate investments offer a reliable rental income yield.", ko: "부동산 투자는 안정적인 임대 수익률을 가져다준다." },
    { en: "The new manufacturing process yielded a 20% increase in output.", ko: "새로운 제조 공정 덕분에 생산량이 20%나 향상되었다." }
  ]},
  { id: 'b028', word: 'blueprint', ipa: '/ˈbluːprɪnt/', meaning: '청사진, 구체적 계획', category: 'business', categoryLabel: '비즈니스', tags: ['#계획', '#청사진'], examples: [
    { en: "The CEO presented a bold blueprint for our company's future expansion.", ko: "대표님이 회사 미래 확장을 위한 대담한 청사진을 발표했다." },
    { en: "We need a clear blueprint before kicking off the software redesign.", ko: "소프트웨어 리디자인에 착수하기 전에 명확한 구체적 계획이 필요하다." }
  ]},
  { id: 'b029', word: 'consensus', ipa: '/kənˈsensəs/', meaning: '의견 일치, 합의', category: 'business', categoryLabel: '비즈니스', tags: ['#합의', '#의견'], examples: [
    { en: "It was tough to reach a full consensus during the lengthy boardroom meeting.", ko: "길었던 임원 회의 내내 완전한 합의를 이끌어내기가 꽤 벅찼다." },
    { en: "We finally built a consensus on the marketing strategy direction.", ko: "우리는 마케팅 전략 방향성에 대해 마침내 의견 일치를 보았다." }
  ]},
  { id: 'b030', word: 'downsizing', ipa: '/ˈdaʊnsaɪzɪŋ/', meaning: '규모 축소, 구조조정', category: 'business', categoryLabel: '비즈니스', tags: ['#구조조정', '#조직개편'], examples: [
    { en: "The corporation announced a major restructuring and staff downsizing.", ko: "기업 측에서 대대적인 조직 개편과 인력 구조조정 계획을 발표했다." },
    { en: "Many tech firms avoided downsizing by shifting to remote work models.", ko: "많은 테크 기업들이 원격 근무 체제로 전환하면서 구조조정을 피할 수 있었다." }
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
      const saved = localStorage.getItem('talk_dict_150_bookmarks');
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
      localStorage.setItem('talk_dict_150_bookmarks', JSON.stringify(bookmarks));
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
    { id: 'cafe_dining', label: '카페/식당 (30)', icon: Coffee },
    { id: 'travel_airport', label: '여행/공항 (30)', icon: Plane },
    { id: 'daily', label: '일상대화 (30)', icon: MessageCircle },
    { id: 'shopping', label: '쇼핑/택시 (30)', icon: ShoppingBag },
    { id: 'business', label: '비즈니스 (30)', icon: Briefcase },
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
              <p className={`text-xs ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>상황별 핵심 어휘 150선 & 리얼 회화 예문</p>
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
                          <p className="text-[10px] font-extrabold text-slate-400 tracking-wider uppercase">일상 회화 예문</p>
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