require('dotenv').config();
const ClientModel = require('../models/client');
const { handleHttpError } = require('../utils/handleError.js');
const { matchedData } = require('express-validator');

// `POST /api/client` (crear cliente)
const getUserFromRequest = async (req) => {
    const user = req.user;

    console.log(`current user: ${user.name}, ${user.id}`);

    if (!user) throw new Error("ERROR_USER_NOT_FOUND");
    if (user.deleted) throw new Error("ERROR_USER_DELETED");

    return user;
}
const createClient = async (req, res) => {
    try {
        const user = await getUserFromRequest(req);
        const body = matchedData(req);
        const data = await ClientModel.create({...body, userId: user._id});
        res.send({data, message: "Cliente creado correctamente."});
    } catch (error) {
        console.error(`ERROR in createClient: ${error}`);
        handleHttpError(res, 'ERROR_CREATE_CLIENT', 403);
    }
};

const getClients = async (req, res) => {
    try {
        const data = await ClientModel.find({});
        res.send(data);
    } catch (error) {
        console.error(`ERROR in getClients: ${error}`);
        handleHttpError(res, 'ERROR_GET_CLIENTS', 403);
    }
}

const getClient = async (req, res) => {
    try {
        const {id} = matchedData(req);
        const result = await ClientModel.findById(id);
        res.send(result);
    } catch (error) {
        console.error(`ERROR in getClient: ${error}`);
        handleHttpError(res, 'ERROR_GET_CLIENTS', 403);
    }
}

/* const updateClient = async (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            return handleHttpError(res, 'ERROR_USER_NOT_FOUND', 403);
        }

        console.log(`user: ${user} \nuser id: ${user.id}`);

        const { id, ...body } = matchedData(req); 

        console.log(`body: ${body}`);

        const client = await ClientModel.findOne({_id: id});

        console.log(`client: ${client}`);

        const updatedClient = await ClientModel.findOneAndUpdate(
            { _id: id, userId: user._id }, 
            body,
            { new: true }
        );

        console.log(`updatedClient: ${updatedClient}`);

        if (!updatedClient) {
            return handleHttpError(res, 'ERROR_CLIENT_NOT_FOUND', 404);
        }

        res.send({ data: updatedClient, message: "Cliente actualizado correctamente." });
    } catch (error) {
        console.error(`ERROR in updateClient: ${error}`);
        handleHttpError(res, 'ERROR_UPDATE_CLIENT', 403);
    }
}; */

module.exports = { createClient, getClient, getClients };