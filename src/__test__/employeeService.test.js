jest.mock('../repository/employeeDAO');
const employeeDAO = require("../repository/employeeDAO");
const employeeService = require('../service/employeeService');



describe("Employee Posting Suite", () => {
    beforeEach(() => {
        employeeDAO.postEmployee.mockReturnValue(null);
        employeeDAO.getEmployeebyUsername.mockClear();
        employeeDAO.getEmployeebyId.mockClear(null);
    })

    test("post a valid employee should get correct username and password", async () => {
        employeeDAO.postEmployee.mockReturnValue({
            employee_id: "3d3d3",
            username: "user1",
            password: "pass1",
            role: "employee"
        });

        const dummyEmployee = {
            username: "user1",
            password: "pass1"
        };

        const newEmployee = await employeeService.postEmployee(dummyEmployee);

        expect(newEmployee.username).toBe("user1");
        expect(employeeDAO.postEmployee).toHaveBeenCalled();
    })

    test("Cannot post an invalid employee object", async () => {

        const newEmployee = await employeeService.postEmployee(null);

        expect(newEmployee).toBeNull();
    })


    test("Cannot post an employee if their username is already in use", async () => {
        employeeDAO.getEmployeebyUsername.mockReturnValue({
            employee_id: "3d3d3",
            username: "user1",
            password: "pass1",
            role: "employee"
        });

        const dummyEmployee = {
            username: "user1",
            password: "pass1"
        };

        const newEmployee = await employeeService.postEmployee(dummyEmployee);

        expect(newEmployee).toBeNull();
    })

    test("Cannot post an employee with invalid credentials", async () => {
        employeeDAO.getEmployeebyUsername.mockReturnValue(null);

        const dummyEmployee = {
            username: "",
            password: "sdfa"
        };

        const newEmployee = await employeeService.postEmployee(dummyEmployee);

        expect(newEmployee).toBeNull();
    })

    test("Handling database failure on valid employee posting", async () => {
        employeeDAO.postEmployee.mockReturnValue(null);

        const dummyEmployee = {
            username: "user10",
            password: "pass10"
        };

        const newEmployee = await employeeService.postEmployee(dummyEmployee);

        expect(newEmployee).toBe(null);
    })

})


describe("Getting an Employee by their Username Suite", () => {
    test("Should return an employee through their username", async () => {
        employeeDAO.getEmployeebyUsername.mockReturnValue({
            password: '$2b$10$hqjZALTTjPO.URvvkItB5eUP4iuleqjF5bm2GWELbNreo8pD/p2E.',
            username: 'user1',
            role: 'employee',
            employee_id: 'aa75718c-b875-4587-9f05-4e10bd91caf5'
        })

        const dummyUsername = "user1";

        const returnedEmployee = await employeeService.getEmployeebyUsername(dummyUsername);
        if (returnedEmployee) {
            //console.log(returnedEmployee);
            expect(employeeDAO.getEmployeebyUsername).toHaveBeenCalled();
            expect(returnedEmployee).toBeDefined();
            expect(returnedEmployee.username).toBe(dummyUsername);
        }
    })

    test("Handling of invalid username", async () => {
        const returnedEmployee = await employeeService.getEmployeebyUsername(null);
        expect(returnedEmployee).toBeNull();
    })

    test("Handling username not associated with an Employee", async () => {
        employeeDAO.getEmployeebyUsername.mockReturnValue(null);

        const dummyInvalidUsername = "userX";

        const returnedEmployee = await employeeService.getEmployeebyUsername(dummyInvalidUsername);

        expect(returnedEmployee).toBeNull();
    });

    test("Invalid response from database to valid username", async () => {
        employeeDAO.getEmployeebyUsername.mockReturnValue(null);

        const dummyUsername = "user1";

        const returnedEmployee = await employeeService.getEmployeebyUsername(dummyUsername);
        expect(returnedEmployee).toBeNull();
    });
})

