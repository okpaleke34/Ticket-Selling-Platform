const router = require('express').Router()
const ticket = require('../controllers/ticketController')
const { addReservationValidation,addPaymentValidation } = require("../validations/tickets/tickets.validation")

const { settings } = require("../middlewares/appMiddleware")

router.use(settings)



/**
 * @swagger
 * components:
 *  schemas:
 *      Reservation:
 *       type: object
 *       required:
 *          - first_name
 *          - last_name
 *          - email
 *          - no_of_tickets
 *       properties:
 *          first_name:
 *              type: string
 *              description: User first name
 *          last_name:
 *              type: string
 *              description: User last name
 *          email:
 *              type: string
 *              description: User email address
 *          no_of_tickets:
 *              type: integer
 *              description: The number of tickets the user want to book
 *       example:
 *          first_name: John
 *          last_name: Doe
 *          email: john@doe.com
 *          no_of_tickets: 10
 *   
 *      Payment:
 *       type: object
 *       required:
 *          - amount
 *          - currency
 *          - mode
 *          - reserve_id
 *       properties:
 *          amount:
 *              type: integer
 *              description: Amount to be paid for the ticket
 *          currency:
 *              type: string
 *              description: Currency of the anount
 *          mode:
 *              type: string
 *              description: Mode of the payment
 *          reserve_id:
 *              type: integer
 *              description: The id of the reservation
 *      example:
 *          amount: 40
 *          currency: EUR
 *          reserve_id: 1
 *          mode: Bank transfer
 *   
 */

// GET ROUTES 
/**
 * @swagger
 * /api/v1/ticket/settings:
 *  get:
 *    description: Get the app settings, cost per ticket and total tickets left
 *    responses:
 *      '200':
 *          description: A successful response
 */
router.get("/settings",ticket.settings)

/**
 * @swagger
 * /api/v1/ticket/reservation/{token}:
 *  get:
 *    summary: fetch a reservation details using the token id
 *    parameters:
 *      - in: path
 *        name: token
 *        required: true
 *        schema:
 *          type: string
 *        description: The token ID of the reservation
 *    responses:
 *      '200':
 *          description: A successful response
 *      '404':
 *          description: could not found the reservation token in the database
 *      '500':
 *          description: Error occurred while fetching the reservation details
 */
router.get("/reservation/:token",ticket.getReservationByToken)

// POST ROUTES

/**
 * @swagger
 * /api/v1/ticket/make-reservation:
 *  post:
 *    summary: make reservation through a form submit
 *    requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Reservation'
 *       text/plain:
 *        schema:
 *         type: string
 *    responses:
 *      '200':
 *          description: Reservation created successfully
 *      '500':
 *          description: Error occurred while creating the reservation
 * 
 */
router.post("/reserve",addReservationValidation,ticket.makeReservation)


/**
 * @swagger
 * /api/v1/ticket/make-payment:
 *  post:
 *    summary: make payment through a form submit
 *    requestBody:
 *      required: true
 *      content:
 *       application/json:
 *        schema:
 *         $ref: '#/components/schemas/Payment'
 *       text/plain:
 *        schema:
 *         type: string
 *    responses:
 *      '200':
 *          description: Payment made successfully
 *      '500':
 *          description: Error occurred while making payment
 * 
 */
router.post("/pay",addPaymentValidation,ticket.makePayment)

module.exports = router