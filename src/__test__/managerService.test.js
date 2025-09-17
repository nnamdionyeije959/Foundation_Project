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

describe("Getting All Tickets Suite", () => {
    beforeEach(() => {
        ticketDAO.updateTicketStatus.mockReturnValue(null);
        ticketDAO.updateTicketStatus.mockReturnValue(null);

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

    test("handle empty repository", async () => {
        ticketDAO.getAllTickets.mockReturnValue([]);

        const allRequests = await managerService.getAllTickets();

        expect(ticketDAO.getAllTickets).toHaveBeenCalled();
        expect(allRequests.length).toBe(0);
    })

    test("Handle Failed Ticket Retrieval", async () => {
        ticketDAO.getAllTickets.mockReturnValue(null);

        const allRequests = await managerService.getAllTickets();

        expect(ticketDAO.getAllTickets).toHaveBeenCalled();
        expect(allRequests).toBeNull();
    })
})

describe("Get Pending Requests Suite", () => {
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

    test("handle case where there are no pending requests", async () => {
        ticketDAO.getAllPendingTickets.mockReturnValue([]);

        const allRequests = await managerService.getAllPendingRequests();

        expect(ticketDAO.getAllPendingTickets).toHaveBeenCalled();
        expect(allRequests.length).toBe(0);
    })

    test("Handle Failed Ticket Retrieval", async () => {
        ticketDAO.getAllPendingTickets.mockReturnValue(null);

        const allRequests = await managerService.getAllPendingRequests();

        expect(ticketDAO.getAllPendingTickets).toHaveBeenCalled();
        expect(allRequests).toBeNull();
    })
})

describe("Ticket Status Updating Suite", () => {
    beforeEach(() => {
        ticketDAO.updateTicketStatus.mockReturnValue(null);
        ticketDAO.updateTicketStatus.mockReturnValue(null);

    })

    test("Positive Updating ticket status test", async () => {
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

    test("Posting a ticket update with an invalid ticket ID should return null", async () => {
        const dummyInvalidTicketId = "22f885-456e-894c-3745364c3645";
        const dummyStatus = "approved";

        const updatedTicket = await managerService.updateTicketStatus(dummyInvalidTicketId, dummyStatus);
        expect(updatedTicket).toBeNull();
    })

    test("Posting a ticket update with an invalid status should return null", async () => {
        const dummyTicketId = "22f24f13-f885-456e-894c-3745364c3645";
        const dummyInvalidStatus = "okay";

        const updatedTicket = await managerService.updateTicketStatus(dummyTicketId, dummyInvalidStatus);
        expect(updatedTicket).toBeNull();
    })

    test("Posting a ticket update with null parameters", async () => {
        const updatedTicket = await managerService.updateTicketStatus(null, null);
        expect(updatedTicket).toBeNull();
    })

    test("Handling of failed ticket update with valid update", async () => {
        ticketService.getTicketById.mockReturnValue({
            ticket_id: "22f24f13-f885-456e-894c-3745364c3645",
            amount: 153.45,
            description: "This is the description of my ticket",
            employee_id: "aa75718c-b875-4587-9f05-4e10bd91caf5",
            reviewed: false,
            status: "pending",
            username: "user1"
        });

        ticketDAO.updateTicketStatus.mockReturnValue(null);

        const dummyTicketId = "22f24f13-f885-456e-894c-3745364c3645";
        const dummyStatus = "approved";

        const updatedTicket = await managerService.updateTicketStatus(dummyTicketId, dummyStatus);
        expect(updatedTicket).toBe(null);
    })
})

describe("Manager Login Validation Suite", () => {
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
        expect(employeeService.getEmployeebyUsername).toHaveBeenCalled();
        expect(validatedManagersLogin.role).toBe("manager");
    })

    test("Invalid Manager Login Credentials", async () => {
        employeeService.getEmployeebyUsername.mockReturnValue(null);
        const dummyInvalidUsername = "managerr1";
        const dummyInvalidPassword = "passs4";

        const validatedManagersLogin = await managerService.validateManagerLogin(dummyInvalidUsername, dummyInvalidPassword);
        expect(employeeService.getEmployeebyUsername).toHaveBeenCalled();
        expect(validatedManagersLogin).toBe(null);
    })

    test("Invalid Manager Password", async () => {
        employeeService.getEmployeebyUsername.mockReturnValue({
            password: '$2b$10$YOXv0lMFu5ZT023SAzUdkemslxooXBL9bdl.CyjGBNjOwEdnwiy5e',
            username: 'manager1',
            role: 'manager',
            employee_id: '50e02545-2849-4260-bc11-86e73a070e9f'
        });

        bcrypt.compare.mockResolvedValue(false);

        const dummyUsername = "manager1";
        const dummyInvalidPassword = "pass8";

        const validatedManagersLogin = await managerService.validateManagerLogin(dummyUsername, dummyInvalidPassword);
        expect(employeeService.getEmployeebyUsername).toHaveBeenCalled();
        expect(validatedManagersLogin).toBeNull();
    })

    test("Invalid Employee Role", async () => {
        employeeService.getEmployeebyUsername.mockReturnValue({
            password: '$2b$10$YOXv0lMFu5ZT023SAzUdkemslxooXBL9bdl.CyjGBNjOwEdnwiy5e',
            username: 'user1',
            role: 'employee',
            employee_id: '50e02545-2849-4260-bc11-86e73a070e9f'
        });

        bcrypt.compare.mockResolvedValue(true);

        const dummyUsername = "user1";
        const dummyPassword = "pass1";

        const validatedManagersLogin = await managerService.validateManagerLogin(dummyUsername, dummyPassword);
        expect(employeeService.getEmployeebyUsername).toHaveBeenCalled();
        expect(validatedManagersLogin).toBeNull();
    })

    test("Passing in null username or password", async () => {
        const validatedManagersLogin = await managerService.validateManagerLogin(null, null);
        expect(validatedManagersLogin).toBeNull();
    })
})

describe("Ticket Validation Suite", () => {
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
        expect(ticketService.getTicketById).toHaveBeenCalled();
        expect(validateState).toBe(true);
    })

    test("Invalid Ticket ID", async () => {
        ticketService.getTicketById.mockReturnValue(null);

        const dummyInvalidTicketId = "22f24f13-894c-3745364c3645";
        const dummyStatus = "approved";

        const validateState = await managerService.validateTicketUpdate(dummyInvalidTicketId, dummyStatus);
        expect(ticketService.getTicketById).toHaveBeenCalled();
        expect(validateState).toBeNull();
    })

    test("Invalid Updated Ticket Status", async () => {
        ticketService.getTicketById.mockReturnValue(null);

        const dummyTicketId = "22f24f13-f885-456e-894c-3745364c3645";
        const dummyInvalidStatus = "not approved";

        const validateState = await managerService.validateTicketUpdate(dummyTicketId, dummyInvalidStatus);
        expect(ticketService.getTicketById).toHaveBeenCalled();
        expect(validateState).toBeNull();
    })

    test("Passing in null ticket_id or status", async () => {
        const validateState = await managerService.validateTicketUpdate(null, null);
        expect(validateState).toBeNull();
    })
})