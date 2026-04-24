import React, { useState } from 'react';
import { generateShellConcept } from '../services/geminiService';
import { ShellDesign } from '../types';
import { Sparkles, Download, Printer, Loader2 } from 'lucide-react';

const ShellWorkshop: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [selectedStyle, setSelectedStyle] = useState('Cyberpunk');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedDesigns, setGeneratedDesigns] = useState<ShellDesign[]>([]);

  const handleGenerate = async () => {
    if (!prompt.trim()) return;

    setIsGenerating(true);
    try {
      const imageUrl = await generateShellConcept(prompt, selectedStyle);
      
      const newDesign: ShellDesign = {
        id: Date.now().toString(),
        prompt,
        style: selectedStyle,
        imageUrl,
        createdAt: Date.now(),
        isPrinted: false
      };

      setGeneratedDesigns(prev => [newDesign, ...prev]);
    } catch (error) {
      alert("Failed to generate shell concept. Check console.");
    } finally {
      setIsGenerating(false);
    }
  };

  const styles = ['Cyberpunk', 'Minimalist', 'Anime/Chibi', 'Organic/Nature', 'Pixel Art'];

  return (
    <div className="p-8 max-w-7xl mx-auto h-screen flex flex-col">
       <header className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-3">
           <Sparkles className="text-indigo-500" />
           Exterior Workshop
        </h1>
        <p className="text-slate-500 mt-2">
          Design custom 3D printable shells for the Standard Core Capsule using AI.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 flex-1 overflow-hidden">
        {/* Input Control Panel */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col overflow-y-auto">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Design Parameters</h2>
            
            <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Concept Prompt</label>
                <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="e.g. A lucky cat wearing sunglasses, or a dragon eating a burger..."
                    className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700 resize-none h-32"
                />
            </div>

            <div className="mb-6">
                <label className="block text-sm font-medium text-slate-700 mb-2">Art Style</label>
                <div className="grid grid-cols-2 gap-2">
                    {styles.map(style => (
                        <button
                            key={style}
                            onClick={() => setSelectedStyle(style)}
                            className={`px-3 py-2 text-sm rounded-lg border text-left transition-all ${
                                selectedStyle === style 
                                ? 'bg-indigo-50 border-indigo-500 text-indigo-700' 
                                : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                        >
                            {style}
                        </button>
                    ))}
                </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                <h4 className="text-amber-800 text-sm font-semibold mb-1">Hardware Constraint</h4>
                <p className="text-amber-700 text-xs">
                    The AI generation engine is locked to preserve the central cylindrical cavity (ø 40mm) for the HabitPod Core Capsule.
                </p>
            </div>

            <div className="mt-auto">
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 transition-all flex items-center justify-center space-x-2"
                >
                    {isGenerating ? (
                        <><Loader2 className="animate-spin" /> <span>Fabricating Concept...</span></>
                    ) : (
                        <><Sparkles size={20} /> <span>Generate Shell</span></>
                    )}
                </button>
            </div>
        </div>

        {/* Preview Grid */}
        <div className="lg:col-span-2 overflow-y-auto pr-2 pb-20">
            <h2 className="text-lg font-semibold text-slate-800 mb-4">Generated Concepts</h2>
            
            {generatedDesigns.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-96 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
                    <PaletteIcon className="w-16 h-16 text-slate-300 mb-4" />
                    <p className="text-slate-400 font-medium">No designs generated yet.</p>
                    <p className="text-slate-400 text-sm">Enter a prompt to start creating.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {generatedDesigns.map(design => (
                        <div key={design.id} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-xl transition-all">
                            <div className="aspect-square bg-slate-100 relative overflow-hidden">
                                <img 
                                    src={design.imageUrl} 
                                    alt={design.prompt} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                                />
                                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white text-xs px-2 py-1 rounded-md">
                                    {design.style}
                                </div>
                            </div>
                            <div className="p-4">
                                <p className="text-slate-800 font-medium mb-1 line-clamp-1">{design.prompt}</p>
                                <p className="text-xs text-slate-400 mb-4">Generated {new Date(design.createdAt).toLocaleTimeString()}</p>
                                
                                <div className="flex gap-2">
                                    <button className="flex-1 flex items-center justify-center space-x-2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium transition-colors">
                                        <Download size={16} />
                                        <span>STL</span>
                                    </button>
                                    <button className="flex-1 flex items-center justify-center space-x-2 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shadow-md shadow-indigo-200">
                                        <Printer size={16} />
                                        <span>Order Print</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

// Helper icon
const PaletteIcon = ({className}: {className:string}) => (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
)

export default ShellWorkshop;