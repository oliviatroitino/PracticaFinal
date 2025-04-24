const express = require("express")
const router = express.Router()
const { createClient, getClient, getClients} = require('../controllers/client.js');
const { validatorCreateClient, validatorGetClient } = require('../validators/client.js');
const authMiddleware = require("../middleware/session.js");

router.post('/create-client', authMiddleware, validatorCreateClient, createClient);
//router.patch('/:id', authMiddleware, validatorUpdateClient, updateClient);
router.get('/:id', authMiddleware, validatorGetClient, getClient);

module.exports = router;