import Attendance, * as AttendanceModel from "../models/attendanceModel.js";

// Save multiple attendance records
export async function createAttendance(req, res) {
  try {
    const { records } = req.body;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: "No attendance records provided" });
    }

    const results = [];
    for (const record of records) {
      const saved = await AttendanceModel.upsertAttendance(record);
      results.push(saved);
    }

    res.status(201).json({
      message: "Attendance saved successfully",
      data: results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// Get all attendance
export async function getAllAttendance(req, res) {
  try {
    const { date } = req.query;
    const query = date ? { date } : {};

    const data = await Attendance.find(query)
      .populate("userId", "name email");

    res.json({ message: "Attendance records", data });
  } catch (err) {
    console.error("Attendance fetch error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}


// Get by ID
export async function getAttendanceById(req, res) {
  try {
    const record = await AttendanceModel.getAttendanceById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "Attendance not found" });
    }
    res.json({ data: record });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// Update
export async function updateAttendance(req, res) {
  try {
    const updated = await AttendanceModel.updateAttendanceById(
      req.params.id,
      req.body
    );
    if (!updated) {
      return res.status(404).json({ message: "Attendance not found" });
    }
    res.json({ message: "Attendance updated", data: updated });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// Delete
export async function deleteAttendance(req, res) {
  try {
    const deleted = await AttendanceModel.deleteAttendanceById(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Attendance not found" });
    }
    res.json({ message: "Attendance deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// Summary (Dashboard)
export async function getAttendanceSummary(req, res) {
  try {
    const date =
      req.query.date || new Date().toISOString().split("T")[0];

    const summary = await AttendanceModel.getAttendanceSummaryByDate(date);

    res.json({
      message: "Attendance summary",
      date,
      data: summary,
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

export async function getMonthlyAttendanceSummary(req, res) {
  try {
    const { month } = req.query;

   const data = await Attendance.aggregate([
      { $match: { date: { $regex: `^${month}` } } },
      {
        $group: {
          _id: "$date",
          present: {
            $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] }
          },
          absent: {
            $sum: { $cond: [{ $eq: ["$status", "Absent"] }, 1, 0] }
          }
        }
      }
    ]);

    res.json({ data });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

