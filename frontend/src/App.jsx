import { useState } from 'react';
import ResumeUploader from './components/ResumeUploader';
import PastResumesTable from './components/PastResumesTable';

function App() {
  const [activeTab, setActiveTab] = useState('analysis');

  return (
    <div className="w-full max-w-6xl bg-slate-900/70 border border-slate-700/70 shadow-[0_24px_80px_rgba(0,0,0,0.65)] rounded-3xl p-5 md:p-8 backdrop-blur-xl">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 mb-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] tracking-[0.16em] uppercase text-emerald-200/80">
              AI powered resume intelligence
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-semibold text-slate-50 tracking-tight">
            Resume Analyzer
          </h1>
          <p className="mt-1 text-sm md:text-[15px] text-slate-400 max-w-xl">
            Upload a resume, get structured insights, quality rating, and tailored
            upskilling suggestions – then revisit every analysis in a single view.
          </p>
        </div>

        <div className="flex items-center gap-3 text-xs md:text-sm text-slate-400">
          <div className="flex items-center gap-2 px-3 py-2 rounded-2xl bg-slate-800/70 border border-slate-700/80">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,0.9)]" />
            Backend status
            <span className="font-semibold text-emerald-300">Connected</span>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex border-b border-slate-700 mb-4">
        <div className="inline-flex rounded-full bg-slate-900/70 p-1 border border-slate-700/70">
          <button
            type="button"
            onClick={() => setActiveTab('analysis')}
            className={`px-4 md:px-5 py-1.5 text-xs md:text-sm font-medium rounded-full transition-all ${
              activeTab === 'analysis'
                ? 'bg-slate-50 text-slate-900 shadow-sm'
                : 'text-slate-300 hover:text-slate-50'
            }`}
          >
            Resume Analysis
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`px-4 md:px-5 py-1.5 text-xs md:text-sm font-medium rounded-full transition-all ${
              activeTab === 'history'
                ? 'bg-slate-50 text-slate-900 shadow-sm'
                : 'text-slate-300 hover:text-slate-50'
            }`}
          >
            Historical Viewer
          </button>
        </div>
      </div>

      {/* Tab content */}
      <div className="mt-4">
        {activeTab === 'analysis' && <ResumeUploader />}
        {activeTab === 'history' && <PastResumesTable />}
      </div>
    </div>
  );
}

export default App;
