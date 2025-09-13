const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, ScanCommand, QueryCommand, UpdateCommand} = require("@aws-sdk/lib-dynamodb");
const {logger} = require("../util/logger");

const client = new DynamoDBClient({region: "us-east-1"});
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "tickets_table";

// CRUD

async function postTicket(ticket) {
    const command = new PutCommand({
        TableName,
        Item: ticket
    })

    try{
        const data = await documentClient.send(command);
        logger.info(`PUT command to databse complete ${JSON.stringify(data)}`);
        return data;
    }catch(error){
        logger.error(error);
        return null;
    }
}

// need a function to get tickets by employeeId
async function getTicketsByEmployeeId(employee_id) {
    const command = new ScanCommand({
        TableName,
        FilterExpression: "#employee_id = :employee_id",
        ExpressionAttributeNames: {"#employee_id": "employee_id"},
        ExpressionAttributeValues: {":employee_id": employee_id}
    });

    try{
        const data = await documentClient.send(command);
        logger.info(`SCAN command to database complete ${JSON.stringify(data)}`);
        return data.Items;
    }catch(error){
        logger.error(error);
        return null;
    }
}

async function getTicketById(ticket_id) {
    const command = new ScanCommand({
        TableName,
        FilterExpression: "#ticket_id = :ticket_id",
        ExpressionAttributeNames: {"#ticket_id": "ticket_id"},
        ExpressionAttributeValues: {":ticket_id": ticket_id}
    });

    try{
        const data = await documentClient.send(command);
        logger.info(`SCAN command to database complete ${JSON.stringify(data)}`);
        return data.Items[0];
    }catch(error){
        logger.error(error);
        return null;
    }
}

//getTicketById("a56f9ecf-0624-47cf-a3e1-71faf3b6c7a0");

async function getAllTickets() {
    const command = new ScanCommand({
        TableName,
    });

    try{
        const data = await documentClient.send(command);
        logger.info(`SCAN command to database complete ${JSON.stringify(data)}`);
        return data.Items;
    }catch(error){
        logger.error(error);
        return null;
    }
}

async function getAllPendingTickets() {
    const command = new ScanCommand({
        TableName,
        FilterExpression: "#status = :status",
        ExpressionAttributeNames: {"#status": "status"},
        ExpressionAttributeValues: {":status": "pending"}
    });

    try{
        const data = await documentClient.send(command);
        logger.info(`SCAN command to database complete ${JSON.stringify(data)}`);
        return data.Items;
    }catch(error){
        logger.error(error);
        return null;
    }
}

async function updateTicketStatus(ticket_id, newStatus) {
    const command = new UpdateCommand({
        TableName,
        Key: {ticket_id: ticket_id},
        UpdateExpression: "set #status = :status, #reviewed = :reviewed",
        ExpressionAttributeNames: {
            "#status": "status",
            "#reviewed": "reviewed"
        },
        ExpressionAttributeValues: {
            ":status": newStatus,
            ":reviewed": true,
        }
    })

    try{
        const data = await documentClient.send(command);
        logger.info(`UPDATE command to databse complete ${JSON.stringify(data)}`);
        return data;
    }catch(error){
        logger.error(error);
        return null;
    }
}

//updateTicketStatus("7a566dc7-e3a4-4b8f-8f80-29cf59d9531e", "denied");

//console.log(getAllPendingTickets());

module.exports = {
    postTicket,
    getTicketsByEmployeeId,
    getTicketById,
    getAllTickets,
    getAllPendingTickets,
    updateTicketStatus
}