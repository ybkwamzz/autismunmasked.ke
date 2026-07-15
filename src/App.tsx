import React, { useState, useEffect, useRef } from 'react';
import { 
  Heart, 
  Info, 
  BookOpen, 
  X, 
  Play, 
  Check, 
  Plus, 
  Trash2, 
  Send, 
  Globe, 
  Volume2, 
  VolumeX, 
  MessageSquare, 
  Calendar, 
  Smile, 
  Compass, 
  Sparkles, 
  Share2, 
  CheckCircle, 
  Download, 
  User, 
  Users,
  ChevronUp,
  ChevronDown,
  BookMarked,
  Layers,
  Flame,
  HelpCircle
} from 'lucide-react';

interface Story {
  id: string;
  name: string;
  role: string;
  location: string;
  title: string;
  content: string;
  category: string;
  date: string;
}

interface ScheduleItem {
  id: string;
  time: string;
  task: string;
  icon: string;
  done: boolean;
}

interface Message {
  role: 'user' | 'model';
  text: string;
  time: string;
}

export default function App() {
  // Core States
  const [language, setLanguage] = useState<'en' | 'swa'>('en');
  const [activeModal, setActiveModal] = useState<null | 'video' | 'donate' | 'submit-story' | 'toolkit-schedule' | 'toolkit-cards' | 'toolkit-board' | 'toolkit-calm'>(null);
  
  // Newsletter
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);
  
  // Dynamic Impact Counters (start with base, increment on action)
  const [familiesCount, setFamiliesCount] = useState(2410);
  const [storiesCount, setStoriesCount] = useState(153);
  
  // Story Submission State
  const [newStory, setNewStory] = useState({
    name: '',
    role: 'Parent',
    location: '',
    title: '',
    content: '',
    category: 'Our Journey'
  });
  const [storySuccess, setStorySuccess] = useState(false);

  // Preloaded stories with localStorage fallback
  const [stories, setStories] = useState<Story[]>(() => {
    const saved = localStorage.getItem('autism_unmasked_stories');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback below
      }
    }
    return [
      {
        id: '1',
        name: 'Grace Mwangi',
        role: 'Parent',
        location: 'Nairobi',
        category: 'Our Journey',
        title: "The Founder's Story: Patience Over Fear",
        content: "When my son David was 2, he still hadn't spoken his first word. Relatives whispered about family curses, while some doctors dismissed it as simple speech delay. After a correct diagnosis of Autism, we embarked on a journey of intense early intervention. Today, David is attending mainstream schooling, expressing his brilliant mind through painting, and showing everyone that autism is not a curse—it is simply a different way of seeing the world.",
        date: 'July 2026'
      },
      {
        id: '2',
        name: 'Amina K.',
        role: 'Sibling',
        location: 'Mombasa',
        category: 'Sibling Voices',
        title: "My Brother Sees in Colors",
        content: "My brother Jojo doesn't communicate with words, but his face lights up when he organizes his wooden blocks by color. Learning to understand his unique communication cues completely reshaped how I view humanity. He has taught me that connection transcends language, and his quiet joy is the most beautiful thing in our household.",
        date: 'June 2026'
      },
      {
        id: '3',
        name: 'Teacher Juma',
        role: 'Educator',
        location: 'Kisumu',
        category: 'Special Education',
        title: "Sensory-Friendly Public Classrooms",
        content: "As a special education teacher in Kisumu, I realized that many autistic students thrive when given visual predictability. By introducing low-cost visual schedules on blackboards and creating a quiet sensory corner with pillows and local beanbags, we have reduced classroom sensory overload by 80%. Our children are learning faster and feeling safer.",
        date: 'May 2026'
      }
    ];
  });

  // Save stories to local storage
  useEffect(() => {
    localStorage.setItem('autism_unmasked_stories', JSON.stringify(stories));
    setStoriesCount(153 + stories.length - 3); // Update count dynamically
  }, [stories]);

  // --- Therapy Toolkit 1: Visual Schedules State & Handlers ---
  const [scheduleItems, setScheduleItems] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem('autism_unmasked_schedule');
    if (saved) {
      try { return JSON.parse(saved); } catch(e) {}
    }
    return [
      { id: 's1', time: '07:30 AM', task: 'Brush Teeth', icon: '🪥', done: false },
      { id: 's2', time: '08:00 AM', task: 'Eat Breakfast', icon: '🍳', done: false },
      { id: 's3', time: '09:00 AM', task: 'Study Time', icon: '📝', done: false },
      { id: 's4', time: '04:00 PM', task: 'Play Outside', icon: '⚽', done: false },
      { id: 's5', time: '07:30 PM', task: 'Take a Bath', icon: '🛀', done: false },
      { id: 's6', time: '08:30 PM', task: 'Bedtime Story & Sleep', icon: '🛌', done: false },
    ];
  });

  useEffect(() => {
    localStorage.setItem('autism_unmasked_schedule', JSON.stringify(scheduleItems));
  }, [scheduleItems]);

  const [newScheduleTask, setNewScheduleTask] = useState('');
  const [newScheduleTime, setNewScheduleTime] = useState('08:00 AM');
  const [newScheduleIcon, setNewScheduleIcon] = useState('⭐');

  const addScheduleItem = () => {
    if (!newScheduleTask.trim()) return;
    const newItem: ScheduleItem = {
      id: 's_' + Date.now(),
      time: newScheduleTime,
      task: newScheduleTask,
      icon: newScheduleIcon,
      done: false
    };
    setScheduleItems([...scheduleItems, newItem]);
    setNewScheduleTask('');
  };

  const toggleScheduleDone = (id: string) => {
    setScheduleItems(scheduleItems.map(item => item.id === id ? { ...item, done: !item.done } : item));
  };

  const deleteScheduleItem = (id: string) => {
    setScheduleItems(scheduleItems.filter(item => item.id !== id));
  };

  const moveScheduleItem = (index: number, direction: 'up' | 'down') => {
    const nextIndex = direction === 'up' ? index - 1 : index + 1;
    if (nextIndex < 0 || nextIndex >= scheduleItems.length) return;
    const updated = [...scheduleItems];
    const temp = updated[index];
    updated[index] = updated[nextIndex];
    updated[nextIndex] = temp;
    setScheduleItems(updated);
  };

  // --- Therapy Toolkit 2: Flashcards (AAC Soundboard) ---
  const [voiceSpeechAlert, setVoiceSpeechAlert] = useState<string | null>(null);
  
  const flashcards = [
    { text: 'I want water', swaText: 'Nataka maji', icon: '💧', color: 'bg-blue-50 border-blue-200 text-blue-800' },
    { text: 'I am hungry', swaText: 'Nina njaa', icon: '🍎', color: 'bg-red-50 border-red-200 text-red-800' },
    { text: 'Help me', swaText: 'Nisaidie', icon: '🙋‍♂️', color: 'bg-amber-50 border-amber-200 text-amber-800' },
    { text: 'Bathroom', swaText: 'Chooni', icon: '🚽', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
    { text: 'Yes please', swaText: 'Ndiyo tafadhali', icon: '👍', color: 'bg-green-50 border-green-200 text-green-800' },
    { text: 'No thank you', swaText: 'Hapana asante', icon: '👎', color: 'bg-rose-50 border-rose-200 text-rose-800' },
    { text: 'I am happy', swaText: 'Nina furaha', icon: '😊', color: 'bg-pink-50 border-pink-200 text-pink-800' },
    { text: 'I feel tired', swaText: 'Nimechoka', icon: '🥱', color: 'bg-indigo-50 border-indigo-200 text-indigo-800' },
    { text: 'Quiet space', swaText: 'Sehemu tulivu', icon: '🤫', color: 'bg-purple-50 border-purple-200 text-purple-800' },
    { text: 'I feel sick', swaText: 'Naumwa', icon: '🤒', color: 'bg-orange-50 border-orange-200 text-orange-800' },
  ];

  const speakText = (engText: string, swaText: string) => {
    const textToSpeak = language === 'en' ? engText : swaText;
    const langCode = language === 'en' ? 'en-US' : 'sw-KE';
    
    // UI subtitling feedback
    setVoiceSpeechAlert(textToSpeak);
    setTimeout(() => setVoiceSpeechAlert(null), 2500);

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // cancel any active speech
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = langCode;
      utterance.rate = 0.9; // slightly slower rate for children
      window.speechSynthesis.speak(utterance);
    }
  };

  // --- Therapy Toolkit 3: AAC Communication Board ---
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
    speakText(engStr, swaStr);
  };

  const clearSentence = () => {
    setSelectedSubject(null);
    setSelectedObject(null);
  };

  // --- Therapy Toolkit 4: Sensory Calming Room with Web Audio API ---
  const [breathingText, setBreathingText] = useState<'Breathe In' | 'Hold' | 'Breathe Out'>('Breathe In');
  const [breathingScale, setBreathingScale] = useState(1);
  const [audioMuted, setAudioMuted] = useState(true);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);

  // Breathing rhythm loop
  useEffect(() => {
    if (activeModal !== 'toolkit-calm') {
      stopCalmSound();
      return;
    }

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
    };
  }, [activeModal]);

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

  // --- Lumo AI Assistant Chat Panel States & Handlers ---
  const [isLumoChatOpen, setIsLumoChatOpen] = useState(false);
  const [lumoInput, setLumoInput] = useState('');
  const [lumoMessages, setLumoMessages] = useState<Message[]>([
    { 
      role: 'model', 
      text: "Hujambo! I am Lumo, your supportive assistant. Ask me anything about Autism, visual toolkits, finding assessment clinics in Kenya, or navigating special educational resources.", 
      time: '11:30 AM' 
    }
  ]);
  const [isLumoTyping, setIsLumoTyping] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (chatBottomRef.current) {
      chatBottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [lumoMessages, isLumoTyping]);

  const handleLumoSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      role: 'user',
      text: text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setLumoMessages(prev => [...prev, userMsg]);
    setLumoInput('');
    setIsLumoTyping(true);

    // Prepare message history to keep context
    const history = lumoMessages.slice(-6).map(m => ({
      role: m.role,
      text: m.text
    }));

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history,
          language
        })
      });

      if (!response.ok) {
        throw new Error('API request failed');
      }

      const data = await response.json();
      const modelMsg: Message = {
        role: 'model',
        text: data.text || "I apologize, I am experiencing temporary difficulties. Let's try again in a moment.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setLumoMessages(prev => [...prev, modelMsg]);
    } catch (err) {
      console.error("Lumo API communication error:", err);
      // Client-side fallback if the API is missing or fails
      setTimeout(() => {
        let fallbackReply = "Thank you for asking. I'm having trouble connecting to the smart Gemini server right now. If you are developing, please check if your GEMINI_API_KEY is configured in Settings > Secrets. \n\nFor general help, you can use our pre-programmed guide buttons below!";
        
        // Match standard questions for intelligent offline helper
        const normalized = text.toLowerCase();
        if (normalized.includes('early signs') || normalized.includes('sign') || normalized.includes('dalili')) {
          fallbackReply = language === 'en' 
            ? "Early signs of autism (typically visible by age 2) include:\n• Delayed speech or being completely non-verbal.\n• Minimal eye contact or not responding to their name.\n• Repetitive behaviors (like hand-flapping, spinning objects, or rocking).\n• Strong preference for structured routines.\n\nConsult developmental pediatricians at Gertrude’s Children’s Hospital or Kenyatta National Hospital clinic in Nairobi for diagnostic assessments."
            : "Dalili za mapema za usonji (autism) kwa watoto ni pamoja na:\n• Kuchelewa kuongea au kutoongea kabisa.\n• Kutotazama machoni na kutojibu wanapoitwa majina yao.\n• Tabia za kujirudia kama kupunga mikono, kuzungusha vitu, au kuyumbayumba.\n• Kupenda sana utaratibu maalum.\n\nShauriana na madaktari katika Hospitali ya Watoto ya Gertrude's au KNH kliniki kwa tathmini kamili.";
        } else if (normalized.includes('assessment') || normalized.includes('centre') || normalized.includes('vituo')) {
          fallbackReply = language === 'en'
            ? "Key assessment centres in Kenya include:\n• **Nairobi**: Gertrude's Children's Hospital, Kenyatta National Hospital Developmental Clinic, KISE (Kenya Institute of Special Education).\n• **Kiambu**: Autism Support Center Kenya (ASCK).\n• **Mombasa**: Coast General Hospital Clinic, Sahajanand Special School.\n• **Organizations**: Autism Society of Kenya (ASK) can connect you with local county support groups."
            : "Vituo vya tathmini nchini Kenya:\n• **Nairobi**: Hospitali ya Watoto ya Gertrude, Hospitali ya Kitaifa ya Kenyatta (KNH) kliniki ya watoto, KISE (Taasisi ya Elimu Maalum ya Kenya).\n• **Kiambu**: Kituo cha Msaada wa Usonji Kenya (ASCK).\n• **Mombasa**: Kliniki ya Hospitali Kuu ya Pwani, Shule Maalum ya Sahajanand.\n• **Mashirika**: Autism Society of Kenya (ASK) inakuunganisha na vikundi vya usaidizi vya wazazi kaunti zote.";
        } else if (normalized.includes('sensory') || normalized.includes('corner') || normalized.includes('kona')) {
          fallbackReply = language === 'en'
            ? "How to create a sensory corner at home:\n1. Use soft, dim lighting (avoid bright white neon light).\n2. Add soft pillows, a beanbag, or weighted blankets.\n3. Keep soothing toys like fidget spinners or water bubble timers.\n4. Use a quiet visual reminder chart, and utilize our toolkit's Calming Breathing guide to aid deep breathing exercises!"
            : "Jinsi ya kutengeneza kona ya hisia nyumbani:\n1. Tumia mwanga mwanana wa joto na punguza kelele.\n2. Weka mito laini, beanbag au mablanketi mazito.\n3. Toa vichezeo laini kama fidget spinners au vipima muda vya maji.\n4. Tumia chati ya picha na utumie zana yetu ya Pumzi ya Kutuliza kusaidia mazoezi ya kupumua!";
        } else if (normalized.includes('myth') || normalized.includes('fact') || normalized.includes('uongo')) {
          fallbackReply = language === 'en'
            ? "**Common Autism Myths vs Facts in Kenya:**\n• *Myth*: Autism is caused by witchcraft or parenting mistakes.\n• *Fact*: Autism is a neurological, biological difference in brain development. No one is to blame.\n• *Myth*: Autistic children cannot study or succeed.\n• *Fact*: With predictive visual toolkits and tailored support, they can learn and many excel wonderfully in school."
            : "**Uongo na Ukweli kuhusu Usonji nchini Kenya:**\n• *Uongo*: Usonji unasababishwa na uchawi au makosa ya malezi ya mama.\n• *Ukweli*: Usonji ni tofauti ya kibiolojia na kineurolojia katika maendeleo ya ubongo. Hakuna lawama hapa.\n• *Uongo*: Watoto wenye usonji hawawezi kusoma wala kufanikiwa.\n• *Ukweli*: Kwa kutumia zana za picha (visual tools) na msaada unaofaa, wanaweza kujifunza na wengi hufanya vizuri mashuleni.";
        }

        const modelMsg: Message = {
          role: 'model',
          text: fallbackReply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setLumoMessages(prev => [...prev, modelMsg]);
      }, 1000);
    } finally {
      setIsLumoTyping(false);
    }
  };

  // Story submission handler
  const handleStorySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStory.name || !newStory.location || !newStory.title || !newStory.content) return;

    const submitted: Story = {
      id: 'story_' + Date.now(),
      name: newStory.name,
      role: newStory.role,
      location: newStory.location,
      title: newStory.title,
      content: newStory.content,
      category: newStory.category,
      date: 'Today'
    };

    setStories([submitted, ...stories]);
    setStorySuccess(true);
    setNewStory({
      name: '',
      role: 'Parent',
      location: '',
      title: '',
      content: '',
      category: 'Our Journey'
    });
    setFamiliesCount(prev => prev + 1); // Mock community impact grows!
    setTimeout(() => {
      setStorySuccess(false);
      setActiveModal(null);
    }, 2000);
  };

  return (
    <div id="app-container" className="min-h-screen bg-[#FFF8EE] text-[#2D3748] font-sans flex flex-col antialiased">
      
      {/* Floating sub-titles alert for screen-reader/audio playback visualization */}
      {voiceSpeechAlert && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-[#2D3748] text-white px-6 py-3 rounded-full text-sm font-semibold flex items-center gap-2 shadow-2xl border border-white/20 animate-bounce">
          <Volume2 className="w-4 h-4 text-[#E89B2E] animate-pulse" />
          <span>"{voiceSpeechAlert}"</span>
        </div>
      )}

      {/* Header Navigation */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-4 sm:px-8 h-20 border-b border-[#C77700]/20 bg-[#FFF8EE]/95 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#C77700] rounded-xl flex items-center justify-center text-white font-serif font-black text-xl shadow-md shadow-[#C77700]/10">
            U
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-[#2D3748] font-serif leading-none">
              Autism <span className="text-[#C77700]">Unmasked</span>
            </h1>
            <span className="text-[10px] sm:text-xs font-semibold text-[#2F6B4F] uppercase tracking-widest block">Kenya Support Hub</span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex gap-8 text-xs font-bold uppercase tracking-widest text-[#2D3748]/80">
          <a href="#hero" className="hover:text-[#C77700] transition-colors">{language === 'en' ? 'Home' : 'Mwanzo'}</a>
          <a href="#toolkit" className="hover:text-[#C77700] transition-colors">{language === 'en' ? 'Toolkit' : 'Zana za Tiba'}</a>
          <a href="#stories" className="hover:text-[#C77700] transition-colors">{language === 'en' ? 'Stories' : 'Hadithi'}</a>
          <a href="#impact" className="hover:text-[#C77700] transition-colors">{language === 'en' ? 'Impact' : 'Matokeo'}</a>
        </nav>

        <div className="flex items-center gap-2 sm:gap-4">
          {/* SWA/EN Toggle */}
          <button 
            id="lang-toggle-btn"
            onClick={() => {
              const newLang = language === 'en' ? 'swa' : 'en';
              setLanguage(newLang);
              // reset speech
              if ('speechSynthesis' in window) window.speechSynthesis.cancel();
            }}
            className="flex items-center gap-1.5 text-xs font-extrabold border-2 border-[#2F6B4F] text-[#2F6B4F] px-2.5 py-1 rounded-full hover:bg-[#2F6B4F]/5 transition-all cursor-pointer"
            title="Translate to Swahili / English"
          >
            <Globe className="w-3 h-3" />
            <span>{language === 'en' ? 'EN / SWA' : 'SWA / EN'}</span>
          </button>

          {/* Donate CTA Button */}
          <button 
            id="donate-btn"
            onClick={() => setActiveModal('donate')}
            className="bg-[#2F6B4F] hover:bg-[#23513b] text-white px-4 sm:px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold shadow-md shadow-[#2F6B4F]/10 transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            {language === 'en' ? 'Donate Now' : 'Changia Sasa'}
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-8">
        
        {/* Top Section: Hero (Left) and Quick Guidance Summary (Right) */}
        <div id="hero" className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          
          {/* Left Hero Block (60% equivalent on desktop) */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            <section className="relative min-h-[340px] bg-[#C77700] rounded-[32px] overflow-hidden flex flex-col justify-end p-6 sm:p-10 text-white shadow-xl border-4 border-white transition-transform hover:shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent z-10"></div>
              
              {/* Pattern Overlay */}
              <div className="absolute inset-0 opacity-10 pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(#FFF 1px, transparent 1px)', backgroundSize: '16px 16px' }}></div>
              
              <div className="relative z-20 w-full mt-12">
                <span className="text-[10px] sm:text-xs font-extrabold uppercase tracking-[0.3em] mb-2 block text-[#E89B2E]">
                  {language === 'en' ? 'SUPPORTING EVERY MIND' : 'KUSAIDIA KILA AKILI'}
                </span>
                <h2 className="text-3xl sm:text-5xl font-black font-serif leading-[1.0] tracking-tight">
                  {language === 'en' ? (
                    <>Empowering <br />Our Autistic <br />Community.</>
                  ) : (
                    <>Kuwezesha <br />Jamii Yetu <br />ya Usonji.</>
                  )}
                </h2>
                <p className="mt-4 max-w-lg text-xs sm:text-sm text-[#FFF8EE]/90 leading-relaxed font-medium">
                  {language === 'en' 
                    ? "Sharing real stories, breaking myths, and supporting Kenyan families to build a more inclusive society where every brain is appreciated."
                    : "Kushiriki hadithi halisi, kuvunja dhana mbaya, na kusaidia familia nchini Kenya kujenga jamii yenye usawa ambapo kila akili inathaminiwa."}
                </p>
                
                <div className="mt-6 flex flex-wrap gap-4">
                  <button 
                    onClick={() => setActiveModal('video')}
                    className="flex items-center gap-2 bg-[#E89B2E] hover:bg-[#d1841e] text-[#2D3748] px-5 py-2.5 rounded-full text-xs font-extrabold tracking-wider uppercase transition-transform transform hover:scale-105 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{language === 'en' ? 'Watch Intro Video' : 'Tazama Video ya Utangulizi'}</span>
                  </button>
                  <a 
                    href="#toolkit"
                    className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm text-white px-5 py-2.5 rounded-full text-xs font-bold border border-white/25 transition-colors"
                  >
                    <span>{language === 'en' ? 'Explore Toolkit' : 'Chunguza Zana za Tiba'}</span>
                  </a>
                </div>
              </div>

              {/* Absolute Corner Accent Play Badge */}
              <div 
                onClick={() => setActiveModal('video')}
                className="absolute top-6 right-6 sm:top-10 sm:right-10 z-20 w-12 h-12 bg-white/20 hover:bg-white/35 backdrop-blur-md rounded-full flex items-center justify-center border border-white/35 cursor-pointer transition-all transform hover:scale-110 shadow-lg"
                title="Watch video"
              >
                <Play className="w-4 h-4 text-white fill-white ml-0.5" />
              </div>
            </section>
          </div>

          {/* Right Top Block (40% equivalent on desktop): Dynamic educational highlights */}
          <div className="lg:col-span-4 flex flex-col gap-6 justify-between bg-white rounded-[32px] p-6 sm:p-8 border border-[#C77700]/10 shadow-md">
            <div>
              <div className="flex items-center gap-2 text-[#2F6B4F] mb-3">
                <BookMarked className="w-5 h-5" />
                <span className="text-xs font-extrabold uppercase tracking-widest">{language === 'en' ? 'Autism Facts' : 'Ukweli wa Usonji'}</span>
              </div>
              <h3 className="text-xl font-bold font-serif text-[#2D3748] mb-3">
                {language === 'en' ? 'Understanding Autism Spectrum' : 'Kuelewa Spectrum ya Usonji'}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed mb-4">
                {language === 'en'
                  ? "Autism is a neurological variation. It influences how a person perceives, processes sensory stimuli, and interacts with others. It is NOT an illness to cure, but a processing difference to respect and accommodate."
                  : "Usonji ni tofauti ya kinyurolojia. Huathiri jinsi mtu anavyotambua na kushirikiana na wengine. Sio ugonjwa wa kutibu, bali ni tofauti ya jinsi ubongo unavyofanya kazi inayohitaji heshima na malazi."}
              </p>
              
              <div className="border-t border-[#C77700]/10 pt-4 space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#2F6B4F]/10 flex items-center justify-center text-[#2F6B4F] shrink-0 font-bold text-xs">✓</div>
                  <p className="text-[11px] text-[#2D3748]/90 font-medium">
                    <strong>{language === 'en' ? 'Sensory processing' : 'Usindikaji wa hisia'}:</strong> {language === 'en' ? 'Lights, sounds, textures can feel extremely amplified.' : 'Taa, sauti, au vitambaa vinaweza kusikika kwa nguvu sana.'}
                  </p>
                </div>
                <div className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full bg-[#2F6B4F]/10 flex items-center justify-center text-[#2F6B4F] shrink-0 font-bold text-xs">✓</div>
                  <p className="text-[11px] text-[#2D3748]/90 font-medium">
                    <strong>{language === 'en' ? 'Communication' : 'Mawasiliano'}:</strong> {language === 'en' ? 'Using visual supports dramatically improves expression and calmness.' : 'Kutumia misaada ya picha husaidia sana kujieleza na kuleta utulivu.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t border-[#C77700]/10 flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400">{language === 'en' ? 'Guided Support' : 'Usaidizi wa Kujitolea'}</span>
              <button 
                onClick={() => setIsLumoChatOpen(true)}
                className="text-xs font-bold text-[#C77700] hover:text-[#2D3748] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{language === 'en' ? 'Chat with Lumo' : 'Ongea na Lumo'} &rarr;</span>
              </button>
            </div>
          </div>
        </div>

        {/* Middle Section: Therapy Toolkit Grid & Calming Room (Visual, Sounds, AAC) */}
        <section id="toolkit" className="bg-[#FFF8EE] border-t-2 border-[#C77700]/15 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
            <div>
              <span className="text-[10px] font-bold text-[#C77700] uppercase tracking-[0.25em]">{language === 'en' ? 'SUPPORTIVE EXPERIENCES' : 'MBINU ZA MSAADA'}</span>
              <h2 className="font-bold text-2xl sm:text-3xl font-serif text-[#2D3748] mt-1">{language === 'en' ? 'Therapy Toolkit' : 'Zana za Tiba'}</h2>
            </div>
            <span className="text-xs font-extrabold text-[#2F6B4F] bg-[#2F6B4F]/10 px-3 py-1.5 rounded-full">
              {language === 'en' ? '100% Free Interactive Tools' : 'Zana Bure Kabisa Shirikishi'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Toolkit 1: Visual Schedules */}
            <div className="bg-white rounded-[24px] p-6 border border-[#C77700]/10 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-[#C77700]/10 rounded-xl flex items-center justify-center text-xl mb-4">🗂</div>
                <h3 className="text-lg font-bold text-[#2D3748] mb-1">{language === 'en' ? 'Visual Schedules' : 'Ratiba za Picha'}</h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  {language === 'en' 
                    ? 'Help children understand what comes next, lowering anxiety and reducing behavioral meltdowns.' 
                    : 'Saidia watoto kuelewa nini kinafuata, kupunguza wasiwasi na kupunguza fujo au hofu.'}
                </p>
              </div>
              <button 
                onClick={() => setActiveModal('toolkit-schedule')}
                className="w-full bg-[#2D3748] hover:bg-[#1a212b] text-white py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
              >
                {language === 'en' ? 'Build Schedule' : 'Unda Ratiba'}
              </button>
            </div>

            {/* Toolkit 2: Flash Cards */}
            <div className="bg-white rounded-[24px] p-6 border border-[#C77700]/10 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-[#E89B2E]/10 rounded-xl flex items-center justify-center text-xl mb-4">🎴</div>
                <h3 className="text-lg font-bold text-[#2D3748] mb-1">{language === 'en' ? 'AAC Speech Cards' : 'Kadi za Sauti (AAC)'}</h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  {language === 'en' 
                    ? 'Empower non-verbal children to communicate basic physical and emotional needs through voice output.' 
                    : 'Washa mawasiliano ya sauti kwa watoto wasioweza kuongea kueleza mahitaji yao ya kimwili.'}
                </p>
              </div>
              <button 
                onClick={() => setActiveModal('toolkit-cards')}
                className="w-full bg-[#2D3748] hover:bg-[#1a212b] text-white py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
              >
                {language === 'en' ? 'Open Soundboard' : 'Fungua Kadi za Sauti'}
              </button>
            </div>

            {/* Toolkit 3: AAC Sentence Board */}
            <div className="bg-white rounded-[24px] p-6 border border-[#C77700]/10 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-[#2F6B4F]/10 rounded-xl flex items-center justify-center text-xl mb-4">📢</div>
                <h3 className="text-lg font-bold text-[#2D3748] mb-1">{language === 'en' ? 'Communication Strip' : 'Ukanda wa Maneno'}</h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  {language === 'en' 
                    ? 'Let children combine actions (e.g., I want) with objects (e.g., Water) to express complete thoughts.' 
                    : 'Ruhusu watoto kuchanganya vitendo (mfano, Nataka) na vitu (mfano, Maji) kuunda sentensi.'}
                </p>
              </div>
              <button 
                onClick={() => setActiveModal('toolkit-board')}
                className="w-full bg-[#2D3748] hover:bg-[#1a212b] text-white py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
              >
                {language === 'en' ? 'Build Sentences' : 'Unda Sentensi'}
              </button>
            </div>

            {/* Toolkit 4: Calming Tasks */}
            <div className="bg-white rounded-[24px] p-6 border border-[#C77700]/10 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 bg-[#C77700]/10 rounded-xl flex items-center justify-center text-xl mb-4">🧘</div>
                <h3 className="text-lg font-bold text-[#2D3748] mb-1">{language === 'en' ? 'Sensory Calming Room' : 'Chumba cha Kutuliza'}</h3>
                <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                  {language === 'en' 
                    ? 'Interactive visual ripples and a soothing low-frequency sound generator for emotional self-regulation.' 
                    : 'Mawimbi ya rangi shirikishi na sauti tulivu ya masafa ya chini kusaidia kujituliza kihisia.'}
                </p>
              </div>
              <button 
                onClick={() => setActiveModal('toolkit-calm')}
                className="w-full bg-[#2F6B4F] hover:bg-[#1e4432] text-white py-2.5 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
              >
                {language === 'en' ? 'Enter Sensory Space' : 'Ingia Chumba Tulivu'}
              </button>
            </div>

          </div>
        </section>

        {/* Bottom Section: Storytelling Hub (Left 60%) and Impact/Join community (Right 40%) */}
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-8 mt-4 border-t-2 border-[#C77700]/15 pt-8">
          
          {/* Stories Hub (60% equivalent) */}
          <div id="stories" className="lg:col-span-6 flex flex-col gap-6">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-[#2F6B4F] uppercase tracking-widest">{language === 'en' ? 'COMMUNITY VOICES' : 'SAUTI ZA JAMII'}</span>
                <h2 className="text-2xl font-bold font-serif text-[#2D3748] mt-1">{language === 'en' ? 'Real Stories, Shared Hope' : 'Hadithi Halisi, Tumaini Moja'}</h2>
              </div>
              <button 
                onClick={() => setActiveModal('submit-story')}
                className="flex items-center gap-1 text-xs font-extrabold text-[#C77700] border-b-2 border-[#C77700] hover:text-[#2D3748] hover:border-[#2D3748] pb-0.5 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Share Your Story' : 'Shirikisha Hadithi Yako'}</span>
              </button>
            </div>

            {/* Stories List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {stories.map((story) => (
                <div 
                  key={story.id} 
                  className={`rounded-[24px] p-6 shadow-sm flex flex-col justify-between border transition-all hover:shadow-md ${
                    story.role === 'Sibling' 
                      ? 'bg-[#2F6B4F] text-white border-[#2F6B4F]' 
                      : 'bg-white text-[#2D3748] border-[#C77700]/10'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className={`text-[9px] uppercase font-bold px-2 py-0.5 rounded-full ${
                        story.role === 'Sibling' 
                          ? 'bg-white/20 text-[#FFF8EE]' 
                          : 'bg-[#C77700]/10 text-[#C77700]'
                      }`}>
                        {story.role}
                      </span>
                      <span className={`text-[10px] ${story.role === 'Sibling' ? 'text-white/70' : 'text-gray-400'}`}>
                        {story.location}
                      </span>
                    </div>
                    <h3 className="text-md sm:text-lg font-bold font-serif mb-2 leading-tight">
                      {story.title}
                    </h3>
                    <p className={`text-xs leading-relaxed line-clamp-5 ${story.role === 'Sibling' ? 'text-white/85 italic' : 'text-gray-600'}`}>
                      "{story.content}"
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-2 mt-4 pt-4 border-t border-current/10">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-[10px] ${
                      story.role === 'Sibling' ? 'bg-white/20 text-white' : 'bg-[#C77700]/10 text-[#C77700]'
                    }`}>
                      {story.name.charAt(0)}
                    </div>
                    <span className="text-[10px] font-bold">
                      {story.name} • {story.date}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Sidebar Area: Impact and Newsletter (40% equivalent) */}
          <div id="impact" className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Impact Counters */}
            <section className="grid grid-cols-2 gap-4">
              <div className="bg-[#E89B2E] text-white p-6 rounded-[24px] text-center shadow-lg transform hover:scale-[1.02] transition-transform">
                <div className="text-3xl font-black font-serif">{familiesCount.toLocaleString()}+</div>
                <div className="text-[9px] uppercase font-extrabold tracking-widest opacity-90 mt-1">
                  {language === 'en' ? 'Families Reached' : 'Familia Zilizofikiwa'}
                </div>
              </div>
              <div className="bg-[#FFF8EE] border-2 border-[#E89B2E] p-6 rounded-[24px] text-center transform hover:scale-[1.02] transition-transform">
                <div className="text-3xl font-black font-serif text-[#C77700]">{storiesCount}+</div>
                <div className="text-[9px] uppercase font-extrabold tracking-widest text-[#2D3748]/60 mt-1">
                  {language === 'en' ? 'Stories Shared' : 'Hadithi Zilizotolewa'}
                </div>
              </div>
            </section>

            {/* Newsletter Container */}
            <section className="bg-[#2D3748] text-[#FFF8EE] rounded-[32px] p-6 sm:p-8 relative overflow-hidden shadow-xl">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="p-1.5 rounded-lg bg-white/10 text-[#E89B2E]">⚡</span>
                  <h3 className="font-bold text-lg font-serif">{language === 'en' ? 'Join the Community' : 'Jiunge na Jamii Yetu'}</h3>
                </div>
                <p className="text-xs text-[#FFF8EE]/85 mb-4 leading-relaxed">
                  {language === 'en'
                    ? 'Receive monthly special educational visual materials, community advice, and stories from families across Kenya directly in your email.'
                    : 'Pata vifaa vya masomo vya picha vya kila mwezi, ushauri wa jamii, na hadithi kutoka kwa familia kote nchini Kenya moja kwa moja.'}
                </p>

                {newsletterSuccess ? (
                  <div className="bg-[#2F6B4F]/40 border border-[#2F6B4F] text-[#FFF8EE] p-3 rounded-lg text-xs flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-400 shrink-0" />
                    <span>{language === 'en' ? 'Asante! You have joined the supportive community.' : 'Asante! Umejiunga na jamii yetu ya msaada.'}</span>
                  </div>
                ) : (
                  <form 
                    onSubmit={(e) => {
                      e.preventDefault();
                      if (newsletterEmail.trim()) {
                        setNewsletterSuccess(true);
                        setFamiliesCount(prev => prev + 1);
                      }
                    }}
                    className="flex flex-col sm:flex-row gap-2"
                  >
                    <input 
                      type="email" 
                      required
                      placeholder={language === 'en' ? 'Enter your email' : 'Ingiza barua pepe yako'} 
                      value={newsletterEmail}
                      onChange={(e) => setNewsletterEmail(e.target.value)}
                      className="bg-white/10 border border-white/25 rounded-xl px-4 py-2 text-xs focus:outline-none focus:border-[#E89B2E] text-white flex-1 placeholder:text-white/45"
                    />
                    <button 
                      type="submit"
                      className="bg-[#C77700] hover:bg-[#d1841e] text-white px-5 py-2 rounded-xl text-xs font-extrabold uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      {language === 'en' ? 'Join' : 'Jiunge'}
                    </button>
                  </form>
                )}

                <div className="flex items-center gap-4 mt-6 opacity-65 text-[10px] font-bold tracking-wider">
                  <span className="hover:text-[#E89B2E] cursor-pointer">WhatsApp Group</span>
                  <span>•</span>
                  <span className="hover:text-[#E89B2E] cursor-pointer">Instagram</span>
                  <span>•</span>
                  <span className="hover:text-[#E89B2E] cursor-pointer">Facebook</span>
                </div>
              </div>
              
              {/* Artistic Blur Ambient Light */}
              <div className="absolute -right-8 -bottom-8 w-28 h-28 bg-[#E89B2E] rounded-full blur-3xl opacity-20"></div>
            </section>
          </div>
        </div>
      </main>

      {/* Footer Status Bar & Contact */}
      <footer className="mt-12 px-4 sm:px-8 py-6 border-t border-[#C77700]/10 flex flex-col md:flex-row justify-between items-center gap-4 bg-white">
        
        {/* Lumo AI Status Panel - Interactive Drawer Trigger */}
        <div 
          onClick={() => setIsLumoChatOpen(true)}
          className="flex items-center gap-3 cursor-pointer group bg-[#FFF8EE] border border-[#C77700]/20 hover:border-[#C77700] px-4 py-2 rounded-full transition-all"
          title="Open Lumo Assistant Chat"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></div>
          <span className="text-[10px] font-extrabold text-[#2D3748]/80 uppercase tracking-widest group-hover:text-[#C77700]">
            {language === 'en' ? 'Lumo AI Assistant Active' : 'Lumo AI Msaidizi Amewashwa'}
          </span>
          <span className="text-[9px] bg-[#C77700] text-white font-black px-1.5 py-0.5 rounded uppercase">Click to Chat</span>
        </div>

        <div className="text-[10px] text-[#2D3748]/60 font-medium text-center md:text-left">
          &copy; 2026 Autism Unmasked Kenya • Supporting Every Mind • Made with 💚 in Nairobi
        </div>

        {/* Social Badges */}
        <div className="flex gap-3">
          <span className="w-8 h-8 rounded-full bg-[#2D3748]/5 hover:bg-[#C77700]/15 hover:text-[#C77700] flex items-center justify-center text-[10px] font-bold cursor-pointer transition-colors">FB</span>
          <span className="w-8 h-8 rounded-full bg-[#2D3748]/5 hover:bg-[#C77700]/15 hover:text-[#C77700] flex items-center justify-center text-[10px] font-bold cursor-pointer transition-colors">IG</span>
          <span className="w-8 h-8 rounded-full bg-[#2D3748]/5 hover:bg-[#C77700]/15 hover:text-[#C77700] flex items-center justify-center text-[10px] font-bold cursor-pointer transition-colors">WA</span>
        </div>
      </footer>

      {/* ========================================================= */}
      {/* ======================= MODALS ========================== */}
      {/* ========================================================= */}

      {/* 1. Video Modal */}
      {activeModal === 'video' && (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-white rounded-[32px] overflow-hidden w-full max-w-2xl border-4 border-white shadow-2xl relative">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 bg-black/60 hover:bg-black text-white p-2 rounded-full cursor-pointer z-10 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative aspect-video bg-[#2D3748] flex flex-col items-center justify-center p-8 text-center text-white">
              {/* Simulated educational Kenyan cartoon/storytelling video on Autism */}
              <div className="absolute inset-0 opacity-15 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#FFF 1px, transparent 1px)', backgroundSize: '12px 12px' }}></div>
              <Compass className="w-16 h-16 text-[#E89B2E] animate-spin mb-4" style={{ animationDuration: '10s' }} />
              <span className="text-[10px] uppercase font-bold tracking-widest text-[#E89B2E] mb-2 block">Educational Storyboard</span>
              <h3 className="text-xl sm:text-2xl font-bold font-serif mb-3">Autism Unmasked Kenya</h3>
              <p className="text-xs max-w-md text-gray-300 leading-relaxed mb-6">
                "Hi, I'm Juma. I am 7 years old and I am autistic. Sometimes sensory sights and sounds feel like thunder to my head. Here's how my family uses visual routines to help me navigate the day peacefully..."
              </p>
              
              <div className="flex gap-4 items-center">
                <span className="text-[11px] text-[#E89B2E] font-bold">● Simulating educational audio playback...</span>
                <button 
                  onClick={() => speakText("Hello, this is Juma. Welcome to Autism Unmasked Kenya, where we support parents, caregivers and friends.", "Hujambo, huyu ni Juma. Karibu kwenye Autism Unmasked Kenya, ambapo tunasaidia wazazi na walezi.")}
                  className="bg-[#2F6B4F] hover:bg-[#1f4734] px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Listen to Intro voice' : 'Sikiliza sauti'}</span>
                </button>
              </div>
            </div>
            <div className="bg-[#FFF8EE] p-6 text-center border-t border-[#C77700]/10">
              <h4 className="font-bold text-sm text-[#2D3748] mb-1">
                {language === 'en' ? 'Early Intervention Changes Everything' : 'Uingiliaji wa Mapema Hubadilisha Kila Kitu'}
              </h4>
              <p className="text-xs text-gray-500 max-w-md mx-auto">
                {language === 'en' 
                  ? 'Identifying sensory needs early helps children establish predictable routines and feel entirely secure.' 
                  : 'Kutambua mahitaji ya hisia mapema humsaidia mtoto kuanzisha ratiba inayotabirika na kujisikia salama.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* 2. Donate Modal (Kenya-specific payment details) */}
      {activeModal === 'donate' && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#FFF8EE] rounded-[32px] border-4 border-[#2F6B4F] p-6 sm:p-8 w-full max-w-md shadow-2xl relative text-[#2D3748]">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-700 p-1.5 rounded-full cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="text-center mb-6">
              <span className="text-3xl text-[#2F6B4F]">💚</span>
              <h3 className="text-2xl font-bold font-serif mt-2">{language === 'en' ? 'Support Our Mission' : 'Changia Huduma Yetu'}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {language === 'en' ? '100% of your donation pays for printing and delivering Therapy Toolkits to families in rural Kenya.' : '100% ya mchango wako hutumika kuchapisha na kusambaza zana za tiba kwa familia vijijini Kenya.'}
              </p>
            </div>

            {/* Donation options */}
            <div className="space-y-4">
              {/* Option A: M-PESA details */}
              <div className="bg-white p-4 rounded-2xl border border-green-300 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-3 h-3 rounded-full bg-green-500"></span>
                  <span className="text-xs font-black text-green-700 uppercase tracking-widest">Safaricom M-PESA</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400 block text-[9px] uppercase font-bold">Lipa Na M-PESA</span>
                    <strong className="text-[#2D3748]">Paybill: 400222</strong>
                  </div>
                  <div>
                    <span className="text-gray-400 block text-[9px] uppercase font-bold">Account Number</span>
                    <strong className="text-[#2D3748]">UNMASKED</strong>
                  </div>
                </div>
              </div>

              {/* Option B: Card Simulation */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  alert(language === 'en' ? 'Thank you! Your simulated donation was received successfully.' : 'Asante sana! Mchango wako wa kuigiza umepokelewa vizuri.');
                  setFamiliesCount(prev => prev + 5);
                  setActiveModal(null);
                }}
                className="space-y-3"
              >
                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Donor Name</label>
                  <input type="text" required placeholder="e.g. Kwame Juma" className="w-full bg-white border border-[#C77700]/20 rounded-xl px-3 py-1.5 text-xs text-[#2D3748] focus:outline-none focus:border-[#2F6B4F]" />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Amount (KES)</label>
                    <input type="number" required defaultValue="1000" min="100" className="w-full bg-white border border-[#C77700]/20 rounded-xl px-3 py-1.5 text-xs text-[#2D3748] focus:outline-none focus:border-[#2F6B4F]" />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Card Number</label>
                    <input type="text" required maxLength={16} placeholder="4000 1234 5678" className="w-full bg-white border border-[#C77700]/20 rounded-xl px-3 py-1.5 text-xs text-[#2D3748] focus:outline-none focus:border-[#2F6B4F]" />
                  </div>
                </div>
                <button type="submit" className="w-full bg-[#2F6B4F] hover:bg-[#1e4432] text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer">
                  {language === 'en' ? 'Donate via Card' : 'Changia kupitia Kadi'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 3. Story Submit Modal */}
      {activeModal === 'submit-story' && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#FFF8EE] rounded-[32px] border-4 border-[#C77700] p-6 sm:p-8 w-full max-w-lg shadow-2xl relative text-[#2D3748]">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-700 p-1.5 rounded-full cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="mb-4">
              <h3 className="text-2xl font-bold font-serif text-[#C77700]">{language === 'en' ? 'Share Your Journey' : 'Shirikisha Safari Yako'}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {language === 'en' ? 'Encourage thousands of parents across Kenya by writing your victory stories or lesson learned.' : 'Hamasisha maelfu ya wazazi nchini Kenya kwa kuandika hadithi yako ya ushindi au mafunzo.'}
              </p>
            </div>

            {storySuccess ? (
              <div className="bg-[#2F6B4F] text-[#FFF8EE] p-6 rounded-2xl text-center space-y-2">
                <CheckCircle className="w-12 h-12 mx-auto text-[#E89B2E] animate-bounce" />
                <h4 className="font-bold text-lg">{language === 'en' ? 'Story Submitted!' : 'Hadithi Imepokelewa!'}</h4>
                <p className="text-xs opacity-90">
                  {language === 'en' ? 'Thank you. Your narrative is now unmasked on the community board.' : 'Asante. Hadithi yako sasa inaonekana kwenye ubao wa jamii.'}
                </p>
              </div>
            ) : (
              <form onSubmit={handleStorySubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Your Name</label>
                    <input 
                      type="text" 
                      required 
                      value={newStory.name}
                      onChange={(e) => setNewStory({...newStory, name: e.target.value})}
                      placeholder="Grace Mwangi" 
                      className="w-full bg-white border border-[#C77700]/20 rounded-xl px-3 py-2 text-xs text-[#2D3748] focus:outline-none focus:border-[#C77700]" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Your Role</label>
                    <select 
                      value={newStory.role}
                      onChange={(e) => setNewStory({...newStory, role: e.target.value})}
                      className="w-full bg-white border border-[#C77700]/20 rounded-xl px-3 py-2 text-xs text-[#2D3748] focus:outline-none focus:border-[#C77700]"
                    >
                      <option value="Parent">Parent / Guardian</option>
                      <option value="Sibling">Sibling</option>
                      <option value="Educator">Educator</option>
                      <option value="Autistic Self">Autistic Self</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Kenyan Location / County</label>
                    <input 
                      type="text" 
                      required 
                      value={newStory.location}
                      onChange={(e) => setNewStory({...newStory, location: e.target.value})}
                      placeholder="e.g., Nairobi, Kisumu" 
                      className="w-full bg-white border border-[#C77700]/20 rounded-xl px-3 py-2 text-xs text-[#2D3748] focus:outline-none focus:border-[#C77700]" 
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Category</label>
                    <select 
                      value={newStory.category}
                      onChange={(e) => setNewStory({...newStory, category: e.target.value})}
                      className="w-full bg-white border border-[#C77700]/20 rounded-xl px-3 py-2 text-xs text-[#2D3748] focus:outline-none focus:border-[#C77700]"
                    >
                      <option value="Our Journey">Our Journey</option>
                      <option value="Sibling Voices">Sibling Voices</option>
                      <option value="Special Education">Special Education</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Heading / Title</label>
                  <input 
                    type="text" 
                    required 
                    value={newStory.title}
                    onChange={(e) => setNewStory({...newStory, title: e.target.value})}
                    placeholder="e.g., Taking the First Step" 
                    className="w-full bg-white border border-[#C77700]/20 rounded-xl px-3 py-2 text-xs text-[#2D3748] focus:outline-none focus:border-[#C77700]" 
                  />
                </div>

                <div>
                  <label className="text-[10px] uppercase font-bold text-gray-400 block mb-1">Your Story</label>
                  <textarea 
                    required 
                    rows={4}
                    value={newStory.content}
                    onChange={(e) => setNewStory({...newStory, content: e.target.value})}
                    placeholder="Describe your journey, lessons, or triumphs so others can find hope..." 
                    className="w-full bg-white border border-[#C77700]/20 rounded-xl px-3 py-2 text-xs text-[#2D3748] focus:outline-none focus:border-[#C77700] resize-none"
                  />
                </div>

                <button type="submit" className="w-full bg-[#C77700] hover:bg-[#d1841e] text-white py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer">
                  {language === 'en' ? 'Submit Story' : 'Wasilisha Hadithi'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* 4. Toolkit schedule Modal */}
      {activeModal === 'toolkit-schedule' && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#FFF8EE] rounded-[32px] border-4 border-[#C77700] p-6 w-full max-w-lg shadow-2xl relative text-[#2D3748] flex flex-col max-h-[90vh]">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-700 p-1.5 rounded-full cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            
            <div className="mb-4">
              <span className="text-[10px] font-bold text-[#C77700] uppercase tracking-wider block">Interactive Builder</span>
              <h3 className="text-xl font-bold font-serif">{language === 'en' ? 'Daily Visual Routine Planner' : 'Mratibu wa Ratiba ya Picha'}</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {language === 'en' ? 'Predictable structures reduce anxiety. Create, order, and toggle tasks as complete with your child.' : 'Mifumo inayotabirika hupunguza fujo. Unda, panga, na gusa mradi kukamilisha na mtoto.'}
              </p>
            </div>

            {/* Quick adding task form */}
            <div className="bg-white p-3 rounded-2xl border border-[#C77700]/10 grid grid-cols-1 sm:grid-cols-12 gap-2 mb-4 shrink-0">
              <div className="sm:col-span-5">
                <input 
                  type="text" 
                  placeholder={language === 'en' ? "New task, e.g. Wash hands" : "Kazi, mfano Kuosha mikono"} 
                  value={newScheduleTask}
                  onChange={(e) => setNewScheduleTask(e.target.value)}
                  className="w-full bg-[#FFF8EE] border border-[#C77700]/10 rounded-xl px-3 py-1.5 text-xs text-[#2D3748]"
                />
              </div>
              <div className="sm:col-span-4 flex gap-1">
                <input 
                  type="text" 
                  placeholder="08:00 AM" 
                  value={newScheduleTime}
                  onChange={(e) => setNewScheduleTime(e.target.value)}
                  className="w-1/2 bg-[#FFF8EE] border border-[#C77700]/10 rounded-xl px-2 py-1.5 text-[11px] text-[#2D3748] text-center"
                />
                {/* Simple Emoji Picker */}
                <select 
                  value={newScheduleIcon}
                  onChange={(e) => setNewScheduleIcon(e.target.value)}
                  className="w-1/2 bg-[#FFF8EE] border border-[#C77700]/10 rounded-xl px-1 py-1.5 text-xs text-[#2D3748] text-center"
                >
                  <option value="🪥">🪥</option>
                  <option value="🍳">🍳</option>
                  <option value="📝">📝</option>
                  <option value="⚽">⚽</option>
                  <option value="🛀">🛀</option>
                  <option value="🛌">🛌</option>
                  <option value="🍎">🍎</option>
                  <option value="💧">💧</option>
                  <option value="🧸">🧸</option>
                  <option value="🚗">🚗</option>
                  <option value="👟">👟</option>
                  <option value="🤫">🤫</option>
                  <option value="🏫">🏫</option>
                  <option value="🦷">🦷</option>
                </select>
              </div>
              <div className="sm:col-span-3">
                <button 
                  onClick={addScheduleItem}
                  className="w-full bg-[#2F6B4F] hover:bg-[#1e4432] text-white py-1.5 rounded-xl text-xs font-bold uppercase cursor-pointer flex items-center justify-center gap-1"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'en' ? 'Add' : 'Weka'}</span>
                </button>
              </div>
            </div>

            {/* List container with scroll */}
            <div className="flex-1 overflow-y-auto space-y-2 pr-1 mb-4">
              {scheduleItems.length === 0 ? (
                <div className="text-center py-8 text-gray-400 text-xs">
                  {language === 'en' ? 'No tasks added. Create one above!' : 'Hakuna kazi iliyowekwa bado. Unda moja hapo juu!'}
                </div>
              ) : (
                scheduleItems.map((item, index) => (
                  <div 
                    key={item.id} 
                    className={`flex items-center justify-between p-3 rounded-2xl border transition-all ${
                      item.done 
                        ? 'bg-green-50/50 border-green-200 opacity-60 line-through text-gray-400' 
                        : 'bg-white border-[#C77700]/10 text-[#2D3748]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <button 
                        onClick={() => toggleScheduleDone(item.id)}
                        className={`w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all cursor-pointer ${
                          item.done 
                            ? 'bg-green-500 border-green-500 text-white' 
                            : 'border-gray-300 hover:border-[#2F6B4F]'
                        }`}
                      >
                        {item.done && <Check className="w-3.5 h-3.5" />}
                      </button>
                      <span className="text-2xl">{item.icon}</span>
                      <div>
                        <span className="text-xs font-bold block leading-none">{item.task}</span>
                        <span className="text-[10px] text-gray-400 font-semibold">{item.time}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {/* Re-ordering arrows */}
                      <button 
                        disabled={index === 0}
                        onClick={() => moveScheduleItem(index, 'up')}
                        className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-500 disabled:opacity-30 cursor-pointer"
                        title="Move Up"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button 
                        disabled={index === scheduleItems.length - 1}
                        onClick={() => moveScheduleItem(index, 'down')}
                        className="p-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-500 disabled:opacity-30 cursor-pointer"
                        title="Move Down"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>

                      <button 
                        onClick={() => deleteScheduleItem(item.id)}
                        className="p-1 text-red-500 hover:bg-red-50 rounded cursor-pointer"
                        title="Delete item"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Quick Actions (Print/Simulate PDF export) */}
            <div className="shrink-0 pt-3 border-t border-[#C77700]/10 flex justify-between items-center bg-[#FFF8EE]">
              <span className="text-[10px] text-gray-400 font-medium">
                {language === 'en' ? 'Automatic local saving' : 'Kuhifadhi otomatiki katika kifaa chako'}
              </span>
              <button 
                onClick={() => alert(language === 'en' ? 'Routine compiled successfully. Printing visual template...' : 'Ratiba imekamilika vizuri. Inachapisha kadi za picha...')}
                className="bg-[#2D3748] hover:bg-black text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{language === 'en' ? 'Print Schedule' : 'Chapa Ratiba'}</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Toolkit cards soundboard Modal */}
      {activeModal === 'toolkit-cards' && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#FFF8EE] rounded-[32px] border-4 border-[#C77700] p-6 w-full max-w-2xl shadow-2xl relative text-[#2D3748] flex flex-col max-h-[90vh]">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-700 p-1.5 rounded-full cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-bold text-[#2F6B4F] uppercase tracking-wider block">AAC Soundboard Voice Aids</span>
              <h3 className="text-xl font-bold font-serif">{language === 'en' ? 'Speech Helper Flashcards' : 'Kadi za Sauti za Kujieleza'}</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {language === 'en' ? 'Tap any card below. The device will speak the phrase in your selected language to aid non-verbal children.' : 'Gusa kadi yoyote hapa chini. Kifaa kitasoma sentensi kwa sauti kwa lugha uliyochagua ili kusaidia mawasiliano.'}
              </p>
            </div>

            {/* Grid of Flash Cards */}
            <div className="flex-1 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-4 pr-1 py-1">
              {flashcards.map((card, idx) => (
                <div 
                  key={idx}
                  onClick={() => speakText(card.text, card.swaText)}
                  className={`border-2 rounded-[24px] p-5 flex flex-col items-center justify-center text-center cursor-pointer transition-all transform active:scale-95 hover:shadow-md hover:-translate-y-0.5 bg-white border-[#C77700]/10`}
                >
                  <span className="text-4xl mb-3 block transform hover:scale-110 transition-transform">{card.icon}</span>
                  <span className="text-xs font-bold block text-[#2D3748]">{language === 'en' ? card.text : card.swaText}</span>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-[#C77700] mt-1.5 flex items-center gap-1">
                    <Volume2 className="w-2.5 h-2.5 animate-pulse" />
                    <span>{language === 'en' ? 'Tap to Speak' : 'Gusa uongee'}</span>
                  </span>
                </div>
              ))}
            </div>

            <div className="shrink-0 mt-4 pt-3 border-t border-[#C77700]/10 text-center text-[10px] text-gray-400 font-bold tracking-wider uppercase">
              {language === 'en' ? 'Speech synthesizer active (en-US / sw-KE)' : 'Mchanganyiko wa sauti unatumika (en-US / sw-KE)'}
            </div>
          </div>
        </div>
      )}

      {/* 6. Toolkit board Sentence strip Modal */}
      {activeModal === 'toolkit-board' && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#FFF8EE] rounded-[32px] border-4 border-[#C77700] p-6 w-full max-w-2xl shadow-2xl relative text-[#2D3748] flex flex-col max-h-[90vh]">
            <button 
              onClick={() => setActiveModal(null)}
              className="absolute top-4 right-4 bg-gray-200 hover:bg-gray-300 text-gray-700 p-1.5 rounded-full cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <span className="text-[10px] font-bold text-[#2F6B4F] uppercase tracking-wider block">AAC Communication Strip</span>
              <h3 className="text-xl font-bold font-serif">{language === 'en' ? 'Construct Sentences' : 'Tengeneza Sentensi za Mawasiliano'}</h3>
              <p className="text-[11px] text-gray-500 mt-0.5">
                {language === 'en' ? 'Help children formulate statements by choosing a subject (action) and an object (need).' : 'Saidia watoto kuunda kauli kwa kuchagua mada (kitendo) na kitu (mahitaji).'}
              </p>
            </div>

            {/* Active Sentence Strip */}
            <div className="bg-white rounded-2xl p-4 border-2 border-[#2F6B4F] flex flex-wrap items-center justify-between gap-3 mb-6 min-h-[80px] shrink-0">
              <div className="flex items-center gap-3">
                {selectedSubject ? (
                  <div className="bg-[#2F6B4F]/10 border border-[#2F6B4F]/30 px-3 py-2 rounded-xl flex items-center gap-1.5">
                    <span className="text-lg">{selectedSubject.icon}</span>
                    <span className="text-xs font-black text-[#2F6B4F]">{language === 'en' ? selectedSubject.en : selectedSubject.swa}</span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-300 italic">{language === 'en' ? '[Choose Subject]' : '[Chagua Kitendo]'}</span>
                )}

                <span className="text-gray-400 font-bold">&rarr;</span>

                {selectedObject ? (
                  <div className="bg-[#C77700]/10 border border-[#C77700]/30 px-3 py-2 rounded-xl flex items-center gap-1.5">
                    <span className="text-lg">{selectedObject.icon}</span>
                    <span className="text-xs font-black text-[#C77700]">{language === 'en' ? selectedObject.en : selectedObject.swa}</span>
                  </div>
                ) : (
                  <span className="text-xs text-gray-300 italic">{language === 'en' ? '[Choose Object]' : '[Chagua Mahitaji]'}</span>
                )}
              </div>

              <div className="flex gap-2">
                <button 
                  disabled={!selectedSubject || !selectedObject}
                  onClick={playSentence}
                  className="bg-[#2F6B4F] hover:bg-[#1e4432] disabled:opacity-40 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{language === 'en' ? 'Speak' : 'Soma'}</span>
                </button>
                <button 
                  onClick={clearSentence}
                  className="bg-gray-100 hover:bg-gray-200 text-gray-500 px-3 py-2 rounded-xl text-xs font-bold"
                >
                  {language === 'en' ? 'Clear' : 'Futa'}
                </button>
              </div>
            </div>

            {/* Selection Area */}
            <div className="flex-1 overflow-y-auto space-y-6">
              {/* Part A: Subjects */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#2F6B4F] mb-3">{language === 'en' ? 'Step 1: Choose Action' : 'Hatua ya 1: Chagua Kitendo'}</h4>
                <div className="grid grid-cols-3 gap-3">
                  {subjects.map((sub, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setSelectedSubject(sub)}
                      className={`border-2 rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                        selectedSubject?.en === sub.en 
                          ? 'bg-[#2F6B4F]/10 border-[#2F6B4F]' 
                          : 'bg-white border-[#C77700]/10'
                      }`}
                    >
                      <span className="text-2xl mb-1.5">{sub.icon}</span>
                      <span className="text-xs font-bold">{language === 'en' ? sub.en : sub.swa}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Part B: Objects */}
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-widest text-[#C77700] mb-3">{language === 'en' ? 'Step 2: Choose Need' : 'Hatua ya 2: Chagua Mahitaji'}</h4>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {objects.map((obj, idx) => (
                    <div 
                      key={idx}
                      onClick={() => setSelectedObject(obj)}
                      className={`border-2 rounded-2xl p-3 flex flex-col items-center justify-center text-center cursor-pointer transition-all ${
                        selectedObject?.en === obj.en 
                          ? 'bg-[#C77700]/10 border-[#C77700]' 
                          : 'bg-white border-[#C77700]/10'
                      }`}
                    >
                      <span className="text-2xl mb-1.5">{obj.icon}</span>
                      <span className="text-xs font-bold">{language === 'en' ? obj.en : obj.swa}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Sensory room Breathing Space Modal */}
      {activeModal === 'toolkit-calm' && (
        <div className="fixed inset-0 bg-black/85 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="bg-[#1A2230] rounded-[32px] border-4 border-[#2F6B4F]/50 p-6 sm:p-8 w-full max-w-md shadow-2xl relative text-white flex flex-col items-center text-center">
            <button 
              onClick={() => {
                stopCalmSound();
                setActiveModal(null);
              }}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-1.5 rounded-full cursor-pointer transition-colors"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="mb-4">
              <span className="text-[9px] font-extrabold text-[#E89B2E] uppercase tracking-widest block">SENSORY COGNITIVE REGULATION</span>
              <h3 className="text-xl font-bold font-serif text-[#FFF8EE]">{language === 'en' ? 'Sensory Calming Space' : 'Chumba Tulivu cha Hisia'}</h3>
              <p className="text-[10px] text-gray-400 mt-1 max-w-xs">
                {language === 'en' ? 'Follow the circle rhythm. Breathe slow and steady to trigger calm sensory signals.' : 'Fuata mdundo wa mviringo. Pua taratibu kupunguza msisimko mkubwa wa hisia.'}
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
                <span className="text-[10px] font-bold block text-gray-300">{audioMuted ? (language === 'en' ? 'Ocean Hum Off' : 'Muziki Umezimwa') : (language === 'en' ? 'Soothing Wave Hum On' : 'Muziki unacheza')}</span>
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

            <div className="space-y-2 max-w-xs">
              <span className="text-[10px] text-gray-400 block font-bold tracking-widest uppercase">{language === 'en' ? 'Instruction Guide' : 'Mwongozo wa Hatua'}</span>
              <p className="text-xs text-gray-300 leading-relaxed">
                {language === 'en' 
                  ? 'Breathe deep into your stomach as the bubble grows. Hold for a moment, then exhale slowly as it shrinks.' 
                  : 'Vuta pumzi ndani kabisa ya tumbo Bubble linapokua. Shikilia kidogo, kisha toa pumzi taratibu linapopungua.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* ============= LUMO AI ASSISTANT CHAT PANEL ============= */}
      {/* ========================================================= */}
      
      {isLumoChatOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex justify-end backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#FFF8EE] h-full shadow-2xl flex flex-col border-l border-[#C77700]/20 animate-slide-in relative text-[#2D3748]">
            
            {/* Drawer Header */}
            <header className="px-6 py-4 border-b border-[#C77700]/10 flex items-center justify-between bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-full bg-[#2F6B4F] text-white flex items-center justify-center text-xs font-bold shadow-md relative">
                  L
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-green-500 border-2 border-white"></span>
                </div>
                <div>
                  <h3 className="font-bold font-serif text-sm">Lumo Assistant</h3>
                  <span className="text-[9px] uppercase font-bold tracking-widest text-[#2F6B4F] block">Autism Unmasked Expert</span>
                </div>
              </div>
              <button 
                onClick={() => setIsLumoChatOpen(false)}
                className="p-1.5 rounded-full bg-gray-100 hover:bg-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </header>

            {/* Chat Messages Log */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FFF8EE]">
              {lumoMessages.map((msg, index) => (
                <div 
                  key={index}
                  className={`flex flex-col max-w-[85%] ${
                    msg.role === 'user' ? 'ml-auto items-end' : 'mr-auto items-start'
                  }`}
                >
                  <div className={`p-4 rounded-3xl text-xs leading-relaxed whitespace-pre-line shadow-sm border ${
                    msg.role === 'user' 
                      ? 'bg-[#C77700] text-white border-[#C77700]' 
                      : 'bg-white text-[#2D3748] border-[#C77700]/10'
                  }`}>
                    {msg.text}
                  </div>
                  <span className="text-[8px] text-gray-400 font-bold tracking-wider mt-1 px-2 uppercase">{msg.time}</span>
                </div>
              ))}

              {isLumoTyping && (
                <div className="flex items-center gap-1.5 text-xs text-gray-400 font-bold px-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce"></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  <span className="ml-1 uppercase tracking-widest text-[9px]">Lumo is formulating reply...</span>
                </div>
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Suggested Quick Questions */}
            <div className="px-6 py-3 border-t border-[#C77700]/10 bg-white/70 space-y-1.5 shrink-0">
              <span className="text-[9px] font-extrabold uppercase tracking-widest text-gray-400 block mb-1">Suggested Questions</span>
              <div className="flex flex-col gap-1">
                <button 
                  onClick={() => handleLumoSendMessage(language === 'en' ? 'What are early signs of Autism?' : 'Dalili za mapema za Usonji ni zipi?')}
                  className="w-full text-left bg-[#FFF8EE] hover:bg-[#C77700]/10 border border-[#C77700]/10 px-3 py-1.5 rounded-xl text-[10px] font-bold text-[#2D3748] transition-colors cursor-pointer"
                >
                  ❓ {language === 'en' ? 'What are early signs of Autism?' : 'Dalili za mapema za Usonji ni zipi?'}
                </button>
                <button 
                  onClick={() => handleLumoSendMessage(language === 'en' ? 'Where can I find assessment centres in Kenya?' : 'Niko wapi vituo vya tathmini nchini Kenya?')}
                  className="w-full text-left bg-[#FFF8EE] hover:bg-[#C77700]/10 border border-[#C77700]/10 px-3 py-1.5 rounded-xl text-[10px] font-bold text-[#2D3748] transition-colors cursor-pointer"
                >
                  📍 {language === 'en' ? 'Where are assessment centres in Kenya?' : 'Niko wapi vituo vya tathmini nchini Kenya?'}
                </button>
                <button 
                  onClick={() => handleLumoSendMessage(language === 'en' ? 'Tell me about Autism Myths vs Facts in Kenya.' : 'Uongo na Ukweli kuhusu Usonji nchini Kenya')}
                  className="w-full text-left bg-[#FFF8EE] hover:bg-[#C77700]/10 border border-[#C77700]/10 px-3 py-1.5 rounded-xl text-[10px] font-bold text-[#2D3748] transition-colors cursor-pointer"
                >
                  ⚡ {language === 'en' ? 'Autism Myths vs Facts in Kenya' : 'Uongo na Ukweli kuhusu Usonji nchini Kenya'}
                </button>
              </div>
            </div>

            {/* Message Input Box */}
            <div className="p-4 border-t border-[#C77700]/10 bg-white shrink-0">
              <div className="flex gap-2">
                <input 
                  type="text"
                  placeholder={language === 'en' ? "Ask Lumo about Autism..." : "Uza Lumo kuhusu Usonji..."}
                  value={lumoInput}
                  onChange={(e) => setLumoInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleLumoSendMessage(lumoInput);
                    }
                  }}
                  className="bg-[#FFF8EE] border border-[#C77700]/25 rounded-2xl px-4 py-2.5 text-xs text-[#2D3748] focus:outline-none focus:border-[#2F6B4F] flex-1"
                />
                <button 
                  onClick={() => handleLumoSendMessage(lumoInput)}
                  className="bg-[#2F6B4F] hover:bg-[#1e4432] text-white p-2.5 rounded-2xl cursor-pointer transition-colors"
                  title="Send message"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[8px] text-gray-400 font-semibold text-center mt-2 tracking-widest uppercase">
                {language === 'en' ? 'Powered by Server-Side Gemini API' : 'Inaendeshwa na Gemini API ya Server'}
              </p>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
