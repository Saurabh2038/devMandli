
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const cookieParser = require("cookie-parser");

const userAuth = require("./middlewares/auth");
const authRoute = require("./routes/auth");
const profileRoute = require("./routes/profile");
const requestRoute = require("./routes/request");

app.use(express.json());
app.use(cookieParser());

// auth api - signup, login, logout

app.use("/", authRoute);

// get profile

app.use("/", profileRoute);

// sending connection - Request

app.use("/", requestRoute);


connectDB()
.then(() => {
    console.log("Database connection successful.");
    app.listen(3000, () => {
        console.log("server is listening on port 3000");
    });
})
.catch((err) => {
    console.error("Database can't be connected" + err.message);
})

