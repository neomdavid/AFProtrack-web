import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import AttendanceHeader from "../../components/Trainer/AttendanceHeader";
import DayPills from "../../components/Trainer/DayPills";
import AttendanceSummary from "../../components/Trainer/AttendanceSummary";
import DaySettings from "../../components/Trainer/DaySettings";
import AttendanceTable from "../../components/Trainer/AttendanceTable";
import EditEndDateModal from "../../components/Trainer/EditEndDateModal";
import CompleteDayModal from "../../components/Trainer/CompleteDayModal";
import {
  useGetTrainingProgramByIdQuery,
  useGetDayAttendanceByDateQuery,
  useGetSessionMetaByDateQuery,
  useRecordTraineeAttendanceMutation,
  useUpdateSessionMetaMutation,
} from "../../features/api/adminEndpoints";
import { skipToken } from "@reduxjs/toolkit/query";

// Helper mappers
const mapProgram = (apiProgram, fallbackId) => ({
  id: apiProgram?._id || fallbackId,
  name: apiProgram?.programName || "Training Program",
  startDate: apiProgram?.startDate ? apiProgram.startDate.slice(0, 10) : "",
  endDate: apiProgram?.endDate ? apiProgram.endDate.slice(0, 10) : "",
  defaultStartTime: apiProgram?.startTime || "",
  defaultEndTime: apiProgram?.endTime || "",
});

