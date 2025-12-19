import express from "express";
import * as attendanceController from "../controllers/attendanceController.js";
import * as attendanceValidator from "../validators/attendanceValidator.js";

const router = express.Router();

router.post(
  "/",
  ...attendanceValidator.createAttendanceRules,
  attendanceController.createAttendance
);

router.get("/", attendanceController.getAllAttendance);

router.get(
  "/:id",
  ...attendanceValidator.idParamRule,
  attendanceController.getAttendanceById
);

router.put(
  "/:id",
  ...attendanceValidator.idParamRule,
  ...attendanceValidator.updateAttendanceRules,
  attendanceController.updateAttendance
);

router.delete(
  "/:id",
  ...attendanceValidator.idParamRule,
  attendanceController.deleteAttendance
);

export default router;
