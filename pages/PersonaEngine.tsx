import React, { useState } from 'react';
import { PersonalityMode, RagDocument } from '../types';
import { simulatePersonaResponse } from '../services/geminiService';
import { Upload, FileText, Trash2, PlayCircle, MessageSquare } from 'lucide-react';

const PersonaEngine: React.FC = () => {
  const [activePersona, setActivePersona] = useState<PersonalityMode>(PersonalityMode.STRICT_COACH);
  const [documents, setDocuments] = useState<RagDocument[]>([
    { id: '1', name: 'Diabetic_Guidelines_v2.pdf', type: 'Medical', uploadDate: '2023-10-24' },
    { id: '2', name: 'Kids_Nutrition_Facts.txt', type: 'Educational', uploadDate: '2023-10-25' }
  ]);
  
  // Simulation State
  const [simAction, setSimAction] = useState('reaching for a chocolate bar');
  const [simResponse, setSimResponse] = useState('');
  const [isLoadingSim, setIsLoadingSim] = useState(false);

  const handleSimulate = async () => {
    setIsLoadingSim(true);
    setSimResponse('');
    
    // Construct simple RAG context from doc names for the demo
    const context = documents.map(d => `Source: ${d.name} (${d.type})`).join('; ');
    
    const response = await simulatePersonaResponse(activePersona, simAction, context);
    setSimResponse(response);
    setIsLoadingSim(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if(file) {
          setDocuments(prev => [...prev, {
              id: Date.now().toString(),
              name: file.name,
              type: 'General',
              uploadDate: new Date().toISOString().split('T')[0]
          }])
      }
  }

  return (
    <div className="p-8 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
      
      {/* Left Column: Configuration */}
      <div className="space-y-8">
        {/* Personality Selector */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-4">Personality Model</h2>
          <div className="grid grid-cols-1 gap-4">
            {Object.values(PersonalityMode).map((mode) => (
              <div 
                key={mode}
                onClick={() => setActivePersona(mode)}
                className={`cursor-pointer p-4 rounded-xl border-2 transition-all flex items-center justify-between ${
                  activePersona === mode 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-slate-100 hover:border-slate-200'
                }`}
              >
                <div>
                  <h3 className={`font-semibold ${activePersona === mode ? 'text-indigo-700' : 'text-slate-700'}`}>{mode}</h3>
                  <p className="text-sm text-slate-500">
                    {mode === PersonalityMode.STRICT_COACH && "Direct, demanding, discipline-focused."}
                    {mode === PersonalityMode.GENTLE_PARTNER && "Supportive, soft-spoken, 'we' language."}
                    {mode === PersonalityMode.ANIME_CHUUNI && "Fantasy metaphors, energetic, dramatic."}
                  </p>
                </div>
                <div className={`w-4 h-4 rounded-full border-2 ${
                    activePersona === mode ? 'border-indigo-500 bg-indigo-500' : 'border-slate-300'
                }`} />
              </div>
            ))}
          </div>
        </section>

        {/* RAG Knowledge Base */}
        <section className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-center mb-4">
                 <h2 className="text-xl font-bold text-slate-900">Knowledge Base (RAG)</h2>
                 <label className="cursor-pointer bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-lg text-sm font-medium flex items-center space-x-2 transition-colors">
                    <Upload size={16} />
                    <span>Upload Doc</span>
                    <input type="file" className="hidden" onChange={handleFileUpload} />
                 </label>
            </div>
            
            <div className="space-y-3">
                {documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg group">
                        <div className="flex items-center space-x-3 overflow-hidden">
                            <div className="p-2 bg-white rounded-md text-indigo-500 shadow-sm">
                                <FileText size={18} />
                            </div>
                            <div className="truncate">
                                <p className="text-sm font-medium text-slate-700 truncate">{doc.name}</p>
                                <p className="text-xs text-slate-400">{doc.type} • {doc.uploadDate}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => setDocuments(docs => docs.filter(d => d.id !== doc.id))}
                            className="text-slate-300 hover:text-red-500 transition-colors"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
                {documents.length === 0 && (
                    <p className="text-center text-slate-400 text-sm py-4">No documents uploaded. AI relies on general knowledge.</p>
                )}
            </div>
        </section>
      </div>

      {/* Right Column: Simulation Playground */}
      <div className="bg-slate-900 rounded-2xl p-8 flex flex-col text-white shadow-xl relative overflow-hidden">
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
         
         <div className="flex items-center space-x-3 mb-6 relative z-10">
            <div className="p-2 bg-indigo-500 rounded-lg">
                <PlayCircle size={24} className="text-white" />
            </div>
            <div>
                <h2 className="text-xl font-bold">Simulator</h2>
                <p className="text-indigo-200 text-sm">Test personality & RAG response</p>
            </div>
         </div>

         <div className="flex-1 space-y-6 relative z-10">
             <div>
                 <label className="text-sm text-indigo-300 font-medium uppercase tracking-wider mb-2 block">User Action</label>
                 <input 
                    type="text" 
                    value={simAction}
                    onChange={(e) => setSimAction(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 text-white rounded-xl p-4 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                    placeholder="Describe what the user is doing..."
                 />
             </div>

             <button 
                onClick={handleSimulate}
                disabled={isLoadingSim}
                className="w-full py-3 bg-gradient-to-r from-indigo-500 to-violet-500 hover:from-indigo-400 hover:to-violet-400 rounded-xl font-semibold shadow-lg shadow-indigo-900/50 transition-all"
             >
                {isLoadingSim ? 'Processing Logic...' : 'Test Response'}
             </button>

             <div className="border-t border-slate-700 pt-6">
                 <label className="text-sm text-indigo-300 font-medium uppercase tracking-wider mb-2 block flex items-center gap-2">
                    <MessageSquare size={16} />
                    AI Response
                 </label>
                 <div className="bg-slate-800/50 rounded-xl p-6 min-h-[160px] border border-slate-700 font-mono text-sm leading-relaxed relative">
                    {simResponse ? (
                        <p className="typing-effect">{simResponse}</p>
                    ) : (
                        <p className="text-slate-500 italic">Waiting for input simulation...</p>
                    )}
                    {isLoadingSim && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-800/80 backdrop-blur-sm rounded-xl">
                            <div className="flex space-x-1">
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0s'}}></div>
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                                <div className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0.4s'}}></div>
                            </div>
                        </div>
                    )}
                 </div>
             </div>
         </div>
      </div>

    </div>
  );
};

export default PersonaEngine;