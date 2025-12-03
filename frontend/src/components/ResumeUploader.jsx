import { useState } from 'react';
import { uploadResume } from '../services/api';
import ResumeDetails from './ResumeDetails';

function ResumeUploader({ analysis, setAnalysis }) {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleFileChange = (e) => {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (selected.type !== 'application/pdf') {
      setError('Please upload a PDF file only.');
      setFile(null);
      setFileName('');
      return;
    }

    setError('');
    setFile(selected);
    setFileName(selected.name);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a resume (PDF) to analyze.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await uploadResume(file);
      if (!result) {
        setError('No analysis received from server.');
        return;
      }

      // ✅ Now stored at App level
      setAnalysis(result);
    } catch (err) {
      console.error(err);
      setError('Analysis failed. Please try again or check backend logs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload card */}
      <div className="relative overflow-hidden rounded-2xl border border-slate-700/80 bg-gradient-to-br from-slate-900/80 via-slate-900/60 to-slate-900/30 p-5 md:p-6 shadow-[0_18px_40px_rgba(15,23,42,0.8)]">
        <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-16 h-56 w-56 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />

        <div className="relative flex flex-col lg:flex-row lg:items-center gap-6">
          {/* Left */}
          <div className="flex-1 space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-slate-50">
              Upload a resume to start the analysis
            </h2>
            <p className="text-sm text-slate-300 max-w-lg">
              Supported format: <span className="font-semibold text-indigo-200">PDF</span>.
              We parse the content, send it to Gemini, and return a fully structured
              analysis with rating and upskilling suggestions.
            </p>
          </div>

          {/* Right */}
          <div className="flex-1 max-w-md space-y-3">
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-600/80 hover:border-indigo-400/80 transition-colors rounded-2xl px-4 py-6 bg-slate-900/70 cursor-pointer">
              <p className="text-sm font-medium text-slate-50">Click to upload resume</p>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            <p className="text-xs text-slate-400 truncate">
              {fileName ? (
                <>
                  Selected: <span className="text-slate-100 font-medium">{fileName}</span>
                </>
              ) : (
                'No file selected yet.'
              )}
            </p>

            <button
              type="button"
              onClick={handleUpload}
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 text-sm font-semibold text-slate-950 px-4 py-2 shadow-[0_10px_30px_rgba(79,70,229,0.55)] disabled:opacity-60"
            >
              {loading ? 'Analyzing…' : 'Run AI Analysis'}
            </button>

            {error && (
              <p className="text-xs text-red-300 bg-red-950/50 border border-red-700/60 rounded-xl px-3 py-2">
                {error}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ✅ Analysis now persists across tabs */}
      {analysis && (
        <div className="animate-[fadeIn_0.35s_ease-out]">
          <ResumeDetails data={analysis} />
        </div>
      )}
    </div>
  );
}

export default ResumeUploader;
