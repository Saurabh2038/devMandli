
const express = require("express");

const app = express();

app.listen(3000, () => {
    console.log("server is listening on port 3000");
});

app.use("/user", (req, res) => {
    res.send("User - Saurabh2038");
})

app.use("/hello", (req, res) => {
    res.send("saying hello");
})

app.use("/", (req, res) => {
    res.send("Hello from the server.");
});

app.use("/hello", (req, res) => {
    res.send("saying hello");
})