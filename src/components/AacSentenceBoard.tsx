import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Volume2, ArrowLeft } from 'lucide-react';

interface AacSentenceBoardProps {
  language: 'en' | 'swa';
  onSpeak: (engText: string, swaText: string) => void;
}

export default function AacSentenceBoard({ language, onSpeak }: AacSentenceBoardProps) {
  const [selectedSubject, setSelectedSubject] = useState<{en: string, swa: string, icon: string} | null>(null);
  const [selectedObject, setSelectedObject] = useState<{en: string, swa: string, icon: string} | null>(null);

  const subjects = [
    { en: 'I want', swa: 'Nataka', icon: '👉' },
    { en: 'I feel', swa: 'Ninahisi', icon: '🧠' },
    { en: 'I need', swa: 'Nahitaji', icon: '🆘' },
  ];

  const objects = [
    { en: 'Water', swa: 'Maji', icon: '💧' },
    { en: 'Food', swa: 'Chakula', icon: '🍎' },
    { en: 'Sleep', swa: 'Kulala', icon: '🛌' },
    { en: 'Help', swa: 'Msaada', icon: '🙋‍♂️' },
    { en: 'Quiet', swa: 'Utulivu', icon: '🤫' },
    { en: 'Happy', swa: 'Furaha', icon: '😊' },
    { en: 'Sad', swa: 'Huzuni', icon: '😢' },
    { en: 'Hug', swa: 'Kukumbatiwa', icon: '🫂' },
  ];

  const playSentence = () => {
    if (!selectedSubject || !selectedObject) return;
    const engStr = `${selectedSubject.en} ${selectedObject.en}`;
    const swaStr = `${selectedSubject.swa} ${selectedObject.swa}`;
    onSpeak(engStr, swaStr);
  };

  const clearSentence = () => {
    setSelectedSubject(null);
    setSelectedObject(null);
  };

  return (
    <div className="bg-white rounded-[32px] border-2 border-[#C77700]/10 p-6 sm:p-8 w-full max-w-2xl mx-auto shadow-md relative text-[#2D3748]">
      <div className="flex items-center gap-2 mb-6">
        <Link 
          to="/toolkit" 
          className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors flex items-center gap-1.5 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'en' ? 'Back to Toolkit' : 'Rudi Kwenye Zana'}</span>
        </Link>
      </div>

      <div className="mb-6">
        <span className="text-[10px] font-bold text-[#2F6B4F] uppercase tracking-wider block">AAC Communication Strip</span>
        <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#C77700]">
          {language === 'en' ? 'Construct Sentences' : 'Tengeneza Sentensi za Mawasiliano'}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {language === 'en' 
            ? 'Help children formulate statements by choosing a subject (action) and an object (need).' 
            : 'Saidia watoto kuunda kauli kwa kuchagua mada (kitendo) na kitu (mahitaji).'}
        </p>
      </div>

      {/* Active Sentence Strip */}
      <div className="bg-white rounded-2xl p-5 border-2 border-[#2F6B4F] flex flex-wrap items-center justify-between gap-4 mb-8 min-h-[90px] shadow-sm">
        <div className="flex items-center gap-3">
          {selectedSubject ? (
            <div className="bg-[#2F6B4F]/10 border border-[#2F6B4F]/30 px-4 py-2.5 rounded-xl flex items-center gap-2">
              <span className="text-2xl">{selectedSubject.icon}</span>
              <span className="text-xs font-black text-[#2F6B4F]">
                {language === 'en' ? selectedSubject.en : selectedSubject.swa}
              </span>
            </div>
          ) : (
            <span className="text-xs text-gray-300 italic">
              {language === 'en' ? '[Choose Action]' : '[Chagua Kitendo]'}
            </span>
          )}

          <span className="text-gray-400 font-bold text-lg">&rarr;</span>

          {selectedObject ? (
            <div className="bg-[#C77700]/10 border border-[#C77700]/30 px-4 py-2.5 rounded-xl flex items-center gap-2">
              <span className="text-2xl">{selectedObject.icon}</span>
              <span className="text-xs font-black text-[#C77700]">
                {language === 'en' ? selectedObject.en : selectedObject.swa}
              </span>
            </div>
          ) : (
            <span className="text-xs text-gray-300 italic">
              {language === 'en' ? '[Choose Need]' : '[Chagua Mahitaji]'}
            </span>
          )}
        </div>

        <div className="flex gap-2 w-full sm:w-auto justify-end">
          <button 
            disabled={!selectedSubject || !selectedObject}
            onClick={playSentence}
            className="bg-[#2F6B4F] hover:bg-[#1e4432] disabled:opacity-40 text-white px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 cursor-pointer"
          >
            <Volume2 className="w-4 h-4" />
            <span>{language === 'en' ? 'Speak' : 'Soma'}</span>
          </button>
          <button 
            onClick={clearSentence}
            className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-4 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-colors"
          >
            {language === 'en' ? 'Clear' : 'Futa'}
          </button>
        </div>
      </div>

      {/* Selection Area */}
      <div className="space-y-8">
        {/* Step 1: Subjects */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#2F6B4F] mb-3">
            {language === 'en' ? 'Step 1: Choose Action' : 'Hatua ya 1: Chagua Kitendo'}
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {subjects.map((sub, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedSubject(sub)}
                className={`border-2 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  selectedSubject?.en === sub.en 
                    ? 'bg-[#2F6B4F]/10 border-[#2F6B4F] shadow-sm' 
                    : 'bg-white border-[#C77700]/10 hover:border-[#2F6B4F]/40'
                }`}
              >
                <span className="text-3xl mb-2">{sub.icon}</span>
                <span className="text-xs font-black">{language === 'en' ? sub.en : sub.swa}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Objects */}
        <div>
          <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#C77700] mb-3">
            {language === 'en' ? 'Step 2: Choose Need' : 'Hatua ya 2: Chagua Mahitaji'}
          </h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {objects.map((obj, idx) => (
              <button 
                key={idx}
                onClick={() => setSelectedObject(obj)}
                className={`border-2 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                  selectedObject?.en === obj.en 
                    ? 'bg-[#C77700]/10 border-[#C77700] shadow-sm' 
                    : 'bg-white border-[#C77700]/10 hover:border-[#C77700]/40'
                }`}
              >
                <span className="text-3xl mb-2">{obj.icon}</span>
                <span className="text-xs font-black">{language === 'en' ? obj.en : obj.swa}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
