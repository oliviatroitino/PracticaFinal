const { check } = require('express-validator');
const { validateResults } = require("../utils/handleValidator");

const validatorCreateClient = [
    check("name").exists().notEmpty().isString(),
    check("cif")
        .exists()
        .notEmpty()
        .isString()
        .matches(/^[A-Z][0-9]{8}$/),
    check("address").exists().notEmpty(),
    check("address.street").exists().notEmpty().isString(),
    check("address.number").exists().notEmpty().isNumeric(),
    check("address.postal").exists().notEmpty().isNumeric(),
    check("address.city").exists().notEmpty().isString(),
    check("address.province").exists().notEmpty().isString(),
    (req, res, next) => {
        return validateResults(req, res, next);
    }
]

const validatorGetClient = [
    check("id").exists().notEmpty().isMongoId(),
    (req, res, next) => {
        return validateResults(req, res, next);
    }
];

/* client.name = data.name;
        client.cif = data.cif;
        client.address = data.address; */

const validatorUpdateClient = [
    check("name").exists().notEmpty().isString(),
    check("cif")
        .exists()
        .notEmpty()
        .isString()
        .matches(/^[A-Z][0-9]{8}$/),
    check("address").exists().notEmpty(),
    check("address.street").exists().notEmpty().isString(),
    check("address.number").exists().notEmpty().isNumeric(),
    check("address.postal").exists().notEmpty().isNumeric(),
    check("address.city").exists().notEmpty().isString(),
    check("address.province").exists().notEmpty().isString(),
    (req, res, next) => {
        return validateResults(req, res, next);
    }
];

module.exports = { validatorCreateClient, validatorGetClient, validatorUpdateClient };