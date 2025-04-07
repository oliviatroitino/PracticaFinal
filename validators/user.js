const { check } = require('express-validator');
const { validateResults } = require("../utils/handleValidator");

const validatorRegisterUser = [
    check("email").exists().isEmail(),
    check("password").exists().notEmpty().isString(),
    check("role").optional().isIn(["user", "admin"]),
    (req, res, next) => {
        return validateResults(req, res, next);
    }
];

const validatorValidateUser = [
    check("email").exists().notEmpty().isEmail(),
    check("code").exists().notEmpty().isLength({ min: 6, max: 6 }),
    (req, res, next) => {
        return validateResults(req, res, next);
    }
]

const validatorUpdateUser = [
    check("name").exists().notEmpty().isString(),
    check("surname").exists().notEmpty().isString(),
    check("nif")
        .exists()
        .notEmpty()
        .matches(/^[A-Z0-9]{1}[0-9]{7}[A-Z0-9]{1}$/)
        .withMessage("NIF inválido"),
    (req, res, next) => {
        return validateResults(req, res, next);
    }
];

const validatorCompany = [
    check("companyName").exists().notEmpty().isString(),
    check("companyCif").exists().notEmpty().isString().matches(/^[A-Z][0-9]{8}$/),
    check("companyAddress").exists().notEmpty().isString(),
    (req, res, next) => {
        return validateResults(req, res, next);
    }
]

const validatorSendRecoveryCode = [
    check("email")
      .exists().withMessage("El email es obligatorio")
      .isEmail().withMessage("Debe ser un email válido"),
    (req, res, next) => {
      return validateResults(req, res, next);
    }
];

const validatorRecoverPassword = [
    check("email")
      .exists().withMessage("El email es obligatorio")
      .isEmail().withMessage("Debe ser un email válido"),
  
    check("code")
      .exists().withMessage("El código es obligatorio")
      .isLength({ min: 6, max: 6 }).withMessage("El código debe tener 6 dígitos")
      .isNumeric().withMessage("El código debe ser numérico"),
  
    check("newPassword")
      .exists().withMessage("La nueva contraseña es obligatoria")
      .isLength({ min: 8 }).withMessage("Debe tener al menos 8 caracteres"),
  
    (req, res, next) => {
      return validateResults(req, res, next);
    }
];

module.exports = { validatorRegisterUser, validatorValidateUser, validatorUpdateUser, validatorCompany, validatorSendRecoveryCode, validatorRecoverPassword };