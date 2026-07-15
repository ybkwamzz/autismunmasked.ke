import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Volume2, ArrowLeft } from 'lucide-react';

interface AacCardsProps {
  language: 'en' | 'swa';
  onSpeak: (engText: string, swaText: string) => void;
  voiceSpeechAlert: string | null;
}

export default function AacCards({ language, onSpeak, voiceSpeechAlert }: AacCardsProps) {
  const flashcards = [
    { text: 'I want water', swaText: 'Nataka maji', icon: '💧' },
    { text: 'I am hungry', swaText: 'Nina njaa', icon: '🍎' },
    { text: 'Help me', swaText: 'Nisaidie', icon: '🙋‍♂️' },
    { text: 'Bathroom', swaText: 'Chooni', icon: '🚽' },
    { text: 'Yes please', swaText: 'Ndiyo tafadhali', icon: '👍' },
    { text: 'No thank you', swaText: 'Hapana asante', icon: '👎' },
    { text: 'I am happy', swaText: 'Nina furaha', icon: '😊' },
    { text: 'I feel tired', swaText: 'Nimechoka', icon: '🥱' },
    { text: 'Quiet space', swaText: 'Sehemu tulivu', icon: '🤫' },
    { text: 'I feel sick', swaText: 'Naumwa', icon: '🤒' },
  ];

  return (
    <div className="bg-white rounded-[32px] border-2 border-[#C77700]/10 p-6 sm:p-8 w-full max-w-3xl mx-auto shadow-md relative text-[#2D3748]">
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
        <span className="text-[10px] font-bold text-[#2F6B4F] uppercase tracking-wider block">AAC Soundboard Voice Aids</span>
        <h3 className="text-2xl sm:text-3xl font-bold font-serif text-[#C77700]">
          {language === 'en' ? 'Speech Helper Flashcards' : 'Kadi za Sauti za Kujieleza'}
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {language === 'en' 
            ? 'Tap any card below. The device will speak the phrase in your selected language to aid non-verbal children.' 
            : 'Gusa kadi yoyote hapa chini. Kifaa kitasoma sentensi kwa sauti kwa lugha uliyochagua ili kusaidya mawasiliano.'}
        </p>
      </div>

      {/* Spoken Alert Feedback Panel */}
      {voiceSpeechAlert && (
        <div className="mb-6 bg-[#2D3748] text-white p-4 rounded-2xl flex items-center justify-center gap-3 animate-pulse border border-[#E89B2E]/30 shadow-lg">
          <Volume2 className="w-5 h-5 text-[#E89B2E]" />
          <span className="text-sm font-bold font-serif italic">"{voiceSpeechAlert}"</span>
        </div>
      )}

      {/* Grid of Flash Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6">
        {flashcards.map((card, idx) => (
          <button 
            key={idx}
            onClick={() => onSpeak(card.text, card.swaText)}
            className="border-2 border-[#C77700]/10 rounded-[24px] p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all transform active:scale-95 hover:shadow-md hover:-translate-y-0.5 bg-white hover:border-[#C77700]/30"
          >
            <span className="text-5xl mb-3 block transform hover:scale-110 transition-transform">{card.icon}</span>
            <span className="text-xs font-black block text-[#2D3748]">
              {language === 'en' ? card.text : card.swaText}
            </span>
            <span className="text-[9px] uppercase font-bold tracking-widest text-[#C77700] mt-2.5 flex items-center gap-1">
              <Volume2 className="w-3 h-3 animate-pulse" />
              <span>{language === 'en' ? 'Tap to Speak' : 'Gusa uongee'}</span>
            </span>
          </button>
        ))}
      </div>

      <div className="pt-4 border-t border-[#C77700]/10 text-center text-[10px] text-gray-400 font-bold tracking-wider uppercase">
        {language === 'en' 
          ? 'Speech synthesizer active (English en-US / Swahili sw-KE)' 
          : 'Mchanganyiko wa sauti unatumika (Kiingereza en-US / Kiswahili sw-KE)'}
      </div>
    </div>
  );
}
