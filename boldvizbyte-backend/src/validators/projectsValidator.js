import { body, param, validationResult } from "express-validator";

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ error: "Validation failed", details: errors.mapped() });
  next();
};

export const createProjectRules = [
  body("title").exists().withMessage("Title required").isString(),
  body("description").optional().isString(),
  body("ownerId").exists().isUUID(),
  body("status").optional().isIn(["planning","active","completed"]),
  body("startDate").optional().isISO8601(),
  body("endDate").optional().isISO8601(),
  handleValidation
];

export const updateProjectRules = createProjectRules;

export const idParamRule = [
  param("id").exists().isUUID().withMessage("Invalid project ID"),
  handleValidation
];
