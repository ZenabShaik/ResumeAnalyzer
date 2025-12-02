import { useEffect, useState } from 'react';
import { getAllResumes, getResumeById } from '../services/api';
import ResumeDetails from './ResumeDetails';

function PastResumesTable() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getAllResumes();
        setResumes(data || []);
      } catch (err) {
        console.error(err);
        setError('Unable to fetch historical resumes.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const openDetails = async (id) => {
    try {
      setDetailsLoading(true);
      setModalOpen(true);
      const full = await getResumeById(id);
      setSelected(full);
    } catch (err) {
      console.error(err);
      setSelected(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelected(null);
  };

  return (
    <div className="space-y-4">
      {/* Summary header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold text-slate-100">
            Historical analyses
          </h2>
          <p className="text-xs text-slate-400">
            Every resume you’ve analyzed is captured here with rating and timestamp.
          </p>
        </div>
        {resumes.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="inline-flex items-center gap-1 rounded-full bg-slate-900/70 border border-slate-700 px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              {resumes.length} record{resumes.length > 1 ? 's' : ''} tracked
            </span>
          </div>
        )}
      </div>

      {/* Table / states */}
      <div className="rounded-2xl border border-slate-800 bg-slate-950/60 overflow-hidden">
        {loading ? (
          <div className="p-6 text-sm text-slate-300 flex items-center gap-2">
            <span className="h-4 w-4 border-2 border-slate-600 border-t-slate-100 rounded-full animate-spin" />
            Loading historical data…
          </div>
        ) : error ? (
          <div className="p-6 text-sm text-red-300">
            {error}
          </div>
        ) : resumes.length === 0 ? (
          <div className="p-6 text-sm text-slate-300">
            No resumes have been analyzed yet. Run your first analysis in the{" "}
            <span className="font-semibold text-indigo-300">Resume Analysis</span> tab.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-slate-200">
              <thead className="bg-slate-900/80 border-b border-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-[0.16em]">
                    Candidate
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-[0.16em]">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-[0.16em]">
                    Rating
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-[0.16em]">
                    Uploaded at
                  </th>
                  <th className="px-4 py-3 text-right text-xs font-semibold text-slate-400 uppercase tracking-[0.16em]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {resumes.map((r, idx) => {
                  const rating = typeof r.resume_rating === 'number'
                    ? r.resume_rating
                    : Number(r.resume_rating) || 0;

                  const pillColor =
                    rating >= 8 ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                      : rating >= 6 ? 'bg-amber-500/10 text-amber-200 border-amber-400/40'
                      : 'bg-rose-500/10 text-rose-200 border-rose-400/40';

                  return (
                    <tr
                      key={r.id || r._id || idx}
                      className="border-b border-slate-800/80 hover:bg-slate-900/60 transition-colors"
                    >
                      <td className="px-4 py-3 text-sm">
                        <div className="flex flex-col">
                          <span className="font-medium text-slate-50">
                            {r.name || 'Unnamed candidate'}
                          </span>
                          <span className="text-[11px] text-slate-500">
                            {r.phone || 'Contact not available'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-300">
                        {r.email || '—'}
                      </td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[11px] ${pillColor}`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {rating ? `${rating}/10` : 'N/A'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-slate-300">
                        {r.uploaded_at
                          ? new Date(r.uploaded_at).toLocaleString()
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          type="button"
                          onClick={() => openDetails(r.id || r._id)}
                          className="inline-flex items-center gap-1 rounded-full bg-slate-900/80 border border-slate-700 px-3 py-1.5 text-[11px] font-medium text-slate-100 hover:border-indigo-400 hover:text-indigo-200 transition-colors"
                        >
                          View details
                          <span className="text-xs">↗</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal for details */}
      {modalOpen && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl border border-slate-800 bg-slate-950/95 shadow-[0_32px_120px_rgba(0,0,0,0.9)] p-4 md:p-6">
            <button
              type="button"
              onClick={closeModal}
              className="absolute right-4 top-4 inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 border border-slate-700 text-slate-300 hover:bg-slate-800"
            >
              ✕
            </button>

            {detailsLoading && (
              <div className="flex items-center gap-2 text-sm text-slate-300 mb-3">
                <span className="h-4 w-4 border-2 border-slate-600 border-t-slate-100 rounded-full animate-spin" />
                Loading resume analysis…
              </div>
            )}

            {!detailsLoading && selected && (
              <ResumeDetails data={selected} />
            )}

            {!detailsLoading && !selected && (
              <p className="text-sm text-red-300">
                Unable to load details for this resume.
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PastResumesTable;
