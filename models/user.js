const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const UserSchema = new mongoose.Schema(
    {
        name: { 
            type: String,
            required: false
        },
        surname: { 
            type: String,
            required: false
        },
        nif: { type: String },
        email: { 
            type: String, 
            unique: true, 
            required: true 
        },
        password: { 
            type: String, 
            required: true 
        },
        status: {
            type: Boolean, 
            default: false
        },
        role: {
            type: String,
            enum: ["user", "admin"],
            default: "user",
        },
        intentos: { type: Number, default: 3 },
        validationCode: { type: String },
        recoveryCode: { type: String },
        company: {
            companyName: { type: String },
            companyCif: { type: String },
            companyAddress: { type: String },
            logo: {
                url: String,
                filename: {
                    type: String
                }
            }
        },
        deleted: { type: Boolean, default: false }
    }
);

UserSchema.plugin(mongooseDelete, {
    deletedAt: true,
    overrideMethods: "all",
});

module.exports = mongoose.model("user", UserSchema);