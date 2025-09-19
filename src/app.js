
const express = require('express');
const app = express();
const {logger, loggerMiddleware} = require('./util/logger');
const {authenticateToken} = require("./util/jwt");

// import the necessary functions from the employee controller
const employeeController = require('./controller/employeeController');
const managerController = require('./controller/managerController');

const PORT = 3000;

app.use(express.json());
app.use(loggerMiddleware);
app.use(express.static("static"));

app.use("/employees", employeeController);
app.use("/managers", managerController);

app.get("/", (req, res) => {
    res.send("Home Page");
})

app.get("/protected", authenticateToken, (req, res) => {
    res.json({message: "Accessed Protected Route", user: req.user});
})

app.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
})