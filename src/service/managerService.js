const employeeDAO = require('../repository/employeeDAO');
const ticketDAO = require('../repository/ticketDAO');
// const managerDAO = require('../repository/managerDAO');

const employeeService = require('../service/employeeService');
const ticketService = require('../service/ticketService');

const bcrypt = require('bcrypt');
const {logger} = require("../util/logger");


async function getAllTickets() {
    const data = await ticketDAO.getAllTickets();
    if (data) {
        logger.info(`Retrieved all ticket requests: ${JSON.stringify(data)}`);
        return data;
    } else {
        logger.info(`Failed to retrieve ticket requests}`);
        return null;
    }
}


async function getAllPendingRequests() {
    const data = await ticketDAO.getAllPendingTickets();
    if (data) {
        logger.info(`Retrieved pending ticket requests: ${JSON.stringify(data)}`);
        return data;
    } else {
        logger.info(`Failed to retrieve pending ticket requests}`);
        return null;
    }

}

async function updateTicketStatus(ticket_id, newStatus) {
    //const ticketChecker = await validateTicketUpdate
    if (await validateTicketUpdate(ticket_id, newStatus)) {
        const data = await ticketDAO.updateTicketStatus(ticket_id, newStatus);
        if (data) {
            logger.info(`Ticket has been updated: ${JSON.stringify(data)}`)
            return data;
        } else {
            logger.info(`Failed to update ticket: $JSON.stringify${ticket_id}`);
            return null;
        }
    } else {
        logger.info(`Failed to validate ticket or status: ${JSON.stringify(ticket_id, newStatus)}`);
        return null;
    }
}

// middleware function
async function validateManagerLogin(username, password) {

    if (!username || !password) {
        logger.info(`Invalid Username or Password`);
        return null;
    }

    const manager = await employeeService.getEmployeebyUsername(username);
    if (manager && (await bcrypt.compare(password, manager.password)) && manager.role == 'manager') {
        logger.info(`Manager logged in successfully`)
        return manager;
    } else {
        logger.info(`Manager credentials mismatch`);
        return null;
    }
}

// middleware function to check if ticket update is valid
async function validateTicketUpdate(ticket_id, newStatus) {
    if (!ticket_id || !newStatus) {
        return null;
    }

    const employeeCheckResult = await ticketService.getTicketById(ticket_id);
    console.log("ticket result checker");
    console.log(employeeCheckResult);
    const validStatus = (newStatus == "approved" || newStatus == "denied");
    return (employeeCheckResult && validStatus && employeeCheckResult.reviewed == false);
}

module.exports = {
    getAllPendingRequests,
    validateManagerLogin,
    getAllTickets,
    updateTicketStatus,
    validateTicketUpdate
}