const ProgramAttendance = () => {
  const { programId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: programData, isLoading: isLoadingProgram } =
    useGetTrainingProgramByIdQuery(programId);
  const [program, setProgram] = useState({
    id: programId,
    name: "Loading…",
    startDate: "",
    endDate: "",
    defaultStartTime: "",
    defaultEndTime: "",
  });

  useEffect(() => {
    if (programData) {
      setProgram(mapProgram(programData, programId));
    }
  }, [programData, programId]);

  const toDate = (str) => (str ? new Date(str) : null);
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
    const inRange =
      today >= sessions[0] && today <= sessions[sessions.length - 1];
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

  // Day attendance from API
  const { data: dayAttendanceApi } = useGetDayAttendanceByDateQuery(
    programId && selectedKey ? { programId, date: selectedKey } : skipToken,
    { skip: !programId || !selectedKey }
  );

  // Normalize day attendance to { [traineeId]: { status } }
  const dayAttendance = useMemo(() => {
    const records = dayAttendanceApi?.attendanceRecords || [];
    return records.reduce((acc, rec) => {
      acc[rec.traineeId] = { status: rec.status };
      return acc;
    }, {});
  }, [dayAttendanceApi]);

  // Per-day session meta (start/end time, status, reason)
  // Session meta (overrides/cancellation) from API; local edits retained for UI for now
  const { data: sessionMetaApi } = useGetSessionMetaByDateQuery(
    programId && selectedKey ? { programId, date: selectedKey } : skipToken,
    { skip: !programId || !selectedKey }
  );

  const [sessionMeta, setSessionMeta] = useState({});

  // Store backend session meta in local state for persistence
  useEffect(() => {
    if (sessionMetaApi && selectedKey) {
      setSessionMeta((prev) => ({
        ...prev,
        [selectedKey]: { ...(prev[selectedKey] || {}), ...sessionMetaApi },
      }));
    }
  }, [sessionMetaApi, selectedKey]);

  const dayMeta = sessionMeta[selectedKey] || {};
  const dayStartTime = dayMeta.startTime ?? program.defaultStartTime;
  const dayEndTime = dayMeta.endTime ?? program.defaultEndTime;
  const dayStatus = dayMeta.status ?? "active";
  const isDayCancelled = dayStatus === "cancelled";
  const metaCancelReason = dayMeta.reason || "";

  // Per-day edit state for time adjustments
  const [editingTimes, setEditingTimes] = useState({}); // { [dateKey]: boolean }
  const isEditingTimes = !!editingTimes[selectedKey];

  const [recordAttendance, { isLoading: isRecording }] =
    useRecordTraineeAttendanceMutation();
  const updateAttendance = async (traineeId, patch) => {
    if (!selectedKey || !programId || !patch?.status) return;
    try {
      await recordAttendance({
        programId,
        traineeId,
        date: selectedKey,
        status: patch.status,
        remarks: patch.remarks || "",
      }).unwrap();
    } catch (e) {
      console.error("Failed to record attendance", e);
    }
  };

  const daySummary = useMemo(() => {
    const summary = dayAttendanceApi?.summary;
    if (summary) {
      return { present: summary.present || 0, absent: summary.absent || 0 };
    }
    const counts = { present: 0, absent: 0 };
    Object.values(dayAttendance).forEach((val) => {
      if (val.status === "present") counts.present += 1;
      if (val.status === "absent") counts.absent += 1;
    });
    return counts;
  }, [dayAttendanceApi, dayAttendance]);

  // Completion state: prefer backend meta.completed; fallback to local state
  const [completedDays, setCompletedDays] = useState({}); // { [dateKey]: { completed: true, reason, at } }
  const apiCompleted = sessionMetaApi?.completed;
  const isDayCompleted =
    typeof apiCompleted === "boolean"
      ? apiCompleted
      : !!completedDays[selectedKey]?.completed;

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
  const trainees = useMemo(() => {
    const records = dayAttendanceApi?.attendanceRecords || [];
    return records.map((r, idx) => ({
      id: r.traineeId || String(idx),
      name: r.traineeName || "Unknown",
      email: r.serviceId || "", // using serviceId in place of email for display
    }));
  }, [dayAttendanceApi]);
  const filteredTrainees = useMemo(() => {
    let list = trainees;
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          (t.email || "").toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      list = list.filter(
        (t) => (dayAttendance[t.id]?.status || "") === statusFilter
      );
    }
    return list;
  }, [trainees, search, statusFilter, dayAttendance]);

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
  }, [dayAttendance, sessionMeta, selectedKey]);

  // Event handlers
  const handleDateSelect = (dateKey) => {
    setSearchParams({ date: dateKey });
  };

  const [updateSessionMetaMutation] = useUpdateSessionMetaMutation();
  const handleStartTimeChange = async (e) => {
    const value = e.target.value;
    setSessionMeta((p) => ({
      ...p,
      [selectedKey]: {
        ...(p[selectedKey] || {}),
        startTime: value,
      },
    }));
    if (programId && selectedKey) {
      try {
        await updateSessionMetaMutation({
          programId,
          date: selectedKey,
          startTime: value,
          endTime: dayEndTime,
          status: dayStatus,
          reason: dayMeta.reason,
        }).unwrap();
      } catch (err) {
        console.error("Failed updating startTime", err);
      }
    }
  };

  const handleEndTimeChange = async (e) => {
    const value = e.target.value;
    setSessionMeta((p) => ({
      ...p,
      [selectedKey]: {
        ...(p[selectedKey] || {}),
        endTime: value,
      },
    }));
    if (programId && selectedKey) {
      try {
        await updateSessionMetaMutation({
          programId,
          date: selectedKey,
          startTime: dayStartTime,
          endTime: value,
          status: dayStatus,
          reason: dayMeta.reason,
        }).unwrap();
      } catch (err) {
        console.error("Failed updating endTime", err);
      }
    }
  };

  const handleStatusChange = async (e) => {
    const value = e.target.value;
    setSessionMeta((p) => ({
      ...p,
      [selectedKey]: {
        ...(p[selectedKey] || {}),
        status: value,
      },
    }));
    if (programId && selectedKey) {
      try {
        await updateSessionMetaMutation({
          programId,
          date: selectedKey,
          startTime: dayStartTime,
          endTime: dayEndTime,
          status: value,
          reason: dayMeta.reason,
        }).unwrap();
      } catch (err) {
        console.error("Failed updating status", err);
      }
    }
  };

  const handleToggleEditTimes = () => {
    setEditingTimes((p) => ({
      ...p,
      [selectedKey]: !p[selectedKey],
    }));
  };

  const handleMarkDayCompleted = () => {
    setShowCompleteModal(true);
  };

  const handleReopenDay = () => {
    setCompletedDays((p) => {
      const newState = { ...p };
      delete newState[selectedKey];
      return newState;
    });
  };

  const handleEditEndDate = () => {
    setNewEndDate(program.endDate || "");
    setDeadlineReason("");
    setShowDeadlineModal(true);
  };

  const handleExport = () => {
    console.log("Export functionality");
  };

  const handleSettings = () => {
    console.log("Settings functionality");
  };

  const handleSaveEndDate = () => {
    if (!newEndDate) return;
    setProgram((p) => ({ ...p, endDate: newEndDate }));
    setShowDeadlineModal(false);
    console.log("End date updated:", {
      newEndDate,
      deadlineReason,
    });
  };

  const handleCompleteDay = () => {
    setCompletedDays((p) => ({
      ...p,
      [selectedKey]: {
        completed: true,
        reason: completeReason,
        at: new Date().toISOString(),
      },
    }));
    setShowCompleteModal(false);
    setCompleteReason("");
  };

  const handleCancelDay = async (reason) => {
    setSessionMeta((p) => ({
      ...p,
      [selectedKey]: {
        ...(p[selectedKey] || {}),
        status: "cancelled",
        reason: reason,
        cancelledAt: new Date().toISOString(),
      },
    }));
    if (programId && selectedKey) {
      try {
        await updateSessionMetaMutation({
          programId,
          date: selectedKey,
          startTime: dayStartTime,
          endTime: dayEndTime,
          status: "cancelled",
          reason,
        }).unwrap();
      } catch (err) {
        console.error("Failed cancelling day", err);
      }
    }
  };

  const handleUncancelDay = async () => {
    setSessionMeta((p) => ({
      ...p,
      [selectedKey]: {
        ...(p[selectedKey] || {}),
        status: "active",
        reason: undefined,
        cancelledAt: undefined,
      },
    }));
    if (programId && selectedKey) {
      try {
        await updateSessionMetaMutation({
          programId,
          date: selectedKey,
          startTime: dayStartTime,
          endTime: dayEndTime,
          status: "active",
          reason: undefined,
        }).unwrap();
      } catch (err) {
        console.error("Failed reactivating day", err);
      }
    }
  };

  return (
    <div className="flex flex-col gap-4 p-4">
      <AttendanceHeader
        program={program}
        sessions={sessions}
        onEditEndDate={handleEditEndDate}
        onExport={handleExport}
        onSettings={handleSettings}
      />

      <DayPills
        sessions={sessions}
        selectedKey={selectedKey}
        onDateSelect={handleDateSelect}
        sessionMeta={sessionMeta}
      />

      <AttendanceSummary
        daySummary={daySummary}
        dayAttendance={dayAttendance}
        totalTrainees={trainees.length}
      />

      <DaySettings
        dayStartTime={dayStartTime}
        dayEndTime={dayEndTime}
        dayStatus={dayStatus}
        isEditingTimes={isEditingTimes}
        isDayCompleted={isDayCompleted}
        isDayCancelled={isDayCancelled}
        metaCancelReason={metaCancelReason}
        onStartTimeChange={handleStartTimeChange}
        onEndTimeChange={handleEndTimeChange}
        onStatusChange={handleStatusChange}
        onToggleEditTimes={handleToggleEditTimes}
        onMarkDayCompleted={handleMarkDayCompleted}
        onReopenDay={handleReopenDay}
        onCancelDay={handleCancelDay}
        onUncancelDay={handleUncancelDay}
        selectedDate={selectedKey}
      />

      <AttendanceTable
        filteredTrainees={filteredTrainees}
        dayAttendance={dayAttendance}
        onStatusChange={updateAttendance}
        isDayCompleted={isDayCompleted}
        isDayCancelled={isDayCancelled}
        search={search}
        statusFilter={statusFilter}
        onSearchChange={setSearch}
        onStatusFilterChange={setStatusFilter}
      />

      {/* Autosave indicator */}
      <div className="text-xs text-gray-500 text-center">
        {saving
          ? "Saving..."
          : lastSaved
          ? `Last saved: ${lastSaved.toLocaleTimeString()}`
          : ""}
      </div>

      {/* Modals */}
      <EditEndDateModal
        isOpen={showDeadlineModal}
        onClose={() => setShowDeadlineModal(false)}
        newEndDate={newEndDate}
        deadlineReason={deadlineReason}
        onEndDateChange={(e) => setNewEndDate(e.target.value)}
        onReasonChange={(e) => setDeadlineReason(e.target.value)}
        onSave={handleSaveEndDate}
        currentEndDate={program.endDate}
      />

      <CompleteDayModal
        isOpen={showCompleteModal}
        onClose={() => {
          setShowCompleteModal(false);
          setCompleteReason("");
        }}
        completeReason={completeReason}
        onReasonChange={(e) => setCompleteReason(e.target.value)}
        onConfirm={handleCompleteDay}
        selectedDate={selectedKey}
      />
    </div>
  );
};

export default ProgramAttendance;
