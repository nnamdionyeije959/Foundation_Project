jest.mock('../repository/employeeDAO');
const { DescribeBackupCommand } = require("@aws-sdk/client-dynamodb");
const employeeDAO = require("../repository/employeeDAO");
const employeeService = require('../service/employeeService');

// const employeeDAO = {
//     getEmployeebyUsername: jest.fn(),
// }

// jest.mock('../repository/employeeDAO', () => employeeDAO);

describe("Employee Service", () => {
    beforeEach(() => {
        employeeDAO.postEmployee.mockReturnValue([])
    })

    test("should add a new employee", async () => {
        employeeDAO.postEmployee.mockReturnValue([{
            employee_id: "3d3d3",
            username: "user1",
            password: "pass1",
            role: "employee"
        }])
        const newEmployee = await employeeService.postEmployee({username: "user1", password: "pass1"});
        //expect(newEmployee.name).toBe("user1");
        expect(employeeDAO.postEmployee).toHaveBeenCalled();
    })
})

//const employeeService = require('../service/employeeService');

// describe('employeeService', () => {
//     beforeEach(() => {
//         // Reset mocks before each test
//         employeeDAO.getEmployeebyUsername.mockClear();
//         //UserRepository.findByEmail.mockClear();
//     });

//     if('should do stuff', async () => {
        // employeeDAO.getEmployeebyUsername.mockResolvedValue({
        //     employee_id: "3d3d3",
        //     username: "user1",
        //     password: "pass1",
        //     role: "employee"
        // })

//         const pulledEmployee = await employeeService.getEmployeebyUsername("user1");

//         expect(employeeDAO.getEmployeebyUsername).toHaveBeenCalledWith("user1");
//         expect(pulledEmployee).toEqual({
//             employee_id: "3d3d3",
//             username: "user1",
//             password: "pass1",
//             role: "employee"
//         });
//     });
// });


// mock the employeeDAO

// const dummyEmployee = {
//     "username": "user1",
//     "password": "pass1"
// };

// dummyUsername = "user1"


// test('create employeee test', () => {
    
//     const returnedData = getEmployeebyUsername(dummyUsername);

//     console.log("returnedData");
//     console.log(returnedData);

//     expect(returnedData).toBe();

// });

// implementing in the service layer