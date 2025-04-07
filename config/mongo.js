require('dotenv').config();
const mongoose = require('mongoose');
const db_uri = process.env.NODE_ENV === 'test' ? process.env.DB_URI_TEST : process.env.DB_URI;

const dbConnect = () => {
    mongoose.set('strictQuery', false) 
    // mongoose.connect(db_uri)
    // const db_uri = process.env.DB_URI;
    try {
        mongoose.connect(db_uri);
    } catch (error) {
        console.error("Error conectando a la BD:", error);
    }

    // Listen events
    mongoose.connection.on("connected", () => console.log("Conectado a la BD"));
};

module.exports = dbConnect;