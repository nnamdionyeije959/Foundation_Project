jest.mock('../repository/employeeDAO');
const employeeDAO = require("../repository/employeeDAO");
const employeeService = require('../service/employeeService');

describe("Employee Service", () => {
    beforeEach(() => {
        employeeDAO.postEmployee.mockReturnValue([]);
        employeeDAO.getEmployeebyUsername.mockClear();
        employeeDAO.getEmployeebyId.mockClear([]);
    })

    test("post an invalid employee", async () => {
        employeeDAO.postEmployee.mockReturnValue(null);
        const newEmployee = await employeeService.postEmployee({username: "user1", password: "pass1"});
        expect(newEmployee).toBeNull();
        expect(employeeDAO.postEmployee).toHaveBeenCalled();
    })

    test("post a valid employee should get correct username and password", async () => {
        employeeDAO.postEmployee.mockReturnValue({
            employee_id: "3d3d3",
            username: "user1",
            password: "pass1",
            role: "employee"
        });
        const newEmployee = await employeeService.postEmployee({username: "user1", password: "pass1"});

        expect(newEmployee.username).toBe("user1");
        expect(employeeDAO.postEmployee).toHaveBeenCalled();
    })

    test("Should return an employee", async () => {
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

    test("Should take an ID and return an employee", async () => {
        employeeDAO.getEmployeebyUsername.mockReturnValue({
            password: '$2b$10$hqjZALTTjPO.URvvkItB5eUP4iuleqjF5bm2GWELbNreo8pD/p2E.',
            username: 'user2',
            role: 'employee',
            employee_id: 'aa75718c-b875-4587-9f05-4e10bd91caf5'
        })
        const returnedEmployee = await employeeService.getEmployeebyId("aa75718c-b875-4587-9f05-4e10bd91caf5");
        if (returnedEmployee) {
            //console.log(returnedEmployee);
            expect(employeeDAO.getEmployeebyUsername).toHaveBeenCalled();
            expect(returnedEmployee.employee_id).toBe("aa75718c-b875-4587-9f05-4e10bd91caf5");
        }
    })

})