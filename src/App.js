import React, { useState, useEffect } from 'react';
import { Volume2, Bookmark, RefreshCw, Search, BookOpen, GraduationCap } from 'lucide-react';

// 상황별 500 어휘/회화 데이터 (예문 및 한글 번역 포함)
const sampleWords = [
  { id: 1, category: '카페/식당', word: 'grab a bite', meaning: '간단히 뭐 좀 먹다', phonetic: '/ɡræb ə baɪt/', example: 'Do you want to grab a bite before the movie?', exampleKo: '영화 보기 전에 간단히 뭐 좀 먹을래요?' },
  { id: 2, category: '여행/공항', word: 'boarding pass', meaning: '탑승권', phonetic: '/ˈbɔːrdɪŋ pæs/', example: 'May I see your boarding pass and passport?', exampleKo: '탑승권과 여권을 보여주시겠어요?' },
  { id: 3, category: '일상대화', word: 'catch up', meaning: '밀린 이야기를 나누다 / 따라잡다', phonetic: '/kætʃ ʌp/', example: 'Let us get together soon and catch up!', exampleKo: '조만간 만나서 밀린 이야기나 하자!' },
  { id: 4, category: '쇼핑/택시', word: 'keep the change', meaning: '잔돈은 가지세요', phonetic: '/kiːp ðə tʃeɪndʒ/', example: 'Here is twenty dollars, keep the change.', exampleKo: '여기 20달러요, 잔돈은 가지세요.' },
  { id: 5, category: '비즈니스', word: 'call it a day', meaning: '하루 일을 마치다', phonetic: '/kɔːl ɪt ə deɪ/', example: 'We have worked hard today, so let us call it a day.', exampleKo: '오늘 일 고생 많았으니, 이만 마치자.' }
];

const categories = ['전체', '카페/식당', '여행/공항', '일상대화', '쇼핑/택시', '비즈니스'];

function App() {
  const [currentTab, setCurrentTab] = useState('dictionary'); // 'dictionary', 'myWords', 'quiz'
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchTerm, setSearchTerm] = useState('');
  const [accent, setAccent] = useState('us'); // 'us' or 'gb'
  const [myWords, setMyWords] = useState([]);

  // 운전 모드 연속 듣기 상태 관리
  const [isPlayingAll, setIsPlayingAll] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(() => {
    const savedIndex = localStorage.getItem('lastListeningIndex');
    return savedIndex ? parseInt(savedIndex, 10) : 0;
  });

  // 단어 필터링
  const filteredWords = sampleWords.filter(item => {
    const matchesCategory = selectedCategory === '전체' || item.category === selectedCategory;
    const matchesSearch = item.word.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          item.meaning.includes(searchTerm) ||
                          (item.example && item.example.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedCategory, searchTerm]);

  // 음성 합성 헬퍼 함수
  const speakText = (text, lang) => {
    return new Promise((resolve) => {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang === 'us' ? 'en-US' : (lang === 'gb' ? 'en-GB' : lang);
      utterance.rate = 0.85; // 운전 중 듣기 편한 속도
      utterance.onend = resolve;
      utterance.onerror = resolve;
      window.speechSynthesis.speak(utterance);
    });
  };

  // 단일 재생
  const handlePlaySingle = (text, langType) => {
    if (isPlayingAll) {
      setIsPlayingAll(false);
      window.speechSynthesis.cancel();
    }
    const targetLang = langType === 'ko' ? 'ko-KR' : (accent === 'us' ? 'en-US' : 'en-GB');
    speakText(text, targetLang);
  };

  // 운전 모드 연속 재생 오디오 엔진 (예문 3회 반복 + 한글 번역 포함)
  useEffect(() => {
    let isCancelled = false;

    const playSequence = async () => {
      if (!isPlayingAll || filteredWords.length === 0) return;

      const safeIndex = currentIndex % filteredWords.length;
      const currentWord = filteredWords[safeIndex];

      if (!currentWord) return;

      localStorage.setItem('lastListeningIndex', safeIndex.toString());
      const langCode = accent === 'us' ? 'en-US' : 'en-GB';

      // ① 영단어 1회
      await speakText(currentWord.word, langCode);
      if (isCancelled || !isPlayingAll) return;
      await new Promise(r => setTimeout(r, 400));

      // ② 한국어 뜻 1회
      await speakText(currentWord.meaning, 'ko-KR');
      if (isCancelled || !isPlayingAll) return;
      await new Promise(r => setTimeout(r, 500));

      // ③ 영어 예문 3회 반복
      if (currentWord.example) {
        for (let i = 0; i < 3; i++) {
          if (isCancelled || !isPlayingAll) break;
          await speakText(currentWord.example, langCode);
          if (isCancelled || !isPlayingAll) break;
          await new Promise(r => setTimeout(r, 600));
        }
      }

      // ④ 예문 한글 번역 1회
      if (currentWord.exampleKo) {
        if (isCancelled || !isPlayingAll) return;
        await speakText(currentWord.exampleKo, 'ko-KR');
        await new Promise(r => setTimeout(r, 800));
      }

      // ⑤ 다음 단어로 넘어가기 전 휴식 (1.5초)
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
  }, [isPlayingAll, currentIndex, filteredWords, accent]);

  const toggleBookmark = (id) => {
    if (myWords.includes(id)) {
      setMyWords(myWords.filter(wordId => wordId !== id));
    } else {
      setMyWords([...myWords, id]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 p-4 max-w-2xl mx-auto">
      {/* 헤더 */}
      <header className="mb-4 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-black text-gray-900">상황별 회화 500 영한사전</h1>
            <span className="bg-purple-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">PRO</span>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">일상회화 마스터를 위한 500개 핵심 단어/숙어 & 예문</p>
        </div>
        <div className="flex gap-1 bg-gray-200 p-1 rounded-lg">
          <button
            onClick={() => setAccent('us')}
            className={`px-2 py-1 text-xs font-bold rounded ${accent === 'us' ? 'bg-white shadow text-blue-600' : 'text-gray-600'}`}
          >
            US 미
          </button>
          <button
            onClick={() => setAccent('gb')}
            className={`px-2 py-1 text-xs font-bold rounded ${accent === 'gb' ? 'bg-white shadow text-blue-600' : 'text-gray-600'}`}
          >
            GB 영
          </button>
        </div>
      </header>

      {/* 상단 탭 네비게이션 */}
      <div className="flex border-b border-gray-200 mb-4 gap-4">
        <button
          onClick={() => setCurrentTab('dictionary')}
          className={`pb-2 font-bold text-sm flex items-center gap-1.5 border-b-2 transition-all ${
            currentTab === 'dictionary' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <BookOpen size={18} /> 단어/숙어 사전 ({sampleWords.length})
        </button>
        <button
          onClick={() => setCurrentTab('myWords')}
          className={`pb-2 font-bold text-sm flex items-center gap-1.5 border-b-2 transition-all ${
            currentTab === 'myWords' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <Bookmark size={18} /> 내 단어장 ({myWords.length})
        </button>
        <button
          onClick={() => setCurrentTab('quiz')}
          className={`pb-2 font-bold text-sm flex items-center gap-1.5 border-b-2 transition-all ${
            currentTab === 'quiz' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-400 hover:text-gray-600'
          }`}
        >
          <GraduationCap size={18} /> 플래시카드 암기 퀴즈
        </button>
      </div>

      {currentTab === 'dictionary' && (
        <>
          {/* 검색창 */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="영단어/숙어, 한국어 뜻, 예문 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-