import React, { useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  useGetTrainingProgramByIdQuery,
  useGetSessionMetaByDateQuery,
  useGetDayAttendanceByDateQuery,
} from "../../features/api/adminEndpoints";
import { skipToken } from "@reduxjs/toolkit/query";

const ProgramAttendanceLite = () => {
  const { programId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    data: program,
    isLoading: isLoadingProgram,
    isError: isProgramError,
  } = useGetTrainingProgramByIdQuery(programId);

  const toDate = (str) => (str ? new Date(str) : null);
  const formatYMD = (d) => (d ? d.toISOString().slice(0, 10) : "");
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

  const sessions = useMemo(() => {
    const start = toDate(program?.startDate);
    const end = toDate(program?.endDate);
    return getDateRange(start, end);
  }, [program?.startDate, program?.endDate]);

  const today = new Date();
  const defaultDate = useMemo(() => {
    if (!sessions.length) return null;
    const inRange =
      today >= sessions[0] && today <= sessions[sessions.length - 1];
    return inRange ? formatYMD(today) : formatYMD(sessions[0]);
  }, [sessions]);

  const selectedDate = searchParams.get("date") || defaultDate || "";

  useEffect(() => {
    if (!searchParams.get("date") && defaultDate) {
      setSearchParams({ date: defaultDate }, { replace: true });
    }
  }, [defaultDate]);

  const { data: sessionMeta, isFetching: isFetchingMeta } =
    useGetSessionMetaByDateQuery(
      programId && selectedDate ? { programId, date: selectedDate } : skipToken,
      { skip: !programId || !selectedDate }
    );

  const { data: dayAttendance, isFetching: isFetchingAttendance } =
    useGetDayAttendanceByDateQuery(
      programId && selectedDate ? { programId, date: selectedDate } : skipToken,
      { skip: !programId || !selectedDate }
    );

  if (isLoadingProgram) {
    return <div className="p-4">Loading program…</div>;
  }
  if (isProgramError) {
    return <div className="p-4 text-error">Failed to load program.</div>;
  }

  return (
    <div className="p-4 flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Program Attendance</h2>
          <div className="text-sm text-gray-500">
            {program?.name || "Program"} • {program?.startDate} →{" "}
            {program?.endDate}
          </div>
          <div className="text-xs text-gray-500">
            Default time:{" "}
            {program?.startTime || program?.defaultStartTime || ""} –{" "}
            {program?.endTime || program?.defaultEndTime || ""}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {sessions.map((d) => {
          const key = formatYMD(d);
          const isSelected = key === selectedDate;
          return (
            <button
              key={key}
              className={`px-3 py-1 rounded border ${
                isSelected
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white"
              }`}
              onClick={() => setSearchParams({ date: key })}
            >
              {key}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="rounded border p-3">
          <div className="font-medium mb-2">Session Meta</div>
          {isFetchingMeta ? (
            <div>Loading…</div>
          ) : sessionMeta ? (
            <pre className="text-xs whitespace-pre-wrap">
              {JSON.stringify(sessionMeta, null, 2)}
            </pre>
          ) : (
            <div className="text-sm text-gray-500">
              No overrides/cancellation
            </div>
          )}
        </div>

        <div className="rounded border p-3">
          <div className="font-medium mb-2">Day Attendance</div>
          {isFetchingAttendance ? (
            <div>Loading…</div>
          ) : dayAttendance ? (
            <pre className="text-xs whitespace-pre-wrap">
              {JSON.stringify(dayAttendance, null, 2)}
            </pre>
          ) : (
            <div className="text-sm text-gray-500">No data</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProgramAttendanceLite;
