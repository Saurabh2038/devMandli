const express = require("express");
const profileRoute = express.Router();
const userAuth = require("../middlewares/auth");
const {validateProfileEditData, validateSignUpData} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");

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
        const allowedFields = ["firstName", "lastName", "age", "gender", "about", "skills", "photoUrl", "country", "city"];

        const updates = {};
        Object.keys(req.body).forEach((key) => {
            if (allowedFields.includes(key)) {
                updates[key] = req.body[key];
            }
        });

        validateProfileEditData({ body: updates });

        const userId = req.user._id;
        const updatedUser = await User.findByIdAndUpdate(
            userId,
            updates,
            { new: true }
        );

        res.status(200).send({
            message: "Profile updated successfully.",
            data: updatedUser
        });
    }
    catch(err){
        res.status(400).send("Bad request. " + err.message);
    }
})

profileRoute.patch("/profile/password", userAuth, async (req, res) => {
    try{
        
        const {password} = req.body;

        if(!password){
            throw new Error("Password is required!");
        }

        if (!validator.isStrongPassword(password, {
            minLength: 6,
            maxLength: 70,
            minUppercase: 1,
            minLowercase: 1,
            minNumbers: 1,
            minSymbols: 1,
        })) {
            throw new Error("Password must contain lowercase, uppercase, number and symbol.");
        }

        
        const passwordHash = await bcrypt.hash(password, 10);
        const userId = req.user._id;
        const updatedUser = await User.findByIdAndUpdate(userId, { password: passwordHash}, {new: true});

        res
            .cookie("token", null, {expires: new Date(Date.now())})
            .send("Password updated successfully, login again to continue.");
    }
    catch(err){
        res.status(400).send("Bad request. " + err.message);
    }
    
})

module.exports = profileRoute;