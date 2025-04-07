const express = require("express")
const router = express.Router()
const { validatorRegisterUser, validatorValidateUser, validatorUpdateUser, validatorCompany, validatorSendRecoveryCode, validatorRecoverPassword } = require("../validators/user")
const { registerUser, validateUser, deleteUser, getCurrentUser, resendValidationCode, sendRecoveryCode, recoverPassword, updateUser, updateCompany, uploadLogo } = require("../controllers/user.js")
const { validatorMail } = require("../validators/email.js");
const authMiddleware = require("../middleware/session.js");
const { uploadMiddlewareMemory } = require('../utils/handleStorage.js')

router.post("/register", validatorRegisterUser, registerUser);
router.post("/validate", validatorValidateUser, validateUser);
router.post("/resend-code", authMiddleware, validatorMail, resendValidationCode);
router.post("/send-recovery-code", validatorSendRecoveryCode, sendRecoveryCode);
router.patch("/recover-password", validatorRecoverPassword, recoverPassword);
router.patch('/logo', authMiddleware, uploadMiddlewareMemory.single("image"), uploadLogo);
router.patch("/", authMiddleware, validatorUpdateUser, updateUser);
router.patch("/company", authMiddleware,  validatorCompany, updateCompany);
router.delete("/", authMiddleware, deleteUser);
router.get("/user", authMiddleware, getCurrentUser);

module.exports = router;