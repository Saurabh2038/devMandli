const express = require("express");
const requestRoute = express.Router();
const userAuth = require("../middlewares/auth");

requestRoute.post("/connectionRequest", userAuth, async(req, res) => {
    try{
        const user = req.user;

        res.send(user.firstName + " sent a connection request.")
    }
    catch(err){
        res.status(400).send("Bad request." + err.message);
    }
})

module.exports = requestRoute;