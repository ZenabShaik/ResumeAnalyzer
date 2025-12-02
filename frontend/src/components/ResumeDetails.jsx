function ResumeDetails({ data }) {
  if (!data) return null;

  const {
    name,
    email,
    phone,
    linkedin_url,
    summary,
    technical_skills,
    soft_skills,
    work_experience,
    education,
    resume_rating,
    improvement_areas,
    upskill_suggestions,
  } = data;

  const rating = typeof resume_rating === 'number'
    ? resume_rating
    : Number(resume_rating) || 0;

  const ratingColor =
    rating >= 8 ? 'bg-emerald-500'
      : rating >= 6 ? 'bg-amber-400'
      : 'bg-rose-500';

  const ratingLabel =
    rating >= 8 ? 'Strong fit'
      : rating >= 6 ? 'Decent, can improve'
      : 'Needs refinement';

  return (
    <section className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/80 p-5 md:p-6 shadow-[0_16px_40px_rgba(0,0,0,0.8)] space-y-5">
      {/* Header row */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-slate-500 mb-1">
            Candidate profile
          </p>
          <h2 className="text-xl font-semibold text-slate-50">{name || 'Unnamed candidate'}</h2>
          <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-300">
            {email && (
              <div className="inline-flex items-center gap-2">
                <span className="text-slate-400">📧</span>
                <span>{email}</span>
              </div>
            )}
            {phone && (
              <div className="inline-flex items-center gap-2">
                <span className="text-slate-400">📱</span>
                <span>{phone}</span>
              </div>
            )}
            {linkedin_url && (
              <div className="inline-flex items-center gap-2">
                <span className="text-slate-400">🔗</span>
                <a
                  href={linkedin_url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-indigo-300 hover:text-indigo-200 underline underline-offset-2"
                >
                  LinkedIn
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-end gap-2">
          <div className="flex items-baseline gap-3">
            <div className="relative">
              <div className="h-14 w-14 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center shadow-inner">
                <span className="text-2xl font-semibold text-slate-50">
                  {rating || '–'}
                </span>
              </div>
              <span
                className={`absolute -bottom-1 -right-1 h-3 w-3 rounded-full border border-slate-900 ${ratingColor} shadow-[0_0_12px_rgba(248,250,252,0.8)]`}
              />
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400 uppercase tracking-[0.18em]">
                Resume score
              </p>
              <p className="text-sm font-medium text-slate-200">{ratingLabel}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400">
            <span className="inline-flex h-1 w-8 rounded-full bg-slate-600 overflow-hidden">
              <span
                className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-amber-300 to-rose-400"
                style={{ width: `${Math.min(Math.max(rating, 1), 10) * 10}%` }}
              />
            </span>
            <span>{rating ? `${rating}/10 overall strength` : 'Awaiting rating'}</span>
          </div>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="border-t border-slate-800 pt-4">
          <h3 className="text-sm font-semibold text-slate-100 mb-1.5">
            AI Summary
          </h3>
          <p className="text-sm text-slate-300 leading-relaxed">
            {summary}
          </p>
        </div>
      )}

      {/* Skills grid */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="border border-slate-800 rounded-xl p-3.5 bg-slate-900/70">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold tracking-[0.16em] uppercase text-slate-400">
              Technical skills
            </h4>
            <span className="text-[10px] text-slate-500">
              {technical_skills?.length || 0} detected
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {technical_skills?.length ? (
              technical_skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded-full bg-slate-800/80 border border-slate-700 px-2.5 py-1 text-[11px] text-slate-100"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-500">No technical skills extracted.</p>
            )}
          </div>
        </div>

        <div className="border border-slate-800 rounded-xl p-3.5 bg-slate-900/70">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-semibold tracking-[0.16em] uppercase text-slate-400">
              Soft skills
            </h4>
            <span className="text-[10px] text-slate-500">
              {soft_skills?.length || 0} detected
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {soft_skills?.length ? (
              soft_skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1 rounded-full bg-slate-800/80 border border-slate-700 px-2.5 py-1 text-[11px] text-slate-100"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {skill}
                </span>
              ))
            ) : (
              <p className="text-xs text-slate-500">No soft skills extracted.</p>
            )}
          </div>
        </div>
      </div>

      {/* Experience & Education */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5">
          <h4 className="text-xs font-semibold tracking-[0.16em] uppercase text-slate-400 mb-2">
            Work experience
          </h4>
          {work_experience?.length ? (
            <ul className="space-y-2">
              {work_experience.map((exp, idx) => (
                <li key={idx} className="rounded-lg bg-slate-900/80 border border-slate-800 px-3 py-2">
                  <p className="text-sm font-medium text-slate-100">
                    {exp.role || 'Role not specified'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {exp.company || 'Company not specified'}
                    {exp.duration && <> • {exp.duration}</>}
                  </p>
                  {Array.isArray(exp.description) && exp.description.length > 0 && (
                    <ul className="mt-1 list-disc list-inside text-xs text-slate-400 space-y-0.5">
                      {exp.description.map((line, i) => (
                        <li key={i}>{line}</li>
                      ))}
                    </ul>
                  )}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500">No work experience found.</p>
          )}
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/70 p-3.5">
          <h4 className="text-xs font-semibold tracking-[0.16em] uppercase text-slate-400 mb-2">
            Education
          </h4>
          {education?.length ? (
            <ul className="space-y-2">
              {education.map((edu, idx) => (
                <li key={idx} className="rounded-lg bg-slate-900/80 border border-slate-800 px-3 py-2">
                  <p className="text-sm font-medium text-slate-100">
                    {edu.degree || 'Degree not specified'}
                  </p>
                  <p className="text-xs text-slate-400">
                    {edu.institution || 'Institution not specified'}
                    {edu.graduation_year && <> • {edu.graduation_year}</>}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500">No education entries found.</p>
          )}
        </div>
      </div>

      {/* Improvement & upskilling */}
      <div className="grid md:grid-cols-2 gap-4">
        <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-3.5">
          <h4 className="text-xs font-semibold tracking-[0.16em] uppercase text-amber-300 mb-2">
            Improvement areas
          </h4>
          <p className="text-xs md:text-sm text-slate-200 leading-relaxed">
            {improvement_areas || 'No explicit improvement areas returned by the model.'}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900 to-slate-950 p-3.5">
          <h4 className="text-xs font-semibold tracking-[0.16em] uppercase text-sky-300 mb-2">
            Upskill suggestions
          </h4>
          {upskill_suggestions?.length ? (
            <ul className="space-y-1.5 text-xs md:text-sm text-slate-200">
              {upskill_suggestions.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="mt-1 h-1.5 w-1.5 rounded-full bg-sky-400" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-400">No specific upskilling suggestions returned.</p>
          )}
        </div>
      </div>
    </section>
  );
}

export default ResumeDetails;
