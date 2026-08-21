import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Volume2, ArrowLeft, Download, Printer, Eye } from 'lucide-react';

interface AacCardsProps {
  language: 'en' | 'swa';
  onSpeak: (engText: string, swaText: string) => void;
  voiceSpeechAlert: string | null;
  onDownload?: () => void;
}

export default function AacCards({ language, onSpeak, voiceSpeechAlert, onDownload }: AacCardsProps) {
  const location = useLocation();
  const [isPrintFriendly, setIsPrintFriendly] = useState(() => {
    const searchParams = new URLSearchParams(location.search);
    return searchParams.get('print') === 'true' || location.state?.printMode === true;
  });

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

  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const speakVal = searchParams.get('speak');
    if (speakVal) {
      let card = null;
      if (speakVal === 'water') card = flashcards[0];
      else if (speakVal === 'food') card = flashcards[1];
      else if (speakVal === 'help') card = flashcards[2];
      else if (speakVal === 'toilet') card = flashcards[3];
      else if (speakVal === 'pain') card = flashcards[9];

      if (card) {
        onSpeak(card.text, card.swaText);
      }
    }
  }, [location.search, onSpeak]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className={`w-full max-w-3xl mx-auto ${isPrintFriendly ? 'printable-area bg-white p-4 sm:p-6 text-black border-4 border-black rounded-[32px]' : 'bg-white rounded-[32px] border-2 border-[#C77700]/10 p-6 sm:p-8 shadow-md relative text-[#2D3748]'}`}>
      
      {/* Back to Toolkit Navigation (hidden on print) */}
      <div className="flex items-center justify-between gap-4 mb-6 no-print">
        <Link 
          to="/toolkit" 
          className="p-2 hover:bg-gray-100 rounded-full text-gray-600 transition-colors flex items-center gap-1.5 text-xs font-bold back-to-toolkit-link"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'en' ? 'Back to Toolkit' : 'Rudi Kwenye Zana'}</span>
        </Link>

        {/* Print-friendly Toggle button */}
        <button
          onClick={() => setIsPrintFriendly(!isPrintFriendly)}
          className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer transition-all ${
            isPrintFriendly 
              ? 'bg-[#2F6B4F] text-white hover:bg-[#1e4432]' 
              : 'bg-[#C77700]/10 text-[#C77700] hover:bg-[#C77700]/20'
          }`}
        >
          <Printer className="w-4 h-4" />
          <span>
            {isPrintFriendly 
              ? (language === 'en' ? 'Standard Interactive View' : 'Rudi Mtazamo Kawaida') 
              : (language === 'en' ? 'Print Friendly View' : 'Mtazamo wa Kuchapa')}
          </span>
        </button>
      </div>

      {/* Print Mode Top Status Alert Bar (Visible only when Print Friendly Mode is active, hidden on print output) */}
      {isPrintFriendly && (
        <div className="bg-[#2D3748] text-white p-4 rounded-2xl mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 no-print animate-pulse border-2 border-[#E89B2E]">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-[#E89B2E] shrink-0" />
            <div className="text-left">
              <p className="text-xs font-black uppercase tracking-wider text-[#E89B2E]">
                {language === 'en' ? 'Eco-Print Preview Active' : 'Ukurasa wa Kuchapa Uko Tayari'}
              </p>
              <p className="text-[10px] text-gray-300">
                {language === 'en' ? 'Optimized in black & white for ink saving. Click Print Below.' : 'Imeboreshwa kwa rangi nyeusi na nyeupe ili kuokoa wino.'}
              </p>
            </div>
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button
              onClick={handlePrint}
              className="bg-[#2F6B4F] hover:bg-[#1e4432] text-white px-4 py-2 rounded-xl text-xs font-bold uppercase cursor-pointer flex items-center gap-1.5 justify-center flex-1 sm:flex-initial"
            >
              <Printer className="w-4 h-4" />
              <span>{language === 'en' ? 'Print Now' : 'Chapa Sasa'}</span>
            </button>
            <button
              onClick={() => setIsPrintFriendly(false)}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase cursor-pointer flex items-center gap-1.5 justify-center flex-1 sm:flex-initial"
            >
              <Eye className="w-4 h-4" />
              <span>{language === 'en' ? 'Close Preview' : 'Funga'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Component Header Information */}
      <div className="mb-6">
        <span className="text-[10px] font-bold text-[#2F6B4F] uppercase tracking-wider block no-print">AAC Soundboard Voice Aids</span>
        <h3 className={`text-2xl sm:text-3xl font-bold font-serif ${isPrintFriendly ? 'text-black' : 'text-C77700 text-[#C77700]'}`}>
          {language === 'en' ? 'Speech Helper Flashcards' : 'Kadi za Sauti za Kujieleza'}
        </h3>
        <p className="text-xs text-gray-500 mt-1 no-print">
          {language === 'en' 
            ? 'Tap any card below. The device will speak the phrase in your selected language to aid non-verbal children.' 
            : 'Gusa kadi yoyote hapa chini. Kifaa kitasoma sentensi kwa sauti kwa lugha uliyochagua ili kusaidya mawasiliano.'}
        </p>
      </div>

      {/* Spoken Alert Feedback Panel (Hidden during printing) */}
      {voiceSpeechAlert && !isPrintFriendly && (
        <div className="mb-6 bg-[#2D3748] text-white p-4 rounded-2xl flex items-center justify-center gap-3 animate-pulse border border-[#E89B2E]/30 shadow-lg no-print">
          <Volume2 className="w-5 h-5 text-[#E89B2E]" />
          <span className="text-sm font-bold font-serif italic">"{voiceSpeechAlert}"</span>
        </div>
      )}

      {/* Grid of Flash Cards */}
      <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-6 print-grid-cards`}>
        {flashcards.map((card, idx) => (
          <button 
            key={idx}
            disabled={isPrintFriendly}
            onClick={() => onSpeak(card.text, card.swaText)}
            className={`flex flex-col items-center justify-center text-center rounded-[24px] transition-all p-5 ${
              isPrintFriendly 
                ? 'print-eco-card border-2 border-black bg-white text-black font-semibold' 
                : 'border-2 border-[#C77700]/10 cursor-pointer transform active:scale-95 hover:shadow-md hover:-translate-y-0.5 bg-white hover:border-[#C77700]/30 text-[#2D3748]'
            }`}
          >
            <span className="text-5xl mb-3 block transform hover:scale-110 transition-transform">{card.icon}</span>
            <span className={`text-xs font-black block ${isPrintFriendly ? 'text-black text-sm' : 'text-[#2D3748]'}`}>
              {language === 'en' ? card.text : card.swaText}
            </span>
            
            {/* Play guide instructions (hidden on print-friendly layout) */}
            {!isPrintFriendly && (
              <span className="text-[9px] uppercase font-bold tracking-widest text-[#C77700] mt-2.5 flex items-center gap-1 no-print">
                <Volume2 className="w-3 h-3 animate-pulse" />
                <span>{language === 'en' ? 'Tap to Speak' : 'Gusa uongee'}</span>
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Bottom Footer Actions Panel */}
      <div className="pt-6 border-t border-[#C77700]/10 flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-center sm:text-left text-[10px] text-gray-400 font-bold tracking-wider uppercase no-print">
          {language === 'en' 
            ? 'Speech synthesizer active (English en-US / Swahili sw-KE)' 
            : 'Mchanganyiko wa sauti unatumika (Kiingereza en-US / Kiswahili sw-KE)'}
        </div>
        
        <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto no-print">
          <button 
            onClick={handlePrint}
            className="bg-[#2F6B4F] hover:bg-[#1e4432] text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
          >
            <Printer className="w-4 h-4" />
            <span>{language === 'en' ? 'Print Cards Layout' : 'Chapa Kadi za Picha'}</span>
          </button>

          <button 
            onClick={() => {
              if (onDownload) onDownload();
              alert(language === 'en' ? 'Downloading Speech Helper Cards PDF...' : 'Inapakua Kadi za Sauti za Kujieleza...');
            }}
            className="bg-[#2D3748] hover:bg-black text-white px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 cursor-pointer w-full sm:w-auto justify-center"
          >
            <Download className="w-4 h-4" />
            <span>{language === 'en' ? 'Download Cards PDF' : 'Pakua Kadi PDF'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}
