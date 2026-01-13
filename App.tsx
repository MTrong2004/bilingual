import React, { useState, useRef, useEffect } from 'react';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import ProcessingQueue from './components/ProcessingQueue';
import { AppState, ProcessedData, ProcessingOptions, BackgroundJob } from './types';
import { processMediaWithGemini } from './services/geminiService';
import { saveToCache, getFromCache as checkCache, getFromCacheByFilename } from './services/cacheService';
import { Sparkles } from 'lucide-react';

import CourseLibrary from './components/CourseLibrary';
import MainMenu from './components/MainMenu';
import { Lesson, Course } from './data/courseData';

const App: React.FC = () => {
  // New State: Show Landing Page initially - Check localStorage
  const [showLanding, setShowLanding] = useState(() => !localStorage.getItem('started_flow'));
  const [showLibrary, setShowLibrary] = useState(false); 
  const [customUploadMode, setCustomUploadMode] = useState(false); 

  const [appState, setAppState] = useState<AppState>(AppState.UPLOAD);
  const [currentFile, setCurrentFile] = useState<File | string | null>(null);
  const [currentLessonTitle, setCurrentLessonTitle] = useState<string | null>(null);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Background Jobs
  const [jobs, setJobs] = useState<BackgroundJob[]>([]);
  const jobControllers = useRef<Map<string, AbortController>>(new Map());

  const cancelJob = (id: string) => {
      const controller = jobControllers.current.get(id);
      if (controller) {
          controller.abort();
          jobControllers.current.delete(id);
      }
      setJobs(prev => prev.filter(j => j.id !== id));
  };
  
  // Update a job in the queue
  const updateJob = (id: string, updates: Partial<BackgroundJob>) => {
      setJobs(prev => prev.map(job => job.id === id ? { ...job, ...updates } : job));
  };
  
  // Process Queue Effect
  useEffect(() => {
      const processNextJob = async () => {
          const activeJob = jobs.find(j => j.status === 'processing');
          if (activeJob) return; // Busy

          const nextJob = jobs.find(j => j.status === 'pending');
          if (!nextJob) return; // Empty Queue

          await processJob(nextJob);
      };
      
      processNextJob();
  }, [jobs]); // Re-run when jobs change (e.g. status updates)

  // Warn before unload if processing
  useEffect(() => {
      const handleBeforeUnload = (e: BeforeUnloadEvent) => {
          const isProcessing = jobs.some(j => j.status === 'processing' || j.status === 'pending');
          if (isProcessing) {
              e.preventDefault();
              e.returnValue = "Quá trình dịch đang diễn ra. Nếu tải lại trang, tiến trình sẽ bị hủy!";
              return e.returnValue;
          }
      };

      window.addEventListener('beforeunload', handleBeforeUnload);
      return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [jobs]);

  const processJob = async (job: BackgroundJob) => {
      updateJob(job.id, { status: 'processing', progress: 0 });
      let file = job.file;

      const controller = new AbortController();
      jobControllers.current.set(job.id, controller);
      
      try {
        // 1. Download if it's URL
        if (typeof file === 'string') {
            updateJob(job.id, { progress: 5 });
            const response = await fetch(file);
            if (!response.ok) throw new Error("Download failed");
            const blob = await response.blob();
            file = new File([blob], job.filename, { type: blob.type });
            updateJob(job.id, { progress: 20 });
        }
        
        // 1.5 Check Cache (Smart Skip)
        updateJob(job.id, { progress: 25 });
        const cachedData = await checkCache(file);
        if (cachedData) {
            updateJob(job.id, { status: 'completed', progress: 100, result: cachedData });
            return;
        }

        // 2. Process
        const options: ProcessingOptions = {
            generateNotes: true,
            generateFlashcards: true,
            originalLanguage: 'Auto Detect'
        };

        const data = await processMediaWithGemini(
            file,
            options,
            (status, pct) => {
                if (pct) updateJob(job.id, { progress: pct });
            },
            controller.signal
        );

        // 3. Save
        await saveToCache(file, data);
        updateJob(job.id, { status: 'completed', progress: 100, result: data });

      } catch (err: any) {
          if (err.message === "Processing cancelled by user." || err.name === 'AbortError') {
              console.log("Job cancelled:", job.filename);
              // Job is likely already removed from queue by cancelJob, but if not:
              updateJob(job.id, { status: 'error', error: 'Cancelled' });
              return;
          }
          console.error("Job failed", err);
          updateJob(job.id, { status: 'error', error: err.message });
      }
  };

  const addJob = (file: File | string, filename: string) => {
      // 1. Check if already queued
      const existing = jobs.find(j => j.filename === filename && j.status !== 'error');
      if (existing) {
          if (existing.status === 'completed') {
              openJobResult(existing);
          } else {
              alert("Video này đang được xử lý trong hàng chờ. Vui lòng kiểm tra tiến trình ở góc màn hình.");
          }
          return;
      }
      
      // 2. Check cache (Fast check)
      // Note: Full cache check happens in processJob too, but good to check here if possible
      // skipped for simplicity, processJob will handle it or user can check visually in library
      
      const newJob: BackgroundJob = {
          id: Date.now().toString(),
          file,
          filename,
          status: 'pending',
          progress: 0,
          createdAt: Date.now()
      };
      
      setJobs(prev => [...prev, newJob]);
  };

  const openJobResult = (job: BackgroundJob) => {
      if (!job.result) {
          console.warn("Job marked completed but has no result data", job);
          return;
      }
      setCurrentFile(job.file);
      setProcessedData(job.result);
      setCurrentLessonTitle(job.filename);
      setAppState(AppState.DASHBOARD);
  };

  const handleStartProcessing = (file: File | string, options: ProcessingOptions, cachedData?: ProcessedData) => {
      // 0. If cached data provided by FileUpload (Fast Path), skip queue
      if (cachedData) {
          setCurrentFile(file);
          setProcessedData(cachedData);
          let name = typeof file === 'string' ? file.split('/').pop() || 'video' : file.name;
          setCurrentLessonTitle(name);
          setAppState(AppState.DASHBOARD);
          return;
      }

      let name = typeof file === 'string' ? file.split('/').pop() || 'video' : file.name;
      addJob(file, name);
      // Go to library to see queue
      setShowLibrary(true);
      setCustomUploadMode(false);
  };

  const resetApp = () => {
    setAppState(AppState.UPLOAD);
    setCurrentFile(null);
    setCurrentLessonTitle(null);
    setProcessedData(null);
    setErrorMsg(null);
    // Stay in library if we were there, but if we were in custom upload, go back to main menu?
    // User wants "Main Interface" to be the Course List.
    // So if we finish processing, we should probably go back to Dashboard or Main Menu.
    // Ideally, onBack from Dashboard -> Reset -> Main Menu (if not library)
  };

  const goHome = () => {
      resetApp();
      setShowLibrary(false);
      setCustomUploadMode(false);
      setShowLanding(false); // Go to Main Menu, not Landing Page
  };

  const goLanding = () => {
      localStorage.removeItem('started_flow');
      resetApp();
      setShowLibrary(false);
      setCustomUploadMode(false);
      setShowLanding(true);
  }
  
  const handleSelectCourse = (course: Course) => {
      // For now we only have one course structure, so we just toggle library.
      // In future: setCurrentCourse(course);
      setShowLibrary(true);
      setCustomUploadMode(false);
  };

  const handleSelectLesson = async (lesson: Lesson) => {
      // 1. If lesson has pre-calculated dummy data, load immediately (Legacy)
      if (lesson.data) {
          setShowLibrary(false);
          setCurrentFile(lesson.videoUrl || "");
          setProcessedData(lesson.data);
          setCurrentLessonTitle(lesson.title);
          setAppState(AppState.DASHBOARD);
          return;
      }

      // 1.5 Check Cache by Filename (Fast Open)
      try {
          // We save files using lesson.title in processJob, so check that first
          let cachedData = await getFromCacheByFilename(lesson.title);
          
          // Fallback: Check by URL filename just in case
          if (!cachedData && lesson.videoUrl) {
              const urlFilename = decodeURIComponent(lesson.videoUrl.split('/').pop() || "");
              cachedData = await getFromCacheByFilename(urlFilename);
          }

          if (cachedData) {
               console.log("Found cached lesson data!");
               setShowLibrary(false);
               setCurrentFile(lesson.videoUrl || "");
               setProcessedData(cachedData);
               setCurrentLessonTitle(lesson.title);
               setAppState(AppState.DASHBOARD);
               return;
          }
      } catch (e) {
          console.error("Cache check failed", e);
      }
      
      // 2. Add to Queue Logic
      const fileName = lesson.title;
      addJob(lesson.videoUrl || "", fileName);
  };

  // 1. Landing Page View
  if (showLanding) {
      return (
        <LandingPage 
            onGetStarted={() => {
                localStorage.setItem('started_flow', 'true');
                setShowLanding(false);
            }} 
        />
      );
  }
  
  // Global Queue Widget
  const QueueWidget = () => (
      <ProcessingQueue 
        jobs={jobs} 
        onOpenJob={openJobResult}
        onCancelJob={cancelJob}
        onClearCompleted={() => setJobs(prev => prev.filter(j => j.status !== 'completed'))} 
      />
  );
  
  // 2. Library View
  if (showLibrary) {
      return (
        <>
            <CourseLibrary onSelectLesson={handleSelectLesson} onBack={goHome} />
            <QueueWidget />
        </>
      );
  }

  // 3. Main Menu (Default when logged in)
  if (appState === AppState.UPLOAD && !customUploadMode) {
      return (
          <>
            <MainMenu 
                onSelectCourse={handleSelectCourse}
                onOpenUpload={() => setCustomUploadMode(true)}
                onBack={goLanding}
            />
            <QueueWidget />
          </>
      );
  }

  // 4. Dashboard View (When file is processed)
  if (appState === AppState.DASHBOARD && currentFile && processedData) {
      return (
        <>
            <Dashboard file={currentFile} data={processedData} onBack={resetApp} title={currentLessonTitle} />
            <QueueWidget />
        </>
      );
  }

  // 5. Custom Upload / Processing / Error View
  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans selection:bg-white selection:text-black">
        {/* Simple App Header */}
        <header className="absolute top-0 w-full p-8 flex justify-between items-center z-20">
            <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity" onClick={goHome}>
                 <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg shadow-white/20">
                    <div className="w-2 h-2 bg-black rounded-full"></div>
                 </div>
                 <span className="font-bold text-lg text-white tracking-tight">BilingualFlow</span>
            </div>
            
            <button onClick={goHome} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                Back to Dashboard
            </button>
        </header>

        <main className="container mx-auto px-4 min-h-screen pt-24 pb-12 flex flex-col justify-center items-center relative z-10">
            
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Error Message Display */}
            {appState === AppState.ERROR && (
                <div className="w-full max-w-2xl mb-8 animate-fade-in-up relative z-20">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center shadow-2xl backdrop-blur-md">
                        <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3 text-red-400">
                            <span className="text-2xl">⚠</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Đã xảy ra lỗi xử lý AI</h3>
                        <p className="text-red-300 text-sm mb-6 max-h-[100px] overflow-auto bg-black/20 p-2 rounded">{errorMsg}</p>
                        
                        <div className="flex gap-3 justify-center">
                            <button 
                                onClick={resetApp} 
                                className="px-6 py-2 bg-gray-600/50 text-white font-medium rounded-lg hover:bg-gray-600 transition-colors border border-white/10"
                            >
                                Thử lại
                            </button>
                            <button 
                                onClick={() => {
                                    // Fallback: Watch without AI
                                    const mockData: ProcessedData = { subtitles: [], notes: [], flashcards: [] };
                                    setProcessedData(mockData);
                                    setAppState(AppState.DASHBOARD);
                                    setErrorMsg(null);
                                }} 
                                className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors shadow-lg shadow-white/5"
                            >
                                Vẫn xem Video (Bỏ qua AI)
                            </button>
                        </div>
                    </div>
                </div>
            )}
            
            <div className="relative z-20 w-full">
                <FileUpload 
                    onStart={handleStartProcessing} 
                    isLoading={false}
                />
            </div>
        </main>

        <footer className="absolute bottom-6 w-full text-center text-gray-600 text-xs font-mono">
            <p>&copy; {new Date().getFullYear()} BilingualFlow • Gemini 1.5 Architecture</p>
        </footer>
    </div>
  );
};

export default App;