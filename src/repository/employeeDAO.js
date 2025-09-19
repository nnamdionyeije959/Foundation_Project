const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const { DynamoDBDocumentClient, PutCommand, ScanCommand, QueryCommand} = require("@aws-sdk/lib-dynamodb");
const {logger} = require("../util/logger");

const client = new DynamoDBClient({region: "us-east-1"});
const documentClient = DynamoDBDocumentClient.from(client);

const TableName = "employees_table";

// CRUD

async function postEmployee(employee) {
    const command = new PutCommand({
        TableName,
        Item: employee
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



async function getEmployeebyUsername(username) {
    const command = new ScanCommand({
        TableName,
        FilterExpression: "#username = :username",
        ExpressionAttributeNames: {"#username": "username"},
        ExpressionAttributeValues: {":username": username}
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


// make a get employeebyId function for help
async function getEmployeebyId(employee_id) {
    const command = new ScanCommand({
        TableName,
        FilterExpression: "#employee_id = :employee_id",
        ExpressionAttributeNames: {"#employee_id": "employee_id"},
        ExpressionAttributeValues: {":employee_id": employee_id}
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

//console.log(getEmployeebyUsername("nnamdi95e9"));

module.exports = {
    postEmployee,
    getEmployeebyUsername,
    getEmployeebyId
}