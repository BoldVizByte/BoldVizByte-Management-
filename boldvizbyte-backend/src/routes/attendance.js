import express from "express";
import * as attendanceController from "../controllers/attendanceController.js";

const router = express.Router();

router.get("/monthly-summary", attendanceController.getMonthlyAttendanceSummary);
router.get("/summary", attendanceController.getAttendanceSummary);
router.post("/", attendanceController.createAttendance);
router.get("/", attendanceController.getAllAttendance);
router.get("/:id", attendanceController.getAttendanceById);
router.put("/:id", attendanceController.updateAttendance);
router.delete("/:id", attendanceController.deleteAttendance);

export default router;
