const { handleHttpError } = require("../utils/handleError");
const UserModel = require("../models/user.js");
const { verifyToken } = require("../utils/handleJwt.js")

const authMiddleware = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            handleHttpError(res, "NOT_TOKEN", 401);
            return;
        }

        // Nos llega la palabra reservada Bearer (es un estándar) y el Token, así que me quedo con la última parte
        const token = req.headers.authorization.split(' ').pop();

        // Del token, miramos en Payload (revisar verifyToken de utils/handleJwt)
        const dataToken = await verifyToken(token);

        if (!dataToken._id) {
            handleHttpError(res, "ERROR_ID_TOKEN", 401);
            return;
        }

        // const user = await UserModel.findById(dataToken._id)
        const user = await UserModel.findById({_id: dataToken._id, deleted: { $in: [true, false] }})

        req.user = user; // inyecto al user en la peticion
        next();
    } catch (err) {
        handleHttpError(res, "NOT_SESSION", 401);
    }
};

module.exports = authMiddleware;