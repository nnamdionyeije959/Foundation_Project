const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, ScanCommand, QueryCommand} = require("@aws-sdk/lib-dynamodb");
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

//console.log(getAllPendingTickets());

module.exports = {
    postTicket,
    getTicketsByEmployeeId,
    getAllPendingTickets
}