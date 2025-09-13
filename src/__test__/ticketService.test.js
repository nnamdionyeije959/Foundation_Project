jest.mock('../repository/ticketDAO');
jest.mock('../service/employeeService');
const ticketDAO = require("../repository/ticketDAO");
const employeeService = require("../service/employeeService");
const ticketService = require('../service/ticketService');

describe("Ticket Service Suite", () => {
    beforeEach(() => {
        //ticketDAO.postTicket.mockReturnValue([]);
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
        expect(postedTicket.username).toBe("user1");
        expect(ticketDAO.postTicket).toHaveBeenCalled();
    });

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
})