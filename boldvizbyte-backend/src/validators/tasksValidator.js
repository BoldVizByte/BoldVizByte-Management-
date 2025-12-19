import { body, param, validationResult } from "express-validator";

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ error: "Validation failed", details: errors.mapped() });
  next();
};

export const createTaskRules = [
  body("title").exists().withMessage("Title required").isString(),
  body("description").optional().isString(),
  body("projectId").exists().isUUID(),
  body("assigneeId").optional().isUUID(),
  body("status").optional().isIn(["pending","in-progress","completed"]),
  body("priority").optional().isIn(["low","medium","high"]),
  handleValidation
];

export const updateTaskRules = createTaskRules;

export const idParamRule = [
  param("id").exists().isUUID().withMessage("Invalid task ID"),
  handleValidation
];
