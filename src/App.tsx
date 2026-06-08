import { useState, useEffect, useRef } from 'react';
import { 
  Users, 
  BookOpen, 
  HelpCircle, 
  HeartHandshake, 
  Search, 
  Plus, 
  Upload, 
  Volume2, 
  VolumeX, 
  Sparkles, 
  Calendar, 
  MapPin, 
  Send, 
  ExternalLink, 
  AlertTriangle, 
  FileText, 
  CheckCircle2, 
  Music,
  UserCheck,
  X,
  Clock,
  Mail,
  Smartphone
} from 'lucide-react';

// Interfaces for our Lost & Found Items
interface LostFoundItem {
  id: string;
  title: string;
  type: 'LOST' | 'FOUND';
  category: string;
  description: string;
  location: string;
  date: string;
  contact: string;
  contactMethod: string;
  image?: string; // Base64 or placeholder gradient
  resolved: boolean;
  reporterName: string;
}

// Interfaces for WAB Confidants (Important Contacts)
interface ContactPerson {
  role: string;
  name: string;
  contact: string;
  location: string;
  description: string;
  avail: string;
}

// Initial Preset Lost and Found Items
const INITIAL_ITEMS: LostFoundItem[] = [
  {
    id: 'p5-item-1',
    title: 'Limited Edition Tiger HydroFlask',
    type: 'FOUND',
    category: 'Bottles',
    description: 'Matte black 32oz bottle with multiple stickers including a WAB Tiger, school mascot logo, and high school track team emblem. Very cold water remaining.',
    location: 'HS Gym Back Row Bleachers',
    date: '2026-06-07',
    contact: 'hs_office@wab.edu',
    contactMethod: 'email',
    resolved: false,
    reporterName: 'Coach Marcus',
    image: '',
  },
  {
    id: 'p5-item-2',
    title: 'Apple AirPods Pro 2 Case only',
    type: 'LOST',
    category: 'Electronics',
    description: 'Slight scratch near the charger port. Name engraved on the back has been worn down but starts with W.',
    location: 'Atrium Cafeteria Seating Area',
    date: '2026-06-06',
    contact: 'william.z@student.wab.edu',
    contactMethod: 'email',
    resolved: false,
    reporterName: 'William Zhang',
    image: '',
  },
  {
    id: 'p5-item-3',
    title: 'TI-84 Plus CE Graphing Calculator',
    type: 'FOUND',
    category: 'School Supplies',
    description: 'Pink pastel casing. Has custom programs in the memory, and batteries are fully charged.',
    location: 'HS Math Wing Room 2209',
    date: '2026-06-05',
    contact: 'y_noodle_wab',
    contactMethod: 'wechat',
    resolved: false,
    reporterName: 'Yuki Sato',
    image: '',
  },
  {
    id: 'p5-item-4',
    title: 'WAB ID Card Cardholder',
    type: 'LOST',
    category: 'Keys/IDs',
    description: 'Transparent red lanyard with my library receipt inside. Crucial for entering transit gate, please reach out as soon as possible!',
    location: 'Bus Parking Area or Main Bridge',
    date: '2026-06-04',
    contact: 'sophia.g28@student.wab.edu',
    contactMethod: 'email',
    resolved: false,
    reporterName: 'Sophia G.',
    image: '',
  }
];

// Presets for Contacts / Confidants
const WAB_CONFIDANTS: ContactPerson[] = [
  {
    role: "High School Counselor (Grade 9-10)",
    name: "Dr. David Sterling",
    contact: "dsterling@wab.edu",
    location: "HS Office, Room 2101",
    description: "Support for academic pacing, emotional wellness counseling, and high school transition calibration.",
    avail: "Mon-Fri: 8:00 AM - 4:00 PM"
  },
  {
    role: "High School Counselor (Grade 11-12)",
    name: "Ms. Michelle Zhang",
    contact: "mzhang@wab.edu",
    location: "HS Office, Room 2102",
    description: "University counseling advisor, standardized exam registration, career planning, and stress navigation.",
    avail: "Mon-Fri: 8:00 AM - 4:30 PM"
  },
  {
    role: "Wab HS Librarian & Media Specialist",
    name: "Mrs. Sarah Cooper",
    contact: "hs_library@wab.edu",
    location: "HS Library Center Level 2",
    description: "Master of citation records, academic database passwords generator, and creative media workspace layout guide.",
    avail: "Mon-Fri: 7: 45 AM - 5:00 PM"
  },
  {
    role: "Tech Support & Helpdesk Admin",
    name: "Mr. Linus Jin",
    contact: "helpdesk@wab.edu",
    location: "IT Innovation Center Room 1104",
    description: "Resolves Wi-Fi configurations, VPN certificates, TigerPortal account lockouts, and MacBook hardware claims.",
    avail: "Mon-Fri: 8:00 AM - 4:30 PM"
  },
  {
    role: "HS Nurse & Emergency Officer",
    name: "Nurse Linda",
    contact: "nurse@wab.edu",
    location: "Main Gymnasium Lobby Office",
    description: "Allergy records registration, temporary health cards, ibuprofen access, and emergency triage support.",
    avail: "Daily: 7:45 AM - 6:00 PM"
  }
];

