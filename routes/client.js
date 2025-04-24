const express = require("express")
const router = express.Router()
const { createClient, getClient, getClients, updateClient} = require('../controllers/client.js');
const { validatorCreateClient, validatorGetClient, validatorUpdateClient } = require('../validators/client.js');
const authMiddleware = require("../middleware/session.js");

router.post('/create-client', authMiddleware, validatorCreateClient, createClient);
router.put('/:id', authMiddleware, validatorUpdateClient, updateClient);
router.get('/:id', authMiddleware, validatorGetClient, getClient);
router.get('/', authMiddleware, validatorGetClient, getClients);

module.exports = router;