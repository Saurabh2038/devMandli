const express = require("express");
const authRoute = express.Router();
const {validateSignUpData} = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const validator = require("validator");



authRoute.post("/signup", async (req, res) => {

    const data = req.body;

    try{

        validateSignUpData(req);

        const {firstName, lastName, emailId, password} = req.body;

        const passwordHash = await bcrypt.hash(password, 10)
        

        const user = new User({
            firstName,
            lastName,
            emailId,
            password: passwordHash,
        });
        await user.save();
        res.send("Account created successfully.");
    }
    catch(err) {
        res.status(400).send("Bad request " + err.message);
    };

});

authRoute.post("/login", async (req, res) => {
    const {emailId, password} = req.body;

    try{
        if(!validator.isEmail(emailId)){
            throw new Error("Wrong email id.");
        }
        else{
            const user = await User.findOne({emailId: emailId});
            if(!user){
                throw new Error("Invalid credentials.");
            }
            else{
                const isPasswordValid = await user.validatePassword(password);
                if(!isPasswordValid){
                    throw new Error("Invalid credentials.");
                }
                else{
                    const token = await user.getJWT();

                    res.cookie("token", token, {expires: new Date(Date.now() + (7*24*3600000))});
                    res.send("Login Successful.");
                }
            }
        }

        
    }
    catch(err){
        res.status(400).send("Bad request " + err.message);
    }
});

authRoute.post("/logout", async (req, res) => {
    res
        .cookie("token", null, {expires: new Date(Date.now())})
        .send("Logged out.");
})

module.exports = authRoute;