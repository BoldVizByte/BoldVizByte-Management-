import { body, param, validationResult } from "express-validator";
import mongoose from "mongoose";

// Middleware to handle validation results
const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ error: "Validation failed", details: errors.mapped() });
  }
  next();
};

// Validate attendance creation
export const createAttendanceRules = [
  body("records")
    .exists().withMessage("Records array is required")
    .isArray({ min: 1 }).withMessage("Records must be a non-empty array"),
  body("records.*.userId")
    .exists().withMessage("userId is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid userId"),
  body("records.*.date")
    .exists().withMessage("Date is required")
    .matches(/^\d{4}-\d{2}-\d{2}$/).withMessage("Date must be in YYYY-MM-DD format"),
  body("records.*.status")
    .exists().withMessage("Status is required")
    .isIn(["Present", "Absent", "--"]).withMessage("Status must be Present, Absent, or --"),
  body("records.*.login").optional().isString(),
  body("records.*.logout").optional().isString(),
  handleValidation
];

// Validate attendance update (same rules)
export const updateAttendanceRules = [
  body("status").optional().isIn(["Present", "Absent", "--"]),
  body("login").optional().isString(),
  body("logout").optional().isString(),
  handleValidation
];


// Validate ID param
export const idParamRule = [
  param("id")
    .exists().withMessage("Attendance ID is required")
    .custom((value) => mongoose.Types.ObjectId.isValid(value))
    .withMessage("Invalid attendance ID"),
  handleValidation
];