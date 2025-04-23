const express = require("express")
const router = express.Router()
const { createClient, getClient, getClients, updateClient} = require('../controllers/client.js');
const { validatorCreateClient, validatorGetClient, validatorUpdateClient } = require('../validators/client.js');
const authMiddleware = require("../middleware/session.js");
const loadClient = require('../middleware/loadClient.js');

router.post('/create-client', authMiddleware, validatorCreateClient, createClient);
router.patch('/:id', authMiddleware, validatorUpdateClient, updateClient);
router.get('/:id', authMiddleware, loadClient, validatorGetClient, getClient);

module.exports = router;