const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        maxLength: 30
    },
    lastName: {
        type: String,
        maxLength: 30,
        default: "",
    },
    emailId: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 50,
        trim: true,
        unique: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: "Invalid Email."
        }
    },
    password: {
        type: String,
        required: true,
        minLength: 6,
        maxLength: 70,
        validate: {
            validator: (value) => validator.isStrongPassword(value, {
                minLength: 6,
                maxLength: 70,
                minLowercase: 1,
                minUppercase: 1,
                minNumbers: 1,
                minSymbols: 1
            }),
            message: "Password must include - uppercase, lowercase, number and symbol."
        }
    },
    age: {
        type: Number,
        // required: true,
        min: 12, 
        max: 80
    },
    gender: {
        type: String,
        lowercase: true,
        enum: ["male", "m", "female", "f", "others", "o"]
    },
    about: {
        type: String,
        maxLength: 1000,
        default: "",
    },
    skills: {
        type: [String],
        default: [],
        validate: [
            {
                validator: (arr) => arr.length <= 10,
                message: "You can list upto 10 skills only."
            },
            {
                validator: (arr) => arr.every(skill => skill.length <= 30),
                message: "Skill can't be too large."
            }
        ]
        
    },
    photoUrl: {
        type: String,
        maxLength: 500,
        validate: {
            validator: (url) => !url || validator.isURL(url),
            message: "Photo url is not correct."
        }
    },
    country: {
        type: String,
        maxLength: 30,
        default: "India"
    },
    city: {
        type: String,
        maxLength: 30,
        default: "",
    }
    
    
}, {timestamps: true});

userSchema.methods.getJWT = async function(){
    const token = await jwt.sign({_id: this._id}, JWT_SECRET, {expiresIn: "7d"});
    return token;
};

userSchema.methods.validatePassword = async function (userInputPassword) {
   return await bcrypt.compare(userInputPassword, this.password);
};



module.exports = mongoose.model("User", userSchema);