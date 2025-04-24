const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const ClientSchema = mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: "user", 
            required: true 
        },
        name: {
            type: String,
            required: true
        },
        cif: {
            type: String,
            required: true
        },
        address: {
            street: {
                type: String
            },
            number: {
                type: Number
            },
            postal: {
                type: Number
            },
            city: {
                type: String
            },
            province: {
                type: String
            }
        },
        deleted: {
            type: Boolean,
            default: false
        }
    }
);

// TODO ver lo de mongoose-delete

module.exports = mongoose.model("client", ClientSchema);