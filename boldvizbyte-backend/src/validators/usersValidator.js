import { body, param, validationResult } from "express-validator";

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(422).json({ error: "Validation failed", details: errors.mapped() });
  next();
};

export const createUserRules = [
  body("name").exists().withMessage("Name is required").isString().isLength({ min: 3 }),
  body("email").exists().withMessage("Email required").isEmail().normalizeEmail(),
  body("password").exists().withMessage("Password required").isLength({ min: 6 }),
  body("role").optional().isIn(["admin", "manager", "user"]),
  handleValidation
];

export const updateUserRules = createUserRules;

export const idParamRule = [
  param("id").exists().isUUID().withMessage("Invalid user ID"),
  handleValidation
];
