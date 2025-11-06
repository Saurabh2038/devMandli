const express = require("express");
const profileRoute = express.Router();
const userAuth = require("../middlewares/auth");

profileRoute.get("/profile/user", userAuth, async (req, res) => {
    try{
        const user = req.user;
        res.send(user);
    }
    catch(err){
        res.status(400).send("Bad request. " + err.message);
    }
});

profileRoute.patch("/profile/edit", userAuth, async (req, res) => {
    try{
        
    }
    catch(err){
        res.status(400).send("Bad request. " + err.message);
    }
})

module.exports = profileRoute;