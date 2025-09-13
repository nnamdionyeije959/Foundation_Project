const express = require('express')
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require("bcrypt");

const secretKey = "my-secret-key"

const employeeService = require("../service/employeeService");
const ticketService = require("../service/ticketService");
const managerService = require("../service/managerService");

const { authenticateToken, decodeJWT } = require("../util/jwt");

let tokenHolder = null;
let translatedToken = null; 


// this should be a get/pending request
// standard get should return all requests
// just need to edit the ticketDAO
router.get("/all-tickets", validateManagerLoginStatus, async (req, res) => {
    const data = await managerService.getAllTickets();
    // check for if the manager is logged in
    if (data) {
        res.status(201).json({data});
    } else {
        res.status(400).json({message: "failed to find requests", data: req.body});
    }
})

router.get("/pending", validateManagerLoginStatus, async (req, res) => {
    const data = await managerService.getAllPendingRequests();
    // check for if the manager is logged in
    if (data) {
        res.status(201).json({data});
    } else {
        res.status(400).json({message: "failed to find pending requests", data: req.body});
    }
})

router.post("/login", async (req, res) => {
    const {username, password} = req.body;
    const data = await managerService.validateManagerLogin(username, password);
    if (data) {
        const token = jwt.sign(
            {
                id: data.employee_id,
                username,
                role: data.role
            },
            secretKey,
            {
                expiresIn: "20m"
            }
        );
        //console.log(token);
        tokenHolder = token;
        //console.log(tokenHolder);
        res.status(200).json({message: "you have logged in", token});
    } else {
        res.status(401).json({message: "invalid login"});
    };
})

router.put("/requests", validateManagerLoginStatus, async (req, res) => {
    const {ticket_id, newStatus} = req.body;
    const data = await managerService.updateTicketStatus(ticket_id, newStatus);
    if (data) {
        res.status(201).json({data});
    } else {
        res.status(400).json({message: "failed to update ticket", data: req.body});
    }
})

async function validateManagerLoginStatus(req, res, next) {
    if (tokenHolder) {
        translatedToken = await decodeJWT(tokenHolder);
        if (!translatedToken) {
            res.status(400).json({message: "Invalid token"});
        }
        // check if the token holder is a manager
        if (translatedToken.role != "manager") {
            res.status(400).json({message: "Invalid credentials"});
        }
        next();
    } else {
        res.status(400).json({message: "You are not logged in as a manager"});
    }
}


// manager login function

// I probably won't need a separate DAO for the managers, I can just check for whether or not an
// employee has the manager role

module.exports = router;