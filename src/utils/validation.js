

const validator = require("validator");

const validateSignUpData = (req) => {
    const {firstName, emailId, password} = req.body;

    if(!firstName){
        throw new Error("Enter your first name.");
    }
    else if(firstName.length > 30){
        throw new Error("firstname is too large.")
    }
    if(!validator.isEmail(emailId)){
        throw new Error("Enter a valid email id.");
    }
    else if(emailId.length > 50){
        throw new Error("email-id is too large.");
    }
    if(!validator.isStrongPassword(password, {
        minLength: 6,
        maxLength: 70,
        minUppercase: 1,
        minLowercase: 1,
        minNumbers: 1,
        minSymbols: 1,
    })){
        throw new Error("Password must contain lowercase, uppercase, number and symbol.");
    }
    else if(password.length > 500){
        throw new Error("Password is too large.");
    }
}

const validateProfileEditData = (req) => {
    const {firstName, lastName, age, gender, about, skills, photoUrl, country, city} = req.body;
    
    if(firstName && firstName.length > 30){
        throw new Error("firstname is too large.");
    }
    if(lastName && lastName.length > 30){
        throw new Error("lastname is too large.");
    }
    if(age && (age < 12 || age > 80)){
        throw new Error("age must be between 12 to 80.");
    }
    if(gender && gender.length > 10){
        throw new Error("please enter a valid gender.");
    }
    if(about && about.length > 1000){
        throw new Error("about is too large.");
    }
    if(skills){
        if(!Array.isArray(skills)){
            throw new Error("skills should be an array.");
        }
        if(skills.length > 10){
            throw new Error("skills should not exceed 10.");
        }
        skills.forEach((value) => {
            if(value.length > 30){
                throw new Error("skill can't be too large.");
            }
        })
    }
    if(photoUrl && photoUrl.length > 500){
        throw new Error("photoUrl is too large.");
    }
    if(photoUrl && !validator.isURL(photoUrl)){
        throw new Error("enter a valid photo-URL.");
    }
    if(country && country.length > 30){
        throw new Error("Name of country can't be too large.");
    }
    if(city && city.length > 30){
        throw new Error("City name can't be too large.");
    }



}

module.exports = {validateSignUpData, validateProfileEditData};