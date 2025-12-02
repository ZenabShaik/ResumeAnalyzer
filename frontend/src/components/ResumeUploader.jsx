import { useState } from 'react';
import { uploadResume } from '../services/api';
import ResumeDetails from './ResumeDetails';

function ResumeUploader() {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState(null);

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
    setAnalysis(null);

    try {
      const result = await uploadResume(file);
      if (!result) {
        setError('No analysis received from server.');
        return;
      }
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
          {/* Left: instructions */}
          <div className="flex-1 space-y-3">
            <h2 className="text-lg md:text-xl font-semibold text-slate-50">
              Upload a resume to start the analysis
            </h2>
            <p className="text-sm text-slate-300 max-w-lg">
              Supported format: <span className="font-semibold text-indigo-200">PDF</span>.
              We parse the content, send it to Gemini, and return a fully structured
              analysis with rating and upskilling suggestions.
            </p>

            <ul className="flex flex-wrap gap-3 text-xs text-slate-300/90">
              <li className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1 bg-slate-900/60">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                AI rating (1–10) & summary
              </li>
              <li className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1 bg-slate-900/60">
                <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
                Skill extraction & gaps
              </li>
              <li className="inline-flex items-center gap-2 rounded-full border border-slate-700 px-3 py-1 bg-slate-900/60">
                <span className="h-1.5 w-1.5 rounded-full bg-violet-400" />
                Tailored upskilling suggestions
              </li>
            </ul>
          </div>

          {/* Right: upload control */}
          <div className="flex-1 max-w-md space-y-3">
            <label
              className="flex flex-col items-center justify-center border-2 border-dashed border-slate-600/80 hover:border-indigo-400/80 transition-colors rounded-2xl px-4 py-6 bg-slate-900/70 cursor-pointer"
            >
              <div className="flex flex-col items-center text-center gap-2">
                <div className="h-10 w-10 rounded-2xl bg-slate-800/80 flex items-center justify-center">
                  <span className="text-xl">📄</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-slate-50">
                    Click to upload resume
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    Drag &amp; drop not implemented yet, but we pretend it is 😉
                  </p>
                </div>
              </div>
              <input
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <p className="text-xs text-slate-400 truncate">
                {fileName ? (
                  <>
                    Selected:&nbsp;
                    <span className="text-slate-100 font-medium">{fileName}</span>
                  </>
                ) : (
                  'No file selected yet.'
                )}
              </p>

              <button
                type="button"
                onClick={handleUpload}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-400 hover:from-indigo-400 hover:to-indigo-300 disabled:opacity-60 disabled:cursor-not-allowed text-sm font-semibold text-slate-950 px-4 py-2 shadow-[0_10px_30px_rgba(79,70,229,0.55)] transition-transform active:scale-95"
              >
                {loading ? (
                  <>
                    <span className="h-4 w-4 border-2 border-slate-900/40 border-t-slate-950 rounded-full animate-spin" />
                    Analyzing…
                  </>
                ) : (
                  <>
                    <span>Run AI Analysis</span>
                  </>
                )}
              </button>
            </div>

            {error && (
              <p className="text-xs text-red-300 bg-red-950/50 border border-red-700/60 rounded-xl px-3 py-2">
                {error}
              </p>
            )}

            {!error && !loading && !analysis && (
              <p className="text-xs text-slate-400">
                Tip: Use different profiles (fresher, experienced, role-specific resumes) to
                see how the rating & suggestions adapt.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Analysis result */}
      {analysis && (
        <div className="animate-[fadeIn_0.35s_ease-out]">
          <ResumeDetails data={analysis} />
        </div>
      )}
    </div>
  );
}

export default ResumeUploader;
