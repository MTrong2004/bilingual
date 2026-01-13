import React, { useState } from 'react';
import { Course, COURSES } from '../data/courseData';
import { PlayCircle, Upload, BookOpen, Clock, Zap, Settings, Download, X, ArrowLeft, RotateCcw } from 'lucide-react';
import { getAllCacheEntries, importCacheEntries } from '../services/cacheService';

interface MainMenuProps {
  onSelectCourse: (course: Course) => void;
  onOpenUpload: () => void;
  onBack: () => void;
}

const MainMenu: React.FC<MainMenuProps> = ({ onSelectCourse, onOpenUpload, onBack }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleExportData = async () => {
      setIsExporting(true);
      try {
          const allData = await getAllCacheEntries();
          const dataStr = JSON.stringify(allData, null, 2);
          const blob = new Blob([dataStr], { type: "application/json" });
          const url = URL.createObjectURL(blob);
          
          const a = document.createElement('a');
          a.href = url;
          a.download = `bilingual-flow-export-${new Date().toISOString().slice(0,10)}.json`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
      } catch (e) {
          console.error("Export failed", e);
          alert("Failed to export data");
      } finally {
          setIsExporting(false);
      }
  };
  
  const handleImportClick = () => {
      fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      if (!confirm("This will merge imported data with your current data. Existing files with same ID will be overwritten. Continue?")) {
          e.target.value = "";
          return;
      }
      
      setIsImporting(true);
      try {
          const text = await file.text();
          const data = JSON.parse(text);
          
          if (!Array.isArray(data)) throw new Error("Invalid JSON format (Expected an array)");
          
          await importCacheEntries(data);
          alert(`Successfully imported/updated ${data.length} records!`);
          window.location.reload(); 
      } catch (err: any) {
          console.error("Import failed", err);
          alert("Import failed: " + err.message);
      } finally {
          setIsImporting(false);
          if (fileInputRef.current) fileInputRef.current.value = "";
      }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans selection:bg-indigo-500/30 relative">
        
        <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".json" 
            onChange={handleFileChange} 
        />

        {/* Settings Modal */}
        {showSettings && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={() => setShowSettings(false)}>
                <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
                    <button 
                        onClick={() => setShowSettings(false)}
                        className="absolute top-4 right-4 text-gray-500 hover:text-white"
                    >
                        <X size={20} />
                    </button>
                    
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <Settings className="w-5 h-5 text-indigo-400" />
                        Settings
                    </h2>

                    <div className="space-y-4">
                        <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                            <h3 className="font-bold text-gray-200 mb-2">Data Management</h3>
                            <p className="text-xs text-gray-400 mb-4">
                                Download all your locally translated content as a JSON file. 
                            </p>
                            <button 
                                onClick={handleExportData}
                                disabled={isExporting}
                                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2 mb-3"
                            >
                                {isExporting ? (
                                    <span>Exporting...</span>
                                ) : (
                                    <>
                                        <Download size={16} />
                                        Export All Data (.json)
                                    </>
                                )}
                            </button>

                            <button 
                                onClick={handleImportClick}
                                disabled={isImporting}
                                className="w-full py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                            >
                                {isImporting ? (
                                    <span>Importing...</span>
                                ) : (
                                    <>
                                        <RotateCcw size={16} />
                                        Import Data (.json)
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )}

        {/* Header */}
        <header className="max-w-6xl mx-auto flex justify-between items-center mb-16 pt-8">
            <div className="flex items-center gap-3">
                 <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                    <div className="w-3 h-3 bg-white rounded-full"></div>
                 </div>
                 <span className="font-bold text-2xl tracking-tight">BilingualFlow</span>
            </div>
            <div className="flex items-center gap-4">
                 <button 
                    onClick={() => setShowSettings(true)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors text-sm font-medium px-3 py-2 hover:bg-white/5 rounded-lg"
                 >
                     <Settings size={16} />
                     Settings
                 </button>
                 <div className="w-px h-4 bg-white/10"></div>
                 <button onClick={onBack} className="text-gray-400 hover:text-white transition-colors text-sm font-medium">
                     Log Out
                 </button>
            </div>
        </header>

        <main className="max-w-6xl mx-auto">
            {/* Hero Welcome */}
            <div className="mb-16 relative">
                <button 
                  onClick={onBack}
                  className="absolute -top-12 lg:top-1 right-0 lg:right-auto lg:-left-16 p-2 text-gray-500 hover:text-white hover:bg-white/10 rounded-full transition-all"
                  title="Back to Home Page"
                >
                    <ArrowLeft className="w-6 h-6" />
                </button>

                <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-4">
                    Welcome back, Learner.
                </h1>
                <p className="text-gray-400 text-lg max-w-2xl">
                    Continue your bilingual journey. Select a course or analyze a new video.
                </p>
            </div>

            {/* Content Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                
                {/* Courses Section (Main) */}
                <div className="md:col-span-8 space-y-8">
                    <div className="flex items-center gap-3 mb-6">
                        <BookOpen className="w-5 h-5 text-indigo-400" />
                        <h2 className="text-xl font-bold">Your Courses</h2>
                    </div>

                    <div className="grid grid-cols-1 gap-6">
                        {COURSES.map(course => (
                            <div 
                                key={course.id}
                                onClick={() => onSelectCourse(course)}
                                className="group relative bg-[#111] border border-white/5 hover:border-indigo-500/50 rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1"
                            >
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                
                                <div className="flex flex-col md:flex-row h-full">
                                    {/* Thumbnail */}
                                    <div className="md:w-64 h-48 md:h-auto bg-gray-800 overflow-hidden relative">
                                        <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent md:bg-gradient-to-r" />
                                        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-xs font-bold bg-white/10 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                            <PlayCircle className="w-3 h-3" />
                                            {course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} Lessons
                                        </div>
                                    </div>

                                    {/* Info */}
                                    <div className="p-6 flex-1 flex flex-col justify-center relative z-10">
                                        <h3 className="text-2xl font-bold text-gray-100 group-hover:text-white mb-2">
                                            {course.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm leading-relaxed mb-6 line-clamp-2">
                                            {course.description}
                                        </p>
                                        
                                        <div className="flex items-center gap-6 text-xs text-gray-500 font-mono">
                                            <span className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                Updated Today
                                            </span>
                                            <span className="flex items-center gap-2 text-indigo-400">
                                                <Zap className="w-4 h-4" />
                                                Active
                                            </span>
                                        </div>
                                    </div>
                                    
                                    {/* Arrow */}
                                    <div className="px-6 flex items-center justify-center border-l border-white/5 text-gray-600 group-hover:text-white transition-colors">
                                        <span className="text-3xl">→</span>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {/* Coming Soon Placeholder */}
                        <div className="border border-dashed border-white/10 rounded-2xl p-8 text-center bg-white/5 opacity-50 hover:opacity-100 transition-opacity">
                            <p className="text-gray-400 text-sm">More courses coming soon...</p>
                        </div>
                    </div>
                </div>

                {/* Sidebar / Tools */}
                <div className="md:col-span-4 space-y-8">
                     <div className="flex items-center gap-3 mb-6">
                        <Zap className="w-5 h-5 text-yellow-400" />
                        <h2 className="text-xl font-bold">Quick Tools</h2>
                    </div>

                    <button 
                        onClick={onOpenUpload}
                        className="w-full bg-[#111] hover:bg-[#161616] border border-white/10 p-6 rounded-2xl text-left transition-all hover:border-white/20 group"
                    >
                        <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-indigo-500 group-hover:text-white transition-colors text-gray-400">
                             <Upload className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-gray-200 mb-1">Analyze Video</h3>
                        <p className="text-xs text-gray-500">
                            Upload a standalone video or paste a URL for instant analysis.
                        </p>
                    </button>

                    <div className="bg-gradient-to-b from-indigo-900/20 to-transparent p-6 rounded-2xl border border-indigo-500/20">
                         <h3 className="font-bold text-indigo-300 text-sm mb-2">Did you know?</h3>
                         <p className="text-xs text-indigo-200/60 leading-relaxed">
                             You can click on any generated flashcard to see the context sentence from the video instantly.
                         </p>
                    </div>
                </div>

            </div>
        </main>
    </div>
  );
};

export default MainMenu;