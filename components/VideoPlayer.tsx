import React, { useRef, useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { Subtitle } from '../types';
import { getTTSAudio } from '../services/geminiService';
import { 
  Captions, 
  Loader2, 
  Settings, 
  Maximize, 
  Minimize, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Headphones, 
  Check,
  ChevronRight,
  ChevronLeft,
  Languages,
  Type
} from 'lucide-react';

interface VideoPlayerProps {
  src: string;
  subtitles: Subtitle[];
  onTimeUpdate?: (time: number) => void;
}

export interface VideoPlayerRef {
  seekTo: (seconds: number) => void;
  playAudioManual: (text: string, lang?: string) => void;
}

const parseTime = (timeStr: string): number => {
  const parts = timeStr.split(':').map(Number);
  if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
  if (parts.length === 2) return parts[0] * 60 + parts[1];
  return 0;
};

const formatTime = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  return `${m}:${s.toString().padStart(2, '0')}`;
};

// Available Gemini Voices
const GEMINI_VOICES = [
  { name: 'Kore (Female - Warm)', id: 'Kore' },
  { name: 'Puck (Male - Natural)', id: 'Puck' },
  { name: 'Charon (Male - Deep)', id: 'Charon' },
  { name: 'Fenrir (Male - Strong)', id: 'Fenrir' },
  { name: 'Zephyr (Female - Soft)', id: 'Zephyr' },
];

