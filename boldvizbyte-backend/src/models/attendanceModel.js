// src/models/attendanceModel.js
import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Store date as YYYY-MM-DD
    date: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["Present", "Absent", "--"],
      default: "--"
    },

    login: {
      type: String,
      default: "--"
    },

    logout: {
      type: String,
      default: "--"
    }
  },
  {
    timestamps: true // ✅ automatically adds createdAt & updatedAt
  }
);

const Attendance = mongoose.model("Attendance", attendanceSchema);

// --------------------------
// Functions for controller
// --------------------------

export async function createAttendance({ userId, date, status, login, logout }) {
  const record = await Attendance.create({
    userId,
    date,
    status: status || "--",
    login: login || "--",
    logout: logout || "--"
  });
  return record.toObject();
}

export function allAttendance() {
  return Attendance.find().lean();
}

export function findAttendanceById(id) {
  return Attendance.findById(id).lean();
}

export async function updateAttendance(id, payload) {
  payload.updatedAt = new Date();
  return Attendance.findByIdAndUpdate(id, payload, { new: true }).lean();
}

export function deleteAttendance(id) {
  return Attendance.findByIdAndDelete(id);
}

// default export
export default Attendance;