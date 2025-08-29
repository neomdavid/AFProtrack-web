import React, { useEffect, useMemo, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useParams, useSearchParams } from "react-router-dom";
import AttendanceHeader from "../../components/Trainer/AttendanceHeader";
import DayPills from "../../components/Trainer/DayPills";
import AttendanceSummary from "../../components/Trainer/AttendanceSummary";
import DaySettings from "../../components/Trainer/DaySettings";
import AttendanceTable from "../../components/Trainer/AttendanceTable";
import EditEndDateModal from "../../components/Trainer/EditEndDateModal";
import CompleteDayModal from "../../components/Trainer/CompleteDayModal";
import EditTimesModal from "../../components/Trainer/EditTimesModal";
import ChangeStatusModal from "../../components/Trainer/ChangeStatusModal";
import ReopenDayModal from "../../components/Trainer/ReopenDayModal";
import CancelDayModal from "../../components/Trainer/CancelDayModal";
import ReactivateDayModal from "../../components/Trainer/ReactivateDayModal";
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

  const pad2 = (n) => String(n).padStart(2, "0");
  const parseYMDLocal = (str) => {
    if (!str) return null;
    const ymd = str.includes("T") ? str.slice(0, 10) : str;
    const [y, m, d] = ymd.split("-").map(Number);
    return new Date(y, (m || 1) - 1, d || 1);
  };
  const formatYMD = (d) =>
    `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

  // Helper to normalize date keys for consistent matching
  const normalizeDateKey = (dateStr) => {
    // Handle both "2025-09-09" and "2025-09-09T00:00:00.000Z" formats
    if (dateStr.includes("T")) {
      return dateStr.slice(0, 10);
    }
    return dateStr;
  };

  const getDateRange = (start, end) => {
    if (!start || !end) return [];
    const days = [];
    const cur = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate()
    );
    const last = new Date(end.getFullYear(), end.getMonth(), end.getDate());
    while (cur <= last) {
      days.push(new Date(cur.getFullYear(), cur.getMonth(), cur.getDate()));
      cur.setDate(cur.getDate() + 1);
    }
    return days;
  };

  const sessions = useMemo(
    () =>
      getDateRange(
        parseYMDLocal(program?.startDate),
        parseYMDLocal(program?.endDate)
      ),
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
  const selectedDate = currentDateParam
    ? parseYMDLocal(currentDateParam)
    : null;
  const selectedKey = selectedDate ? formatYMD(selectedDate) : null;

  // Debug: selection and session keys
  useEffect(() => {
    try {
      const sessionKeys = sessions.map((d) => formatYMD(d));
      // eslint-disable-next-line no-console
      console.log("[Attendance] selectedKey=", selectedKey, {
        currentDateParam,
        defaultDate,
        sessionKeys,
      });
    } catch (e) {
      // ignore
    }
  }, [selectedKey, currentDateParam, defaultDate, sessions]);

  useEffect(() => {
    if (!searchParams.get("date") && defaultDate) {
      setSearchParams({ date: defaultDate }, { replace: true });
    }
  }, [defaultDate]);

  // Day attendance from API
  const { data: dayAttendanceApi, isLoading: isLoadingAttendance } =
    useGetDayAttendanceByDateQuery(
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

  // Debug: meta keys and flags
  useEffect(() => {
    try {
      const keys = Object.keys(completeSessionMeta || {});
      const sample = selectedKey ? completeSessionMeta[selectedKey] : undefined;
      // eslint-disable-next-line no-console
      console.log("[Attendance] sessionMeta keys=", keys, {
        selectedKey,
        selectedMeta: sample,
      });
    } catch (e) {
      // ignore
    }
  }, [completeSessionMeta, selectedKey]);

  const dayMeta = completeSessionMeta[selectedKey] || {};
  const dayStartTime = dayMeta.startTime ?? program.defaultStartTime;
  const dayEndTime = dayMeta.endTime ?? program.defaultEndTime;
  const dayStatus = dayMeta.status ?? "active";
  const isDayCancelled = dayStatus === "cancelled";
  const metaCancelReason = dayMeta.reason || "";
  const metaCompletionReason = dayMeta.completedReason || "";

  // Times/Status modals
  const [showTimesModal, setShowTimesModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [showReopenModal, setShowReopenModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showReactivateModal, setShowReactivateModal] = useState(false);

  const [recordAttendance, { isLoading: isRecording }] =
    useRecordTraineeAttendanceMutation();
  const updateAttendance = async (traineeId, patch) => {
    if (!selectedKey || !programId || !patch?.status) return;
    try {
      // eslint-disable-next-line no-console
      console.log("[Attendance] recordTraineeAttendance payload", {
        programId,
        traineeId,
        date: selectedKey,
        status: patch.status,
        remarks: patch.remarks || "",
      });
      await recordAttendance({
        programId,
        traineeId,
        date: selectedKey,
        status: patch.status,
        remarks: patch.remarks || "",
      }).unwrap();
      // eslint-disable-next-line no-console
      console.log("[Attendance] recordTraineeAttendance success");
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
        // eslint-disable-next-line no-console
        console.log("[Attendance] updateSessionMeta startTime payload", {
          programId,
          date: selectedKey,
          startTime: value,
          endTime: dayEndTime,
          status: dayStatus,
          reason: dayMeta.reason,
        });
        await updateSessionMetaMutation({
          programId,
          date: selectedKey,
          startTime: value,
          endTime: dayEndTime,
          status: dayStatus,
          reason: dayMeta.reason,
        }).unwrap();
        // eslint-disable-next-line no-console
        console.log("[Attendance] updateSessionMeta startTime success");
        toast.success("Start time updated");
      } catch (err) {
        console.error("Failed updating startTime", err);
        toast.error("Failed to update start time");
      }
    }
  };

  const handleEndTimeChange = async (e) => {
    const value = e.target.value;
    if (programId && selectedKey) {
      try {
        // eslint-disable-next-line no-console
        console.log("[Attendance] updateSessionMeta endTime payload", {
          programId,
          date: selectedKey,
          startTime: dayStartTime,
          endTime: value,
          status: dayStatus,
          reason: dayMeta.reason,
        });
        await updateSessionMetaMutation({
          programId,
          date: selectedKey,
          startTime: dayStartTime,
          endTime: value,
          status: dayStatus,
          reason: dayMeta.reason,
        }).unwrap();
        // eslint-disable-next-line no-console
        console.log("[Attendance] updateSessionMeta endTime success");
        toast.success("End time updated");
      } catch (err) {
        console.error("Failed updating endTime", err);
        toast.error("Failed to update end time");
      }
    }
  };

  const handleStatusChange = () => setShowReactivateModal(true);

  const handleOpenTimesModal = () => setShowTimesModal(true);
  const handleOpenStatusModal = () => setShowStatusModal(true);

  const handleMarkDayCompleted = () => {
    setShowCompleteModal(true);
  };

  const handleReopenDay = () => setShowReopenModal(true);

  const handleEditEndDate = () => {
    setNewEndDate(program.endDate || "");
    setDeadlineReason("");
    setShowDeadlineModal(true);
  };

  const handleExport = () => {
    console.log("Export functionality");
  };

  const [updateProgramEndDate, { isLoading: isUpdatingEndDate }] =
    useUpdateProgramEndDateMutation();
  const handleSaveEndDate = async () => {
    if (!newEndDate || !programId) return;
    try {
      // eslint-disable-next-line no-console
      console.log("[Attendance] updateProgramEndDate payload", {
        programId,
        endDate: newEndDate,
        reason: deadlineReason,
      });
      await updateProgramEndDate({
        programId,
        endDate: newEndDate,
        reason: deadlineReason,
      }).unwrap();
      setProgram((p) => ({ ...p, endDate: newEndDate }));
      setShowDeadlineModal(false);
      // eslint-disable-next-line no-console
      console.log("[Attendance] updateProgramEndDate success");
      toast.success("End date updated");
    } catch (e) {
      console.error("Failed to update end date", e);
      toast.error("Failed to update end date");
    }
  };

  const [markDayCompleted, { isLoading: isMarkingCompleted }] =
    useMarkDayCompletedMutation();
  const handleCompleteDay = async () => {
    if (!selectedKey || !programId || !completeReason.trim()) return;
    try {
      // eslint-disable-next-line no-console
      console.log("[Attendance] markDayCompleted payload", {
        programId,
        date: selectedKey,
        reason: completeReason,
      });
      await markDayCompleted({
        programId,
        date: selectedKey,
        reason: completeReason,
      }).unwrap();
      setShowCompleteModal(false);
      setCompleteReason("");
      // eslint-disable-next-line no-console
      console.log("[Attendance] markDayCompleted success");
      toast.success("Day marked as completed");
    } catch (e) {
      console.error("Failed to mark day as completed", e);
      toast.error("Failed to mark day as completed");
    }
  };

  const handleCancelDay = async (reason) => {
    if (programId && selectedKey) {
      setIsCancellingDay(true);
      try {
        // eslint-disable-next-line no-console
        console.log("[Attendance] cancel day payload", {
          programId,
          date: selectedKey,
          startTime: dayStartTime,
          endTime: dayEndTime,
          status: "cancelled",
          reason,
        });
        await updateSessionMetaMutation({
          programId,
          date: selectedKey,
          startTime: dayStartTime,
          endTime: dayEndTime,
          status: "cancelled",
          reason,
        }).unwrap();
        // eslint-disable-next-line no-console
        console.log("[Attendance] cancel day success");
        toast.success("Day cancelled");
      } catch (err) {
        console.error("Failed cancelling day", err);
        toast.error("Failed to cancel day");
      } finally {
        setIsCancellingDay(false);
      }
    }
  };

  const handleUncancelDay = async () => {
    if (programId && selectedKey) {
      setIsReactivatingDay(true);
      try {
        // eslint-disable-next-line no-console
        console.log("[Attendance] uncancel day payload", {
          programId,
          date: selectedKey,
          startTime: dayStartTime,
          endTime: dayEndTime,
          status: "active",
        });
        await updateSessionMetaMutation({
          programId,
          date: selectedKey,
          startTime: dayStartTime,
          endTime: dayEndTime,
          status: "active",
          reason: undefined,
        }).unwrap();
        // eslint-disable-next-line no-console
        console.log("[Attendance] uncancel day success");
        toast.success("Day reactivated");
      } catch (err) {
        console.error("Failed reactivating day", err);
        toast.error("Failed to reactivate day");
      } finally {
        setIsReactivatingDay(false);
      }
    }
  };

  const [reopenCompletedDay, { isLoading: isReopeningDay }] =
    useReopenCompletedDayMutation();

  // Loading states for manual operations
  const [isCancellingDay, setIsCancellingDay] = useState(false);
  const [isReactivatingDay, setIsReactivatingDay] = useState(false);

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
        isEditingTimes={false}
        isDayCompleted={isDayCompleted}
        isDayCancelled={isDayCancelled}
        metaCancelReason={metaCancelReason}
        onOpenTimesModal={handleOpenTimesModal}
        onOpenStatusModal={handleOpenStatusModal}
        onMarkDayCompleted={handleMarkDayCompleted}
        onReopenDay={handleReopenDay}
        onCancelDay={() => setShowCancelModal(true)}
        onUncancelDay={() => setShowReactivateModal(true)}
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
        isLoading={isLoadingAttendance}
        selectedDate={selectedKey}
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
        isLoading={isUpdatingEndDate}
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
        isLoading={isMarkingCompleted}
      />

      <EditTimesModal
        isOpen={showTimesModal}
        onClose={() => setShowTimesModal(false)}
        startTime={dayStartTime}
        endTime={dayEndTime}
        onSave={async ({ startTime, endTime }) => {
          if (!programId || !selectedKey) return;
          try {
            await updateSessionMetaMutation({
              programId,
              date: selectedKey,
              startTime,
              endTime,
              status: dayStatus,
              reason: dayMeta.reason,
            }).unwrap();
            setShowTimesModal(false);
            toast.success("Times updated");
          } catch (err) {
            console.error("Failed updating times", err);
            toast.error("Failed to update times");
          }
        }}
      />

      {/* Status modal removed in favor of toggle + dedicated cancel/reactivate modals */}

      <ReopenDayModal
        isOpen={showReopenModal}
        onClose={() => setShowReopenModal(false)}
        onConfirm={async () => {
          if (!selectedKey || !programId) return;
          try {
            await reopenCompletedDay({ programId, date: selectedKey }).unwrap();
            setShowReopenModal(false);
            toast.success("Day reopened");
          } catch (e) {
            console.error("Failed to reopen day", e);
            toast.error("Failed to reopen day");
          }
        }}
        isLoading={isReopeningDay}
      />

      <CancelDayModal
        isOpen={showCancelModal}
        onClose={() => setShowCancelModal(false)}
        onConfirm={async (reason) => {
          try {
            await handleCancelDay(reason);
            setShowCancelModal(false);
          } catch {}
        }}
        isLoading={isCancellingDay}
      />

      <ReactivateDayModal
        isOpen={showReactivateModal}
        onClose={() => setShowReactivateModal(false)}
        onConfirm={async () => {
          try {
            await handleUncancelDay();
            setShowReactivateModal(false);
          } catch {}
        }}
        isLoading={isReactivatingDay}
      />
      <ToastContainer
        position="top-center"
        newestOnTop
        closeOnClick
        pauseOnHover={false}
        theme="light"
      />
    </div>
  );
};

export default ProgramAttendance;
