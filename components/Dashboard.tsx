import React, { useRef, useState } from 'react';
import { ProcessedData } from '../types';
import VideoPlayer, { VideoPlayerRef } from './VideoPlayer';
import NotesPanel from './NotesPanel';
import FlashcardsPanel from './FlashcardsPanel';
import { ArrowLeft, Volume2, Loader2, Download, FileText, FileVideo, Music, AlertTriangle, Terminal, X, Copy, Check, Wand2 } from 'lucide-react';
import { getTTSAudio, audioBufferToWav } from '../services/geminiService';
// @ts-ignore
import { FFmpeg } from '@ffmpeg/ffmpeg';
// @ts-ignore
import { fetchFile, toBlobURL } from '@ffmpeg/util';

interface DashboardProps {
  file: File | string; // Support both File object (upload) and string URL (library)
  data: ProcessedData;
  onBack: () => void;
}

const parseTime = (timeStr: string): number => {
    const parts = timeStr.split(':').map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return 0;
};

const Dashboard: React.FC<DashboardProps> = ({ file, data, onBack }) => {
  const videoRef = useRef<VideoPlayerRef>(null);
  const [activeTab, setActiveTab] = useState<'notes' | 'flashcards'>('notes');
  const [loadingAudioId, setLoadingAudioId] = useState<string | null>(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [showMergeModal, setShowMergeModal] = useState(false);
  
  // Safe helper for filename
  const getFileName = () => {
      if (typeof file === 'string') return 'Course_Video.mp4';
      return (file as File).name;
  };
  const fileName = getFileName();
  const fileBaseName = fileName.split('.')[0] || 'video';

  const videoUrl = typeof file === 'string' ? file : URL.createObjectURL(file);

  // Dubbing & Merge State
  const [isProcessing, setIsProcessing] = useState(false);
  const [progressText, setProgressText] = useState('');
  const [progressPercent, setProgressPercent] = useState(0);

  // Merge Script State
  const [copiedScript, setCopiedScript] = useState(false);

  const handleNoteClick = (timestampStr: string) => {
    const seconds = parseTime(timestampStr);
    videoRef.current?.seekTo(seconds);
  };

  const handleTranscriptClick = async (text: string, id: string, lang: string) => {
    setLoadingAudioId(id);
    try {
        videoRef.current?.playAudioManual(text, lang);
    } catch (e) {
        console.error(e);
    } finally {
        setLoadingAudioId(null);
    }
  };

  const handleDownloadSource = () => {
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
  
  const generateFullAudioBlob = async (onProgress: (pct: number) => void): Promise<Blob | null> => {
      const audioContext = new AudioContext();
      const subtitles = data.subtitles;
      if (subtitles.length === 0) return null;

      const totalDuration = parseTime(subtitles[subtitles.length - 1].endTime) + 10;
      const sampleRate = 24000;
      const offlineCtx = new OfflineAudioContext(1, sampleRate * totalDuration, sampleRate);
      
      let processedCount = 0;
      
      for (const sub of subtitles) {
          const startTime = parseTime(sub.startTime);
          try {
              const buffer = await getTTSAudio(sub.textVietnamese, 'Kore', audioContext);
              const source = offlineCtx.createBufferSource();
              source.buffer = buffer;
              source.connect(offlineCtx.destination);
              source.start(startTime);
          } catch (e) {
              console.warn(`Failed to generate audio for line ${sub.id}`, e);
          }
          processedCount++;
          onProgress(Math.round((processedCount / subtitles.length) * 100));
      }

      const renderedBuffer = await offlineCtx.startRendering();
      return audioBufferToWav(renderedBuffer);
  };

  const handleDownloadDubbedAudio = async () => {
      if (isProcessing) return;
      setIsProcessing(true);
      setProgressText("Generating TTS Audio...");
      setProgressPercent(0);

      try {
          const wavBlob = await generateFullAudioBlob((pct) => setProgressPercent(pct));
          if (!wavBlob) throw new Error("No audio generated");

          const url = URL.createObjectURL(wavBlob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${fileBaseName}_dubbed_audio.wav`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
      } catch (error) {
          console.error("Dubbing generation failed", error);
          alert("Could not generate dubbed audio. Check API quota.");
      } finally {
          setIsProcessing(false);
          setProgressText('');
          setProgressPercent(0);
      }
  };

  // --- FFMPEG VIDEO MERGING LOGIC ---
  const handleMergeAndDownload = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    setShowExportMenu(false);

    try {
        // 1. Generate Audio First
        setProgressText("Step 1/3: Generating AI Voiceover...");
        setProgressPercent(0);
        const audioBlob = await generateFullAudioBlob((pct) => setProgressPercent(pct));
        if (!audioBlob) throw new Error("Audio generation failed");

        // 2. Load FFmpeg
        setProgressText("Step 2/3: Loading Video Engine...");
        setProgressPercent(0);
        
        const ffmpeg = new FFmpeg();
        const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm';
        
        // Log handler
        ffmpeg.on('log', ({ message }: { message: string }) => console.log(message));
        
        // --- FIX FOR CROSS-ORIGIN WORKER ---
        // We must load the worker script manually, rewrite its imports to be absolute (CDN),
        // and serve it via a Blob URL to avoid "Failed to construct Worker" CORS errors.
        const ffmpegLibBase = 'https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/esm';
        const workerResp = await fetch(`${ffmpegLibBase}/worker.js`);
        if (!workerResp.ok) throw new Error("Failed to fetch FFmpeg worker");
        let workerText = await workerResp.text();
        
        // Replace relative imports (e.g., import ... from "./814.ffmpeg.js") with absolute CDN paths
        workerText = workerText.replace(/from\s*['"]\.\/([^'"]+)['"]/g, `from "${ffmpegLibBase}/$1"`);
        
        const classWorkerURL = URL.createObjectURL(new Blob([workerText], { type: 'text/javascript' }));

        await ffmpeg.load({
            coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
            wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
            classWorkerURL: classWorkerURL // Pass our patched worker
        });

        // 3. Write files to memory
        setProgressText("Step 3/3: Merging Video & Audio (This may take a while)...");
        const videoData = await fetchFile(file);
        const audioData = await fetchFile(audioBlob);

        await ffmpeg.writeFile('input.mp4', videoData);
        await ffmpeg.writeFile('input.wav', audioData);

        // 4. Run FFmpeg Command
        // -c:v copy: Copy video stream (super fast)
        // -c:a aac: Re-encode audio to AAC for MP4 compatibility
        // -map 0:v:0: Take video from first file
        // -map 1:a:0: Take audio from second file
        // -shortest: Stop when the shorter stream ends
        await ffmpeg.exec([
            '-i', 'input.mp4', 
            '-i', 'input.wav', 
            '-c:v', 'copy', 
            '-c:a', 'aac', 
            '-map', '0:v:0', 
            '-map', '1:a:0', 
            '-shortest', 
            'output.mp4'
        ]);

        // 5. Read output
        const data = await ffmpeg.readFile('output.mp4');
        const url = URL.createObjectURL(new Blob([(data as any).buffer], { type: 'video/mp4' }));

        const a = document.createElement('a');
        a.href = url;
        a.download = `${fileBaseName}_bilingual_dubbed.mp4`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        // Cleanup
        await ffmpeg.deleteFile('input.mp4');
        await ffmpeg.deleteFile('input.wav');
        await ffmpeg.deleteFile('output.mp4');
        URL.revokeObjectURL(classWorkerURL);
        
    } catch (error) {
        console.error("Merge failed", error);
        alert(`Merge failed: ${error instanceof Error ? error.message : "Browser memory limit exceeded for this file size. Please use the Manual Merge option."}`);
        setShowMergeModal(true); // Fallback to guide
    } finally {
        setIsProcessing(false);
        setProgressText('');
        setProgressPercent(0);
    }
  };

  const exportSRT = (type: 'bilingual' | 'original' | 'vietnamese') => {
    let content = '';
    data.subtitles.forEach((sub, index) => {
        const start = sub.startTime.includes(',') ? sub.startTime : `${sub.startTime},000`;
        const end = sub.endTime.includes(',') ? sub.endTime : `${sub.endTime},000`;

        content += `${index + 1}\n`;
        content += `${start} --> ${end}\n`;
        
        if (type === 'bilingual') {
            content += `${sub.textOriginal}\n`;
            content += `${sub.textVietnamese}\n\n`;
        } else if (type === 'original') {
            content += `${sub.textOriginal}\n\n`;
        } else {
            content += `${sub.textVietnamese}\n\n`;
        }
    });

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${fileBaseName}_${type}.srt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setShowExportMenu(false);
  };

  const generateFFmpegCommand = () => {
      const videoName = fileName;
      const audioName = `${fileBaseName}_dubbed_audio.wav`;
      const outputName = `${fileBaseName}_final.mp4`;
      
      return `ffmpeg -i "${videoName}" -i "${audioName}" -c:v copy -c:a aac -map 0:v:0 -map 1:a:0 -shortest "${outputName}"`;
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(generateFFmpegCommand());
      setCopiedScript(true);
      setTimeout(() => setCopiedScript(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* PROCESSING OVERLAY */}
      {isProcessing && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-sm w-full p-8 text-center shadow-2xl animate-fade-in-up">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Processing Video</h3>
                <p className="text-gray-600 mb-4">{progressText}</p>
                <div className="w-full bg-gray-200 rounded-full h-2 mb-2 overflow-hidden">
                    <div 
                        className="bg-indigo-600 h-2 rounded-full transition-all duration-300" 
                        style={{ width: `${progressPercent}%` }}
                    ></div>
                </div>
                <p className="text-xs text-gray-400 font-mono">{progressPercent}%</p>
                <div className="mt-6 p-3 bg-yellow-50 text-yellow-800 text-xs rounded-lg text-left">
                    <strong>Note:</strong> Video merging happens inside your browser. Do not close this tab.
                </div>
            </div>
        </div>
      )}

      {/* MERGE GUIDE MODAL */}
      {showMergeModal && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
              <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl overflow-hidden animate-fade-in-up">
                  <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                          <Terminal className="w-5 h-5 text-indigo-600" />
                          Manual Merge (Fallback)
                      </h3>
                      <button onClick={() => setShowMergeModal(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                          <X className="w-5 h-5 text-gray-500" />
                      </button>
                  </div>
                  
                  <div className="p-6 space-y-6">
                      <div className="bg-yellow-50 border border-yellow-100 rounded-xl p-4 text-sm text-yellow-800">
                          <strong>Why see this?</strong> The automatic merge failed (likely due to large file size or memory limits). Please use the steps below.
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Option 1: Manual */}
                          <div className="space-y-3">
                              <h4 className="font-bold text-gray-700">Option 1: Easy (Drag & Drop)</h4>
                              <p className="text-sm text-gray-500">Use any free editor like CapCut, Canva, or Clipchamp.</p>
                              <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2 ml-1">
                                  <li>Download <strong>Source Video</strong>.</li>
                                  <li>Download <strong>Dubbed Audio</strong>.</li>
                                  <li>Drag both into CapCut.</li>
                                  <li>Mute original video audio.</li>
                                  <li>Export!</li>
                              </ol>
                          </div>

                          {/* Option 2: FFmpeg */}
                          <div className="space-y-3">
                              <h4 className="font-bold text-gray-700">Option 2: Pro (Instant)</h4>
                              <p className="text-sm text-gray-500">If you have <a href="https://ffmpeg.org/download.html" target="_blank" className="text-indigo-600 hover:underline">FFmpeg</a> installed, run this command in your folder:</p>
                              
                              <div className="relative bg-gray-900 rounded-lg p-4 font-mono text-xs text-green-400 overflow-x-auto">
                                  {generateFFmpegCommand()}
                                  <button 
                                    onClick={copyToClipboard}
                                    className="absolute top-2 right-2 p-1.5 bg-white/10 hover:bg-white/20 rounded text-white transition-colors"
                                    title="Copy Command"
                                  >
                                      {copiedScript ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                              </div>
                          </div>
                      </div>

                      <div className="flex gap-3 pt-2">
                            <button 
                                onClick={handleDownloadSource}
                                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                            >
                                <FileVideo className="w-4 h-4" /> 1. Get Video
                            </button>
                            <button 
                                onClick={handleDownloadDubbedAudio}
                                disabled={isProcessing}
                                className="flex-1 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                            >
                                {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Music className="w-4 h-4" />} 
                                2. Get Audio
                            </button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-50 shadow-sm">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-800 leading-tight max-w-md truncate" title={fileName}>{fileName}</h1>
            <p className="text-xs text-gray-500">Bilingual Study Mode (Local TTS)</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
            {/* Export Dropdown */}
            <div className="relative">
                <button 
                    onClick={() => setShowExportMenu(!showExportMenu)}
                    disabled={isProcessing}
                    className="flex items-center gap-2 px-3 py-2 bg-indigo-600 text-white shadow-md shadow-indigo-200 rounded-lg text-sm font-bold hover:bg-indigo-700 transition-colors disabled:opacity-50"
                >
                    {isProcessing ? (
                        <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Processing...</span>
                        </>
                    ) : (
                        <>
                            <Download className="w-4 h-4" />
                            <span className="hidden sm:inline">Download</span>
                        </>
                    )}
                </button>
                
                {showExportMenu && (
                    <>
                        <div className="fixed inset-0 z-10" onClick={() => setShowExportMenu(false)}></div>
                        <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-xl border border-gray-100 z-20 overflow-hidden">
                            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                                Video Export
                            </div>
                            <button 
                                onClick={handleMergeAndDownload} 
                                className="w-full text-left px-4 py-3 text-sm text-white font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-90 flex items-center gap-3"
                            >
                                <div className="p-1.5 bg-white/20 rounded-full">
                                    <Wand2 className="w-4 h-4" />
                                </div>
                                <div>
                                    <div>Video + Voiceover (MP4)</div>
                                    <div className="text-[10px] font-normal opacity-80">Auto-merge in browser</div>
                                </div>
                            </button>

                            <div className="border-t border-gray-100 my-1"></div>

                            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                                Subtitles
                            </div>
                            <button onClick={() => exportSRT('bilingual')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                                Bilingual (.srt)
                            </button>
                            <button onClick={() => exportSRT('vietnamese')} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600">
                                Vietnamese Only (.srt)
                            </button>

                            <div className="border-t border-gray-100 my-1"></div>
                            
                            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                                Separate Files
                            </div>
                            <button onClick={handleDownloadDubbedAudio} className="w-full text-left px-4 py-2 text-sm text-indigo-700 hover:bg-indigo-50 flex items-center gap-2">
                                <Music className="w-4 h-4" />
                                Audio Only (.wav)
                            </button>
                            <button onClick={handleDownloadSource} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2">
                                <FileVideo className="w-4 h-4" />
                                Source Video Only
                            </button>
                        </div>
                    </>
                )}
            </div>

            <div className="h-6 w-px bg-gray-300 mx-1 hidden sm:block"></div>

            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                <button 
                    onClick={() => setActiveTab('notes')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'notes' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Notes
                </button>
                <button 
                    onClick={() => setActiveTab('flashcards')}
                    className={`px-3 py-1.5 rounded-md text-sm font-medium transition-all ${activeTab === 'flashcards' ? 'bg-white text-indigo-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                    Flashcards
                </button>
            </div>
        </div>
      </header>

      <main className="flex-1 p-4 md:p-6 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Video Player */}
        <div className="lg:col-span-2 space-y-4">
          <VideoPlayer 
            ref={videoRef} 
            src={videoUrl} 
            subtitles={data.subtitles} 
          />
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200">
             <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-800 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    Transcript Preview
                </h3>
             </div>
             <div className="h-64 overflow-y-auto custom-scrollbar text-sm space-y-1 pr-2">
                {data.subtitles.map(sub => (
                    <div key={sub.id} className="grid grid-cols-12 gap-3 hover:bg-indigo-50/50 p-3 rounded-lg transition-colors group border border-transparent hover:border-indigo-100">
                        <span 
                            className="col-span-2 text-gray-400 font-mono text-xs cursor-pointer hover:text-indigo-600 hover:underline pt-1"
                            onClick={() => handleNoteClick(sub.startTime)}
                        >
                            {sub.startTime}
                        </span>
                        <div className="col-span-10 flex flex-col gap-1">
                            <div className="flex items-start justify-between">
                                <p className="text-gray-900 font-medium leading-relaxed">{sub.textOriginal}</p>
                                <button 
                                    onClick={() => handleTranscriptClick(sub.textOriginal, `${sub.id}-orig`, 'en-US')}
                                    disabled={loadingAudioId !== null}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full text-gray-400 hover:text-indigo-600 hover:bg-white transition-all shadow-sm"
                                    title="Play Original (Local)"
                                >
                                    {loadingAudioId === `${sub.id}-orig` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Volume2 className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                            <div className="flex items-start justify-between">
                                <p className="text-indigo-600 text-sm italic leading-relaxed">{sub.textVietnamese}</p>
                                <button 
                                    onClick={() => handleTranscriptClick(sub.textVietnamese, `${sub.id}-vn`, 'vi-VN')}
                                    disabled={loadingAudioId !== null}
                                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-full text-gray-400 hover:text-indigo-600 hover:bg-white transition-all shadow-sm"
                                    title="Đọc tiếng Việt (Local)"
                                >
                                    {loadingAudioId === `${sub.id}-vn` ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Volume2 className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
             </div>
          </div>
        </div>

        {/* Right Column: Tools */}
        <div className="lg:col-span-1 h-[600px] lg:h-auto lg:min-h-[calc(100vh-8rem)] sticky top-24">
            {activeTab === 'notes' ? (
                <NotesPanel notes={data.notes} onNoteClick={handleNoteClick} />
            ) : (
                <FlashcardsPanel cards={data.flashcards} />
            )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;