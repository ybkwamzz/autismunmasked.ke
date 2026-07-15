import React from 'react';
import { Link } from 'react-router-dom';

interface ToolkitProps {
  language: 'en' | 'swa';
}

export default function Toolkit({ language }: ToolkitProps) {
  return (
    <section id="toolkit-hub" className="bg-[#FFF8EE] pt-2 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-3">
        <div>
          <span className="text-[10px] font-bold text-[#C77700] uppercase tracking-[0.25em]">
            {language === 'en' ? 'SUPPORTIVE EXPERIENCES' : 'MBINU ZA MSAADA'}
          </span>
          <h2 className="font-bold text-3xl sm:text-4xl font-serif text-[#2D3748] mt-1">
            {language === 'en' ? 'Therapy Toolkit' : 'Zana za Tiba'}
          </h2>
          <p className="text-sm text-gray-500 mt-2 max-w-2xl leading-relaxed">
            {language === 'en' 
              ? 'Our interactive clinical-grade visual templates, AAC speech engines, and sensory regulation environments are built to support cognitive stability and daily expression.'
              : 'Zana zetu za picha shirikishi, mitambo ya sauti (AAC), na vyumba vya kutuliza vimeundwa kusaidia utulivu wa akili na mawasiliano ya kila siku.'}
          </p>
        </div>
        <span className="text-xs font-extrabold text-[#2F6B4F] bg-[#2F6B4F]/10 px-4 py-2 rounded-full shrink-0">
          {language === 'en' ? '100% Free Interactive Tools' : 'Zana Bure Kabisa Shirikishi'}
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Toolkit 1: Visual Schedules */}
        <div className="bg-white rounded-[28px] p-6 border border-[#C77700]/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between hover:-translate-y-1">
          <div>
            <div className="w-12 h-12 bg-[#C77700]/10 rounded-2xl flex items-center justify-center text-2xl mb-4">🗂</div>
            <h3 className="text-xl font-bold text-[#2D3748] mb-2">{language === 'en' ? 'Visual Schedules' : 'Ratiba za Picha'}</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              {language === 'en' 
                ? 'Help children understand what comes next, lowering anxiety and reducing behavioral meltdowns.' 
                : 'Saidia watoto kuelewa nini kinafuata, kupunguza wasiwasi na kupunguza fujo au hofu.'}
            </p>
          </div>
          <Link 
            to="/toolkit/schedule"
            className="w-full bg-[#2D3748] hover:bg-black text-center text-white py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer block"
          >
            {language === 'en' ? 'Build Schedule' : 'Unda Ratiba'}
          </Link>
        </div>

        {/* Toolkit 2: AAC Soundboard */}
        <div className="bg-white rounded-[28px] p-6 border border-[#C77700]/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between hover:-translate-y-1">
          <div>
            <div className="w-12 h-12 bg-[#E89B2E]/10 rounded-2xl flex items-center justify-center text-2xl mb-4">🎴</div>
            <h3 className="text-xl font-bold text-[#2D3748] mb-2">{language === 'en' ? 'AAC Speech Cards' : 'Kadi za Sauti (AAC)'}</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              {language === 'en' 
                ? 'Empower non-verbal children to communicate basic physical and emotional needs through voice output.' 
                : 'Washa mawasiliano ya sauti kwa watoto wasioweza kuongea kueleza mahitaji yao ya kimwili.'}
            </p>
          </div>
          <Link 
            to="/toolkit/cards"
            className="w-full bg-[#2D3748] hover:bg-black text-center text-white py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer block"
          >
            {language === 'en' ? 'Open Soundboard' : 'Fungua Kadi za Sauti'}
          </Link>
        </div>

        {/* Toolkit 3: AAC Sentence Board */}
        <div className="bg-white rounded-[28px] p-6 border border-[#C77700]/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between hover:-translate-y-1">
          <div>
            <div className="w-12 h-12 bg-[#2F6B4F]/10 rounded-2xl flex items-center justify-center text-2xl mb-4">📢</div>
            <h3 className="text-xl font-bold text-[#2D3748] mb-2">{language === 'en' ? 'Communication Strip' : 'Ukanda wa Maneno'}</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              {language === 'en' 
                ? 'Let children combine actions (e.g., I want) with objects (e.g., Water) to express complete thoughts.' 
                : 'Ruhusu watoto kuchanganya vitendo (mfano, Nataka) na vitu (mfano, Maji) kuunda sentensi.'}
            </p>
          </div>
          <Link 
            to="/toolkit/board"
            className="w-full bg-[#2D3748] hover:bg-black text-center text-white py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer block"
          >
            {language === 'en' ? 'Build Sentences' : 'Unda Sentensi'}
          </Link>
        </div>

        {/* Toolkit 4: Calming Room */}
        <div className="bg-white rounded-[28px] p-6 border border-[#C77700]/10 shadow-sm hover:shadow-md transition-all flex flex-col justify-between hover:-translate-y-1">
          <div>
            <div className="w-12 h-12 bg-[#C77700]/10 rounded-2xl flex items-center justify-center text-2xl mb-4">🧘</div>
            <h3 className="text-xl font-bold text-[#2D3748] mb-2">{language === 'en' ? 'Sensory Calming Room' : 'Chumba cha Kutuliza'}</h3>
            <p className="text-xs text-gray-500 mb-6 leading-relaxed">
              {language === 'en' 
                ? 'Interactive visual ripples and a soothing low-frequency sound generator for emotional self-regulation.' 
                : 'Mawimbi ya rangi shirikishi na sauti tulivu ya masafa ya chini kusaidia kujituliza kihisia.'}
            </p>
          </div>
          <Link 
            to="/toolkit/calm"
            className="w-full bg-[#2F6B4F] hover:bg-[#1e4432] text-center text-white py-3 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer block"
          >
            {language === 'en' ? 'Enter Sensory Space' : 'Ingia Chumba Tulivu'}
          </Link>
        </div>

      </div>
    </section>
  );
}
