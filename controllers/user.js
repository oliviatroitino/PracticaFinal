require('dotenv').config();
const UserModel = require('../models/user.js');
const { handleHttpError } = require('../utils/handleError.js');
const { matchedData } = require('express-validator');
const { encrypt } = require("../utils/handlePassword.js");
const { sendEmail } = require("../utils/handleEmail"); // OAuth
const { tokenSign } = require("../utils/handleJwt.js");
const {uploadToPinata} = require('../utils/handleUploadIPFS.js')

const registerUser = async (req, res) => {
    try {
        const body = matchedData(req); 

        // Ver si ya existe el usuario
        const existingUser = await UserModel.findOne({ email: body.email, status: true });

        if (existingUser) {
            // Ya existe el email y está validado
            return handleHttpError(res, 'ERROR_USER_EXISTS', 409);
        }

        const hashedPassword = await encrypt(body.password);
        body.password = hashedPassword;

        // Generar código de validación
        body.status = false; // No verificado
        body.validationCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generación código
        body.intentos = 0;
        body.role = "user";

        const user = await UserModel.create(body);

        await sendEmail({
            to: user.email,
            subject: "Código de verificación",
            html: `<p>Tu código es: <b>${user.validationCode}</b></p>`,
            from: process.env.EMAIL
        });
          
        const token = await tokenSign(user);
        
        user.set("password", undefined, { strict: false });

        res.send({user, token, message: "Usuario registrado. Revisa tu correo."});
    } catch (error) {
        console.error("Error en registerUser: ", error);
        handleHttpError(res, 'ERROR_REGISTER_USER', 403);
    }
};

const validateUser = async (req, res) => {
    try {
        const { email, code } = matchedData(req);
        const user = await UserModel.findOne({ email, status: false });

        if (!user) {
            return handleHttpError(res, "USER_NOT_FOUND_OR_ALREADY_VALIDATED", 404);
        }

        if(user.validationCode !== code){ // Codigo incorrecto
            user.intentos += 1;
            await user.save();

            if (user.intentos >= 3){
                await UserModel.deleteOne({ _id: user.id });
                return handleHttpError(res, "MAX_ATTEMPTS_EXCEEDED", 403);
            }

            return handleHttpError(res, "INVALID_CODE", 401);
        }

        // Codigo correcto
        user.status = true;
        user.intentos = 0;
        await user.save();

        const token = await tokenSign(user);
        user.set("password", undefined, { strict: false });

        res.send({
            message: "Usuario validado correctamente",
            token,
            user
        });
    } catch (err) {
        console.error(err);
        handleHttpError(res, "ERROR_VALIDATING_USER", 500);
    }
};

const resendValidationCode = async (req, res) => {
    try {
        const { email } = matchedData(req);
        const user = await UserModel.findOne({ email, status: false });
    
        if (!user) {
            return handleHttpError(res, "USER_NOT_FOUND_OR_ALREADY_VALIDATED", 404);
        }
    
        // Generar código
        const newCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.validationCode = newCode;
        user.intentos = 0;
        await user.save();
    
        await sendEmail({
            to: user.email,
            subject: "Código de verificación",
            html: `<p>Tu código es: <b>${user.validationCode}</b></p>`,
            from: process.env.EMAIL
        });
    
        res.send({ message: "Código enviado por email" });
  
    } catch (error) {
        console.error("ERROR_SEND_CODE:", error);
        handleHttpError(res, "ERROR_SEND_CODE", 500);
    }
};

const updateUser = async (req, res) => {
    try {
        const data = matchedData(req);
        const user = req.user;

        user.name = data.name;
        user.surname = data.surname;
        user.nif = data.nif;

        await user.save();

        user.set("password", undefined, { strict: false });

        res.send({ message: "Datos usuario actualizados correctamente: ", user });

    } catch (error) {
        console.error("ERROR_UPDATE_USER:", error);
        handleHttpError(res, "ERROR_UPDATE_USER", 500);
    }
};

const updateCompany = async (req, res) => {
    try {
        const data = matchedData(req);
        const user = req.user;

        if (!user.company) {
            user.company = {}; // por si no existe
        }

        user.company.companyName = data.companyName;
        user.company.companyCif = data.companyCif;
        user.company.companyAddress = data.companyAddress;

        await user.save();

        user.set("password", undefined, { strict: false });

        res.send({ message: "Datos compañía actualizados correctamente: ", user });
    } catch (error) {
        console.error("ERROR_UPDATE_COMPANY:", error);
        handleHttpError(res, "ERROR_UPDATE_COMPANY", 500);
    }
};

