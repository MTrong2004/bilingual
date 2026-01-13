import React, { useState, useRef } from 'react';
import { Settings, Zap, Download, RotateCcw, X, Eye, EyeOff } from 'lucide-react';
import { getAllCacheEntries, importCacheEntries } from '../services/cacheService';

interface SettingsModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
    const [apiKey, setApiKey] = useState(() => localStorage.getItem("gemini_api_key") || "");
    const [showKey, setShowKey] = useState(false);
    const [isExporting, setIsExporting] = useState(false);
    const [isImporting, setIsImporting] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSaveKey = () => {
        localStorage.setItem("gemini_api_key", apiKey.trim());
        alert("API Key saved!");
    };

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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4" onClick={onClose}>
            <div className="bg-[#111] border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl relative" onClick={e => e.stopPropagation()}>
                <button 
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-white"
                >
                    <X size={20} />
                </button>
                
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                    <Settings className="w-5 h-5 text-indigo-400" />
                    Settings
                </h2>

                <div className="space-y-4">
                    
                    {/* API Key Section */}
                    <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                        <h3 className="font-bold text-gray-200 mb-2 flex items-center gap-2">
                            <Zap className="w-4 h-4 text-yellow-400" />
                            Gemini API Key
                        </h3>
                        <p className="text-xs text-gray-400 mb-3">
                            Required for AI translation features. 
                            <a 
                                href="https://aistudio.google.com/app/apikey" 
                                target="_blank" 
                                rel="noreferrer"
                                className="text-indigo-400 hover:text-indigo-300 ml-1 underline"
                            >
                                Get key here
                            </a>
                        </p>
                        <div className="flex gap-2">
                            <div className="relative flex-1">
                                <input 
                                    type={showKey ? "text" : "password"}
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="Enter your Gemini API Key..."
                                    className="w-full bg-black/40 border border-white/10 rounded-lg pl-3 pr-10 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowKey(!showKey)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                                >
                                    {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                            <button 
                                onClick={handleSaveKey}
                                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition-colors"
                            >
                                Save
                            </button>
                        </div>
                    </div>

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
                        <input 
                            type="file" 
                            ref={fileInputRef} 
                            className="hidden" 
                            accept=".json" 
                            onChange={handleFileChange} 
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;