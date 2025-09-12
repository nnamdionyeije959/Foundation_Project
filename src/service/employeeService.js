const employeeDAO = require('../repository/employeeDAO');
// const uuid = require('uuid');
const bcrypt = require('bcrypt');
const {logger} = require("../util/logger");
//const { post } = require('../controller/employeeController');

async function postEmployee(employee) {
    const saltRounds = 10;
    
    const usernameCheck = await (getEmployeebyUsername(employee.username))
    // Validate the user and check if the new username is already taken
    if (validateEmployee(employee) && (!usernameCheck)){
        const password = await bcrypt.hash(employee.password, saltRounds);
        const data = await employeeDAO.postEmployee({
            username: employee.username,
            password,
            role: "employee",
            employee_id: crypto.randomUUID()
        })
        logger.info(`Creating new employee: ${JSON.stringify(data)}`);
        return data;
    } else {
        logger.info(`Failed to validate employee: ${JSON.stringify(employee)}`);
        return null;
    }
}

async function validateLogin(username, password) {
    const employee = await getEmployeebyUsername(username);
    if(employee && (await bcrypt.compare(password, employee.password))) {
        logger.info(`Employee logged in successfully`)
        return employee;
    } else {
        logger.info(`Employee credentials mismatch`);
        return null;
    }
}

//validateLogin("revaturePro", "sadnflawkjenfa");


async function getEmployeebyUsername(username) {
    if (username) {
        const data = await employeeDAO.getEmployeebyUsername(username);
        if(data){
            logger.info(`Employee found by username: ${JSON.stringify(data)}`);
            return data;
        }else{
            logger.info(`Employee not found by username: ${username}`);
            return null;
        }
    }
}

async function getEmployeebyId(employee_id) {
    if (employee_id) {
        const data = await employeeDAO.getEmployeebyId(employee_id);
        if(data){
            logger.info(`Employee found by id: ${JSON.stringify(data)}`);
            return data;
        }else{
            logger.info(`Employee not found by id: ${employee_id}`);
            return null;
        }
    }
}

//console.log(getEmployeebyUsername("nnamdi9e59").Items);


function validateEmployee(employee){
    const usernameResult = employee.username.length > 0;
    const passwordResult = employee.password.length > 0;
    return (usernameResult && passwordResult);
}

module.exports = {
    postEmployee,
    getEmployeebyUsername,
    getEmployeebyId,
    validateLogin,
}