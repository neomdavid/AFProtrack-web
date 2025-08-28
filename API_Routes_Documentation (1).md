# **API Routes Documentation**

## **Authorization Levels**

- **Training Staff**: Full access to manage attendance and sessions
- **Admin**: Read access + export functionality
- **Trainee**: View own attendance only

---

## **📊 ATTENDANCE ROUTES**

| Method | Route                                                             | Purpose                                   | Auth                   |
| ------ | ----------------------------------------------------------------- | ----------------------------------------- | ---------------------- |
| `POST` | `/api/training-programs/:programId/trainee/:traineeId/attendance` | Record individual attendance              | Admin + Training Staff |
| `POST` | `/api/training-programs/:programId/attendance/bulk`               | Record attendance for multiple trainees   | Admin + Training Staff |
| `GET`  | `/api/training-programs/:programId/attendance/:date`              | Get all trainees' attendance for a date   | Admin + Training Staff |
| `GET`  | `/api/training-programs/:programId/trainee/:traineeId/attendance` | Get specific trainee's attendance history | Admin + Training Staff |
| `GET`  | `/api/training-programs/mobile/my-attendance/:programId`          | Get current user's attendance             | Trainee                |

---

## **⚙️ SESSION MANAGEMENT ROUTES**

| Method   | Route                                                       | Purpose                            | Auth           |
| -------- | ----------------------------------------------------------- | ---------------------------------- | -------------- |
| `PUT`    | `/api/training-programs/:programId/sessions/:date/meta`     | Update day settings (time, status) | Training Staff |
| `POST`   | `/api/training-programs/:programId/sessions/:date/complete` | Mark day as completed/locked       | Training Staff |
| `DELETE` | `/api/training-programs/:programId/sessions/:date/complete` | Reopen completed day               | Training Staff |
| `PATCH`  | `/api/training-programs/:programId/end-date`                | Update program end date            | Training Staff |

---

## **📈 MONITORING & REPORTING ROUTES**

| Method | Route                                                   | Purpose                            | Auth                   |
| ------ | ------------------------------------------------------- | ---------------------------------- | ---------------------- |
| `GET`  | `/api/training-programs/:programId/sessions/:date/meta` | Get day settings and status        | Admin + Training Staff |
| `GET`  | `/api/training-programs/:programId/attendance/summary`  | Get overall attendance statistics  | Admin + Training Staff |
| `GET`  | `/api/training-programs/:programId/attendance/export`   | Export attendance data (CSV/Excel) | Admin + Training Staff |

---

## **👥 ENROLLMENT ROUTES**

| Method | Route                                                         | Purpose                          | Auth                   |
| ------ | ------------------------------------------------------------- | -------------------------------- | ---------------------- |
| `GET`  | `/api/training-programs/:programId/enrolled-trainees`         | Get list of enrolled trainees    | Admin + Training Staff |
| `PUT`  | `/api/training-programs/:programId/trainee/:traineeId/status` | Update trainee enrollment status | Training Staff         |

---

## **📝 Request Examples**

### **Record Attendance**

```json
POST /api/training-programs/123/trainee/456/attendance
{
  "date": "2025-08-27",
  "status": "present",
  "timeIn": "08:30",
  "timeOut": "17:00",
  "note": "On time"
}
```

### **Bulk Attendance**

```json
POST /api/training-programs/123/attendance/bulk
{
  "date": "2025-08-27",
  "attendanceRecords": [
    {"traineeId": "456", "status": "present", "timeIn": "08:30"},
    {"traineeId": "789", "status": "absent", "note": "Sick"}
  ]
}
```

### **Update Session Meta**

```json
PUT /api/training-programs/123/sessions/2025-08-27/meta
{
  "startTime": "08:00",
  "endTime": "17:00",
  "status": "active",
  "reason": "Weather conditions"
}
```

### **Export Data**

```
GET /api/training-programs/123/attendance/export?format=csv&startDate=2025-08-19&endDate=2025-08-29
```

---

## **🔧 Response Format**

**Success:**

```json
{
  "success": true,
  "message": "Operation completed",
  "data": {
    /* response data */
  }
}
```

**Error:**

```json
{
  "success": false,
  "message": "Error description"
}
```
