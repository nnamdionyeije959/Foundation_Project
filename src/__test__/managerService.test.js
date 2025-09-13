// mock the ticket repository
jest.mock('../repository/ticketDAO');
const ticketDAO = require("../repository/ticketDAO");

// mock the employeeService
jest.mock('../service/employeeService');
const employeeService = require("../service/employeeService");

// mock the ticketService
jest.mock('../service/ticketService');
const ticketService = require('../service/ticketService');

// import bcrypt and then set up a Jest mock for its dependency
const bcrypt = require('bcrypt');
jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

const managerService = require('../service/managerService');

describe("Manager Service Suite", () => {
    beforeEach(() => {

    })

    test("Sending a get request should get All Tickets", async () => {
        ticketDAO.getAllTickets.mockReturnValue([{
            ticket_id: "22f24f13-f885-456e-894c-3745364c3645",
            amount: 153.45,
            description: "This is the description of my ticket",
            employee_id: "aa75718c-b875-4587-9f05-4e10bd91caf5",
            reviewed: true,
            status: "approved",
            username: "user1"
        },
        {
            ticket_id: "22f24f13-f885-454e-894c-3745364c3645",
            amount: 250.45,
            description: "This is the description of my other ticket",
            employee_id: "aa75718c-b875-4587-9f05-4e10bd91caf5",
            reviewed: false,
            status: "pending",
            username: "user1"
        }])

        const allRequests = await managerService.getAllTickets();
        expect(allRequests[0].username).toBe("user1");
        expect(allRequests.length).toBe(2);
        expect(ticketDAO.getAllTickets).toHaveBeenCalled();

    })

    test("Requesting the pending tickets should get all pending tickets", async () => {
        ticketDAO.getAllPendingTickets.mockReturnValue([{
            ticket_id: "22f24f13-f885-456e-894c-3745364c3645",
            amount: 153.45,
            description: "This is the description of my ticket",
            employee_id: "aa75718c-b875-4587-9f05-4e10bd91caf5",
            reviewed: false,
            status: "pending",
            username: "user1"
        },
        {
            ticket_id: "22f24f13-f885-454e-894c-3745364c3645",
            amount: 250.45,
            description: "This is the description of my other ticket",
            employee_id: "aa75718c-b875-4587-9f05-4e10bd91caf5",
            reviewed: false,
            status: "pending",
            username: "user1"
        }])

        const allPendingRequests = await managerService.getAllPendingRequests();
        expect(allPendingRequests[0].status).toBe("pending");
        expect(allPendingRequests.length).toBe(2);
        expect(ticketDAO.getAllPendingTickets).toHaveBeenCalled();
    });

    test("Updating ticket status", async () => {
        ticketService.getTicketById.mockReturnValue({
            ticket_id: "22f24f13-f885-456e-894c-3745364c3645",
            amount: 153.45,
            description: "This is the description of my ticket",
            employee_id: "aa75718c-b875-4587-9f05-4e10bd91caf5",
            reviewed: false,
            status: "pending",
            username: "user1"
        });

        ticketDAO.updateTicketStatus.mockReturnValue({
            ticket_id: "22f24f13-f885-456e-894c-3745364c3645",
            amount: 153.45,
            description: "This is the description of my ticket",
            employee_id: "aa75718c-b875-4587-9f05-4e10bd91caf5",
            reviewed: true,
            status: "approved",
            username: "user1"
        });

        const dummyTicketId = "22f24f13-f885-456e-894c-3745364c3645";
        const dummyStatus = "approved";

        const updatedTicket = await managerService.updateTicketStatus(dummyTicketId, dummyStatus);
        expect(ticketDAO.updateTicketStatus).toHaveBeenCalled();
        expect(updatedTicket.status).toBe("approved");
        expect(updatedTicket.reviewed).toBe(true);
    })

    test("Validate Ticket Update", async () => {
        ticketService.getTicketById.mockReturnValue({
            ticket_id: "22f24f13-f885-456e-894c-3745364c3645",
            amount: 153.45,
            description: "This is the description of my ticket",
            employee_id: "aa75718c-b875-4587-9f05-4e10bd91caf5",
            reviewed: false,
            status: "pending",
            username: "user1"
        });

        const dummyTicketId = "22f24f13-f885-456e-894c-3745364c3645";
        const dummyStatus = "approved";

        const validateState = await managerService.validateTicketUpdate(dummyTicketId, dummyStatus);
        //console.log(validateState);
        expect(ticketService.getTicketById).toHaveBeenCalled();
        expect(validateState).toBe(true);
    })

    test("Validate Manager Login Function Test", async () => {
        employeeService.getEmployeebyUsername.mockReturnValue({
            password: '$2b$10$YOXv0lMFu5ZT023SAzUdkemslxooXBL9bdl.CyjGBNjOwEdnwiy5e',
            username: 'manager1',
            role: 'manager',
            employee_id: '50e02545-2849-4260-bc11-86e73a070e9f'
        });

        bcrypt.compare.mockResolvedValue(true);

        const dummyUsername = "manager1";
        const dummyPassword = "pass1";

        const validatedManagersLogin = await managerService.validateManagerLogin(dummyUsername, dummyPassword);
        console.log("Validated Managers Login!");
        console.log(validatedManagersLogin);
        expect(employeeService.getEmployeebyUsername).toHaveBeenCalled();
        expect(validatedManagersLogin.role).toBe("manager");
    })


})