import React, { useState, useRef } from 'react';
import FileUpload from './components/FileUpload';
import Dashboard from './components/Dashboard';
import LandingPage from './components/LandingPage';
import { AppState, ProcessedData, ProcessingOptions } from './types';
import { processMediaWithGemini } from './services/geminiService';
import { saveToCache } from './services/cacheService';
import { Sparkles } from 'lucide-react';

import CourseLibrary from './components/CourseLibrary';
import { Lesson } from './data/courseData';

const App: React.FC = () => {
  // New State: Show Landing Page initially
  const [showLanding, setShowLanding] = useState(true);
  const [showLibrary, setShowLibrary] = useState(false); // NEW: Library Mode

  const [appState, setAppState] = useState<AppState>(AppState.UPLOAD);
  const [currentFile, setCurrentFile] = useState<File | string | null>(null);
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
    
    // Check if it's a URL (Course Mode) - Bypass Upload
    if (typeof file === 'string') {
        // TODO: In real app, fetch subtitle JSON from URL if available.
        // For now, we simulate "No subtitles yet" or dummy data for the URL video.
        // Actually, we can use Gemini to generate subs for the URL if we can fetch it?
        // No, current logic requires File object for upload.
        // LIMITATION: URL mode currently supports only playing, OR we need to fetch Blob.
        
        // TEMPORARY FIX: If URL, we assume it's just raw playing or we skip AI for now
        // But the user expects AI features.
        // Let's create a "Mock" processed data for now so they can at least watch.
        
        const mockData: ProcessedData = {
            subtitles: [],
            notes: [],
            flashcards: []
        };
        setProcessedData(mockData);
        setAppState(AppState.DASHBOARD);
        return;
    }

    // Create a new controller
    const controller = new AbortController();
    abortControllerRef.current = controller;

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
    setProcessedData(null);
    setErrorMsg(null);
    setStatusMessage(null);
    setProgress(0);
  };

  const goHome = () => {
      resetApp();
      setShowLibrary(false);
      setShowLanding(true);
  };
  
  const handleSelectLesson = (lesson: Lesson) => {
      setShowLibrary(false);

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
            onGetStarted={() => setShowLanding(false)} 
            // We can add a "Library" button to LandingPage later
        />
      );
  }
  
  // 2. Library View
  if (showLibrary) {
      return <CourseLibrary onSelectLesson={handleSelectLesson} onBack={goHome} />;
  }

  // 3. Dashboard View (When file is processed)
  if (appState === AppState.DASHBOARD && currentFile && processedData) {
      return <Dashboard file={currentFile} data={processedData} onBack={resetApp} />;
  }

  // 3. Main App View (Upload / Processing / Error)
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
            {appState === AppState.UPLOAD && !showLibrary && (
                <div className="flex gap-4">
                    <button onClick={() => setShowLibrary(true)} className="text-sm font-medium text-indigo-400 hover:text-indigo-300 transition-colors">
                        Course Library
                    </button>
                    <button onClick={goHome} className="text-sm font-medium text-gray-400 hover:text-white transition-colors">
                        Back to Home
                    </button>
                </div>
            )}
        </header>

        <main className="container mx-auto px-4 h-screen flex flex-col justify-center items-center relative z-10">
            
            {/* Ambient Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>

            {/* Error Message Display */}
            {appState === AppState.ERROR && (
                <div className="w-full max-w-xl mb-8 animate-fade-in-up relative z-20">
                    <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 text-center shadow-2xl backdrop-blur-md">
                        <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-3 text-red-400">
                            <span className="text-2xl">⚠</span>
                        </div>
                        <h3 className="text-lg font-bold text-white mb-1">Processing Failed</h3>
                        <p className="text-red-300 text-sm mb-4">{errorMsg}</p>
                        <button 
                            onClick={resetApp} 
                            className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors shadow-sm"
                        >
                            Try Again
                        </button>
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