const uploadLogo = async (req,res) => {
    try {
        const file = req.file;
        const user = req.user;

        if (!file){
            return handleHttpError(res, "FILE_NOT_PROVIDED", 400);
        }

        const fileBuffer = file.buffer;
        const originalName = file.originalname;

        console.log("(debug en controllers/user.js) fileBuffer:", file?.buffer?.length);
        console.log("(debug en controllers/user.js) fileName:", file?.originalname);
        

        const pinataResponse = await uploadToPinata(fileBuffer, originalName);
        const ipfsFile = pinataResponse.IpfsHash;
        const logoUrl = `https://${process.env.PINATA_GATEWAY_URL}/ipfs/${ipfsFile}`

        if (!user.company) {
            user.company = {};
        }
        user.company.logo = {
            url: logoUrl,
            filename: originalName
        };
        await user.save();

        user.set("password", undefined, { strict: false });

        res.send({ message: "Logo subido correctamente", logo: logoUrl });
    } catch (error) {
        console.error("ERROR_UPLOAD_LOGO:", error);
        handleHttpError(res, "ERROR_UPLOAD_LOGO", 500);
    }
};

const sendRecoveryCode = async (req, res) => {
    try {
        const {email} = matchedData(req);
        const user = await UserModel.findOne({ email });

        if (!user) {
            return handleHttpError(res, "USER_NOT_FOUND", 404);
        }

        // Generar código de recuperación
        const recoveryCode = Math.floor(100000 + Math.random() * 900000).toString();
        user.recoveryCode = recoveryCode;
        await user.save();

        // Enviar por mail
        await sendEmail({
            to: user.email,
            subject: "Código de recuperación",
            html: `<p>Tu código es: <b>${user.recoveryCode}</b></p>`,
            from: process.env.EMAIL
        });
        
        res.send({ message: "Código enviado por email" });
        
    } catch (error) {
        console.error(error);
        handleHttpError(res, "ERROR_RECOVERING_PASSWORD", 500);
    }

};

const recoverPassword = async (req, res) => {
    try {
        const { email, code, newPassword } = matchedData(req);
        const user = await UserModel.findOne({ email });

        if (!user) {
            return handleHttpError(res, "USER_NOT_FOUND", 404);
        }

        if(user.recoveryCode !== code){ // Codigo incorrecto
            return handleHttpError(res, "INVALID_CODE", 401);
        }

        // Codigo correcto
        user.password = await encrypt(newPassword);
        user.recoveryCode = null;
        await user.save();
        
        user.set("password", undefined, { strict: false });
        const token = await tokenSign(user);

        res.send({
            message: "Contraseña actualizada correctamente",
            token,
            user
        });
    } catch (err) {
        console.error(err);
        handleHttpError(res, "ERROR_RECOVERING_PASSWORD", 500);
    }
}

const getCurrentUser = async (req, res) => {
    try {
        const user = req.user;
    
        if (!user) {
            return handleHttpError(res, "USER_NOT_FOUND", 404);
        }

        if (user.deleted) {
            return handleHttpError(res, "USER_DELETED", 404);
        }
    
        user.set("password", undefined, { strict: false });
        res.send({ user });
    } catch (err) {
        console.error("ERROR_GET_ME:", err);
        handleHttpError(res, "ERROR_GET_ME", 500);
    }
}

const deleteUser = async (req, res) => {
    try {
        const user = req.user;
        const soft = req.query.soft !== "false";
    
        if (!user) {
            return handleHttpError(res, "USER_NOT_FOUND", 404);
        }
        if (user.role !== "user") {
            return handleHttpError(res, "UNAUTHORIZED_DELETE", 403)
        }
    
        if (soft) {
            user.deleted = true;
            await user.save();
            return res.send({ message: "Cuenta desactivada correctamente (soft delete)" });
        } else {
            await UserModel.findByIdAndDelete({ _id: user._id });
            return res.send({ message: "Cuenta eliminada permanentemente (hard delete)" });
        }
    } catch (err) {
        console.error("ERROR_DELETE_USER:", err);
        handleHttpError(res, "ERROR_DELETE_USER", 500);
    }
};  

module.exports = { registerUser, validateUser, deleteUser, getCurrentUser, resendValidationCode, sendRecoveryCode, recoverPassword, updateUser, updateCompany, uploadLogo }