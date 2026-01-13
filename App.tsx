import React, { useState, useRef } from 'react';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import { AppState, ProcessedData, ProcessingOptions } from './types';
import { processMediaWithGemini } from './services/geminiService';
import { saveToCache } from './services/cacheService';
import { Sparkles } from 'lucide-react';

import CourseLibrary from './components/CourseLibrary';
import MainMenu from './components/MainMenu';
import { Lesson, Course } from './data/courseData';

const App: React.FC = () => {
  // New State: Show Landing Page initially - Check localStorage
  const [showLanding, setShowLanding] = useState(() => !localStorage.getItem('started_flow'));
  const [showLibrary, setShowLibrary] = useState(false); 
  const [customUploadMode, setCustomUploadMode] = useState(false); // NEW: Explicit mode for file upload tool

  const [appState, setAppState] = useState<AppState>(AppState.UPLOAD);
  const [currentFile, setCurrentFile] = useState<File | string | null>(null);
  const [currentLessonTitle, setCurrentLessonTitle] = useState<string | null>(null);
  const [processedData, setProcessedData] = useState<ProcessedData | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);

  // Ref to hold the abort controller
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleStartProcessing = async (file: File | string, options: ProcessingOptions, cachedData?: ProcessedData) => {
    setCurrentFile(file);
    setAppState(AppState.PROCESSING);
    setErrorMsg(null);
    setStatusMessage("Initializing...");
    setProgress(5);

    // If cached data is provided, skip the API call
    if (cachedData) {
        setStatusMessage("Loading from cache...");
        setProgress(100);
        setTimeout(() => {
            setProcessedData(cachedData);
            setAppState(AppState.DASHBOARD);
        }, 800); // Small fake delay for UX smoothness
        return;
    }

    // Create a new controller for this operation
    const controller = new AbortController();
    abortControllerRef.current = controller;
    
    // Check if it's a URL (Course Mode) - Bypass Upload
    if (typeof file === 'string') {
        try {
            setStatusMessage("Downloading video for AI Analysis...");
            setProgress(10);
            
            // Fetch the file from the URL to allow AI processing
            const response = await fetch(file, { signal: controller.signal });
            if (!response.ok) throw new Error(`Failed to fetch video: ${response.statusText}`);
            
            const blob = await response.blob();
            // Extract a clean filename from the URL
            let fileName = file.split('/').pop() || "video.mp4";
            try { fileName = decodeURIComponent(fileName); } catch (e) {}
            
            // Create a File object from the Blob
            const downloadedFile = new File([blob], fileName, { type: blob.type || 'video/mp4' });
            
            // Update the file variable to point to the real file object
            file = downloadedFile;
            
            setStatusMessage("Checking cache...");
            // EXTRA CHECK: Check if we have this file in cache already?
            const service = await import('./services/cacheService') as any;
            const checkCache = service.checkCache || service.getFromCache;
            const cachedResult = checkCache ? await checkCache(downloadedFile) : null;
            
            if (cachedResult) {
                console.log("Found cached data for downloaded file!");
                setStatusMessage("Loading from cache...");
                setProgress(100);
                setTimeout(() => {
                    setProcessedData(cachedResult);
                    setAppState(AppState.DASHBOARD);
                }, 500);
                return;
            }

            setStatusMessage("Video downloaded. Starting AI...");
            setProgress(20);
        } catch (err: any) {
             console.error("Error downloading file:", err);
             // SHOW ERROR to user instead of silent fail
             setErrorMsg(`Không thể tải video để dịch: ${err.message}. (Bạn vẫn có thể xem video nhưng không có AI)`);
             
             // Fallback to mock data if download fails, so user can at least watch
             const mockData: ProcessedData = { subtitles: [], notes: [], flashcards: [] };
             setProcessedData(mockData);
             setAppState(AppState.DASHBOARD);
             return;
        }
    }

    try {
      const data = await processMediaWithGemini(
        file, 
        options, 
        (status, pct) => {
            setStatusMessage(status);
            if (pct !== undefined) setProgress(pct);
        },
        controller.signal // Pass signal to service
      );
      
      // Save result to cache for future use
      await saveToCache(file, data);

      setProgress(100);
      setProcessedData(data);
      setAppState(AppState.DASHBOARD);
    } catch (err: any) {
      if (err.message === "Processing cancelled by user.") {
          resetApp();
          return;
      }
      
      console.error(err);
      setErrorMsg(err.message || "An unexpected error occurred during processing.");
      setAppState(AppState.ERROR);
      setProgress(0);
    } finally {
        setStatusMessage(null);
        abortControllerRef.current = null;
    }
  };

  const handleCancel = () => {
      if (abortControllerRef.current) {
          abortControllerRef.current.abort();
          setStatusMessage("Cancelling...");
      }
  };

  const resetApp = () => {
    setAppState(AppState.UPLOAD);
    setCurrentFile(null);
    setCurrentLessonTitle(null);
    setProcessedData(null);
    setErrorMsg(null);
    setStatusMessage(null);
    setProgress(0);
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

  const handleSelectLesson = (lesson: Lesson) => {
      setShowLibrary(false);
      setCustomUploadMode(false); // Just in case
      setCurrentLessonTitle(lesson.title);

      // 1. If lesson has pre-calculated data, load immediately
      if (lesson.data) {
          setCurrentFile(lesson.videoUrl || "https://media.w3.org/2010/05/sintel/trailer_hd.mp4");
          setProcessedData(lesson.data);
          setAppState(AppState.DASHBOARD);
          return;
      }
      
      // 2. Otherwise try to process
      const options: ProcessingOptions = {
          generateNotes: true,
          generateFlashcards: true,
          originalLanguage: 'Auto Detect'
      };
      
      handleStartProcessing(lesson.videoUrl || "https://media.w3.org/2010/05/sintel/trailer_hd.mp4", options);
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
  
  // 2. Library View
  if (showLibrary) {
      return <CourseLibrary onSelectLesson={handleSelectLesson} onBack={goHome} />;
  }

  // 3. Main Menu (Default when logged in)
  if (appState === AppState.UPLOAD && !customUploadMode) {
      return (
          <MainMenu 
             onSelectCourse={handleSelectCourse}
             onOpenUpload={() => setCustomUploadMode(true)}
             onBack={goLanding}
          />
      );
  }

  // 4. Dashboard View (When file is processed)
  if (appState === AppState.DASHBOARD && currentFile && processedData) {
      return <Dashboard file={currentFile} data={processedData} onBack={resetApp} title={currentLessonTitle} />;
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
                onCancel={handleCancel}
                isLoading={appState === AppState.PROCESSING}
                statusMessage={statusMessage}
                progress={progress}
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