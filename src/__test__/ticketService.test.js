jest.mock('../repository/ticketDAO');
jest.mock('../service/employeeService');
const ticketDAO = require("../repository/ticketDAO");
const employeeService = require("../service/employeeService");
const ticketService = require('../service/ticketService');

describe("Ticket Posting testing Suite", () => {
    beforeEach(() => {
        ticketDAO.postTicket.mockReturnValue(null);
    })

    test("Creating a ticket should get the correct description and amount", async () => {
        ticketDAO.postTicket.mockReturnValue({
            ticket_id: "22f24f13-f885-456e-894c-3745364c3645",
            amount: 153.45,
            description: "This is the description of my ticket",
            employee_id: "aa75718c-b875-4587-9f05-4e10bd91caf5",
            reviewed: false,
            status: "pending",
            username: "user1"
        });

        const dummyTicket = {
            amount: 153.45,
            description: "This is the description of my ticket"
        };
        const dummyEmployeeId = "aa75718c-b875-4587-9f05-4e10bd91caf5";
        const dummyUsername = "user1";

        const postedTicket = await ticketService.postTicket(dummyTicket, dummyEmployeeId, dummyUsername);

        expect(postedTicket.username).toBe(dummyUsername);
        expect(ticketDAO.postTicket).toHaveBeenCalled();

        // should test the validation methods
        // positive, negative testing
        // how does it handle receiving errors
        // null checks
    });

    test("Creating an invalid ticket should return null (validateTicket)", async () => {
        const dummyTicket = {
            amount: 0,
            description: "This is the description of my ticket"
        };
        const dummyEmployeeId = "aa75718c-b875-4587-9f05-4e10bd91caf5";
        const dummyUsername = "user1";

        const postedTicket = await ticketService.postTicket(dummyTicket, dummyEmployeeId, dummyUsername);

        expect(postedTicket).toBeNull();
    })
    
    test("Posting a ticket with an invalid ID or username should return null (validateEmployeeID)", async () => {
        
        const dummyTicket = {
            amount: 153.45,
            description: "This is the description of my ticket"
        };

        const dummyEmployeeId = null;
        const dummyUsername = "user1";

        const postedTicket = await ticketService.postTicket(dummyTicket, dummyEmployeeId, dummyUsername);

        expect(postedTicket).toBeNull();
    })

    test("handling null input", async () => {
        const postedTicket = await ticketService.postTicket(null, null, null);

        expect(postedTicket).toBeNull();
    })

    test("Handling failed database posting", async () => {
        ticketDAO.postTicket.mockReturnValue(null);

        const dummyTicket = {
            amount: 153.45,
            description: "This is the description of my ticket"
        };
        const dummyEmployeeId = "aa75718c-b875-4587-9f05-4e10bd91caf5";
        const dummyUsername = "user1";

        const postedTicket = await ticketService.postTicket(dummyTicket, dummyEmployeeId, dummyUsername);

        expect(postedTicket).toBeNull();
        expect(ticketDAO.postTicket).toHaveBeenCalled();
    })
})

describe("Ticket retrieval by employee ID tests", () => {
   test("Passing in an employeeID should return all tickets associated", async () => {
        employeeService.getEmployeebyId.mockReturnValue({
            password: '$2b$10$hqjZALTTjPO.URvvkItB5eUP4iuleqjF5bm2GWELbNreo8pD/p2E.',
            username: 'user2',
            role: 'employee',
            employee_id: 'aa75718c-b875-4587-9f05-4e10bd91caf5'
        });
        ticketDAO.getTicketsByEmployeeId.mockReturnValue([{
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
        }]);

        const dummyEmployeeId = "aa75718c-b875-4587-9f05-4e10bd91caf5";

        const returnedTickets = await ticketService.getTicketsByEmployeeId(dummyEmployeeId);

        expect(ticketDAO.getTicketsByEmployeeId).toHaveBeenCalled();
        expect(employeeService.getEmployeebyId).toHaveBeenCalled();
        expect(returnedTickets.length).toBe(2);
        expect(returnedTickets[0].ticket_id).toBe("22f24f13-f885-456e-894c-3745364c3645");
    })

    test("Passing in a null employee ID", async () => {
        const returnedTicket = await ticketService.getTicketsByEmployeeId(null);

        expect(returnedTicket).toBeNull();
    })


    test("Passing in an invalid employee ID should return null", async () => {
        employeeService.getEmployeebyId.mockReturnValue(null);

        const dummyInvalidEmployeeId = "aa75718c-b875-4587-9f05-4e10bd91caf5";

        const returnedTickets = await ticketService.getTicketsByEmployeeId(dummyInvalidEmployeeId);

        expect(employeeService.getEmployeebyId).toHaveBeenCalled();
        expect(returnedTickets).toBeNull();
        
    }) 
    
    test("Handling failed database retrieval on valid employee ID", async () => {
        employeeService.getEmployeebyId.mockReturnValue({
            password: '$2b$10$hqjZALTTjPO.URvvkItB5eUP4iuleqjF5bm2GWELbNreo8pD/p2E.',
            username: 'user2',
            role: 'employee',
            employee_id: 'aa75718c-b875-4587-9f05-4e10bd91caf5'
        });
        
        ticketDAO.getTicketsByEmployeeId.mockReturnValue(null);

        const dummyEmployeeId = "aa75718c-b875-4587-9f05-4e10bd91caf5";

        const returnedTickets = await ticketService.getTicketsByEmployeeId(dummyEmployeeId);

        expect(employeeService.getEmployeebyId).toHaveBeenCalled();
        expect(ticketDAO.getTicketsByEmployeeId).toHaveBeenCalled();
        expect(returnedTickets).toBeNull();
        
    }) 
});


describe("Ticket retrieval by ticket ID tests", () => {
    test("You should be able to pull a ticket by its ID", async () => {
        ticketDAO.getTicketById.mockReturnValue({
            ticket_id: "22f24f13-f885-456e-894c-3745364c3645",
            amount: 153.45,
            description: "This is the description of my ticket",
            employee_id: "aa75718c-b875-4587-9f05-4e10bd91caf5",
            reviewed: false,
            status: "pending",
            username: "user1"
        })

        const dummyTicketId = "22f24f13-f885-456e-894c-3745364c3645";

        const returnedTicket = await ticketService.getTicketById(dummyTicketId);
        expect(ticketDAO.getTicketById).toHaveBeenCalled();
        expect(returnedTicket.ticket_id).toBe(dummyTicketId);
    })

    test('Passing in a null ticket ID should return null', async () => {
        const dummyTicketId = null;

        const returnedTicket = await ticketService.getTicketById(dummyTicketId);

        expect(returnedTicket).toBeNull();
    })

    test('Passing in an invalid ticket should return null', async () => {
        ticketDAO.getTicketById.mockReturnValue(null)

        const dummyInvalidTicketId = "22f24f13-f885456e-894c-3745364c3645";

        const returnedTicket = await ticketService.getTicketById(dummyInvalidTicketId);
        expect(ticketDAO.getTicketById).toHaveBeenCalled();
        expect(returnedTicket).toBeNull();
    })
});