describe("Getting an Employee by their ID Suite", () => {
    test("Should take an ID and return the correct employee", async () => {
        employeeDAO.getEmployeebyId.mockReturnValue({
            password: '$2b$10$hqjZALTTjPO.URvvkItB5eUP4iuleqjF5bm2GWELbNreo8pD/p2E.',
            username: 'user2',
            role: 'employee',
            employee_id: 'aa75718c-b875-4587-9f05-4e10bd91caf5'
        })

        const dummyEmployeeId = "aa75718c-b875-4587-9f05-4e10bd91caf5";
        const returnedEmployee = await employeeService.getEmployeebyId(dummyEmployeeId);
        if (returnedEmployee) {
            //console.log(returnedEmployee);
            expect(employeeDAO.getEmployeebyId).toHaveBeenCalled();
            expect(returnedEmployee.employee_id).toBe("aa75718c-b875-4587-9f05-4e10bd91caf5");
        }
    })

    test("Handling of invalid Employee ID", async () => {
        const returnedEmployee = await employeeService.getEmployeebyId(null);
        expect(returnedEmployee).toBeNull();
    })

    test("Handling Employee ID not associated with an Employee", async () => {
        employeeDAO.getEmployeebyId.mockReturnValue(null);

        const dummyInvalidEmployeeId = "aa75718c-b875-4587-9f05-4e10";

        const returnedEmployee = await employeeService.getEmployeebyId(dummyInvalidEmployeeId);

        expect(returnedEmployee).toBeNull();
    });

    test("Invalid response from database to valid Employee ID", async () => {
        employeeDAO.getEmployeebyId.mockReturnValue(null);

        const dummyEmployeeId = "aa75718c-b875-4587-9f05-4e10bd91caf5";

        const returnedEmployee = await employeeService.getEmployeebyId(dummyEmployeeId);
        expect(returnedEmployee).toBeNull();
    });

})

describe("Validate Login Suite", () => {
    
    const bcrypt = require('bcrypt');
    // jest.mock('bcrypt', () => ({
    //     compare: jest.fn(),
    // }));

    test("Validate Login works with valid Password and Username", async () => {

        
        employeeDAO.getEmployeebyUsername.mockReturnValue({
            password: '$2b$10$hqjZALTTjPO.URvvkItB5eUP4iuleqjF5bm2GWELbNreo8pD/p2E.',
            username: 'user2',
            role: 'employee',
            employee_id: 'aa75718c-b875-4587-9f05-4e10bd91caf5'
        })
        
        const dummyUsername = "user2";
        const dummyPassword = "pass1";

        const loginValidation = await employeeService.validateLogin(dummyUsername, dummyPassword);
        expect(employeeDAO.getEmployeebyUsername).toHaveBeenCalled();
        expect(loginValidation.role).toBe("employee");
        expect(loginValidation.username).toBe("user2");
    });

    test("Validating Login with invalid Username or Password returns null", async () => {
        const dummyUsername = null;
        const dummyPassword = "pass2";

        const loginValidation = await employeeService.validateLogin(dummyUsername, dummyPassword);
        expect(loginValidation).toBeNull();
    })

    test("Validating Login that doesn't match an employee returns null", async () => {
        employeeDAO.getEmployeebyUsername.mockReturnValue(null);

        const dummyInvalidUsername = "user2X";
        const dummyPassword = "pass32";

        const loginValidation = await employeeService.validateLogin(dummyInvalidUsername, dummyPassword);

        expect(loginValidation).toBeNull();
    })

    test("Validating Login with an incorrect password returns null", async () => {
        employeeDAO.getEmployeebyUsername.mockReturnValue({
            password: '$2b$10$hqjZALTTjPO.URvvkItB5eUP4iuleqjF5bm2GWELbNreo8pD/p2E.',
            username: 'user2',
            role: 'employee',
            employee_id: 'aa75718c-b875-4587-9f05-4e10bd91caf5'
        })
        
        const dummyUsername = "user2";
        const dummyPassword = "pass32";

        const loginValidation = await employeeService.validateLogin(dummyUsername, dummyPassword);
        expect(loginValidation).toBeNull();
    })
})