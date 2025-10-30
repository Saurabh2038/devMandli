

const validator = require("validator");

const validateSignUpData = (req) => {
    const {firstName, emailId, password} = req.body;

    if(!firstName){
        throw new Error("Enter your first name.");
    }
    if(!validator.isEmail(emailId)){
        throw new Error("Enter a valid email id.");
    }
    if(!validator.isStrongPassword(password, {
        minLength: 6,
        minUppercase: 1,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })){
        throw new Error("Password must contain lowercase, uppercase, number and symbol.");
    }

}

module.exports = {validateSignUpData};