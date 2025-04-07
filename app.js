require("dotenv").config();
const express = require("express");
const cors = require("cors");

const dbConnect = require('./config/mongo');
// const usersRouter = require("./routes/user.js");
// const authRouter = require("./routes/auth.js");

const app = express();

app.use(cors());
app.use(express.json());
// app.use('/users', usersRouter);
// app.use('/auth', authRouter)

dbConnect()

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor escuchando en el puerto ${port}`);
});
