import Attendance from "../models/attendanceModel.js";

// Save multiple attendance records
export async function createAttendance(req, res) {
  try {
    const { records } = req.body;

    if (!Array.isArray(records) || records.length === 0) {
      return res.status(400).json({ message: "No attendance records provided" });
    }

    const results = [];

    for (const record of records) {
      const saved = await Attendance.findOneAndUpdate(
        { userId: record.userId, date: record.date },
        {
          status: record.status,
          login: record.login || "--",
          logout: record.logout || "--",
        },
        { upsert: true, new: true }
      );
      results.push(saved);
    }

    res.status(201).json({
      message: "Attendance saved",
      data: results,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
}

// Get all attendance records
export async function getAllAttendance(req, res) {
  try {
    const allAttendance = await Attendance.find();
    res.json({ message: "All attendance records", data: allAttendance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// Get attendance by ID
export async function getAttendanceById(req, res) {
  try {
    const { id } = req.params;
    const record = await Attendance.findById(id);
    if (!record) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    res.json({ message: `Attendance ${id}`, data: record });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// Update attendance by ID
export async function updateAttendance(req, res) {
  try {
    const { id } = req.params;
    const updated = await Attendance.findByIdAndUpdate(id, req.body, { new: true });
    if (!updated) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    res.json({ message: `Attendance ${id} updated`, data: updated });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}

// Delete attendance by ID
export async function deleteAttendance(req, res) {
  try {
    const { id } = req.params;
    const deleted = await Attendance.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: "Attendance record not found" });
    }
    res.json({ message: `Attendance ${id} deleted` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}


// Get attendance summary (any date) for dashboard cards
export async function getAttendanceSummary(req, res) {
  try {
    const { date } = req.query;

    const targetDate = date ? new Date(date) : new Date();

    const start = new Date(targetDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(targetDate);
    end.setHours(23, 59, 59, 999);

    const present = await Attendance.countDocuments({
      date: { $gte: start, $lte: end },
      status: "present",
    });

    const absent = await Attendance.countDocuments({
      date: { $gte: start, $lte: end },
      status: "absent",
    });

    res.json({
      message: "Attendance summary",
      date: targetDate.toISOString().split("T")[0],
      data: { present, absent },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
}
