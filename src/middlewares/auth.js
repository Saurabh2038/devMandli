
const jwt = require("jsonwebtoken");
const User = require("../models/user");

require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const userAuth = async (req, res, next) => {
    try{
        const {token} = req.cookies;
        if(!token){
            throw new Error("Please login.");
        }

        const decodedMessage = await jwt.verify(token, JWT_SECRET);
        const {_id} = decodedMessage;

        const user = await User.findById(_id);

        if(!user){
            throw new Error("User not found.");
        }
        req.user = user;
        next();
    }
    catch(err){
        res.status(400).send("Bad request. " + err.message);
    }
}

module.exports = userAuth;
