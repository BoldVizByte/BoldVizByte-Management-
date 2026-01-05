import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // YYYY-MM-DD
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
  { timestamps: true }
);

// Prevent duplicate attendance per user per day
attendanceSchema.index({ userId: 1, date: 1 }, { unique: true });

const Attendance = mongoose.model("Attendance", attendanceSchema);

/* ================= MODEL FUNCTIONS ================= */

// Create / Update (UPSERT)
export function upsertAttendance(record) {
  return Attendance.findOneAndUpdate(
    { userId: record.userId, date: record.date },
    {
      status: record.status || "--",
      login: record.login || "--",
      logout: record.logout || "--",
    },
    { upsert: true, new: true }
  );
}

export function getAllAttendance() {
  return Attendance.find()
    .populate("userId", "name email")
    .sort({ date: -1 });
}

export function getAttendanceById(id) {
  return Attendance.findById(id).populate("userId", "name email");
}

export function updateAttendanceById(id, payload) {
  return Attendance.findByIdAndUpdate(id, payload, { new: true });
}

export function deleteAttendanceById(id) {
  return Attendance.findByIdAndDelete(id);
}

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
