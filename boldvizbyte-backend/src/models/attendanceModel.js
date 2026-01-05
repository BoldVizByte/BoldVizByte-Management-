import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 📅 Store date as YYYY-MM-DD
    date: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: ["Present", "Absent", "--"],
      default: "--",
    },

    login: {
      type: String,
      default: "--",
    },

    logout: {
      type: String,
      default: "--",
    },
  },
  {
    timestamps: true, // createdAt & updatedAt
  }
);

/* -------------------------------------------------
   ✅ Prevent duplicate attendance
   One user → one day → one record
-------------------------------------------------- */
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

/* -------------------------------------------------
   Normalize date (safety)
-------------------------------------------------- */
attendanceSchema.pre("save", function (next) {
  if (this.date instanceof Date) {
    this.date = this.date.toISOString().split("T")[0];
  }
  next();
});

const Attendance = mongoose.model("Attendance", attendanceSchema);

/* =================================================
   📌 MODEL FUNCTIONS
================================================= */

/**
 * Create or update attendance (UPSERT)
 */
export async function upsertAttendance({
  userId,
  date,
  status,
  login,
  logout,
}) {
  return Attendance.findOneAndUpdate(
    { userId, date },
    {
      userId,
      date,
      status: status || "--",
      login: login || "--",
      logout: logout || "--",
    },
    { upsert: true, new: true }
  ).lean();
}

/**
 * Get ALL attendance records
 */
export function getAllAttendance() {
  return Attendance.find()
    .populate("userId", "name email")
    .sort({ date: -1 })
    .lean();
}

/**
 * Get attendance by ID
 */
export function getAttendanceById(id) {
  return Attendance.findById(id)
    .populate("userId", "name email")
    .lean();
}

/**
 * Update attendance by ID
 */
export function updateAttendanceById(id, payload) {
  payload.updatedAt = new Date();
  return Attendance.findByIdAndUpdate(id, payload, {
    new: true,
  })
    .populate("userId", "name email")
    .lean();
}

/**
 * Delete attendance by ID
 */
export function deleteAttendanceById(id) {
  return Attendance.findByIdAndDelete(id);
}

/*
  Get attendance by date
 */
export function getAttendanceByDate(date) {
  return Attendance.find({ date })
    .populate("userId", "name email")
    .lean();
}

/**
 * Get attendance summary for dashboard
 */
export async function getAttendanceSummaryByDate(date) {
  const present = await Attendance.countDocuments({
    date,
    status: "Present",
  });

  const absent = await Attendance.countDocuments({
    date,
    status: "Absent",
  });

  return { present, absent };
}

export default Attendance;
