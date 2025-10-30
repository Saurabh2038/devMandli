
const mongoose = require("mongoose");

const connectDB = async () => {
    await mongoose.connect(
        "mongodb+srv://Saurabh2038:SauRabh12345@namastenodejs.cnchmqx.mongodb.net/devMandli"
    );
};

module.exports = connectDB;
