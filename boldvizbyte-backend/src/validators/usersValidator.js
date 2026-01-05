import { body, param, validationResult } from "express-validator";

const handleValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(422).json({ error: "Validation failed", details: errors.mapped() });
  next();
};

// Create & update user rules (only name & email)
export const createUserRules = [
  body("name")
    .exists().withMessage("Name is required")
    .isString().isLength({ min: 3 }).withMessage("Name must be at least 3 characters"),
  body("email")
    .exists().withMessage("Email required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),
  handleValidation
];

// Update uses same rules
export const updateUserRules = createUserRules;

// ID param rule (MongoDB ObjectId)
export const idParamRule = [
  param("id")
    .exists().withMessage("User ID is required")
    .isMongoId().withMessage("Invalid user ID"),
  handleValidation
];
