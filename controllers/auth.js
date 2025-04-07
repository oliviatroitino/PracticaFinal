const UserModel = require("../models/user");
const { matchedData } = require("express-validator");
const { handleHttpError } = require("../utils/handleError");
const { compare } = require("../utils/handlePassword");
const { tokenSign } = require("../utils/handleJwt");

const loginCtrl = async (req, res) => {
    try {
        const { email, password } = matchedData(req);

        const user = await UserModel.findOne({ email, status: true });
        if (!user) {
            return handleHttpError(res, "USER_NOT_FOUND", 404);
        }

        const checkPassword = await compare(password, user.password);
        if (!checkPassword) {
            return handleHttpError(res, "INVALID_PASSWORD", 401);
        }

        const token = await tokenSign(user);
        user.set("password", undefined, { strict: false }); // eliminar password antes de enviar el user como respuesta (seguridad)

        res.send({ token, user, message: "Login successful" });
    } catch (e) {
        console.error("LOGIN_ERROR:", e);
        handleHttpError(res, "LOGIN_ERROR", 500);
    }
};

module.exports = { loginCtrl };
