const express = require("express")
const app = express()
const mongoose = require("mongoose")
const cors = require("cors")
const bodyParser = require("body-parser")
const session = require('express-session');
const cookieParser = require("cookie-parser")
const passport = require('passport');
const googleAuthRouter = require("./routes/googleAuthRoute")
const authRouter = require("./routes/authRoute")
const PORT = 1808

app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({ origin: true, credentials: true }))
app.use(express.json())
app.use(cookieParser())

const dotenv = require("dotenv")

dotenv.config({ path: "./config.env" })

app.use(session({ secret: "cat", resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());


const DB = process.env.DATABASE
mongooseOptions = {
    autoIndex: false,
    maxPoolSize: 10,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
    family: 4,
    keepAliveInitialDelay: 300000,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    minPoolSize: 3,
};

mongoose.set('strictQuery', true)

mongoose.connect(DB, mongooseOptions).then(() => {
    console.log("Database Connected !")
})
mongoose.connection.on("error", (error) => {
    console.log(error, "chetan")
})

app.use("/user", authRouter)
app.use("/auth", googleAuthRouter)
app.all("*", (req, res) => {
    res.status(404).json({
        message: `Can't find ${req.originalUrl} on this server!`,
    })
})

app.listen(PORT, () => {
    console.log(`Server listening at ${PORT} PORT!`)
})