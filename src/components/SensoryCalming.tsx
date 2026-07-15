import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Smile, Volume2, VolumeX, ArrowLeft } from 'lucide-react';

interface SensoryCalmingProps {
  language: 'en' | 'swa';
}

export default function SensoryCalming({ language }: SensoryCalmingProps) {
  const [breathingText, setBreathingText] = useState<'Breathe In' | 'Hold' | 'Breathe Out'>('Breathe In');
  const [breathingScale, setBreathingScale] = useState(1);
  const [audioMuted, setAudioMuted] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Breathing rhythm loop
  useEffect(() => {
    let isSubscribed = true;
    let timer: any;

    const runBreathingCycle = () => {
      if (!isSubscribed) return;

      // Stage 1: Breathe In (4 seconds)
      setBreathingText('Breathe In');
      setBreathingScale(1.6);
      adjustSynthVolume(0.3, 4000); // fade sound in

      timer = setTimeout(() => {
        if (!isSubscribed) return;
        
        // Stage 2: Hold (2 seconds)
        setBreathingText('Hold');
        setBreathingScale(1.6);
        adjustSynthVolume(0.3, 2000);

        timer = setTimeout(() => {
          if (!isSubscribed) return;

          // Stage 3: Breathe Out (4 seconds)
          setBreathingText('Breathe Out');
          setBreathingScale(1.0);
          adjustSynthVolume(0.05, 4000); // fade sound down

          timer = setTimeout(() => {
            if (isSubscribed) {
              runBreathingCycle(); // restart
            }
          }, 4000);
        }, 2000);
      }, 4000);
    };

    runBreathingCycle();

    return () => {
      isSubscribed = false;
      clearTimeout(timer);
      // Stop sound when page is navigated away from
      stopCalmSound();
    };
  }, [audioMuted]); // re-trigger or listen to muted state to adjust levels

  const startCalmSound = () => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
      
      const ctx = audioCtxRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      // Create oscillator (warm triangle wave for calming low hum)
      const osc = ctx.createOscillator();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(110, ctx.currentTime); // Low A hum
      
      // Lowpass filter for smooth warmth
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(150, ctx.currentTime);

      const gainNode = ctx.createGain();
      gainNode.gain.setValueAtTime(0.05, ctx.currentTime);

      osc.connect(filter);
      filter.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      osc.start();
      
      oscRef.current = osc;
      gainNodeRef.current = gainNode;
      setAudioMuted(false);
    } catch (e) {
      console.error("Audio Synthesis not supported or blocked: ", e);
    }
  };

  const stopCalmSound = () => {
    if (oscRef.current) {
      try { oscRef.current.stop(); } catch(e){}
      oscRef.current = null;
    }
    gainNodeRef.current = null;
    setAudioMuted(true);
  };

  const toggleCalmSound = () => {
    if (audioMuted) {
      startCalmSound();
    } else {
      stopCalmSound();
    }
  };

  const adjustSynthVolume = (targetVolume: number, durationMs: number) => {
    if (!gainNodeRef.current || !audioCtxRef.current || audioMuted) return;
    const ctx = audioCtxRef.current;
    const gain = gainNodeRef.current.gain;
    gain.setValueAtTime(gain.value, ctx.currentTime);
    gain.linearRampToValueAtTime(targetVolume, ctx.currentTime + (durationMs / 1000));
  };

  return (
    <div className="bg-[#1A2230] rounded-[32px] border-4 border-[#2F6B4F]/50 p-6 sm:p-8 w-full max-w-md mx-auto shadow-2xl relative text-white flex flex-col items-center text-center">
      <div className="w-full flex justify-start mb-4">
        <Link 
          to="/toolkit" 
          onClick={stopCalmSound}
          className="py-1.5 px-3 bg-white/5 hover:bg-white/10 rounded-full text-gray-300 transition-colors flex items-center gap-1.5 text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'en' ? 'Back to Toolkit' : 'Rudi Kwenye Zana'}</span>
        </Link>
      </div>

      <div className="mb-4">
        <span className="text-[9px] font-extrabold text-[#E89B2E] uppercase tracking-widest block">SENSORY COGNITIVE REGULATION</span>
        <h3 className="text-xl sm:text-2xl font-bold font-serif text-[#FFF8EE]">{language === 'en' ? 'Sensory Calming Space' : 'Chumba Tulivu cha Hisia'}</h3>
        <p className="text-[10px] text-gray-400 mt-1 max-w-xs mx-auto">
          {language === 'en' ? 'Follow the circle rhythm. Breathe slow and steady to trigger calm sensory signals.' : 'Fuata mdundo wa mviringo. Vuta pumzi taratibu kupunguza msisimko mkubwa wa hisia.'}
        </p>
      </div>

      {/* Sound Synthesizer control */}
      <div className="mb-6 bg-white/5 border border-white/10 px-4 py-2.5 rounded-2xl flex items-center gap-3">
        <button 
          onClick={toggleCalmSound}
          className="w-8 h-8 rounded-full bg-[#2F6B4F] text-white flex items-center justify-center cursor-pointer transition-all hover:scale-105"
        >
          {audioMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
        </button>
        <div className="text-left">
          <span className="text-[10px] font-bold block text-gray-300">
            {audioMuted ? (language === 'en' ? 'Ocean Hum Off' : 'Muziki Umezimwa') : (language === 'en' ? 'Soothing Wave Hum On' : 'Muziki unacheza')}
          </span>
          <span className="text-[9px] text-gray-500">{language === 'en' ? 'Safe low-frequency audio synth' : 'Sauti salama ya kutuliza ubongo'}</span>
        </div>
      </div>

      {/* Breathing Circle Stage */}
      <div className="w-64 h-64 flex items-center justify-center relative mb-8">
        {/* Background Glow ripples */}
        <div 
          className="absolute inset-0 rounded-full bg-[#2F6B4F] opacity-10 blur-xl transition-transform duration-1000"
          style={{ transform: `scale(${breathingScale * 1.1})` }}
        ></div>

        {/* Dynamic scale breathing outer shell */}
        <div 
          className="w-48 h-48 rounded-full bg-gradient-to-br from-[#2F6B4F] to-[#C77700] opacity-25 flex items-center justify-center absolute transition-all duration-1000"
          style={{ transform: `scale(${breathingScale})` }}
        ></div>

        {/* Solid inner breathing engine */}
        <div 
          className="w-32 h-32 rounded-full bg-[#2F6B4F] flex flex-col items-center justify-center shadow-lg transition-all duration-1000 border-2 border-white/20 z-10"
          style={{ transform: `scale(${breathingScale * 0.9})` }}
        >
          <Smile className="w-8 h-8 text-[#FFF8EE] mb-1.5 animate-pulse" />
          <span className="text-xs font-black tracking-wider uppercase text-center leading-none px-2">
            {language === 'en' ? breathingText : (
              breathingText === 'Breathe In' ? 'Vuta Pumzi' : (
                breathingText === 'Hold' ? 'Shikilia' : 'Toa Pumzi'
              )
            )}
          </span>
        </div>
      </div>

      <div className="space-y-2 max-w-xs mx-auto">
        <span className="text-[10px] text-gray-400 block font-bold tracking-widest uppercase">{language === 'en' ? 'Instruction Guide' : 'Mwongozo wa Hatua'}</span>
        <p className="text-xs text-gray-300 leading-relaxed">
          {language === 'en' 
            ? 'Breathe deep into your stomach as the bubble grows. Hold for a moment, then exhale slowly as it shrinks.' 
            : 'Vuta pumzi ndani kabisa ya tumbo Bubble linapokua. Shikilia kidogo, kisha toa pumzi taratibu linapopungua.'}
        </p>
      </div>
    </div>
  );
}
