const mongoose = require("mongoose");
const mongooseDelete = require("mongoose-delete");

const DeliveryNoteSchema = mongoose.Schema(
    {
        clientId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "client", 
            required: true 
        },
        projectId: { 
            type: mongoose.Schema.Types.ObjectId, 
            ref: "project", 
            required: true },
        format: { 
            type: String, 
            enum: ["material", "hours"], 
            required: true 
        },
        material: { 
            type: String, 
            required: function () { return this.format === "material"; } // TODO revisar
        },
        hours: { 
            type: Number, 
            required: function () { return this.format === "hours"; } // TODO revisar
        },
        description: { type: String, required: true },
        workdate: { type: Date, required: true }
    }
);

module.exports = mongoose.model("delivery-note", DeliveryNoteSchema);