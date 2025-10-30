
const express = require("express");
const connectDB = require("./config/database");
const app = express();
const User = require("./models/user");
const {validateSignUpData} = require("./utils/validation");
const bcrypt = require("bcrypt");
const validator = require("validator");

app.use(express.json());

// signup - api

app.post("/signup", async (req, res) => {

    const data = req.body;

    try{
        // const limits = {
        //     firstName: 30,
        //     lastName: 30,
        //     emailId: 50,
        //     password: 30,
        //     about: 500,
        //     photoUrl: 500,
        //     country: 30,
        //     city: 30,
        // };

        // const invalidField = Object.keys(limits).find(
        //     key => data[key]?.length > limits[key]
        // );

        // if(invalidField){
        //     throw new Error(`${invalidField} is too long, (max ${limits[invalidField]} chars allowed).`)
        // }

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

// login - api

app.post("/login", async (req, res) => {
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
                const passwordCheck = await bcrypt.compare(password, user.password);
                if(!passwordCheck){
                    throw new Error("Invalid credentials.");
                }
                else{
                    res.send("Login Successful.");
                }
            }
        }

        
    }
    catch(err){
        res.status(400).send("Bad request " + err.message);
    }
})

// get user by email

app.get("/user", async(req, res) => {

    const userEmail = req.body.emailId;

    try{
        const user = await User.find({emailId: userEmail});
        if(user.length === 0){
            res.status(404).send("User not found.");
        }
        else{
            res.send(user);
        }
    }
    catch(err){
        res.status(404).send("Something went wrong. " + err.message);
    }
    
});

// feed - get all the users

app.get("/feed", async(req, res) => {
    
    try{
        const user = await User.find();
        res.send(user);
    }
    catch(err){
        res.status(404).send("Something went wrong.");
    }
})

// delete a user

app.delete("/user", async(req, res) => {

    const userId = req.body.userId;

    try{
        const user = await User.findByIdAndDelete(userId);
        if(!user){
            res.status(404).send("User not found.")
        }
        else{
            res.send("User deleted successfully.");
        }
    }
    catch(err){
        res.status(400).send("Something went wrong.");
    }
    
})

// update user using userId

// app.patch("/user", async(req, res) => {
    
//     const userId = req.body.userId;
//     const data = req.body;

//     try{
//         const user = await User.findOneAndUpdate({_id: userId}, data);
//         res.send("User updated successfully.");
//     }
//     catch(err){
//         res.status(400).send("Something went wrong.");
//     }
// })

// update user using email

app.patch("/user", async(req, res) => {

    const userEmail = req.body.emailId;
    const data = req.body;

    const allowedFields = ["firstName", "lastName", "password", "age", "gender", "about", "skills", "photoUrl", "country", "city"];

    const sanitizedData = Object.fromEntries(
        Object.entries(data).filter(([key]) => allowedFields.includes(key))
    );
    
    try{
        const user = await User.findOneAndUpdate({emailId: userEmail}, sanitizedData, {runValidators: true});
        if(!user){
            res.status(404).send("User not found.");
        }
        else{
            res.send("User updated successfully.");
        }
    }
    catch(err){
        res.status(400).send("Wrong credentials. " + err.message);
    }
})

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

