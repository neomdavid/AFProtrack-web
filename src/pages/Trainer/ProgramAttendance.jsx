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
  useRecordTraineeAttendanceMutation,
  useUpdateSessionMetaMutation,
  useUpdateProgramEndDateMutation,
  useMarkDayCompletedMutation,
  useReopenCompletedDayMutation,
  useGetProgramSessionMetaQuery,
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

  // Helper to normalize date keys for consistent matching
  const normalizeDateKey = (dateStr) => {
    // Handle both "2025-09-09" and "2025-09-09T00:00:00.000Z" formats
    if (dateStr.includes("T")) {
      return dateStr.slice(0, 10);
    }
    return dateStr;
  };

  // Helper to compensate for backend's 1-day difference bug
  // When sending dates to backend, add 1 day to compensate for their timezone issue
  const adjustDateForBackend = (dateStr) => {
    const date = new Date(dateStr);
    date.setDate(date.getDate() + 1);
    return date.toISOString().slice(0, 10) + "T00:00:00.000Z";
  };

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
  // We'll use only the bulk endpoint to avoid timezone/date mismatch issues
  // const { data: sessionMetaApi } = useGetSessionMetaByDateQuery(
  //   programId && selectedKey ? { programId, date: selectedKey } : skipToken,
  //   { skip: !programId || !selectedKey }
  // );

  // Fetch bulk session meta for all dates (for DayPills indicators)
  const { data: bulkSessionMeta } = useGetProgramSessionMetaQuery(programId, {
    skip: !programId,
  });

  // Create complete session meta object with defaults for missing dates
  const completeSessionMeta = useMemo(() => {
    const result = {};

    // Add backend data for all dates - this is the single source of truth for indicators
    if (bulkSessionMeta) {
      Object.entries(bulkSessionMeta).forEach(([date, meta]) => {
        const normalizedDate = normalizeDateKey(date);
        result[normalizedDate] = { ...meta };
      });
    }

    // Fill missing dates with defaults for proper indicators
    sessions.forEach((date) => {
      const dateKey = formatYMD(date);
      if (!result[dateKey]) {
        result[dateKey] = {
          status: "active",
          startTime: program.defaultStartTime || "08:00",
          endTime: program.defaultEndTime || "17:00",
          completed: false,
        };
      }
    });

    // Individual API data is only used for detailed settings, NOT for overriding indicators
    // This prevents timezone-shifted data from corrupting the bulk metadata
    // if (sessionMetaApi) {
    //   console.log("🔍 Individual API response:", sessionMetaApi);
    //   console.log("🎯 Current bulk meta for selectedKey:", result[selectedKey]);

    //   // Only merge non-indicator fields (times, reason, etc.) but preserve bulk status/completed
    //   const currentMeta = result[selectedKey] || {};
    //   result[selectedKey] = {
    //     ...currentMeta,
    //     // Keep the bulk metadata status and completed state
    //     status: currentMeta.status,
    //     completed: currentMeta.completed,
    //     // Merge other fields from individual API
    //     startTime: sessionMetaApi.startTime || currentMeta.startTime,
    //     endTime: sessionMetaApi.endTime || currentMeta.endTime,
    //     reason: sessionMetaApi.reason || currentMeta.reason,
    //     completedReason:
    //       sessionMetaApi.completedReason || currentMeta.completedReason,
    //   };

    //   console.log("✅ Final merged meta for selectedKey:", result[selectedKey]);
    // }

    return result;
  }, [
    bulkSessionMeta,
    // sessionMetaApi,
    selectedKey,
    sessions,
    program.defaultStartTime,
    program.defaultEndTime,
  ]);

  const dayMeta = completeSessionMeta[selectedKey] || {};
  const dayStartTime = dayMeta.startTime ?? program.defaultStartTime;
  const dayEndTime = dayMeta.endTime ?? program.defaultEndTime;
  const dayStatus = dayMeta.status ?? "active";
  const isDayCancelled = dayStatus === "cancelled";
  const metaCancelReason = dayMeta.reason || "";
  const metaCompletionReason = dayMeta.completedReason || "";

  // Per-day edit state for time adjustments
  const [editingTimes, setEditingTimes] = useState({}); // { [dateKey]: boolean }
  const isEditingTimes = !!editingTimes[selectedKey];

  const [recordAttendance, { isLoading: isRecording }] =
    useRecordTraineeAttendanceMutation();
  const updateAttendance = async (traineeId, patch) => {
    if (!selectedKey || !programId || !patch?.status) return;
    try {
      const adjustedDate = adjustDateForBackend(selectedKey);

      await recordAttendance({
        programId,
        traineeId,
        date: adjustedDate,
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

  // Completion state from bulk metadata
  const isDayCompleted = !!dayMeta.completed;

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
  }, [dayAttendance, bulkSessionMeta, selectedKey]);

  // Event handlers
  const handleDateSelect = (dateKey) => {
    setSearchParams({ date: dateKey });
  };

  const [updateSessionMetaMutation] = useUpdateSessionMetaMutation();
  const handleStartTimeChange = async (e) => {
    const value = e.target.value;
    if (programId && selectedKey) {
      try {
        const adjustedDate = adjustDateForBackend(selectedKey);

        await updateSessionMetaMutation({
          programId,
          date: adjustedDate,
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
    if (programId && selectedKey) {
      try {
        const adjustedDate = adjustDateForBackend(selectedKey);

        await updateSessionMetaMutation({
          programId,
          date: adjustedDate,
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
    if (programId && selectedKey) {
      try {
        const adjustedDate = adjustDateForBackend(selectedKey);

        await updateSessionMetaMutation({
          programId,
          date: adjustedDate,
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

  const handleReopenDay = async () => {
    if (!selectedKey || !programId) return;
    try {
      const adjustedDate = adjustDateForBackend(selectedKey);

      await reopenCompletedDay({
        programId,
        date: adjustedDate,
      }).unwrap();
    } catch (e) {
      console.error("Failed to reopen day", e);
    }
  };

  const handleEditEndDate = () => {
    setNewEndDate(program.endDate || "");
    setDeadlineReason("");
    setShowDeadlineModal(true);
  };

  const handleExport = () => {
    console.log("Export functionality");
  };

  const [updateProgramEndDate] = useUpdateProgramEndDateMutation();
  const handleSaveEndDate = async () => {
    if (!newEndDate || !programId) return;
    try {
      await updateProgramEndDate({
        programId,
        endDate: newEndDate,
        reason: deadlineReason,
      }).unwrap();
      setProgram((p) => ({ ...p, endDate: newEndDate }));
      setShowDeadlineModal(false);
    } catch (e) {
      console.error("Failed to update end date", e);
    }
  };

  const [markDayCompleted] = useMarkDayCompletedMutation();
  const handleCompleteDay = async () => {
    if (!selectedKey || !programId || !completeReason.trim()) return;
    try {
      const adjustedDate = adjustDateForBackend(selectedKey);

      await markDayCompleted({
        programId,
        date: adjustedDate,
        reason: completeReason,
      }).unwrap();
      setShowCompleteModal(false);
      setCompleteReason("");
    } catch (e) {
      console.error("Failed to mark day as completed", e);
    }
  };

  const handleCancelDay = async (reason) => {
    if (programId && selectedKey) {
      try {
        const adjustedDate = adjustDateForBackend(selectedKey);

        await updateSessionMetaMutation({
          programId,
          date: adjustedDate,
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
    if (programId && selectedKey) {
      try {
        const adjustedDate = adjustDateForBackend(selectedKey);

        await updateSessionMetaMutation({
          programId,
          date: adjustedDate,
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

  const [reopenCompletedDay] = useReopenCompletedDayMutation();

  return (
    <div className="flex flex-col gap-4 p-4">
      <AttendanceHeader
        program={program}
        sessions={sessions}
        onEditEndDate={handleEditEndDate}
        onExport={handleExport}
      />

      <DayPills
        sessions={sessions}
        selectedKey={selectedKey}
        onDateSelect={handleDateSelect}
        sessionMeta={completeSessionMeta}
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
        metaCompletionReason={metaCompletionReason}
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
