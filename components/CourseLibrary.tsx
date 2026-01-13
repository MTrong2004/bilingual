import React, { useState } from 'react';
import { Module, Lesson, COURSE_CONTENT } from '../data/courseData';
import { PlayCircle, Lock, MonitorPlay, ChevronRight, ChevronDown } from 'lucide-react';

interface CourseLibraryProps {
  onSelectLesson: (lesson: Lesson) => void;
  onBack: () => void;
}

const CourseLibrary: React.FC<CourseLibraryProps> = ({ onSelectLesson, onBack }) => {
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>({ "m1": true });

  const toggleModule = (modId: string) => {
    setExpandedModules(prev => ({ ...prev, [modId]: !prev[modId] }));
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8 font-sans">
      <div className="max-w-5xl mx-auto">
        <header className="mb-12 flex items-center justify-between">
            <div>
                 <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-2">
                    Thư Viện Khóa Học
                 </h1>
                 <p className="text-gray-400">ZBrush Masterclass - Bilingual Edition</p>
            </div>
            <button onClick={onBack} className="text-gray-400 hover:text-white px-4 py-2 border border-white/10 rounded-lg">
                Quay lại
            </button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Main Content List */}
            <div className="md:col-span-2 space-y-6">
                {COURSE_CONTENT.map((module) => (
                    <div key={module.id} className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
                        <button 
                            onClick={() => toggleModule(module.id)}
                            className="w-full flex items-center justify-between p-6 hover:bg-white/5 transition-colors text-left"
                        >
                            <h3 className="text-xl font-bold text-gray-200">{module.title}</h3>
                            {expandedModules[module.id] ? <ChevronDown className="text-gray-500" /> : <ChevronRight className="text-gray-500" />}
                        </button>
                        
                        {expandedModules[module.id] && (
                            <div className="border-t border-white/5">
                                {module.lessons.map((lesson, idx) => (
                                    <div 
                                        key={lesson.id}
                                        onClick={() => onSelectLesson(lesson)}
                                        className="p-5 flex items-center gap-4 hover:bg-indigo-500/10 cursor-pointer transition-colors group border-b border-white/5 last:border-0"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-indigo-500 group-hover:text-white transition-all text-gray-400 font-bold text-sm">
                                            {idx + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-200 group-hover:text-white transition-colors">
                                                {lesson.title}
                                            </h4>
                                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{lesson.description}</p>
                                        </div>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 font-mono bg-black/20 px-3 py-1 rounded-full">
                                            <PlayCircle className="w-3 h-3" />
                                            {lesson.duration}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
                <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <MonitorPlay className="w-5 h-5 text-indigo-400" />
                        Tiến độ học tập
                    </h3>
                    <div className="w-full bg-black/40 h-2 rounded-full mb-2 overflow-hidden">
                        <div className="bg-indigo-500 h-full w-[0%]"></div>
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>0% Hoàn thành</span>
                        <span>0/{COURSE_CONTENT.reduce((acc, m) => acc + m.lessons.length, 0)} Bài</span>
                    </div>
                </div>

                <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center">
                    <p className="text-gray-400 text-sm mb-4">Bạn chưa bắt đầu bài học nào.</p>
                    <button className="w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-colors">
                        Học ngay
                    </button>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CourseLibrary;