export default function App() {
  // Page States
  const [showIntro, setShowIntro] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<'hub' | 'lostfound'>('hub');
  
  // Custom interactive level/rank system to incentivize onboarding!
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);
  const [confidantRank, setConfidantRank] = useState<number>(1);
  const [showRankUp, setShowRankUp] = useState<boolean>(false);
  const [lastRankUpName, setLastRankUpName] = useState<string>('');

  // Lost & Found states
  const [items, setItems] = useState<LostFoundItem[]>(() => {
    const saved = localStorage.getItem('wab_lost_found_items');
    return saved ? JSON.parse(saved) : INITIAL_ITEMS;
  });
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedType, setSelectedType] = useState<'ALL' | 'LOST' | 'FOUND'>('ALL');
  
  // Modal / details popup states
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  const [selectedDetailItem, setSelectedDetailItem] = useState<LostFoundItem | null>(null);
  
  // Form submission state
  const [newTitle, setNewTitle] = useState<string>('');
  const [newType, setNewType] = useState<'LOST' | 'FOUND'>('LOST');
  const [newCategory, setNewCategory] = useState<string>('Electronics');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newLocation, setNewLocation] = useState<string>('');
  const [newContact, setNewContact] = useState<string>('');
  const [newContactMethod, setNewContactMethod] = useState<string>('email');
  const [newReporterName, setNewReporterName] = useState<string>('');
  const [newImage, setNewImage] = useState<string>('');
  const [formError, setFormError] = useState<string>('');
  
  // Detail popup drawers for primary navigation
  const [openNavDrawer, setOpenNavDrawer] = useState<'counsel' | 'library' | 'tech' | 'service' | 'contacts' | null>(null);
  
  // Audio state
  const [audioPlaying, setAudioPlaying] = useState<boolean>(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const synthNodesRef = useRef<{ osc1: OscillatorNode; osc2: OscillatorNode; gainNode: GainNode } | null>(null);
  // Track system status
  const [systemClock, setSystemClock] = useState<string>('');

  // Set system clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setSystemClock(now.toLocaleTimeString('en-US', { hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Save to local storage on changes
  useEffect(() => {
    localStorage.setItem('wab_lost_found_items', JSON.stringify(items));
  }, [items]);

  // Handle completed onboarding steps
  const completeStep = (stepId: string, label: string) => {
    if (!completedTasks.includes(stepId)) {
      const updated = [...completedTasks, stepId];
      setCompletedTasks(updated);
      
      // Every 2 items builds 1 rank level! Max 5 rank
      const newCalcRank = Math.min(5, 1 + Math.floor(updated.length / 2));
      if (newCalcRank > confidantRank) {
        setConfidantRank(newCalcRank);
        setLastRankUpName(label);
        setShowRankUp(true);
        // Play beep sound if browser permits
        playNotificationBeep(600, 0.15);
        setTimeout(() => {
          playNotificationBeep(900, 0.3);
        }, 150);
        
        // Auto dismiss rankup popup after 5 seconds
        setTimeout(() => {
          setShowRankUp(false);
        }, 4000);
      } else {
        playNotificationBeep(520, 0.1);
      }
    }
  };

  // Safe Web Audio API synthesizer setting a cool low-key bass-chord loop
  const p5Chords = [
    { freq1: 110, freq2: 220 }, // A (deep)
    { freq1: 146.83, freq2: 293.66 }, // D
    { freq1: 130.81, freq2: 261.63 }, // C
    { freq1: 164.81, freq2: 329.63 }  // E
  ];
  let chordIndex = 0;
  let synthInterval: any = null;

  const playNotificationBeep = (freq: number, duration: number) => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Audio blocked or unsupported
    }
  };

  const startBackgroundSynth = () => {
    if (audioPlaying) {
      // Stop the sound
      try {
        if (synthNodesRef.current) {
          synthNodesRef.current.osc1.stop();
          synthNodesRef.current.osc2.stop();
        }
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
      } catch (err) {}
      audioContextRef.current = null;
      synthNodesRef.current = null;
      setAudioPlaying(false);
      return;
    }

    try {
      // Create Web Audio Context
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      audioContextRef.current = ctx;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      // Configure Oscillator as vintage warm square/triangle wave
      osc1.type = 'triangle';
      osc2.type = 'sine';

      // Set nice smooth low chords (frequency map of P5 style vibe)
      osc1.frequency.setValueAtTime(110, ctx.currentTime); // A2 Bass
      osc2.frequency.setValueAtTime(220, ctx.currentTime); // A3 Tenor

      gainNode.gain.setValueAtTime(0.06, ctx.currentTime); // safe humble volume

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start();
      osc2.start();

      synthNodesRef.current = { osc1, osc2, gainNode };
      setAudioPlaying(true);

      // Low level chord lofi modulation index
      const intervalId = setInterval(() => {
        if (!audioContextRef.current || ctx.state === 'closed') {
          clearInterval(intervalId);
          return;
        }
        chordIndex = (chordIndex + 1) % p5Chords.length;
        const currentChord = p5Chords[chordIndex];
        try {
          osc1.frequency.rampToValueAtTime(currentChord.freq1, ctx.currentTime + 1.2);
          osc2.frequency.rampToValueAtTime(currentChord.freq2, ctx.currentTime + 1.2);
        } catch (e) {}
      }, 4000);

    } catch (e) {
      console.warn('Audio Context start failed', e);
    }
  };

  // Convert uploaded image file to standard base64 for offline local rendering!
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setFormError('File too large. Limits are set at 2MB to operate in state.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewImage(reader.result as string);
      };
      reader.onerror = () => {
        setFormError('Failed reading selected image file.');
      };
      reader.readAsDataURL(file);
    }
  };

  // Submit new Lost / Found Item
  const handleItemSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) {
      setFormError('Please input a valid item label / name.');
      return;
    }
    if (!newLocation.trim()) {
      setFormError('Please define the specific location on campus.');
      return;
    }
    if (!newContact.trim() || !newReporterName.trim()) {
      setFormError('Reporter details are critical for claiming coordinate handovers.');
      return;
    }

    const createdItem: LostFoundItem = {
      id: `custom-p5-${Date.now()}`,
      title: newTitle,
      type: newType,
      category: newCategory,
      description: newDescription || 'No additional characteristics listed by reporter.',
      location: newLocation,
      date: new Date().toISOString().split('T')[0],
      contact: newContact,
      contactMethod: newContactMethod,
      reporterName: newReporterName,
      image: newImage || undefined,
      resolved: false
    };

    setItems([createdItem, ...items]);
    
    // Clear Form inputs
    setNewTitle('');
    setNewDescription('');
    setNewLocation('');
    setNewContact('');
    setNewReporterName('');
    setNewImage('');
    setFormError('');
    setShowAddModal(false);

    // Give Onboarding credits
    completeStep('post_lost_found', 'Lost/Found Reporting');
  };

  // Resolve item status toggle
  const toggleResolveItem = (itemId: string) => {
    setItems(items.map(item => {
      if (item.id === itemId) {
        const toggledResolved = !item.resolved;
        if (toggledResolved) {
          playNotificationBeep(880, 0.2);
        }
        return { ...item, resolved: toggledResolved };
      }
      return item;
    }));
    if (selectedDetailItem?.id === itemId) {
      setSelectedDetailItem(prev => prev ? { ...prev, resolved: !prev.resolved } : null);
    }
    completeStep('resolve_item', 'Treasure Claims');
  };

  // Filter conditions
  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.reporterName.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesType = selectedType === 'ALL' || item.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  const categories = ['ALL', 'Electronics', 'Bottles', 'Clothing', 'Keys/IDs', 'School Supplies', 'Bags', 'Other'];

  return (
    <div id="p5-app-root" className="min-h-screen text-white flex flex-col font-sans selection:bg-[#ff3333] selection:text-white pb-16 relative">
      
      {/* INTRO SCREEN - Calling Card Animation */}
      {showIntro && (
        <div id="intro-splash-screen" className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center p-4">
          <div className="absolute inset-0 bg-repeat bg-center opacity-10" style={{ backgroundImage: 'radial-gradient(#ffe600 2px, transparent 2px)', backgroundSize: '16px 16px' }}></div>
          
          {/* Slashed banner */}
          <div className="w-full max-w-2xl transform rotate-[-4deg] relative bg-[#ffe600] text-black p-6 md:p-10 border-4 border-black shadow-[8px_8px_0px_#ff3333] transition-all duration-300">
            <div className="absolute -top-8 left-12 bg-black text-[#ffe600] text-sm px-3 py-1 font-mono tracking-widest font-bold">
              SYSTEM INITIALIZATION // WAB
            </div>
            
            <h1 className="text-4xl md:text-6xl font-black italic tracking-tighter text-center uppercase font-impact select-none">
              <span className="bg-black text-[#ffe600] px-2 py-1 inline-block transform rotate-[-1deg] mr-2">TIGER</span> 
              <span className="bg-red-600 text-white px-2 py-1 inline-block transform rotate-[2deg]">NAVIGATOR</span>
            </h1>
            
            <p className="mt-4 text-center font-bold tracking-widest text-sm md:text-base font-mono">
              WESTERN ACADEMY OF BEIJING • CAMPUS HUB v1.08
            </p>
          </div>

          <p className="mt-12 text-[#ffe600] font-mono tracking-widest text-xs md:text-sm animate-pulse text-center max-w-md bg-zinc-900 border border-zinc-800 p-2 transform rotate-[1deg]">
            ★ EXPLORE CAMPUS RESOURCES • ACQUIRE SCHOOL INSIGHTS ★
          </p>

          <button
            id="enter-system-btn"
            onClick={() => {
              setShowIntro(false);
              playNotificationBeep(700, 0.45);
            }}
            className="mt-8 bg-red-600 hover:bg-[#ffe600] hover:text-black hover:scale-105 active:scale-95 text-white font-black text-xl px-12 py-4 border-4 border-white tracking-widest uppercase transition-all duration-200 transform skew-x-[-12deg]"
          >
            ENTER THE PORTAL ◆ START HUB
          </button>
          
          <div className="absolute bottom-6 font-mono text-zinc-600 text-xs">
            © WAB HIGH SCHOOL STUDENT ASSISTANT ALLIANCE
          </div>
        </div>
      )}

      {/* DYNAMIC RANK UP BANNER SCREEN */}
      {showRankUp && (
        <div id="rankup-overlay" className="fixed top-0 inset-x-0 z-40 bg-red-600 text-white p-6 border-b-8 border-[#ffe600] shadow-2xl flex flex-col items-center justify-center animate-bounce duration-500">
          <div className="absolute top-2 right-2">
            <button onClick={() => setShowRankUp(false)} className="text-white hover:text-[#ffe600] p-1">
              <X size={24} />
            </button>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-black p-3 border-2 border-white transform rotate-[5deg] shadow-lg">
              <span className="text-[#ffe600] font-impact text-4xl block animate-pulse">LEVEL UP!</span>
            </div>
            <div>
              <p className="text-[#ffe600] text-xs font-mono uppercase tracking-widest font-black">
                ★ WAB ONBOARDING PROGRESS LOGGED ★
              </p>
              <h2 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter">
                CAMPUS KNOWLEDGE RATING: <span className="bg-black text-[#ffe600] px-3 py-0.5 rounded ml-1">LV.{confidantRank}</span>
              </h2>
              <p className="text-white text-sm mt-1 font-mono">
                Explored resource segment: <span className="underline font-bold text-[#ffe600]">{lastRankUpName}</span>. Discover more directory items to raise your score!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TOP DECORATIVE HEADER STRIP */}
      <div id="p5-meta-header" className="bg-[#121215] border-b-4 border-black text-zinc-400 text-xs font-mono px-4 py-2 flex flex-wrap justify-between items-center gap-2 relative z-30">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse"></span>
          <span className="text-[#ffe600] font-bold">WAB-NET CLIENT</span> | LOCATION: <span className="text-white">BEIJING, CN (WAB CAMPUS)</span> | ENVIRONMENT: SECURE
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1 bg-[#22222a] px-2 py-0.5 text-white">
            <Clock size={12} className="text-[#ffe600]" />
            <span>DATE: 2026-06-08</span>
          </div>
          <div className="bg-[#ffe600] text-black px-2 py-0.5 font-bold flex items-center gap-1 transform rotate-[-1deg]">
            <span className="animate-pulse">★</span>
            <span className="tracking-tight uppercase">CAMPUS RADAR: LIVE</span>
          </div>
        </div>
      </div>

      {/* MAIN RED HERO STRIPE */}
      <header id="p5-branding-band" className="p-4 bg-black border-b-[6px] border-[#ffe600] relative overflow-hidden z-20 shadow-[0_10px_20px_rgba(0,0,0,0.5)]">
        {/* Slanted red background box */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-red-600 transform skew-x-[-30deg] translate-x-24 -translate-y-4 opacity-75 hidden md:block"></div>
        {/* Slanted pattern lines */}
        <div className="absolute inset-0 bg-contain bg-right opacity-10 mix-blend-color-dodge" style={{ backgroundImage: "linear-gradient(45deg, #ffe600 25%, transparent 25%, transparent 50%, #ffe600 50%, #ffe600 75%, transparent 75%, transparent)" }}></div>
        
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center relative z-10 gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="bg-[#ffe600] text-black px-1.5 py-0.2 text-[10px] font-black tracking-widest inline-block uppercase transform rotate-[-2deg]">
                EST. 1994
              </span>
              <span className="text-zinc-500 text-xs font-bold tracking-wider">WESTERN ACADEMY OF BEIJING</span>
            </div>
            
            <h1 className="text-3xl md:text-5xl font-extrabold italic tracking-tighter text-black uppercase font-impact flex flex-wrap items-center">
              <span className="bg-[#ffe600] text-black px-3 py-1 mr-2 inline-block transform skew-y-[-2deg] shadow-[4px_4px_0px_#ff3333]">
                WAB 
              </span>
              <span className="text-white px-2 py-1 inline-block transform skew-y-2 relative bg-zinc-900 shadow-[4px_4px_0px_#ffe600]">
                TIGER NAVIGATOR
              </span>
              <span className="text-zinc-400 text-xs md:text-sm font-mono tracking-widest pl-2 block md:inline normal-case">
                // High School Student Portal & Lost-Found Index
              </span>
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Retro Cassette Controller widget */}
            <div className="bg-[#121215] border-2 border-zinc-700 p-2 rounded-lg flex items-center gap-3 w-full sm:w-auto">
              {/* Spinning tape reels simulation */}
              <div id="cassette-tape-widget" onClick={startBackgroundSynth} className="cursor-pointer relative w-12 h-8 bg-zinc-900 border border-zinc-700 rounded flex items-center justify-around overflow-hidden group">
                <div className={`w-3.5 h-3.5 rounded-full border border-dashed border-[#ffe600] ${audioPlaying ? 'animate-spin duration-3000' : ''} flex items-center justify-center`}>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
                <div className={`w-3.5 h-3.5 rounded-full border border-dashed border-[#ffe600] ${audioPlaying ? 'animate-spin duration-3000' : ''} flex items-center justify-center`}>
                  <div className="w-1 h-1 bg-white rounded-full"></div>
                </div>
                <div className="absolute bottom-0 text-[6px] text-zinc-500 font-mono tracking-tighter w-full text-center bg-black bg-opacity-70">
                  {audioPlaying ? 'TRACK ON' : 'LO-FI MUTE'}
                </div>
              </div>

              <div id="music-text-label">
                <p className="text-[10px] text-zinc-500 font-mono leading-none">AMBIENT CONSOLE</p>
                <p className="text-xs font-bold text-white tracking-tight flex items-center gap-1 leading-normal">
                  <Music size={12} className="text-[#ffe600]" />
                  <span>Calm Campus Harmony Chords</span>
                </p>
                <p className="text-[9px] text-[#ffe600] font-mono leading-none flex items-center gap-1">
                  {audioPlaying ? (
                    <>
                      <Volume2 size={10} /> Live custom synthesizer waves
                    </>
                  ) : (
                    <>
                      <VolumeX size={10} /> Tap tape block to play ambient sound
                    </>
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* NAVIGATION TABS SELECTOR (PERSONA COMIC LAYOUT STYLE) */}
      <div id="p5-tabs-container" className="max-w-7xl mx-auto w-full px-4 mt-6 grid grid-cols-2 gap-3 z-10">
        <button
          id="tab-hub-navigation"
          onClick={() => {
            setActiveTab('hub');
            playNotificationBeep(440, 0.15);
          }}
          className={`relative group overflow-hidden border-4 py-3 md:py-4 px-4 font-black tracking-widest text-lg md:text-xl transition-all duration-200 transform ${
            activeTab === 'hub'
              ? 'bg-[#ffe600] text-black border-black -translate-y-1 shadow-[5px_5px_0px_#ff3333]'
              : 'bg-zinc-900 text-[#ffe600] border-[#33333f] opacity-80 hover:opacity-100'
          } skew-x-[-10deg] flex items-center justify-center gap-2`}
        >
          {/* Slanted hover decoration */}
          <span className="absolute inset-y-0 left-0 w-2 bg-red-600 group-hover:w-4 transition-all duration-300"></span>
          <BookOpen className="transform skew-x-[10deg]" size={20} />
          <span className="transform skew-x-[10deg] italic uppercase font-impact tracking-normal">
            WAB STUDENT INFORMATION HUB
          </span>
        </button>

        <button
          id="tab-lostfound-navigation"
          onClick={() => {
            setActiveTab('lostfound');
            playNotificationBeep(554, 0.15);
          }}
          className={`relative group overflow-hidden border-4 py-3 md:py-4 px-4 font-black tracking-widest text-lg md:text-xl transition-all duration-200 transform ${
            activeTab === 'lostfound'
              ? 'bg-[#ffe600] text-black border-black -translate-y-1 shadow-[5px_5px_0px_#ff3333]'
              : 'bg-zinc-900 text-[#ffe600] border-[#33333f] opacity-80 hover:opacity-100'
          } skew-x-[10deg] flex items-center justify-center gap-2`}
        >
          {/* Slanted hover decoration */}
          <span className="absolute inset-y-0 right-0 w-2 bg-red-600 group-hover:w-4 transition-all duration-300"></span>
          <Search className="transform skew-x-[-10deg]" size={20} />
          <span className="transform skew-x-[-10deg] italic uppercase font-impact tracking-normal">
            HIGH SCHOOL LOST & FOUND
          </span>
        </button>
      </div>

      {/* MAIN CONTAINER AREA */}
      <main className="max-w-7xl mx-auto w-full px-4 mt-6 flex-1 z-10">

        {/* ===================================== TAB 1: HUB & QUICK ONBOARDING LINKS ===================================== */}
        {activeTab === 'hub' && (
          <div id="hub-view-wrapper" className="space-y-8">
            
            {/* Quick Onboarding Tracker & Character Level banner */}
            <section id="onboarding-tracker-card" className="bg-[#15151b] border-2 border-[#ff3333] p-6 rounded-lg relative overflow-hidden shadow-[4px_4px_12px_rgba(0,0,0,0.6)]">
              {/* Back decorative stars */}
              <div className="absolute top-2 right-4 text-[#ffe600] text-3xl font-bold font-mono select-none opacity-20">
                ★★★★★
              </div>
              
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 relative z-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-[#ff3333] text-white text-xs px-2 py-0.5 rounded font-bold tracking-widest uppercase">
                      STUDENT PROTOCOL
                    </span>
                    <span className="text-zinc-500 font-mono text-xs">COMMUNITY EXPLORATION BOARD</span>
                  </div>
                  
                  <h3 className="text-2xl font-black tracking-tight text-[#ffe600] uppercase font-impact italic">
                    CAMPUS KNOWLEDGE RATING: <span className="bg-white text-black text-xl px-2.5 py-0.5 rounded ml-1 font-black">Lvl {confidantRank} / 5</span>
                  </h3>
                  <p className="text-zinc-400 text-sm mt-1 max-w-xl">
                    WAB High School is energetic, large, and highly diverse. Visited sections are logged locally to track your exploration of key campus resources.
                  </p>
                </div>

                {/* Level Up Progress Checklist */}
                <div id="onboarding-checklist-box" className="w-full lg:max-w-md bg-black bg-opacity-80 p-4 border border-zinc-800 rounded">
                  <p className="text-[#ffe600] text-xs font-mono tracking-wider font-bold mb-3 uppercase flex items-center gap-1.5">
                    <Sparkles size={14} className="text-[#ffe600]" /> 
                    Exploration Checklist Status: ({completedTasks.length} / 5)
                  </p>
                  
                  <div className="space-y-2 text-xs font-mono">
                    <div className="flex items-center justify-between p-1.5 bg-zinc-900 rounded hover:bg-zinc-800 transition-all">
                      <span className="text-zinc-300">1. Consult counselor hours & services</span>
                      {completedTasks.includes('check_counselor') ? (
                        <span className="text-[#ffe600] uppercase text-[10px] font-bold">★ MET</span>
                      ) : (
                        <button
                          onClick={() => {
                            setOpenNavDrawer('counsel');
                            completeStep('check_counselor', 'Counseling Services');
                          }}
                          className="bg-red-600 text-white px-2 py-0.5 text-[9px] uppercase hover:bg-yellow-500 hover:text-black font-bold"
                        >
                          Unlock Project
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-1.5 bg-zinc-900 rounded hover:bg-zinc-800 transition-all">
                      <span className="text-zinc-300">2. Inspect library LibGuides resource index</span>
                      {completedTasks.includes('check_library') ? (
                        <span className="text-[#ffe600] uppercase text-[10px] font-bold">★ MET</span>
                      ) : (
                        <button
                          onClick={() => {
                            setOpenNavDrawer('library');
                            completeStep('check_library', 'Library Help Center');
                          }}
                          className="bg-red-600 text-white px-2 py-0.5 text-[9px] uppercase hover:bg-yellow-500 hover:text-black font-bold"
                        >
                          Unlock Project
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-1.5 bg-zinc-900 rounded hover:bg-zinc-800 transition-all">
                      <span className="text-zinc-300">3. Learn how to configure campus Wi-Fi & VPN</span>
                      {completedTasks.includes('check_tech') ? (
                        <span className="text-[#ffe600] uppercase text-[10px] font-bold">★ MET</span>
                      ) : (
                        <button
                          onClick={() => {
                            setOpenNavDrawer('tech');
                            completeStep('check_tech', 'IT Tech Support');
                          }}
                          className="bg-red-600 text-white px-2 py-0.5 text-[9px] uppercase hover:bg-yellow-500 hover:text-black font-bold"
                        >
                          Unlock Project
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-1.5 bg-zinc-900 rounded hover:bg-zinc-800 transition-all">
                      <span className="text-zinc-300">4. File or claim an item at Lost & Found</span>
                      {completedTasks.includes('post_lost_found') ? (
                        <span className="text-[#ffe600] uppercase text-[10px] font-bold">★ MET</span>
                      ) : (
                        <button
                          onClick={() => {
                            setActiveTab('lostfound');
                            setShowAddModal(true);
                          }}
                          className="bg-zinc-700 text-white px-2 py-0.5 text-[9px] uppercase hover:bg-[#ffe600] hover:text-black font-bold"
                        >
                          Navigate
                        </button>
                      )}
                    </div>

                    <div className="flex items-center justify-between p-1.5 bg-zinc-900 rounded hover:bg-zinc-800 transition-all">
                      <span className="text-zinc-300">5. Review STUCO student groups directory</span>
                      {completedTasks.includes('check_service') ? (
                        <span className="text-[#ffe600] uppercase text-[10px] font-bold">★ MET</span>
                      ) : (
                        <button
                          onClick={() => {
                            setOpenNavDrawer('service');
                            completeStep('check_service', 'Service Alliance');
                          }}
                          className="bg-red-600 text-white px-2 py-0.5 text-[9px] uppercase hover:bg-yellow-500 hover:text-black font-bold"
                        >
                          Unlock Project
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Level text indicator */}
                  <div className="mt-3 flex items-center justify-between text-[11px] font-mono border-t border-zinc-800 pt-2 text-zinc-400">
                    <span>STATUS: {confidantRank === 5 ? "MAX LEVEL EXPLORER (CAMPUS EXPERT)" : "ONBOARDING IN PROGRESS..."}</span>
                    <span className="text-[#ffe600] font-bold">★ {Math.round((completedTasks.length / 5) * 100)}% COMPLETE</span>
                  </div>
                </div>
              </div>
            </section>

            {/* STATION NAVIGATION (P5 JAGGED STYLE CARDS INTERACTIVE SELECTION GRID) */}
            <div>
              <div id="nav-section-title" className="inline-block transform rotate-[-1deg] bg-[#ffe600] text-black font-black italic uppercase px-4 py-2 font-impact tracking-wider text-xl mb-6 shadow-[5px_5px_0px_#ff3333]">
                ◆ GENERAL CAMPUS RESOURCE DIRECTORY ◆
              </div>

              <div id="services-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                
                {/* 1. COUNSELING SERVICES */}
                <div id="service-card-counseling" className="group relative bg-[#121215] border-4 border-zinc-800 hover:border-[#ff3333] transition-all duration-200 overflow-hidden rounded-lg shadow-lg flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-600 opacity-10 transform skew-y-12"></div>
                  <div className="p-6 relative z-10">
                    <div className="inline-block bg-[#ff3333] text-white font-mono text-xs font-bold px-2 py-0.5 rounded transform rotate-[-2deg] mb-3">
                      PSYCHE WELLNESS
                    </div>
                    <h4 className="text-2xl font-black italic tracking-tighter text-[#ffe600] font-impact uppercase leading-tight">
                      Counseling & Welfare
                    </h4>
                    <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                      Welfare counseling guides, stress relief strategies, and direct scheduling connections to WAB's counselling faculty.
                    </p>
                  </div>
                  <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex justify-between items-center group-hover:bg-[#ff3333] group-hover:text-white transition-all">
                    <span className="text-zinc-500 text-xs font-mono group-hover:text-zinc-100">WAB COUNSELING SUITE</span>
                    <button
                      onClick={() => {
                        setOpenNavDrawer('counsel');
                        completeStep('check_counselor', 'Counseling Services');
                      }}
                      className="text-[#ffe600] font-bold text-xs font-mono tracking-wider italic hover:underline flex items-center gap-1 group-hover:text-white"
                    >
                      ENTER CARD ◆
                    </button>
                  </div>
                </div>

                {/* 2. LIBRARY WEB ARCHIVES */}
                <div id="service-card-library" className="group relative bg-[#121215] border-4 border-zinc-800 hover:border-[#ffe600] transition-all duration-200 overflow-hidden rounded-lg shadow-lg flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500 opacity-10 transform -skew-y-12"></div>
                  <div className="p-6 relative z-10">
                    <div className="inline-block bg-[#ffe600] text-black font-mono text-xs font-bold px-2 py-0.5 rounded transform rotate-[3deg] mb-3">
                      ACADEMIC ARCHIVES
                    </div>
                    <h4 className="text-2xl font-black italic tracking-tighter text-[#ffe600] font-impact uppercase leading-tight">
                      Library Help Center
                    </h4>
                    <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                      Research guides, password lists for academic databases, and virtual media specialist contact details.
                    </p>
                  </div>
                  <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex justify-between items-center group-hover:bg-[#ffe600] group-hover:text-black transition-all">
                    <span className="text-zinc-500 text-xs font-mono group-hover:text-zinc-800">LIBGUIDES SEARCH PORTAL</span>
                    <button
                      onClick={() => {
                        setOpenNavDrawer('library');
                        completeStep('check_library', 'Library Help Center');
                      }}
                      className="text-[#ffe600] font-bold text-xs font-mono tracking-wider italic hover:underline flex items-center gap-1 group-hover:text-black"
                    >
                      ENTER CARD ◆
                    </button>
                  </div>
                </div>

                {/* 3. TECH ACTION SUPPORT */}
                <div id="service-card-tech" className="group relative bg-[#121215] border-4 border-zinc-800 hover:border-[#ff3333] transition-all duration-200 overflow-hidden rounded-lg shadow-lg flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-600 opacity-10 transform skew-y-6"></div>
                  <div className="p-6 relative z-10">
                    <div className="inline-block bg-[#ff3333] text-white font-mono text-xs font-bold px-2 py-0.5 rounded transform rotate-[-1deg] mb-3">
                      IT SUPPORT
                    </div>
                    <h4 className="text-2xl font-black italic tracking-tighter text-[#ffe600] font-impact uppercase leading-tight">
                      Tech Support & Wi-Fi
                    </h4>
                    <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                      Student MacBook configurations, school network authentication instructions, and campus Wi-Fi helpdesk resources.
                    </p>
                  </div>
                  <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex justify-between items-center group-hover:bg-[#ff3333] group-hover:text-white transition-all">
                    <span className="text-zinc-500 text-xs font-mono group-hover:text-zinc-200">IT HELP DESK RECORD</span>
                    <button
                      onClick={() => {
                        setOpenNavDrawer('tech');
                        completeStep('check_tech', 'IT Tech Support');
                      }}
                      className="text-[#ffe600] font-bold text-xs font-mono tracking-wider italic hover:underline flex items-center gap-1 group-hover:text-white"
                    >
                      ENTER CARD ◆
                    </button>
                  </div>
                </div>

                {/* 4. SERVICE ALLIANCES AND CLUBS */}
                <div id="service-card-service" className="group relative bg-[#121215] border-4 border-zinc-800 hover:border-[#ffe600] transition-all duration-200 overflow-hidden rounded-lg shadow-lg flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-yellow-500 opacity-10 transform -skew-y-6"></div>
                  <div className="p-6 relative z-10">
                    <div className="inline-block bg-[#ffe600] text-black font-mono text-xs font-bold px-2 py-0.5 rounded transform rotate-[2deg] mb-3">
                      CAMPUS CLUBS
                    </div>
                    <h4 className="text-2xl font-black italic tracking-tighter text-[#ffe600] font-impact uppercase leading-tight">
                      Service Groups & STUCO
                    </h4>
                    <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                      Directory of active extracurricular service groups, charity links, student council reports, and start guidelines.
                    </p>
                  </div>
                  <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex justify-between items-center group-hover:bg-[#ffe600] group-hover:text-black transition-all">
                    <span className="text-zinc-500 text-xs font-mono group-hover:text-zinc-800">STUDENT INITIATIVES</span>
                    <button
                      onClick={() => {
                        setOpenNavDrawer('service');
                        completeStep('check_service', 'Service Alliance');
                      }}
                      className="text-[#ffe600] font-bold text-xs font-mono tracking-wider italic hover:underline flex items-center gap-1 group-hover:text-black"
                    >
                      ENTER CARD ◆
                    </button>
                  </div>
                </div>

                {/* 5. CAMPUS CONFIDANTS (DIRECT CONTACT DIRECTORY) */}
                <div id="service-card-contacts" className="group relative bg-[#121215] border-4 border-zinc-800 hover:border-[#ff3333] transition-all duration-200 overflow-hidden rounded-lg shadow-lg flex flex-col justify-between">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-red-600 opacity-10 transform skew-y-12"></div>
                  <div className="p-6 relative z-10">
                    <div className="inline-block bg-[#ff3333] text-white font-mono text-xs font-bold px-2 py-0.5 rounded transform rotate-[-3deg] mb-3">
                      DIRECTORY
                    </div>
                    <h4 className="text-2xl font-black italic tracking-tighter text-[#ffe600] font-impact uppercase leading-tight">
                      Key Contacts & Staff
                    </h4>
                    <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
                      Interactive school email directory covering primary high school admin desks, athletic leagues, and counselors.
                    </p>
                  </div>
                  <div className="p-4 bg-zinc-900 border-t border-zinc-800 flex justify-between items-center group-hover:bg-[#ff3333] group-hover:text-white transition-all">
                    <span className="text-zinc-500 text-xs font-mono group-hover:text-zinc-100">CAMPUS ROSTER GUIDES</span>
                    <button
                      onClick={() => {
                        setOpenNavDrawer('contacts');
                        // Complete a minor tracking step
                        completeStep('check_contacts', 'High School Directory');
                      }}
                      className="text-[#ffe600] font-bold text-xs font-mono tracking-wider italic hover:underline flex items-center gap-1 group-hover:text-white"
                    >
                      ENTER CARD ◆
                    </button>
                  </div>
                </div>

                {/* 6. BONUS LOST AND FOUND GATEWAY */}
                <div id="service-card-lostfound-gateway" className="group relative bg-[#1e1414] border-4 border-dashed border-[#ff3333] hover:border-[#ffe600] hover:bg-black transition-all duration-200 overflow-hidden rounded-lg shadow-lg flex flex-col justify-between">
                  <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-[#ffe600] opacity-10 transform rotate-12"></div>
                  <div className="p-6 relative z-10">
                    <div className="inline-block bg-black text-[#ffe600] border border-[#ff3333] font-mono text-xs font-bold px-2 py-0.5 rounded mb-3">
                      RECENT REPORTS
                    </div>
                    <h4 className="text-2xl font-black italic tracking-tighter text-white font-impact uppercase leading-tight">
                      Lost & Found Index
                    </h4>
                    <p className="text-zinc-300 text-sm mt-2 leading-relaxed">
                      Did you drop a calculator, water bottle, AirPods, or keys? High school student registry to claim lost possessions or log reported findings.
                    </p>
                  </div>
                  <div className="p-4 bg-[#ff3333] bg-opacity-25 flex justify-between items-center group-hover:bg-[#ffe600] group-hover:text-black transition-all">
                    <span className="text-[#ffe600] text-xs font-mono font-bold group-hover:text-zinc-950">({items.filter(i => !i.resolved).length} UNCLAIMED ITEMS)</span>
                    <button
                      onClick={() => {
                        setActiveTab('lostfound');
                        playNotificationBeep(580, 0.15);
                      }}
                      className="text-white hover:text-black font-bold text-xs font-mono tracking-wider italic hover:underline flex items-center gap-1 group-hover:text-black"
                    >
                      VIEW ACTIVE INDEX ➔
                    </button>
                  </div>
                </div>

              </div>
            </div>

            {/* HIGH SCHOOL WELCOME BANNER (ONBOARDERS ASSIST) */}
            <section id="onboarding-guide-strip" className="bg-[#121215] border-l-8 border-[#ffe600] p-6 rounded-r-lg relative">
              <div className="absolute top-2 right-4 text-xs font-mono text-zinc-700">COMMUNITY ONBOARDING BOARD</div>
              <h4 className="text-xl font-bold text-white mb-2 flex items-center gap-1">
                <span>◆ Onboarding at Western Academy of Beijing (WAB)</span>
              </h4>
              <p className="text-zinc-400 text-sm max-w-4xl leading-relaxed">
                Welcome, Tiger! WAB describes itself as an incredibly energetic, large-scale, and highly diverse community of global citizens. Stepping onto our Beichao Campus can feel like diving into a labyrinth on day one. Navigating tech setups, finding counseling services, or recovering a lost graphing calculator shouldn't hinder your focus. Use this hub to easily locate resources or post secure notes about stray treasures. You've got the Tiger student network backing you up!
              </p>
            </section>
          </div>
        )}

        {/* ===================================== TAB 2: DETAILED LOST & FOUND SYSTEM ===================================== */}
        {activeTab === 'lostfound' && (
          <div id="lostfound-view-wrapper" className="space-y-6">
            
            {/* Header statistics block */}
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 bg-zinc-950 p-5 rounded-lg border-2 border-zinc-800 relative">
              <div className="absolute top-0 right-1/4 w-12 h-full bg-[#ffe600] opacity-5 transform skew-x-12"></div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-[#ffe600] text-black text-[10px] font-black tracking-widest px-2 py-0.5 block transform rotate-[-1deg]">
                    TREASURE REGISTRY
                  </span>
                  <span className="text-zinc-500 font-mono text-xs">WAB HIGH SCHOOL DISTRICT</span>
                </div>
                <h2 className="text-2xl md:text-3xl font-black italic tracking-tighter text-[#ffe600] uppercase font-impact">
                  HS INTERNAL LOST & FOUND RADAR
                </h2>
                <p className="text-zinc-400 text-sm">
                  Lost items are classified as <span className="text-red-500 font-bold">LOST CLAIMS</span>. Found objects waiting for collection are labeled <span className="text-green-500 font-bold">FOUND ENTRIES</span>.
                </p>
              </div>

              {/* Red report button */}
              <button
                id="initiate-report-btn"
                onClick={() => {
                  setShowAddModal(true);
                  playNotificationBeep(640, 0.1);
                }}
                className="w-full lg:w-auto bg-red-600 hover:bg-[#ffe600] hover:text-black font-black text-sm md:text-base px-6 py-3.5 border-2 border-white tracking-wider uppercase transition-all duration-200 transform skew-x-[-10deg] flex items-center justify-center gap-2 shadow-[4px_4px_0px_rgba(255,51,51,0.4)]"
              >
                <Plus size={18} />
                <span>REPORT LOST / FOUND ITEM ◆</span>
              </button>
            </div>

            {/* SELECTION FILTERS & SEARCH RIBBON */}
            <div id="search-filter-ribbon" className="bg-[#121215] p-4 border-4 border-zinc-900 rounded-lg flex flex-col gap-4 relative">
              
              {/* Slanted category labels selection */}
              <div>
                <p className="text-[#ffe600] text-xs font-mono tracking-widest uppercase font-bold mb-2">
                  ◆ FILTER BY CATEGORICAL CLASSIFICATION
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      id={`filter-cat-${cat.toLowerCase().replace('/', '-')}`}
                      onClick={() => {
                        setSelectedCategory(cat);
                        playNotificationBeep(450, 0.08);
                      }}
                      className={`text-xs font-mono font-bold tracking-tight py-1 px-3 transform skew-x-[-6deg] transition-all ${
                        selectedCategory === cat
                          ? 'bg-[#ffe600] text-black border border-black font-black scale-105 shadow-[2px_2px_0px_#ff3333]'
                          : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:text-white hover:bg-zinc-800'
                      }`}
                    >
                      {cat.toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Text search & type filter flexer */}
              <div className="flex flex-col md:flex-row gap-4">
                {/* Search text input */}
                <div id="search-input-box" className="flex-1 relative">
                  <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-500">
                    <Search size={16} />
                  </span>
                  <input
                    type="text"
                    placeholder="Search keywords, locations, colors, or reporters..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-black border border-zinc-800 focus:border-[#ffe600] rounded py-2.5 pl-9 pr-4 text-sm text-[#ffe600] placeholder-zinc-600 outline-none transition-all"
                  />
                  {searchQuery && (
                    <button
                      onClick={() => setSearchQuery('')}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-zinc-500 hover:text-white"
                    >
                      <X size={16} />
                    </button>
                  )}
                </div>

                {/* Status selector tab-set */}
                <div className="flex border border-zinc-800 rounded overflow-hidden">
                  <button
                    id="type-filter-all"
                    onClick={() => {
                      setSelectedType('ALL');
                      playNotificationBeep(400, 0.08);
                    }}
                    className={`px-4 py-2 text-xs font-mono font-bold uppercase transition-all ${
                      selectedType === 'ALL'
                        ? 'bg-[#ffe600] text-black font-black'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white'
                    }`}
                  >
                    ALL INCIDENTS
                  </button>
                  <button
                    id="type-filter-lost"
                    onClick={() => {
                      setSelectedType('LOST');
                      playNotificationBeep(400, 0.08);
                    }}
                    className={`px-4 py-2 text-xs font-mono font-bold uppercase transition-all ${
                      selectedType === 'LOST'
                        ? 'bg-[#ff3333] text-white font-black'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white'
                    }`}
                  >
                    LOST (WANTED)
                  </button>
                  <button
                    id="type-filter-found"
                    onClick={() => {
                      setSelectedType('FOUND');
                      playNotificationBeep(400, 0.08);
                    }}
                    className={`px-4 py-2 text-xs font-mono font-bold uppercase transition-all ${
                      selectedType === 'FOUND'
                        ? 'bg-green-600 text-white font-black'
                        : 'bg-zinc-900 text-zinc-400 hover:text-white'
                    }`}
                  >
                    FOUND (SECURED)
                  </button>
                </div>
              </div>

              {/* Results status indicator */}
              <div className="text-right text-[11px] font-mono text-zinc-500">
                DISPLAYING: <span className="text-white font-bold">{filteredItems.length}</span> ACTIVE RECORDS
              </div>
            </div>

            {/* LOST AND FOUND ITEMS GRID (PERSONA POSTER STYLE) */}
            {filteredItems.length === 0 ? (
              <div id="no-items-fallback" className="text-center py-20 bg-[#121215] border-4 border-dashed border-zinc-800 rounded-lg">
                <AlertTriangle className="mx-auto text-[#ffe600] animate-bounce mb-3" size={48} />
                <h3 className="text-xl font-bold uppercase font-space">NO ACTIVE RECORDS DETECTED</h3>
                <p className="text-zinc-500 text-xs font-mono mt-1 max-w-md mx-auto">
                  No active lost or found items match your selected filtering variables or keyword search query. Feel free to initiate a new report below!
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('ALL');
                    setSelectedType('ALL');
                  }}
                  className="mt-4 text-xs font-mono font-bold text-[#ffe600] border-b border-[#ffe600] hover:text-red-500 hover:border-red-500"
                >
                  RESET SEARCH FILTERS ➔
                </button>
              </div>
            ) : (
              <div id="lost-found-items-grid" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map((item) => (
                  <div
                    key={item.id}
                    id={`p5-item-card-${item.id}`}
                    onClick={() => {
                       setSelectedDetailItem(item);
                       playNotificationBeep(480, 0.1);
                    }}
                    className={`relative cursor-pointer transition-all duration-300 transform hover:-translate-y-1.5 hover:rotate-1 hover:shadow-2xl ${
                      item.resolved 
                        ? 'bg-zinc-950 border-4 border-zinc-900 opacity-60' 
                        : item.type === 'LOST' 
                          ? 'bg-[#181212] border-4 border-zinc-800 hover:border-[#ff3333]' 
                          : 'bg-[#121812] border-4 border-zinc-800 hover:border-green-500'
                    } rounded-lg overflow-hidden flex flex-col justify-between h-[360px] shadow-[4px_4px_10px_rgba(0,0,0,0.5)]`}
                  >
                    
                    {/* Item Card Body */}
                    <div>
                      {/* Slanted Header bar */}
                      <div className={`p-2 font-mono text-[10px] font-bold tracking-widest flex justify-between items-center ${
                        item.resolved 
                          ? 'bg-zinc-800 text-zinc-400' 
                          : item.type === 'LOST' 
                            ? 'bg-[#ff3333] text-white' 
                            : 'bg-green-600 text-white'
                      }`}>
                        <span>ITEM ID: {item.id.slice(-6).toUpperCase()}</span>
                        <span>{item.date}</span>
                      </div>

                      {/* Display image space */}
                      <div className="h-32 bg-zinc-900 relative flex items-center justify-center overflow-hidden border-b border-zinc-800 group">
                        {item.image ? (
                          <img 
                            src={item.image} 
                            alt={item.title} 
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform" 
                          />
                        ) : (
                          <div className={`w-full h-full flex flex-col items-center justify-center p-4 text-center leading-none ${
                            item.type === 'LOST' 
                              ? 'bg-gradient-to-tr from-zinc-950 to-[#281818]' 
                              : 'bg-gradient-to-tr from-zinc-950 to-[#182818]'
                          }`}>
                            <div className="absolute inset-0 bg-repeat bg-center opacity-5" style={{ backgroundImage: "radial-gradient(#ffe600 2px, transparent 2px)", backgroundSize: "12px 12px" }}></div>
                            <span className="text-zinc-600 uppercase font-mono text-[9px] mb-1">Item Image Preview</span>
                            {item.type === 'LOST' ? (
                              <AlertTriangle className="text-[#ff3333] opacity-60" size={32} />
                            ) : (
                              <CheckCircle2 className="text-green-500 opacity-60" size={32} />
                            )}
                            <span className="text-zinc-500 font-mono text-[10px] uppercase mt-2 font-bold px-2 py-0.5 border border-zinc-800 rounded bg-black bg-opacity-70 truncate max-w-full">
                              {item.category}
                            </span>
                          </div>
                        )}

                        {/* Top corner stickers */}
                        {item.resolved ? (
                          <div className="absolute inset-0 bg-black bg-opacity-80 flex items-center justify-center">
                            <span className="border-4 border-zinc-500 text-zinc-400 transform rotate-[-12deg] font-impact font-bold text-xl px-4 py-1 tracking-widest uppercase">
                              RECLAIMED
                            </span>
                          </div>
                        ) : (
                          <div className="absolute top-2 left-2">
                            <span className={`text-[10px] font-black tracking-wider px-2 py-0.5 rounded shadow ${
                              item.type === 'LOST' 
                                ? 'bg-red-600 text-white' 
                                : 'bg-green-600 text-white'
                            }`}>
                              {item.type === 'LOST' ? '★ LOST' : '◆ FOUND'}
                            </span>
                          </div>
                        )}
                        
                        <div className="absolute bottom-2 right-2 bg-black bg-opacity-80 px-2 py-0.5 rounded text-[10px] font-mono flex items-center gap-1">
                          <MapPin size={10} className="text-[#ffe600]" />
                          <span className="text-zinc-300 max-w-[150px] truncate">{item.location}</span>
                        </div>
                      </div>

                      {/* Content block */}
                      <div className="p-4">
                        <h4 className="font-bold text-base text-white tracking-tight leading-tight uppercase group-hover:text-[#ffe600] line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-zinc-400 font-mono text-xs mt-1 leading-normal line-clamp-3">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer actions */}
                    <div className="p-4 bg-black bg-opacity-40 border-t border-zinc-900 flex justify-between items-center text-xs">
                      <div>
                        <span className="text-zinc-500 text-[10px] font-mono block">REPORTER</span>
                        <span className="text-zinc-300 font-bold truncate max-w-[100px] block leading-none">{item.reporterName}</span>
                      </div>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedDetailItem(item);
                          playNotificationBeep(520, 0.1);
                        }}
                        className={`font-bold font-mono px-3 py-1 text-[11px] transform skew-x-[-6deg] font-black uppercase tracking-tighter ${
                          item.resolved 
                            ? 'bg-zinc-800 text-zinc-500' 
                            : 'bg-[#ffe600] text-black hover:bg-white'
                        }`}
                      >
                        DETAILS ➔
                      </button>
                    </div>

                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {/* ===================================== POPUP 1: SERVICES DETAILS SIDE MODALS ===================================== */}
      {openNavDrawer && (
        <div id="service-details-overlay" className="fixed inset-0 z-40 bg-black bg-opacity-90 flex items-center justify-center p-4 backdrop-blur-sm">
          
          <div className="relative w-full max-w-2xl bg-[#0c0c0f] border-4 border-black shadow-[10px_10px_0px_#ff3333] overflow-hidden rounded-lg p-6 animate-p5-jitter duration-200">
            {/* Corner diagonal sticker tape */}
            <div className="absolute top-0 right-0 w-32 h-8 bg-[#ffe600] transform rotate-45 translate-x-10 translate-y-2 opacity-90"></div>
            
            {/* Close cross */}
            <button
              onClick={() => setOpenNavDrawer(null)}
              className="absolute top-4 right-4 bg-red-600 border border-white text-white p-2.5 hover:bg-[#ffe600] hover:text-black transition-colors"
            >
              <X size={18} />
            </button>

            {/* Modal Heading according to service classification */}
            {openNavDrawer === 'counsel' && (
              <div id="counseling-info-modal">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#ff3333] text-white text-xs font-mono px-2 py-0.5 font-bold uppercase rotate-[-2deg]">
                    CAMPUS RESOURCE // wellness
                  </span>
                  <span className="text-xs text-zinc-500">STUDENT HEALTH SERVICES</span>
                </div>
                
                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-[#ffe600] font-impact mb-4">
                  ACCESSIBLE CLINIC: WAB COUNSELING
                </h3>

                <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                  WAB High School provides exceptional support personnel structures dedicated to student mental health and academic configuration safety. High school counselors operate completely confidential spaces where no academic record is touched without student safety permissions.
                </p>

                <div className="space-y-4 mb-6">
                  <div className="bg-[#121215] border border-zinc-800 p-3 rounded">
                    <p className="text-xs text-zinc-500 font-mono">PRIMARY OPERATION LOCATIONS:</p>
                    <p className="text-[#ffe600] font-bold text-sm">HS Counseling Suites (Room 2101 & 2102, directly overlooking the main canal bridge)</p>
                  </div>

                  <div className="bg-[#121215] border border-zinc-800 p-3 rounded">
                    <p className="text-xs text-zinc-500 font-mono">INSTRUCTIONS TO SEEK DIALOGUE:</p>
                    <ul className="list-disc list-inside text-xs text-zinc-300 mt-1 space-y-1">
                      <li>Walk in at any time during free periods, lunch times, or study hall slots.</li>
                      <li>Send an email schedule request via student email to David or Michelle.</li>
                      <li>Anonymous request dropcards are available at the front shelf of the suite.</li>
                    </ul>
                  </div>

                  <div className="bg-red-950 bg-opacity-30 border border-red-900 p-3 rounded flex items-center gap-2">
                    <AlertTriangle className="text-[#ff3333] shrink-0" size={24} />
                    <p className="text-[11px] text-red-200 font-mono">
                      CONFIDENTIAL ASSURANCE: Conversations are completely safe. Counselors only notify parents if absolute emergency safety bounds are threatened.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href="mailto:mzhang@wab.edu"
                    onClick={() => completeStep('check_counselor', 'Counseling Services')}
                    className="bg-[#ffe600] text-black font-black text-xs uppercase px-4 py-3 transform skew-x-[-10deg] flex items-center gap-1 hover:bg-white"
                  >
                    <Mail size={14} /> Ms. Michelle Zhang Email
                  </a>
                  <a
                    href="mailto:dsterling@wab.edu"
                    onClick={() => completeStep('check_counselor', 'Counseling Services')}
                    className="bg-red-600 text-white font-black text-xs uppercase px-4 py-3 transform skew-x-[-10deg] flex items-center gap-1 hover:bg-[#ffe600] hover:text-black"
                  >
                    <Mail size={14} /> Dr. David Sterling Email
                  </a>
                  <button
                    onClick={() => {
                      setOpenNavDrawer(null);
                      completeStep('check_counselor', 'Counseling Services');
                    }}
                    className="bg-zinc-800 text-zinc-300 font-bold text-xs uppercase px-4 py-3 transform skew-x-[-10deg] hover:text-white"
                  >
                    Close Log
                  </button>
                </div>
              </div>
            )}

            {openNavDrawer === 'library' && (
              <div id="library-info-modal">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#ffe600] text-black text-xs font-mono px-2 py-0.5 font-bold uppercase rotate-[2deg]">
                    CAMPUS LIFE // library
                  </span>
                  <span className="text-xs text-zinc-500">STUDENT REFERENCE DATABASES</span>
                </div>

                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-[#ffe600] font-impact mb-4">
                  ACADEMIC PORTAL: THE WAB MEDIA & LIBRARY CENTER
                </h3>

                <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                  The Western Academy of Beijing library serves as a powerful knowledge portal with millions of available research volumes, global magazines, and high-performance digital tools. 
                </p>

                <div className="space-y-4 mb-6">
                  <div className="bg-[#121215] border border-zinc-800 p-3 rounded">
                    <p className="text-xs text-zinc-500 font-mono">VIRTUAL SCHOLAR CHANNELS:</p>
                    <p className="text-[#ffe600] font-bold text-sm">TigerPortal Library LibGuides, EbscoHost, JStor, and Questia Database</p>
                  </div>

                  <div className="bg-[#121215] border border-zinc-800 p-3 rounded">
                    <p className="text-xs text-zinc-500 font-mono">DATABASE ANONYMOUS PASSWORDS:</p>
                    <p className="text-zinc-300 text-xs mt-1 leading-normal font-mono">
                      Due to copyright terms, passwords cannot be listed publicly. Visit the library help counter, look at the back page of your WAB planner, or ask Mrs. Sarah Cooper for the Master Password Key Card.
                    </p>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded">
                    <p className="text-xs text-[#ffe600] font-bold uppercase mb-1">★ HOW TO BORROW LAB EQUIPMENTS:</p>
                    <p className="text-zinc-400 text-xs">
                      The Library Desk lends out high-resolution DSLRs, spatial tripod mounts, green screens, audio capture mics, and graphing calculators. Borrow limits are 3 days per student ID swipe.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href="https://libguides.wab.edu"
                    target="_blank"
                    rel="noreferrer"
                    onClick={() => completeStep('check_library', 'Library Help Center')}
                    className="bg-[#ffe600] text-black font-black text-xs uppercase px-4 py-3 transform skew-x-[-10deg] flex items-center gap-1.5 hover:bg-white"
                  >
                    <ExternalLink size={14} /> Open WAB LibGuides Portal
                  </a>
                  <button
                    onClick={() => {
                      setOpenNavDrawer(null);
                      completeStep('check_library', 'Library Help Center');
                    }}
                    className="bg-zinc-800 text-zinc-300 font-bold text-xs uppercase px-4 py-3 transform skew-x-[-10deg] hover:text-white"
                  >
                    Close Log
                  </button>
                </div>
              </div>
            )}

            {openNavDrawer === 'tech' && (
              <div id="tech-info-modal">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#ff3333] text-white text-xs font-mono px-2 py-0.5 font-bold uppercase rotate-[-2deg]">
                    CAMPUS INFRASTRUCTURE // telecom
                  </span>
                  <span className="text-xs text-zinc-500">IT SYSTEMS HELP DESK</span>
                </div>

                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-[#ffe600] font-impact mb-4">
                  CONNECTIVITY: WAB WIRELESS & TECH SUPPORT
                </h3>

                <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                  Struggling with the global school gateway? The IT Tech Helpdesk keeps student machines secure, operational, and connected to the high-speed campus internal subnet.
                </p>

                <div className="space-y-4 mb-6 font-mono text-xs">
                  <div className="bg-[#121215] border border-zinc-800 p-3 rounded">
                    <p className="text-[#ffe600] font-bold text-xs uppercase">CONNECTED TO WIFI: &quot;WAB-Student&quot;</p>
                    <p className="text-zinc-400 mt-1 leading-normal">
                      Connect via selecting <span className="text-white">&quot;WAB-Student&quot;</span> on your device. Authenticate with your normal school login: <span className="text-white">firstname.lastname</span> (without email suffix) and your standard password key.
                    </p>
                  </div>

                  <div className="bg-[#121215] border border-zinc-800 p-3 rounded">
                    <p className="text-[#ffe600] font-bold text-xs uppercase">WAB GLOBAL VPN SETUP (FOR TRIPS / AT-HOME ACCESS)</p>
                    <p className="text-zinc-400 mt-1 leading-normal">
                      To safely access grading records, curriculum portals, and library directories from outside campus bounds, download the <span className="text-white">GlobalProtect VPN client</span> via the WAB software center and sign in with school credentials.
                    </p>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded">
                    <p className="text-white font-bold uppercase mb-1">◆ DEVICE REPLACEMENT AND LOANS:</p>
                    <p className="text-zinc-400">
                      If your school-issued Apple MacBook suffers damage, hand it over to Mr. Linus Jin at IT Center. A backup loaner machine is instantly configured for you to prevent academic delays.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href="mailto:helpdesk@wab.edu"
                    onClick={() => completeStep('check_tech', 'IT Tech Support')}
                    className="bg-red-600 text-white font-black text-xs uppercase px-4 py-3 transform skew-x-[-10deg] flex items-center gap-1 hover:bg-[#ffe600] hover:text-black"
                  >
                    <Mail size={14} /> Email Mr. Linus Helpdesk
                  </a>
                  <button
                    onClick={() => {
                      setOpenNavDrawer(null);
                      completeStep('check_tech', 'IT Tech Support');
                    }}
                    className="bg-zinc-800 text-zinc-300 font-bold text-xs uppercase px-4 py-3 transform skew-x-[-10deg] hover:text-white"
                  >
                    Close Log
                  </button>
                </div>
              </div>
            )}

            {openNavDrawer === 'service' && (
              <div id="service-info-modal">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#ffe600] text-black text-xs font-mono px-2 py-0.5 font-bold uppercase rotate-[1deg]">
                    CLUBS & ACTIVITIES // service
                  </span>
                  <span className="text-xs text-zinc-500">STUDENT COUNCIL DECK</span>
                </div>

                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-[#ffe600] font-impact mb-4">
                  THE TIGER SERVICE CORPS: GROUPS & STUCO
                </h3>

                <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                  WAB values student-led action! From localized recycling groups to massive cross-border humanitarian missions, service opportunities are where high schoolers form deep social bonds.
                </p>

                <div className="space-y-4 mb-6">
                  <div className="bg-[#121215] border border-zinc-800 p-3 rounded">
                    <p className="text-xs text-zinc-500 font-mono uppercase">HIGH SCHOOL STUDENT COUNCIL (STUCO):</p>
                    <p className="text-[#ffe600] font-bold text-sm">Organizes Student Cafeteria feedback panels, Spring formals, and sports pep rallies.</p>
                  </div>

                  <div className="bg-[#121215] border border-zinc-800 p-3 rounded font-mono text-xs">
                    <p className="text-white font-bold mb-1">DOMINANT CAMPUS CHARITIES OR GROUPS:</p>
                    <ul className="list-disc list-inside text-zinc-400 space-y-1">
                      <li><span className="text-white font-bold">Roots & Shoots</span>: Carbon footprint neutralization on campus and tree cultivation.</li>
                      <li><span className="text-white font-bold">Migrant Children Support League</span>: Tutoring English to local community children.</li>
                      <li><span className="text-white font-bold">Wildcat Sports Union</span>: High school spirit banners and live streaming support.</li>
                    </ul>
                  </div>

                  <div className="bg-zinc-900 border border-zinc-800 p-3 rounded text-xs">
                    <p className="text-[#ffe600] font-bold uppercase mb-1">PROPOSING NEW ALLIANCES / CLUBS:</p>
                    <p className="text-zinc-400 text-normal">
                      To register a new high school service club, obtain a faculty advisor sponsor, draft a 1-page charter statement, and submit the pitch to STUCO before October 15th to apply for core school budget.
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3">
                  <a
                    href="mailto:hs_office@wab.edu"
                    onClick={() => completeStep('check_service', 'Service Alliance')}
                    className="bg-[#ffe600] text-black font-black text-xs uppercase px-4 py-3 transform skew-x-[-10deg] flex items-center gap-1 hover:bg-white"
                  >
                    <Send size={14} /> Send Inquiry to Student Council
                  </a>
                  <button
                    onClick={() => {
                      setOpenNavDrawer(null);
                      completeStep('check_service', 'Service Alliance');
                    }}
                    className="bg-zinc-800 text-zinc-300 font-bold text-xs uppercase px-4 py-3 transform skew-x-[-10deg] hover:text-white"
                  >
                    Close Log
                  </button>
                </div>
              </div>
            )}

            {openNavDrawer === 'contacts' && (
              <div id="contacts-info-modal">
                <div className="flex items-center gap-2 mb-3">
                  <span className="bg-[#ff3333] text-white text-xs font-mono px-2 py-0.5 font-bold uppercase rotate-[-3deg]">
                    CAMPUS DIRECTORY // roster
                  </span>
                  <span className="text-xs text-zinc-500">KEY CONTACTS DIRECTORY</span>
                </div>

                <h3 className="text-3xl font-black italic uppercase tracking-tighter text-[#ffe600] font-impact mb-4">
                  THE WAB CONTACT DIRECTORY
                </h3>

                <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                  Forging close links with key campus figures speeds up your high school life immensely. Here are the primary counselors and administrators ready to help:
                </p>

                {/* Directory layout table */}
                <div className="max-h-60 overflow-y-auto space-y-3 mb-6 pr-2">
                  {WAB_CONFIDANTS.map((c, idx) => (
                    <div key={idx} className="bg-zinc-900 border border-zinc-800 p-3 rounded hover:bg-[#1a1313] transition-colors">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] text-zinc-500 font-mono leading-none">{c.role.toUpperCase()}</p>
                          <h5 className="text-base font-bold text-white tracking-tight mt-1">{c.name}</h5>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-mono bg-zinc-800 px-1.5 py-0.5 rounded">{c.location}</span>
                      </div>
                      <p className="text-xs text-zinc-400 mt-2 font-mono leading-normal">{c.description}</p>
                      <div className="mt-2 flex justify-between items-center text-[10px] font-mono border-t border-zinc-800 pt-1.5">
                        <span className="text-zinc-500">AVAIL: {c.avail}</span>
                        <a href={`mailto:${c.contact}`} className="text-[#ffe600] underline font-bold hover:text-red-500 transition-colors">
                          {c.contact}
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => {
                      setOpenNavDrawer(null);
                      completeStep('check_contacts', 'High School Directory');
                    }}
                    className="bg-[#ffe600] text-black font-black text-xs uppercase px-6 py-3 transform skew-x-[-10deg] hover:bg-white"
                  >
                    ★ BACK TO PORTAL
                  </button>
                  <button
                    onClick={() => setOpenNavDrawer(null)}
                    className="bg-zinc-800 text-zinc-300 font-bold text-xs uppercase px-4 py-3 transform skew-x-[-10deg] hover:text-white"
                  >
                    Close Log
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      )}

      {/* ===================================== POPUP 2: ADD LOST/FOUND INCIDENT INCIDENT FORM ===================================== */}
      {showAddModal && (
        <div id="add-item-modal-overlay" className="fixed inset-0 z-40 bg-black bg-opacity-95 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto">
          
          <div className="relative w-full max-w-lg my-8 bg-[#0e0e11] border-4 border-black shadow-[10px_10px_0px_#ff3333] overflow-hidden rounded-lg p-6">
            
            {/* Corner diagonal sticker tape */}
            <div className="absolute top-0 right-0 w-32 h-8 bg-red-600 transform rotate-45 translate-x-10 translate-y-2 opacity-90"></div>
            
            {/* Close cross */}
            <button
              onClick={() => {
                setShowAddModal(false);
                setFormError('');
              }}
              className="absolute top-3 right-3 bg-red-600 border border-white text-white p-2 hover:bg-[#ffe600] hover:text-black transition-colors"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="bg-[#ff3333] text-white text-[10px] font-mono px-2 py-0.5 font-bold uppercase rotate-[-2deg]">
                NEW CLAIM FORM // SUBMIT RECORD
              </span>
              <span className="text-xs text-zinc-500 font-mono">STATUS: ACTIVE RECORD</span>
            </div>

            <h3 className="text-2xl md:text-3xl font-black italic uppercase tracking-tighter text-[#ffe600] font-impact mb-4">
              REPORT AN INCIDENT
            </h3>

            {formError && (
              <div className="bg-red-950 border-2 border-red-700 text-red-100 p-3 rounded mb-4 text-xs font-mono flex items-center gap-2">
                <AlertTriangle className="text-red-500" size={16} />
                <span>ERR: {formError}</span>
              </div>
            )}

            <form onSubmit={handleItemSubmit} className="space-y-4 text-xs font-mono">
              
              {/* Type Switch Selector (LOST VS FOUND) */}
              <div>
                <label className="text-zinc-400 block mb-1.5 uppercase font-bold tracking-wider text-[10px]">
                  ◆ CHOOSE REPORT TYPE
                </label>
                <div className="flex border border-zinc-800 rounded overflow-hidden">
                  <button
                    type="button"
                    onClick={() => {
                      setNewType('LOST');
                      playNotificationBeep(420, 0.08);
                    }}
                    className={`flex-1 py-2.5 text-center font-bold tracking-widest ${
                      newType === 'LOST' 
                        ? 'bg-red-600 text-white font-black' 
                        : 'bg-zinc-950 text-zinc-400'
                    }`}
                  >
                    ★ I LOST SOMETHING
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setNewType('FOUND');
                      playNotificationBeep(420, 0.08);
                    }}
                    className={`flex-1 py-2.5 text-center font-bold tracking-widest ${
                      newType === 'FOUND' 
                        ? 'bg-green-600 text-white font-black' 
                        : 'bg-zinc-950 text-zinc-400'
                    }`}
                  >
                    ◆ I FOUND SOMETHING
                  </button>
                </div>
              </div>

              {/* Title Input */}
              <div>
                <label className="text-zinc-400 block mb-1 uppercase font-bold tracking-wider text-[10px]">
                  ◆ Item Name / Tag *
                </label>
                <input
                  type="text"
                  placeholder="Insert exact item name..."
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-black border border-zinc-800 focus:border-[#ffe600] p-2.5 text-sm text-[#ffe600] rounded placeholder-zinc-700 outline-none"
                  required
                />
              </div>

              {/* Category selector & Locations flex */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-zinc-400 block mb-1 uppercase font-bold tracking-wider text-[10px]">
                    ◆ Category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-black border border-zinc-800 text-[#ffe600] p-2.5 text-xs rounded outline-none"
                  >
                    {categories.filter(c => c !== 'ALL').map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1 uppercase font-bold tracking-wider text-[10px]">
                    ◆ Specific Landmark / Location *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. HS Gym Bleachers, Room 2209"
                    value={newLocation}
                    onChange={(e) => setNewLocation(e.target.value)}
                    className="w-full bg-black border border-zinc-800 focus:border-[#ffe600] p-2.5 text-xs text-[#ffe600] rounded placeholder-zinc-700 outline-none"
                    required
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="text-zinc-400 block mb-1 uppercase font-bold tracking-wider text-[10px]">
                  ◆ Item Specifications & Characteristics
                </label>
                <textarea
                  rows={3}
                  placeholder="Detail any specific stickers, colors, scratches, or characteristics that distinguish this item..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full bg-black border border-zinc-800 focus:border-[#ffe600] p-2.5 text-xs text-zinc-300 rounded placeholder-zinc-700 outline-none resize-none"
                />
              </div>

              {/* Image Uploader & dragzone */}
              <div>
                <label className="text-zinc-400 block mb-1 uppercase font-bold tracking-wider text-[10px]">
                  ◆ Attachment / Photograph (Upload photo to attach to this file report)
                </label>
                
                <div className="flex items-center gap-3">
                  <div className="flex-1 border border-dashed border-zinc-800 hover:border-[#ffe600] p-3 text-center rounded relative cursor-pointer bg-zinc-950">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="flex flex-col items-center justify-center gap-1 text-zinc-500">
                      <Upload size={20} className="text-zinc-400" />
                      <span className="text-[10px] uppercase font-bold">
                        {newImage ? '✓ Image Attached' : 'Click to Upload Image'}
                      </span>
                    </div>
                  </div>

                  {newImage && (
                    <div className="relative w-16 h-16 border-2 border-red-500 rounded overflow-hidden shrink-0 bg-black">
                      <img src={newImage} alt="Thumbnail encoded" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => setNewImage('')}
                        className="absolute -top-1 -right-1 bg-black bg-opacity-80 p-0.5 rounded text-red-500 hover:text-white"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Information & Reporter Entity */}
              <div className="grid grid-cols-2 gap-4 border-t border-zinc-800 pt-3">
                <div>
                  <label className="text-zinc-400 block mb-1 uppercase font-bold tracking-wider text-[10px]">
                    ◆ Your Real Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Aaron Wang"
                    value={newReporterName}
                    onChange={(e) => setNewReporterName(e.target.value)}
                    className="w-full bg-black border border-zinc-800 focus:border-[#ffe600] p-2.5 text-xs text-[#ffe600] rounded placeholder-zinc-700 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="text-zinc-400 block mb-1 uppercase font-bold tracking-wider text-[10px]">
                    ◆ Contact Information *
                  </label>
                  <div className="flex gap-2">
                    <select
                      value={newContactMethod}
                      onChange={(e) => setNewContactMethod(e.target.value)}
                      className="bg-black border border-zinc-800 text-white rounded p-1 text-[10px] outline-none"
                    >
                      <option value="email">EMAIL</option>
                      <option value="wechat">WECHAT</option>
                      <option value="phone">PHONE</option>
                    </select>
                    
                    <input
                      type="text"
                      placeholder="e.g. key_person"
                      value={newContact}
                      onChange={(e) => setNewContact(e.target.value)}
                      className="flex-1 bg-black border border-zinc-800 focus:border-[#ffe600] p-2 text-xs text-[#ffe600] rounded placeholder-zinc-700 outline-none"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="flex-1 bg-red-600 hover:bg-[#ffe600] hover:text-black font-black text-sm text-white px-5 py-3 transform skew-x-[-10deg] uppercase tracking-wider transition-all"
                >
                  SUBMIT REPORT TO COMMUNITY
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setFormError('');
                  }}
                  className="bg-zinc-800 text-zinc-300 font-bold hover:text-white px-4 py-3 transform skew-x-[-10deg] uppercase tracking-wider"
                >
                  Cancel
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ===================================== POPUP 3: DETAILED ITEM CARD SPECIFIC DRAWER popup ===================================== */}
      {selectedDetailItem && (
        <div id="item-details-drawer-overlay" className="fixed inset-0 z-40 bg-black bg-opacity-95 flex items-center justify-center p-4 backdrop-blur-md">
          
          <div className="relative w-full max-w-lg bg-[#0d0d10] border-4 border-[#ffe600] shadow-[10px_10px_0px_#000] overflow-hidden rounded-lg p-6">
            
            {/* Resolution stamp diagonally across overlay */}
            {selectedDetailItem.resolved && (
              <div className="absolute top-12 left-0 right-0 py-2.5 bg-red-600 text-white uppercase text-center font-impact tracking-widest text-2xl transform rotate-[-24deg] z-10 border-y-4 border-black border-dashed select-none pointer-events-none shadow-xl">
                ✔ ITEM RESOLVED AND CLAIMED
              </div>
            )}

            {/* Close cross */}
            <button
              onClick={() => setSelectedDetailItem(null)}
              className="absolute top-4 right-4 bg-zinc-800 text-zinc-400 p-2 hover:bg-red-600 hover:text-white transition-colors z-20"
            >
              <X size={16} />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className={`text-[10px] font-mono px-2 py-0.5 font-bold uppercase rotate-[2deg] text-white ${
                selectedDetailItem.type === 'LOST' ? 'bg-[#ff3333]' : 'bg-green-600'
              }`}>
                ITEM RECORD // {selectedDetailItem.type}
              </span>
              <span className="text-xs text-zinc-500 font-mono">WAB HS DATABASE CORRESPONDENCE</span>
            </div>

            {/* Card Content display */}
            <div className="space-y-4">
              
              <h3 className="text-3xl font-black italic uppercase tracking-tighter text-[#ffe600] font-impact leading-none">
                {selectedDetailItem.title}
              </h3>

              {/* Graphic container */}
              <div className="h-48 bg-zinc-950 border border-zinc-800 rounded relative overflow-hidden flex items-center justify-center">
                {selectedDetailItem.image ? (
                  <img src={selectedDetailItem.image} alt="Evidence" className="w-full h-full object-cover" />
                ) : (
                  <div className="text-center p-4">
                    <span className="text-zinc-600 font-mono text-[9px] block mb-2 uppercase">ITEM PHOTO ATTACHMENT</span>
                    {selectedDetailItem.type === 'LOST' ? (
                      <AlertTriangle className="mx-auto text-[#ff3333] opacity-40" size={48} />
                    ) : (
                      <CheckCircle2 className="mx-auto text-green-500 opacity-40" size={48} />
                    )}
                    <span className="text-xs text-zinc-500 font-mono italic block mt-2">
                      No photographic proof filed by campus reporter.
                    </span>
                  </div>
                )}
                
                <div className="absolute bottom-2 left-2 bg-black bg-opacity-80 border border-zinc-800 text-[#ffe600] px-2 py-0.5 rounded font-mono text-[10px] uppercase">
                  CATEGORY: {selectedDetailItem.category}
                </div>
              </div>

              {/* Description box */}
              <div>
                <span className="text-zinc-500 text-[9px] font-mono block uppercase">ITEM REMARKS</span>
                <p className="text-zinc-200 text-sm font-sans leading-relaxed bg-[#121215] p-3 rounded border border-zinc-900">
                  {selectedDetailItem.description}
                </p>
              </div>

              {/* Metadata tags grid */}
              <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                <div className="bg-zinc-900 p-2 border border-zinc-800 rounded">
                  <span className="text-zinc-500 text-[9px] block">REPORT LOCATION</span>
                  <div className="flex items-center gap-1 text-white">
                    <MapPin size={12} className="text-[#ffe600]" />
                    <span className="font-bold truncate">{selectedDetailItem.location}</span>
                  </div>
                </div>

                <div className="bg-zinc-900 p-2 border border-zinc-800 rounded">
                  <span className="text-zinc-500 text-[9px] block">INCIDENT TIMECODE</span>
                  <div className="flex items-center gap-1 text-white">
                    <Calendar size={12} className="text-[#ffe600]" />
                    <span className="font-bold">{selectedDetailItem.date}</span>
                  </div>
                </div>
              </div>

              {/* Coordinator contact box */}
              <div className="bg-zinc-950 p-4 border border-zinc-800 rounded relative">
                <div className="absolute top-2 right-2 text-[8px] bg-[#ffe600] text-black px-1 font-black">REPORTER LOG</div>
                <h5 className="text-[10px] text-zinc-500 font-mono uppercase">HOW TO CONTACT</h5>
                <p className="text-sm text-[#ffe600] font-bold mt-1">
                  Reporter: <span className="text-white">{selectedDetailItem.reporterName}</span>
                </p>
                <div className="mt-2.5 flex items-center gap-2 font-mono text-xs">
                  <span className="bg-zinc-800 text-zinc-400 px-2 py-0.5 rounded font-bold uppercase">
                    {selectedDetailItem.contactMethod}
                  </span>
                  <span className="text-zinc-200 underline select-all">{selectedDetailItem.contact}</span>
                </div>
                <p className="text-[10px] text-zinc-500 font-mono mt-2 italic leading-tight">
                  Please coordinate item handovers safely at high school administrative desks or central lobby intersections.
                </p>
              </div>

              {/* Primary Drawer actions */}
              <div className="flex flex-col gap-2 pt-2">
                
                {/* Toggle status claim resolver button */}
                <button
                  onClick={() => {
                    toggleResolveItem(selectedDetailItem.id);
                  }}
                  className={`w-full py-3.5 italic text-center text-sm transform skew-x-[-10deg] font-black uppercase tracking-wider transition-all ${
                    selectedDetailItem.resolved 
                      ? 'bg-zinc-800 hover:bg-zinc-700 text-zinc-400' 
                      : 'bg-red-600 hover:bg-[#ffe600] hover:text-black text-white'
                  }`}
                >
                  {selectedDetailItem.resolved 
                    ? '◆ TOGGLE BACK TO UNCLAIMED' 
                    : '★ MARK AS RECLAIMED / RESOLVED'}
                </button>

                <div className="flex gap-2">
                  <a
                    href={`mailto:hs_office@wab.edu?subject=WAB%20Lost%20Found%20Claim:%20${encodeURIComponent(selectedDetailItem.title)}`}
                    onClick={() => completeStep('check_contacts', 'Coordinator Inquiry')}
                    className="flex-1 bg-zinc-900 border border-zinc-800 text-center py-2.5 hover:bg-zinc-800 font-bold font-mono text-xs rounded hover:text-white"
                  >
                    EMAIL CENTRAL OFFICE
                  </a>
                  <button
                    onClick={() => setSelectedDetailItem(null)}
                    className="bg-zinc-800 text-zinc-400 hover:text-white font-bold font-mono text-xs px-4"
                  >
                    CLOSE LOG
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

      {/* FOOTER BAR */}
      <footer id="p5-meta-footer" className="max-w-7xl mx-auto w-full px-4 text-center text-zinc-600 text-[10px] font-mono mt-12 mb-6">
        <p className="border-t border-zinc-900 pt-4">
          ◆ TIGER NAVIGATOR DECK IS A STUDENT-INVENTED OFF-LINE ASSISTANT FOR THE WESTERN ACADEMY OF BEIJING ◆
        </p>
        <p className="mt-1">
          Data is synchronized using local storage. To remove a item entry, simply toggle the resolution stamp.
        </p>
        <div className="mt-2 flex justify-center gap-4 text-[#ffe600]">
          <span>★ SYSTEM TIME: {systemClock || "05:52:52"} CN</span>
          <span>◆ PORTAL STATUS: ONLINE</span>
          <span>★ ACTIVE DIRECTORIES: 5</span>
        </div>
      </footer>

    </div>
  );
}
