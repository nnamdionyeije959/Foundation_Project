const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const secretKey = "my-secret-key"

const employeeService = require("../service/employeeService");
const ticketService = require("../service/ticketService");

const { authenticateToken, decodeJWT } = require("../util/jwt");

// use a placeholder employeeID for testing
// will be replaced using JWT authentication
const currentEmployeeId = "aa75718c-b875-4587-9f05-4e10bd91caf5";

router.post("/", validatePostEmployee, async (req, res) => {
    const data = await employeeService.postEmployee(req.body);
    // console.log("Data");
    // console.log(data.$metadata.attempts);
    if(data){
        res.status(201).json({message: `Created Employee ${JSON.stringify(data)}`});
    }else{
        res.status(400).json({message: "Employee not created", data: req.body});
    }
})

router.post("/login", async (req, res) => {
    const {username, password} = req.body;
    const data = await employeeService.validateLogin(username, password);
    if (data) {
        const token = jwt.sign(
            {
                id: data.employee_id,
                username,
                role: data.role // add some check so that only employees can add tickets!
            },
            secretKey,
            {
                expiresIn: "20m"
            }
        );
        //console.log(token);
        //tokenHolder = token;
        //console.log(tokenHolder);
        res.status(200).json({message: "you have logged in", token});
    } else {
        res.status(401).json({message: "invalid login"});
    };
})

// create a logout function for the employee to help with testing
// router.post(login)
// validateLoginStatus
// wipe the token and clear token holder and translated token
// copy function in Manager Controller

// router.post("/logout", validateLoginStatus, async (req, res) => {
//     tokenHolder = null;
//     translatedToken = null;
//     res.status(200).json({message: "You have been logged out!"});
// });

router.post("/submit", validateLoginStatus, async (req, res) => {
    //const {amount, description, status, employee} = req.body;'

    const localTranslatedToken = await decodeJWT(req.headers['authorization'].split(" ")[1]);

    const data = await ticketService.postTicket(req.body, localTranslatedToken.id, localTranslatedToken.username);
    if(data){
        res.status(201).json({message: `Created ticket ${JSON.stringify(data)}`});
    }else{
        res.status(400).json({message: "ticket not created", data: req.body});
    }

    // if (tokenHolder) {
    //     const translatedToken = await decodeJWT(tokenHolder);
    //     //console.log(translatedToken);
        
    // } else {
    //     res.status(400).json({message: "You are not logged in"});
    // }

})

router.get("/", validateLoginStatus, async (req, res) => {
    //const translatedToken = await decodeJWT(tokenHolder);
    const localTranslatedToken = await decodeJWT(req.headers['authorization'].split(" ")[1]);
    console.log(localTranslatedToken);
    
    const data = await ticketService.getTicketsByEmployeeId(localTranslatedToken.id);
    
    if(data) {
        //res.status(201).json({message: `Found tickets ${JSON.stringify(data)}`});
        res.status(201).json(data);
    }else{
        res.status(400).json({message: "tickets not found", data: req.body});
    }
})

async function validateLoginStatus(req, res, next) {
    const currentToken = req.headers['authorization'].split(" ")[1];

    if (currentToken) {
        const translatedToken = await decodeJWT(currentToken);
        if (!translatedToken) {
            res.status(400).json({message: "Invalid token"});
        }
        if (translatedToken.role != "employee") {
            res.status(400).json({message: "Action inaccessible to managers"});
        } else {
            next();
        }
        
    } else {
        res.status(400).json({message: "You are not logged in as an employee"});
    }
}

// validate post ticket middleware
function validatePostTicket(req, res, next) {
    const ticket = req.body;
    if (ticket.amount > 0 && ticket.description) {
        next();
    } else {
        res.status(400).json({message: "invalid ticket", data: ticket});
    }
}

// validate post employee middleware
function validatePostEmployee(req, res, next) {
    const employee = req.body;
    if(employee.username && employee.password) {
        next();
    } else {
        res.status(400).json({message: "invalid username or password", data: employee});
    }
}

module.exports = router;