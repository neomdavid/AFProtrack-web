import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";

// Placeholder sample trainees; replace with API data
const sampleTrainees = Array.from({ length: 50 }).map((_, i) => ({
  id: `enroll-${i + 1}`,
  name: `Trainee ${i + 1}`,
  email: `trainee${i + 1}@mail.com`,
}));

const ProgramAttendance = () => {
  const { programId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [program, setProgram] = useState({ id: programId, name: "Training Program", startDate: "2025-08-19", endDate: "2025-08-29", defaultStartTime: "08:00", defaultEndTime: "17:00" });

  const toDate = (str) => (str ? new Date(str) : null);
  const formatDayLabel = (d) => d.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  const formatYMD = (d) => d.toISOString().slice(0, 10);
  const getDateRange = (start, end) => {
    if (!start || !end) return [];
    const days = [];
    const cur = new Date(start);
    const last = new Date(end);
    while (cur <= last) {
      days.push(new Date(cur));
      cur.setDate(cur.getDate() + 1);
    }
    return days;
  };

  const sessions = useMemo(
    () => getDateRange(toDate(program?.startDate), toDate(program?.endDate)),
    [program]
  );

  const today = new Date();
  const defaultDate = useMemo(() => {
    if (!sessions.length) return null;
    const inRange = today >= sessions[0] && today <= sessions[sessions.length - 1];
    return inRange ? formatYMD(today) : formatYMD(sessions[0]);
  }, [sessions]);

  const currentDateParam = searchParams.get("date") || defaultDate;
  const selectedDate = currentDateParam ? new Date(currentDateParam) : null;
  const selectedKey = selectedDate ? formatYMD(selectedDate) : null;

  useEffect(() => {
    if (!searchParams.get("date") && defaultDate) {
      setSearchParams({ date: defaultDate }, { replace: true });
    }
  }, [defaultDate]);

  // Local attendance state placeholder
  const [attendance, setAttendance] = useState({});
  const dayAttendance = attendance[selectedKey] || {};

  // Per-day session meta (start/end time, status, reason)
  const [sessionMeta, setSessionMeta] = useState({}); // { [dateKey]: { startTime, endTime, status: 'active'|'cancelled', reason } }
  const dayMeta = sessionMeta[selectedKey] || {};
  const dayStartTime = dayMeta.startTime ?? program.defaultStartTime;
  const dayEndTime = dayMeta.endTime ?? program.defaultEndTime;
  const dayStatus = dayMeta.status ?? 'active';
  const isDayCancelled = dayStatus === 'cancelled';
  // Per-day edit state for time adjustments
  const [editingTimes, setEditingTimes] = useState({}); // { [dateKey]: boolean }
  const isEditingTimes = !!editingTimes[selectedKey];

  // Only Present/Absent now
  const STATUS = [
    { value: "present", label: "Present" },
    { value: "absent", label: "Absent" },
  ];
  const QUICK_STATUS = STATUS;

  const updateAttendance = (enrollmentId, patch) => {
    setAttendance((prev) => ({
      ...prev,
      [selectedKey]: {
        ...(prev[selectedKey] || {}),
        [enrollmentId]: { ...(prev[selectedKey]?.[enrollmentId] || {}), ...patch },
      },
    }));
  };

  const daySummary = useMemo(() => {
    const counts = { present: 0, absent: 0 };
    sampleTrainees.forEach((t) => {
      const s = dayAttendance[t.id]?.status;
      if (s && counts[s] !== undefined) counts[s] += 1;
    });
    return counts;
  }, [dayAttendance]);

  // Completion state: mark a day as completed/locked with reason
  const [completedDays, setCompletedDays] = useState({}); // { [dateKey]: { completed: true, reason, at } }
  const isDayCompleted = !!completedDays[selectedKey]?.completed;

  // Deadline edit modal state
  const [showDeadlineModal, setShowDeadlineModal] = useState(false);
  const [newEndDate, setNewEndDate] = useState(program?.endDate || "");
  const [deadlineReason, setDeadlineReason] = useState("");

  // Complete day modal
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [completeReason, setCompleteReason] = useState("");

  // Filters
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const filteredTrainees = useMemo(() => {
    let list = sampleTrainees;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((t) =>
        t.name.toLowerCase().includes(q) || t.email.toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      list = list.filter((t) => (dayAttendance[t.id]?.status || "") === statusFilter);
    }
    return list;
  }, [sampleTrainees, search, statusFilter, dayAttendance]);

  // Autosave indicator
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  useEffect(() => {
    if (!selectedKey) return;
    setSaving(true);
    const t = setTimeout(() => {
      setSaving(false);
      setLastSaved(new Date());
    }, 800);
    return () => clearTimeout(t);
  }, [attendance, sessionMeta, selectedKey]);

  return (
    <div className="flex flex-col gap-4 p-4">
      {/* Breadcrumb */}
      <div className="text-sm breadcrumbs">
        <ul>
          <li><Link to="/admin/dashboard">Dashboard</Link></li>
          <li><Link to="/admin/training_data_overview">Programs</Link></li>
          <li>{program.name}</li>
          <li className="font-semibold">Attendance</li>
        </ul>
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-2">
        <div>
          <h2 className="text-2xl font-bold">{program.name} • Attendance</h2>
          <p className="text-gray-500 text-sm">{program.startDate} – {program.endDate} • {sessions.length} days</p>
        </div>
        <div className="flex gap-2">
          <button className="btn btn-sm btn-outline" onClick={() => { setNewEndDate(program.endDate || ""); setDeadlineReason(""); setShowDeadlineModal(true); }}>Edit End Date</button>
          <button className="btn btn-sm btn-outline">Export</button>
          <button className="btn btn-sm btn-outline">Settings</button>
        </div>
      </div>

      {/* Day pills */}
      <div className="overflow-x-auto sticky top-0 z-10 bg-white/90 backdrop-blur">
        <div className="flex gap-2 py-1">
          {sessions.map((d) => {
            const ymd = formatYMD(d);
            const isActive = ymd === selectedKey;
            const isToday = formatYMD(today) === ymd;
            const isCancelled = (sessionMeta[ymd]?.status || 'active') === 'cancelled';
            const isCompleted = !!completedDays[ymd]?.completed;
            return (
              <button
                key={ymd}
                onClick={() => setSearchParams({ date: ymd })}
                className={`relative px-3 py-1.5 rounded-full border text-sm whitespace-nowrap ${
                  isActive ? "border-primary text-primary bg-primary/10" : "border-gray-300 text-gray-700 hover:bg-gray-100"
                }`}
                title={isCancelled ? "Cancelled" : isCompleted ? "Completed" : undefined}
              >
                {formatDayLabel(d)}{isToday ? " • Today" : ""}
                {(isCancelled || isCompleted) && (
                  <span className={`absolute -right-1 -top-1 w-2.5 h-2.5 rounded-full ${isCancelled ? 'bg-red-500' : 'bg-green-500'}`}></span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Summary + Progress */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 items-stretch">
        <div className="p-2 rounded border border-gray-200 bg-green-50">
          <div className="text-xs text-gray-500">Present</div>
          <div className="text-lg font-semibold text-green-700">{daySummary.present}</div>
        </div>
        <div className="p-2 rounded border border-gray-200 bg-red-50">
          <div className="text-xs text-gray-500">Absent</div>
          <div className="text-lg font-semibold text-red-700">{daySummary.absent}</div>
        </div>
        {/* Completion progress */}
        <div className="p-3 rounded border border-gray-200 bg-white flex flex-col justify-center">
          {(() => {
            const total = sampleTrainees.length;
            const filled = Object.values(dayAttendance).filter((r) => r?.status === "present" || r?.status === "absent").length;
            const pct = total ? Math.round((filled / total) * 100) : 0;
            return (
              <div>
                <div className="flex justify-between text-xs text-gray-600 mb-1">
                  <span>Filled entries</span>
                  <span>{filled}/{total} ({pct}%)</span>
                </div>
                <progress className="progress w-full" value={pct} max="100"></progress>
              </div>
            );
          })()}
        </div>
      </div>

      {/* Day Settings: Start/End times and Day Status */}
      <div className="p-3 rounded border border-gray-200 bg-white flex flex-col sm:flex-row gap-3 items-end">
        <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="label"><span className="label-text">Start Time</span></label>
            <input type="time" className="input input-bordered input-sm w-full" value={dayStartTime} onChange={(e)=>setSessionMeta(p=>({ ...p, [selectedKey]: { ...(p[selectedKey]||{}), startTime: e.target.value } }))} disabled={!isEditingTimes || isDayCompleted || isDayCancelled} />
          </div>
          <div>
            <label className="label"><span className="label-text">End Time</span></label>
            <input type="time" className="input input-bordered input-sm w-full" value={dayEndTime} onChange={(e)=>setSessionMeta(p=>({ ...p, [selectedKey]: { ...(p[selectedKey]||{}), endTime: e.target.value } }))} disabled={!isEditingTimes || isDayCompleted || isDayCancelled} />
          </div>
          <div>
            <label className="label"><span className="label-text">Day Status</span></label>
            <select
              className="select select-bordered select-sm w-full"
              value={dayStatus}
              onChange={(e)=>setSessionMeta(p=>({
                ...p,
                [selectedKey]: {
                  ...(p[selectedKey]||{}),
                  status: e.target.value,
                  ...(e.target.value === 'cancelled' ? { cancellationAnnounced: false } : {})
                }
              }))}
            >
              <option value="active">Active</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              if (!isEditingTimes) {
                setEditingTimes((p) => ({ ...p, [selectedKey]: true }));
                return;
              }
              console.log('Announce adjusted times as default', { date: selectedKey, start: dayStartTime, end: dayEndTime });
              setProgram((p) => ({ ...p, defaultStartTime: dayStartTime, defaultEndTime: dayEndTime }));
              setEditingTimes((p) => ({ ...p, [selectedKey]: false }));
            }}
            disabled={isDayCompleted || isDayCancelled}
          >
            {isEditingTimes ? 'Announce' : 'Adjust Time'}
          </button>
        </div>
      </div>

      {isDayCancelled && (
        <div className="p-3 rounded border border-red-200 bg-red-50 flex flex-col gap-2">
          <div className="text-sm text-red-700 font-medium">This day is marked as Cancelled. Attendance inputs are disabled.</div>
          <div className="w-full flex items-center gap-2">
            <div className="flex items-center gap-2 flex-1">
              <span className="text-xs text-gray-600">Reason</span>
              <input className="input input-bordered input-sm w-full" placeholder="Provide reason" value={dayMeta.reason || ''} onChange={(e)=>setSessionMeta(p=>({ ...p, [selectedKey]: { ...(p[selectedKey]||{}), reason: e.target.value } }))} />
            </div>
            <div className="flex items-center gap-2 ml-auto">
              {dayMeta?.cancellationAnnounced && (
                <span className="badge badge-error badge-outline">Cancellation announced</span>
              )}
              <button
                className="btn btn-primary btn-sm"
                disabled={!dayMeta?.cancellationAnnounced && !((dayMeta.reason || '').trim())}
                onClick={() => {
                  if (!dayMeta?.cancellationAnnounced) {
                    console.log('Announce cancellation', { date: selectedKey, reason: (dayMeta.reason || '') });
                    setSessionMeta((p)=>({
                      ...p,
                      [selectedKey]: { ...(p[selectedKey]||{}), cancellationAnnounced: true }
                    }));
                  } else {
                    setSessionMeta((p) => ({
                      ...p,
                      [selectedKey]: { ...(p[selectedKey]||{}), status: 'active', reason: '', cancellationAnnounced: false }
                    }));
                  }
                }}
              >
                {dayMeta?.cancellationAnnounced ? 'Revert to Active' : 'Announce Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="input input-bordered input-sm w-60"
          placeholder="Search trainee (name/email)"
        />
        <select
          className="select select-bordered select-sm"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All statuses</option>
          {STATUS.map((s) => (
            <option key={s.value} value={s.value}>{s.label}</option>
          ))}
        </select>
        {/* spacer */}
        <div className="flex-1" />
        {/* Quick mark group - keep right aligned */}
        <div className="w-full sm:w-auto flex justify-end items-center gap-2">
          <span className="text-sm text-gray-600">Quick mark (applies to filtered):</span>
          {QUICK_STATUS.map((s) => (
            <button
              key={s.value}
              className="btn btn-xs btn-outline"
              onClick={() => {
                const next = { ...(attendance[selectedKey] || {}) };
                filteredTrainees.forEach((t) => {
                  next[t.id] = { ...(next[t.id] || {}), status: s.value };
                });
                setAttendance((prev) => ({ ...prev, [selectedKey]: next }));
              }}
              disabled={isDayCompleted || isDayCancelled}
              title={`Set ${s.label} for visible trainees`}
            >
              {s.label}
            </button>
          ))}
          <span className="hidden sm:inline text-xs text-gray-500 ml-2">{saving ? 'Saving…' : lastSaved ? `Saved ${lastSaved.toLocaleTimeString()}` : ''}</span>
        </div>
      </div>

      {/* Results count */}
      <div className="text-xs text-gray-500">Showing {filteredTrainees.length} of {sampleTrainees.length} trainees</div>

      {/* Attendance table */}
      <div className="overflow-x-auto border rounded-md">
        <table className="table">
          <thead className="sticky top-0 bg-white">
            <tr>
              <th className="w-72">Participant</th>
              <th className="w-40">Status</th>
              <th className="w-40">Time In</th>
              <th className="w-40">Time Out</th>
              <th className="w-[28rem]">Notes</th>
            </tr>
          </thead>
          <tbody>
            {filteredTrainees.map((t) => {
              const rec = dayAttendance[t.id] || {};
              return (
                <tr key={t.id}>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">
                        {t.name.split(" ").map(n=>n[0]).join("").slice(0,2)}
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium">{t.name}</span>
                        <span className="text-xs text-gray-500">{t.email}</span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <select
                      className="select select-bordered select-sm"
                      value={rec.status || ""}
                      onChange={(e) => updateAttendance(t.id, { status: e.target.value })}
                      disabled={isDayCompleted || isDayCancelled}
                    >
                      <option value="">Select</option>
                      {STATUS.map((s) => (
                        <option key={s.value} value={s.value}>{s.label}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <input type="time" className="input input-bordered input-sm" value={rec.timeIn || ""} onChange={(e) => updateAttendance(t.id, { timeIn: e.target.value })} disabled={isDayCompleted || isDayCancelled} />
                  </td>
                  <td>
                    <input type="time" className="input input-bordered input-sm" value={rec.timeOut || ""} onChange={(e) => updateAttendance(t.id, { timeOut: e.target.value })} disabled={isDayCompleted || isDayCancelled} />
                  </td>
                  <td>
                    <input type="text" className="input input-bordered input-sm w-full" placeholder="Add note" value={rec.note || ""} onChange={(e) => updateAttendance(t.id, { note: e.target.value })} disabled={isDayCompleted || isDayCancelled} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Save bar */}
      <div className="flex flex-col sm:flex-row gap-2 justify-between items-center">
        {/* Day completed badge */}
        <div className="text-xs text-gray-600">
          {isDayCompleted ? (
            <span className="badge badge-success gap-2">Day Locked • {completedDays[selectedKey]?.reason || "No reason"}</span>
          ) : (
            <span className="badge badge-ghost">Day Open</span>
          )}
        </div>
        <div className="flex gap-2">
          {!isDayCompleted ? (
            <button className="btn btn-outline btn-sm" onClick={() => setShowCompleteModal(true)}>Mark Day Completed</button>
          ) : (
            <button className="btn btn-outline btn-sm" onClick={() => setCompletedDays((p)=>({ ...p, [selectedKey]: { completed: false } }))}>Reopen Day</button>
          )}
          <button className="btn btn-outline btn-sm">Discard</button>
          <button
            className="btn btn-primary btn-sm"
            onClick={() => {
              const payload = filteredTrainees.map((t) => {
                const rec = (attendance[selectedKey] || {})[t.id] || {};
                return {
                  enrollmentId: t.id,
                  sessionDate: selectedKey,
                  startTime: dayStartTime,
                  endTime: dayEndTime,
                  dayStatus,
                  status: rec.status || null,
                  timeIn: rec.timeIn || null,
                  timeOut: rec.timeOut || null,
                  note: rec.note || null,
                };
              });
              console.log("Saving attendance:", payload);
            }}
            disabled={isDayCompleted || isDayCancelled}
          >
            Save Attendance
          </button>
        </div>
      </div>

      {/* Edit End Date Modal */}
      {showDeadlineModal && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-2">Edit End Date</h3>
            <div className="space-y-3">
              <div>
                <label className="label"><span className="label-text">New End Date</span></label>
                <input type="date" className="input input-bordered w-full" value={newEndDate} onChange={(e)=>setNewEndDate(e.target.value)} />
              </div>
              <div>
                <label className="label"><span className="label-text">Reason / Remarks</span></label>
                <textarea className="textarea textarea-bordered w-full" rows={3} placeholder="Provide reason for changing end date" value={deadlineReason} onChange={(e)=>setDeadlineReason(e.target.value)} />
              </div>
            </div>
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={()=>setShowDeadlineModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={()=>{
                if (!newEndDate) return;
                setProgram((p)=>({ ...p, endDate: newEndDate }));
                // Recompute sessions by forcing state change via program
                setShowDeadlineModal(false);
                console.log('End date updated:', { newEndDate, deadlineReason });
              }}>Save</button>
            </div>
          </div>
        </dialog>
      )}

      {/* Complete Day Modal */}
      {showCompleteModal && (
        <dialog open className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-2">Mark Day as Completed</h3>
            <p className="text-sm text-gray-600 mb-2">{selectedKey}</p>
            <label className="label"><span className="label-text">Reason / Remarks</span></label>
            <textarea className="textarea textarea-bordered w-full" rows={3} placeholder="Provide reason for completion" value={completeReason} onChange={(e)=>setCompleteReason(e.target.value)} />
            <div className="modal-action">
              <button className="btn btn-ghost" onClick={()=>{ setShowCompleteModal(false); setCompleteReason(""); }}>Cancel</button>
              <button className="btn btn-primary" onClick={()=>{
                setCompletedDays((p)=>({ ...p, [selectedKey]: { completed: true, reason: completeReason, at: new Date().toISOString() } }));
                setShowCompleteModal(false);
                setCompleteReason("");
              }}>Confirm</button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default ProgramAttendance;


