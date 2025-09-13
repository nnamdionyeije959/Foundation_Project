const ticketDAO = require('../repository/ticketDAO');
const employeeService = require('../service/employeeService');
// const uuid = require('uuid');
const bcrypt = require('bcrypt');
const {logger} = require("../util/logger");
//const { post } = require('../controller/employeeController');

async function postTicket(ticket, employee_id, username) {

    if (validateTicket(ticket) && employee_id && username) {
        
        const data = await ticketDAO.postTicket({
            
            employee_id: employee_id,
            username: username,
            amount: ticket.amount,
            description: ticket.description,
            status: "pending",
            reviewed: false,
            ticket_id: crypto.randomUUID(),
        })
        logger.info(`Creating new ticket: ${JSON.stringify(data)}`);
        return data;
    } else {
        logger.info(`Failed to validate ticket: ${JSON.stringify(ticket)}`);
        return null;
    }
}

async function getTicketsByEmployeeId(employee_id) {
    if (employeeService.getEmployeebyId(employee_id)) {
        const data = await ticketDAO.getTicketsByEmployeeId(employee_id);
        if(data){
            logger.info(`Ticket(s) found by Employee ID: ${JSON.stringify(data)}`);
            return data;
        }else{
            logger.info(`No Tickets found by Employee ID: ${employee_id}`);
            return null;
        }
    }
}

async function getTicketById(ticket_id) {
    if (ticket_id) {
        const data = await ticketDAO.getTicketById(ticket_id);
        if (data) {
            logger.info(`Ticket found by Ticket ID: ${JSON.stringify(data)}`);
            return data;
        } else {
            logger.info(`No Ticket found by Ticket Id: ${ticket_id}`);
            return null;
        }
    } else {

    }
}


function validateTicket(ticket) {
    const amountResult = ticket.amount > 0;
    const descriptionResult = ticket.description.length > 0;
    return (amountResult && descriptionResult);
}

module.exports = {
    postTicket,
    getTicketsByEmployeeId,
    getTicketById
}