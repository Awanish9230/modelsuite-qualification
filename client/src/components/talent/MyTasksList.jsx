import { useState } from 'react';
import SubmitTaskModal from './SubmitTaskModal';
import { getTaskDueStatus } from '../../utils/dateUtils';

/* ── Status badge classes ── */
const STATUS_CLASS = {
  Open:      'status-badge-Open',
  Claimed:   'status-badge-Claimed',
  Submitted: 'status-badge-Submitted',
  Approved:  'status-badge-Approved',
  Rejected:  'status-badge-Rejected',
};

/* ── Calendar icon ── */
const IconCalendar = () => (
  <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="14" height="14" rx="2"/>
    <path d="M7 2v4M13 2v4M3 9h14"/>
  </svg>
);

/* ── Upload icon ── */
const IconUpload = () => (
  <svg width="12" height="12" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10 14V4M6 8l4-4 4 4"/>
    <path d="M3 17h14"/>
  </svg>
);

const fmtDate = (raw) => {
  if (!raw) return null;
  try {
    const d = new Date(raw);
    if (isNaN(d)) return raw;
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch { return raw; }
};

const MyTasksList = ({ tasks, onRefresh }) => {
  const [submitTarget, setSubmitTarget] = useState(null);

  if (!tasks || tasks.length === 0) {
    return (
      <div className="py-12 px-6 text-center rounded-xl bg-bg-input border border-dashed border-border text-text-faint text-[13px] font-sans">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2"
          className="mx-auto mb-2.5 opacity-30" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="18" height="18" rx="3"/>
          <path d="M9 12l2 2 4-4"/>
        </svg>
        You haven&apos;t claimed any tasks yet. Go grab one above!
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-2">
        {tasks.map((task, i) => (
          <div key={task._id}
            className="task-card table-row-animate"
            style={{ animationDelay: `${i * 0.06}s` }}>

            {/* Task info */}
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate mb-0.5 text-[13.5px] text-text-primary font-sans">
                {task.title || 'Untitled Task'}
              </p>
              {fmtDate(task.dueDate) && (
                <div className="flex items-center gap-1.5">
                  <p className="flex items-center gap-1.5 text-[11.5px] text-text-muted">
                    <IconCalendar />
                    Due {fmtDate(task.dueDate)}
                  </p>
                  {getTaskDueStatus(task.dueDate, task.status) === 'overdue' && (
                    <span className="inline-block px-1.5 py-[1px] rounded text-[9px] font-bold badge-overdue uppercase tracking-wider">
                      Overdue
                    </span>
                  )}
                  {getTaskDueStatus(task.dueDate, task.status) === 'due-soon' && (
                    <span className="inline-block px-1.5 py-[1px] rounded text-[9px] font-bold badge-due-soon uppercase tracking-wider">
                      Due Soon
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2 shrink-0">
              {(task.status === 'Claimed' || task.status === 'Submitted') && (
                <button
                  onClick={() => setSubmitTarget(task)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[12px] font-semibold cursor-pointer border transition-all bg-primary/10 text-primary border-primary/30 font-sans hover:bg-primary/20 hover:border-primary/40">
                  <IconUpload />
                  {task.status === 'Submitted' ? 'Re-submit' : 'Submit'}
                </button>
              )}

              {task.status ? (
                <span
                  className={`inline-block px-2.5 py-[3px] rounded-full text-[11px] font-medium ${STATUS_CLASS[task.status] || ''}`}
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                  {task.status}
                </span>
              ) : (
                <span
                  className="inline-block px-2.5 py-[3px] rounded-full text-[11px] font-medium status-badge-Open"
                  style={{ fontFamily: 'Inter, sans-serif' }}>
                  —
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {submitTarget && (
        <SubmitTaskModal
          task={submitTarget}
          onClose={() => setSubmitTarget(null)}
          onSubmitted={() => { setSubmitTarget(null); if (onRefresh) onRefresh(); }}
        />
      )}
    </>
  );
};

export default MyTasksList;
