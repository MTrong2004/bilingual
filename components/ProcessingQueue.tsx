import React, { useState } from 'react';
import { BackgroundJob } from '../types';
import { Loader2, CheckCircle2, AlertCircle, X, ChevronUp, ChevronDown, Play, Trash2 } from 'lucide-react';

interface ProcessingQueueProps {
    jobs: BackgroundJob[];
    onOpenJob: (job: BackgroundJob) => void;
    onCancelJob?: (jobId: string) => void;
    onClearCompleted: () => void;
}

const ProcessingQueue: React.FC<ProcessingQueueProps> = ({ jobs, onOpenJob, onCancelJob, onClearCompleted }) => {
    const [isExpanded, setIsExpanded] = useState(true);

    if (jobs.length === 0) return null;

    const activeJobs = jobs.filter(j => j.status === 'processing' || j.status === 'pending');
    const completedJobs = jobs.filter(j => j.status === 'completed' || j.status === 'error');
    
    const totalProgress = activeJobs.length > 0 
        ? activeJobs.reduce((acc, job) => acc + job.progress, 0) / activeJobs.length 
        : 100;

    if (!isExpanded) {
        return (
            <div 
                className="fixed bottom-6 right-6 z-50 bg-[#111] border border-white/10 rounded-full p-1 shadow-2xl cursor-pointer hover:scale-105 transition-transform group"
                onClick={() => setIsExpanded(true)}
            >
                <div className="relative w-12 h-12 flex items-center justify-center bg-indigo-600 rounded-full">
                    {activeJobs.length > 0 ? (
                        <>
                            <Loader2 className="w-6 h-6 text-white animate-spin" />
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-black">
                                {activeJobs.length}
                            </span>
                            {/* Circular Progress (Simple CSS) */}
                            <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                                <circle 
                                    cx="24" cy="24" r="22" 
                                    fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.2" 
                                />
                                <circle 
                                    cx="24" cy="24" r="22" 
                                    fill="none" stroke="white" strokeWidth="2" 
                                    strokeDasharray="138"
                                    strokeDashoffset={138 - (138 * totalProgress) / 100}
                                    strokeLinecap="round"
                                />
                            </svg>
                        </>
                    ) : (
                        <CheckCircle2 className="w-6 h-6 text-white" />
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 w-80 bg-[#111] border border-white/10 rounded-2xl shadow-2xl overflow-hidden font-sans animate-slide-up">
            {/* Header */}
            <div className="bg-white/5 p-3 flex justify-between items-center cursor-pointer" onClick={() => setIsExpanded(false)}>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    {activeJobs.length > 0 ? (
                        <>
                           <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                           Processing ({activeJobs.length})
                        </>
                    ) : (
                        <>
                            <CheckCircle2 className="w-4 h-4 text-green-400" />
                            Tasks Completed
                        </>
                    )}
                </h3>
                <button className="text-gray-400 hover:text-white">
                    <ChevronDown size={16} />
                </button>
            </div>

            {/* List */}
            <div className="max-h-60 overflow-y-auto p-2 space-y-2">
                {jobs.map(job => (
                    <div key={job.id} className="bg-white/5 rounded-lg p-3 hover:bg-white/10 transition-colors relative group">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-xs font-bold text-gray-200 truncate max-w-[180px]" title={job.filename}>
                                {job.filename}
                            </span>
                            {job.status === 'processing' && (
                                <span className="text-[10px] text-indigo-400 font-mono">{Math.round(job.progress)}%</span>
                            )}
                            {job.status === 'completed' && (
                                <button 
                                    onClick={() => onOpenJob(job)} 
                                    className="text-xs bg-green-500/20 text-green-400 px-2 py-0.5 rounded hover:bg-green-500/30"
                                >
                                    Open
                                </button>
                            )}
                        </div>

                        {/* Progress Bar for Active Jobs */}
                        {job.status === 'processing' && (
                            <div className="w-full h-1 bg-gray-700 rounded-full overflow-hidden mb-1">
                                <div 
                                    className="h-full bg-indigo-500 transition-all duration-300"
                                    style={{ width: `${job.progress}%` }}
                                ></div>
                            </div>
                        )}
                        
                        {job.status === 'pending' && (
                            <div className="text-[10px] text-gray-500 italic">Waiting in queue...</div>
                        )}

                        {job.status === 'error' && (
                            <div className="text-[10px] text-red-400 flex items-center gap-1">
                                <AlertCircle size={10} />
                                {job.error || 'Failed'}
                            </div>
                        )}

                        {/* Cancel/Remove Button (Hover) */}
                         <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                if (job.status === 'processing' || job.status === 'pending') {
                                    onCancelJob?.(job.id);
                                } else {
                                    // Remove just this one? For now we have clear all
                                    // But maybe we want to remove individual completed
                                }
                            }}
                            className="absolute right-2 bottom-2 p-1 text-gray-500 hover:text-red-400 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                            title={job.status === 'processing' ? "Cancel" : "Remove"}
                        >
                            {job.status === 'processing' || job.status === 'pending' ? <X size={14} /> : null}
                        </button>
                    </div>
                ))}
            </div>

            {/* Footer actions */}
            {completedJobs.length > 0 && (
                <div className="p-2 border-t border-white/5 flex justify-end">
                    <button 
                        onClick={onClearCompleted}
                        className="text-xs text-gray-400 hover:text-white flex items-center gap-1 px-2 py-1 rounded hover:bg-white/5"
                    >
                        <Trash2 size={12} />
                        Clear Completed
                    </button>
                </div>
            )}
        </div>
    );
};

export default ProcessingQueue;