const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(({ src, subtitles, onTimeUpdate }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  
  // Audio Context & Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioSourceRef = useRef<AudioBufferSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const onlineAudioRef = useRef<HTMLAudioElement | null>(null);
  // Cache for TTS Blobs: Key = "${lang}:${text}" -> Value = BlobURL
  const ttsCache = useRef<Map<string, string>>(new Map());

  // Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showControls, setShowControls] = useState(true);

  // Settings & Dubbing State
  // Removed voiceMode state as requested - unifying into single smart engine
  const [subLanguageMode, setSubLanguageMode] = useState<'BOTH' | 'VI' | 'EN'>('VI');
  const [subFontSize, setSubFontSize] = useState<'SMALL' | 'MEDIUM' | 'LARGE'>('MEDIUM');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsMenu, setSettingsMenu] = useState<'MAIN' | 'SUB_LANG' | 'SUB_SIZE'>('MAIN');

  const [currentSub, setCurrentSub] = useState<Subtitle | null>(null);
  const [showSubs, setShowSubs] = useState(true);
  const [isAutoDub, setIsAutoDub] = useState(false);
  const [speakingText, setSpeakingText] = useState<string | null>(null);
  const [loadingAudio, setLoadingAudio] = useState(false);
  
  const lastPlayedSubId = useRef<number | null>(null);
  // CHANGED: Use number instead of NodeJS.Timeout for browser compatibility
  const controlsTimeoutRef = useRef<number | null>(null);

  // --- INITIALIZATION ---
  useEffect(() => {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioContextRef.current = new AudioContext();
      gainNodeRef.current = audioContextRef.current.createGain();
      gainNodeRef.current.connect(audioContextRef.current.destination);
    }
    return () => { audioContextRef.current?.close(); };
  }, []);

  useEffect(() => {
    const handleFullscreenChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Pre-load all TTS audio for subtitles when component mounts (Gemini)
  // Removed Gemini Preload as we are simplifying to single voice engine

  // --- AUDIO LOGIC ---
  const setDucking = (active: boolean) => {
      if (videoRef.current) videoRef.current.volume = active ? (isMuted ? 0 : 0.1) : (isMuted ? 0 : volume);
  };

  const stopAllAudio = () => {
    if (audioSourceRef.current) { try { audioSourceRef.current.stop(); } catch(e) {} audioSourceRef.current = null; }
    if (onlineAudioRef.current) { onlineAudioRef.current.pause(); onlineAudioRef.current = null; }
    window.speechSynthesis.cancel();
    setSpeakingText(null);
    setLoadingAudio(false);
    setDucking(false);
  };

  const getCacheKey = (text: string, lang: string) => `${lang}:${text}`;

  const prefetchAudio = async (text: string, lang: string) => {
      const key = getCacheKey(text, lang);
      if (ttsCache.current.has(key)) return;

      try {
          const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';
          const langParam = lang === 'vi-VN' ? 'vi-VN' : 'en-US';
          const response = await fetch(`${apiBase}/tts?text=${encodeURIComponent(text)}&lang=${langParam}`);
          if (response.ok) {
              const blob = await response.blob();
              const url = URL.createObjectURL(blob);
              ttsCache.current.set(key, url);
          }
      } catch (err) {
          // Silent fail for prefetch
      }
  };

  const playSmartAudio = async (text: string, langHint: string, onEnd: () => void) => {
    try {
        setLoadingAudio(true);
        const langParam = langHint === 'vi-VN' ? 'vi-VN' : 'en-US';
        const key = getCacheKey(text, langParam);
        
        let url: string;

        if (ttsCache.current.has(key)) {
            url = ttsCache.current.get(key)!;
        } else {
            const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:3001';
            const response = await fetch(`${apiBase}/tts?text=${encodeURIComponent(text)}&lang=${langParam}`);
            if (!response.ok) throw new Error('TTS Server Error');
            const blob = await response.blob();
            url = URL.createObjectURL(blob);
            ttsCache.current.set(key, url);
        }
        
        const audio = new Audio(url);
        
        onlineAudioRef.current = audio;
        audio.onended = () => {
            onEnd();
        };
        audio.onerror = (e) => {
            console.error("Audio playback error", e);
            onEnd();
        };
        
        await audio.play();
        setLoadingAudio(false);
    } catch (error) {
        console.error("Edge TTS Failed - Ensure server.js is running (node server.js)", error);
        setLoadingAudio(false);
        onEnd(); 
    }
  };

  const speakText = (text: string, isManual: boolean, langHint: string = 'vi-VN') => {
    stopAllAudio();
    if (speakingText === text && isManual) return;
    setSpeakingText(text);
    setDucking(true);
    const onEnd = () => { setSpeakingText(null); setDucking(false); };

    playSmartAudio(text, langHint, onEnd);
  };

  useImperativeHandle(ref, () => ({
    seekTo: (seconds: number) => {
      if (videoRef.current) {
        videoRef.current.currentTime = seconds;
        videoRef.current.play();
        stopAllAudio();
      }
    },
    playAudioManual: (text: string, lang: string = 'vi-VN') => speakText(text, true, lang)
  }));

  // --- PLAYER CONTROLS LOGIC ---
  const togglePlay = () => {
      if (videoRef.current) {
          if (videoRef.current.paused) videoRef.current.play();
          else { videoRef.current.pause(); stopAllAudio(); }
      }
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      const time = videoRef.current.currentTime;
      setCurrentTime(time);
      if (onTimeUpdate) onTimeUpdate(time);

      const activeSubIndex = subtitles.findIndex(sub => {
        const start = parseTime(sub.startTime);
        const end = parseTime(sub.endTime);
        return time >= start && time <= end;
      });
      const activeSub = activeSubIndex !== -1 ? subtitles[activeSubIndex] : null;

      if (activeSub && isAutoDub && activeSub.id !== lastPlayedSubId.current) {
         lastPlayedSubId.current = activeSub.id;
         speakText(activeSub.textVietnamese, false, 'vi-VN');
         
         // PREFETCH Next 2 Subtitles
         if (activeSubIndex !== -1) {
             for (let i = 1; i <= 2; i++) {
                 const nextSub = subtitles[activeSubIndex + i];
                 if (nextSub) prefetchAudio(nextSub.textVietnamese, 'vi-VN');
             }
         }
      }
      setCurrentSub(activeSub || null);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      const time = Number(e.target.value);
      if (videoRef.current) {
          videoRef.current.currentTime = time;
          setCurrentTime(time);
          stopAllAudio();
      }
  };

  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
      const vol = Number(e.target.value);
      setVolume(vol);
      if (videoRef.current) {
          videoRef.current.volume = vol;
          setIsMuted(vol === 0);
      }
  };

  const toggleMute = () => {
      if (videoRef.current) {
          const newMuted = !isMuted;
          setIsMuted(newMuted);
          videoRef.current.volume = newMuted ? 0 : volume;
      }
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) containerRef.current.requestFullscreen().catch(err => console.error(err));
    else document.exitFullscreen();
  };

  const handleMouseMove = () => {
      setShowControls(true);
      if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
      controlsTimeoutRef.current = window.setTimeout(() => {
          if (!videoRef.current?.paused && !isSettingsOpen) setShowControls(false);
      }, 2500);
  };

  // --- RENDERERS ---

  const renderSettingsMenu = () => {
    if (!isSettingsOpen) return null;

    return (
        <div className="absolute bottom-16 right-4 w-64 bg-[#0f0f0f]/95 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl z-50 animate-fade-in-up border border-white/10">
            {settingsMenu === 'MAIN' && (
                <div className="py-2">
                    <button 
                        onClick={() => setSettingsMenu('SUB_LANG')}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/10 transition-colors text-sm text-white border-b border-white/5"
                    >
                         <div className="flex items-center gap-3">
                            <Languages className="w-4 h-4 text-gray-400" />
                            <span>Subtitle Language</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                            <span className="text-xs">{subLanguageMode === 'BOTH' ? 'Bilingual' : subLanguageMode === 'VI' ? 'Vietnamese' : 'English'}</span>
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </button>
                    <button 
                        onClick={() => setSettingsMenu('SUB_SIZE')}
                        className="w-full px-4 py-3 flex items-center justify-between hover:bg-white/10 transition-colors text-sm text-white"
                    >
                         <div className="flex items-center gap-3">
                            <Type className="w-4 h-4 text-gray-400" />
                            <span>Subtitle Size</span>
                        </div>
                        <div className="flex items-center gap-1 text-gray-400">
                            <span className="text-xs">{subFontSize === 'SMALL' ? 'Small' : subFontSize === 'MEDIUM' ? 'Normal' : 'Large'}</span>
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    </button>
                </div>
            )}

            {settingsMenu === 'SUB_LANG' && (
                <div className="py-2">
                    <div className="px-4 py-2 flex items-center gap-2 border-b border-white/10 mb-1 cursor-pointer" onClick={() => setSettingsMenu('MAIN')}>
                        <ChevronLeft className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-bold text-white">Subtitle Language</span>
                    </div>
                    {[
                        { id: 'BOTH', label: 'Bilingual (Both)', desc: 'Hiển thị song ngữ' },
                        { id: 'VI', label: 'Vietnamese Only', desc: 'Chỉ tiếng Việt' },
                        { id: 'EN', label: 'English Only', desc: 'Chỉ tiếng Anh' }
                    ].map((mode) => (
                        <button 
                            key={mode.id}
                            onClick={() => { setSubLanguageMode(mode.id as any); setSettingsMenu('MAIN'); }}
                            className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-white/10 transition-colors text-left"
                        >
                            {subLanguageMode === mode.id && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                            <div className={`${subLanguageMode !== mode.id ? 'pl-7' : ''}`}>
                                <div className="text-sm text-white font-medium">{mode.label}</div>
                                <div className="text-xs text-gray-500">{mode.desc}</div>
                            </div>
                        </button>
                    ))}
                </div>
            )}

            {settingsMenu === 'SUB_SIZE' && (
                <div className="py-2">
                    <div className="px-4 py-2 flex items-center gap-2 border-b border-white/10 mb-1 cursor-pointer" onClick={() => setSettingsMenu('MAIN')}>
                        <ChevronLeft className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-bold text-white">Subtitle Size</span>
                    </div>
                    {[
                        { id: 'SMALL', label: 'Small', desc: 'Nhỏ gọn' },
                        { id: 'MEDIUM', label: 'Normal', desc: 'Mặc định' },
                        { id: 'LARGE', label: 'Large', desc: 'To rõ ràng' }
                    ].map((mode) => (
                        <button 
                            key={mode.id}
                            onClick={() => { setSubFontSize(mode.id as any); setSettingsMenu('MAIN'); }}
                            className="w-full px-4 py-2.5 flex items-center gap-3 hover:bg-white/10 transition-colors text-left"
                        >
                            {subFontSize === mode.id && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                            <div className={`${subFontSize !== mode.id ? 'pl-7' : ''}`}>
                                <div className="text-sm text-white font-medium">{mode.label}</div>
                                <div className="text-xs text-gray-500">{mode.desc}</div>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
  };

  // Detect if Source Is Embed URL
  const isEmbed = src.includes('embed.aspx') || src.includes('youtube.com/embed') || src.includes('player.vimeo.com');

  if (isEmbed) {
      return (
        <div 
            ref={containerRef}
            className={`relative group bg-black rounded-3xl overflow-hidden shadow-2xl transition-all duration-500 ease-in-out border border-white/5 ${isFullscreen ? 'w-full h-full rounded-none' : 'w-full aspect-video'}`}
        >
             <iframe 
                src={src} 
                className="w-full h-full" 
                frameBorder="0" 
                scrolling="no" 
                allowFullScreen 
                title="Course Video"
             />
             {/* Overlay Message for Embed Mode */}
             <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-xs text-gray-400 border border-white/10 z-10 pointer-events-none">
                 Embed Mode (AI Features Limited)
             </div>
             {/* Simple Back Button if Fullscreen needed or custom controls absent */}
             <button onClick={toggleFullscreen} className="absolute bottom-4 right-4 bg-black/50 p-2 rounded-lg text-white hover:bg-black/80 z-20">
                 {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
             </button>
        </div>
      );
  }

  return (
    <div 
        ref={containerRef} 
        onMouseMove={handleMouseMove}
        onMouseLeave={() => { if (!videoRef.current?.paused && !isSettingsOpen) setShowControls(false); }}
        className="relative group bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800 flex flex-col justify-center items-center select-none"
        style={{ maxHeight: isFullscreen ? '100vh' : 'auto' }}
    >
      <video
        ref={videoRef}
        src={src}
        crossOrigin="anonymous" 
        className={`w-full ${isFullscreen ? 'h-screen object-contain' : 'aspect-video'}`}
        onClick={togglePlay}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={(e) => setDuration(e.currentTarget.duration)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Subtitles Overlay */}
      {showSubs && currentSub && (
        <div className={`absolute left-0 right-0 flex flex-col items-center justify-end px-4 z-20 pointer-events-none transition-all duration-300 ${isFullscreen ? 'bottom-24' : 'bottom-14'} ${showControls ? '-translate-y-2' : 'translate-y-0'}`}>
             <div className="flex flex-col items-center gap-1.5 transition-all w-full">
                {(subLanguageMode === 'BOTH' || subLanguageMode === 'EN') && (
                    <button
                        onClick={(e) => { e.stopPropagation(); speakText(currentSub.textOriginal, true, 'en-US'); }}
                        className={`pointer-events-auto bg-black/60 hover:bg-black/80 backdrop-blur-[2px] px-2 py-0.5 rounded text-white/90 font-medium transition-colors text-center max-w-[90%]
                             ${subFontSize === 'SMALL' ? 'text-[8px]' : subFontSize === 'LARGE' ? 'text-xs' : 'text-[10px]'}
                             ${isFullscreen ? (subFontSize === 'SMALL' ? 'md:text-sm' : subFontSize === 'LARGE' ? 'md:text-xl' : 'md:text-base') : ''}
                        `}
                    >
                        {currentSub.textOriginal}
                    </button>
                )}
                
                {(subLanguageMode === 'BOTH' || subLanguageMode === 'VI') && (
                    <button
                        onClick={(e) => { e.stopPropagation(); speakText(currentSub.textVietnamese, true, 'vi-VN'); }}
                        className={`pointer-events-auto bg-black/75 hover:bg-black/90 backdrop-blur-[2px] px-3 py-1 rounded-md text-yellow-300 font-semibold shadow-sm transition-colors text-center max-w-[95%] leading-relaxed 
                             ${subFontSize === 'SMALL' ? 'text-[10px]' : subFontSize === 'LARGE' ? 'text-sm' : 'text-xs'}
                             ${isFullscreen ? (subFontSize === 'SMALL' ? 'md:text-lg' : subFontSize === 'LARGE' ? 'md:text-2xl' : 'md:text-xl') : ''}
                        `}
                    >
                        {loadingAudio && speakingText === currentSub.textVietnamese ? (
                            <span className="flex items-center gap-2 justify-center"><Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />{currentSub.textVietnamese}</span>
                        ) : currentSub.textVietnamese}
                    </button>
                )}
             </div>
        </div>
      )}

      {/* Settings Popup */}
      {renderSettingsMenu()}

      {/* CUSTOM CONTROLS OVERLAY (YouTube Style) */}
      <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-12 pb-3 px-3 transition-opacity duration-300 flex flex-col gap-1 z-30 ${showControls ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        
        {/* Progress Bar */}
        <div className="w-full relative group/progress h-4 flex items-center cursor-pointer">
            <input 
                type="range" 
                min="0" 
                max={duration || 100} 
                value={currentTime} 
                onChange={handleSeek}
                className="absolute w-full h-1 bg-white/30 rounded-full appearance-none cursor-pointer z-20 hover:h-1.5 transition-all [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-600 [&::-webkit-slider-thumb]:opacity-0 group-hover/progress:[&::-webkit-slider-thumb]:opacity-100"
            />
            {/* Progress Visuals (since range input styling is limited) */}
            <div className="absolute top-1/2 -translate-y-1/2 left-0 h-1 bg-red-600 rounded-full z-10 pointer-events-none group-hover/progress:h-1.5 transition-all" style={{ width: `${(currentTime / duration) * 100}%` }}></div>
        </div>

        {/* Controls Row */}
        <div className="flex items-center justify-between mt-[-5px]">
            {/* Left: Play, Volume, Time */}
            <div className="flex items-center gap-4">
                <button onClick={togglePlay} className="text-white hover:text-gray-200 transition-colors">
                    {isPlaying ? <Pause className="fill-white w-6 h-6" /> : <Play className="fill-white w-6 h-6" />}
                </button>

                <div className="flex items-center gap-2 group/volume">
                    <button onClick={toggleMute} className="text-white">
                        {isMuted || volume === 0 ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
                    </button>
                    <div className="w-0 overflow-hidden group-hover/volume:w-24 transition-all duration-300">
                        <input 
                            type="range" min="0" max="1" step="0.1" 
                            value={isMuted ? 0 : volume} 
                            onChange={handleVolume}
                            className="w-20 h-1 bg-white/30 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white"
                        />
                    </div>
                </div>

                <div className="text-xs text-gray-300 font-medium font-mono">
                    {formatTime(currentTime)} / {formatTime(duration)}
                </div>
            </div>

            {/* Right: Tools, Settings, Fullscreen */}
            <div className="flex items-center gap-3">
                
                {/* Auto Dub Toggle */}
                <button 
                    onClick={() => { const newState = !isAutoDub; setIsAutoDub(newState); if(!newState) stopAllAudio(); }}
                    className={`relative p-2 rounded-lg transition-all ${isAutoDub ? 'text-indigo-400' : 'text-white hover:bg-white/10'}`}
                    title="Auto-Dub (AI Voiceover)"
                >
                    <Headphones className={`w-5 h-5 ${isAutoDub ? 'fill-indigo-400/20' : ''}`} />
                    {isAutoDub && <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5"><span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span><span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span></span>}
                </button>

                {/* Subtitles Toggle */}
                <button 
                    onClick={() => setShowSubs(!showSubs)}
                    className={`relative p-2 rounded-lg transition-all ${showSubs ? 'text-white' : 'text-gray-500 hover:text-white hover:bg-white/10'}`}
                    title="Toggle Subtitles"
                >
                    <Captions className={`w-6 h-6 ${showSubs ? 'fill-red-600 border-b-2 border-red-600 pb-0.5' : ''}`} />
                </button>

                {/* Settings Toggle */}
                <button 
                    onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                    className={`p-2 rounded-lg transition-all ${isSettingsOpen ? 'rotate-90 text-white' : 'text-white hover:bg-white/10'}`}
                >
                    <Settings className="w-5 h-5" />
                </button>

                {/* Fullscreen */}
                <button onClick={toggleFullscreen} className="p-2 text-white hover:bg-white/10 rounded-lg">
                    {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
});

export default VideoPlayer;