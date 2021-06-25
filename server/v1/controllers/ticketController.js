const nodemailer = require("nodemailer")
const moment = require("moment")
const { v4 }  = require('uuid')
require('dotenv').config()
const { Setting,Reservation,Payment } = require("../models")
const PaymentGateway = require("../adapters/payment.adapter")

const uuidv4 = v4

const sendMail = ({subject,html,to,callback}) => {
    const {COMPANY_NAME,SMTP_PASSWORD,SMTP_HOST,SMTP_PORT,SMTP_EMAIL} = process.env
    const from = `${COMPANY_NAME} <${SMTP_EMAIL}>`
    const smtp = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: true, // use TLS
        auth: {
            user: SMTP_EMAIL,
            pass: SMTP_PASSWORD
        }
    })        
    const mailOptions = {
        from,
        to,
        subject,
        html
    }
    smtp.sendMail(mailOptions, callback)
}

exports.settings = async (req,res) =>{    
    res.status(200).json({success:true,data:res.locals.settings})
}

exports.makePayment = async (req,res) =>{           
    const {amount,reserve_id,mode}= req.body
    const reservation = await Reservation.findByPk(reserve_id)
    if(reservation){
        const {status,no_of_tickets,first_name,last_name,email,token} = reservation.dataValues
        if(status === 1){
            const {cost_per_ticket} = res.locals.settings
            if(Number(amount) === Number(cost_per_ticket * no_of_tickets)){
                try{ 
                    const paymentGateway = new PaymentGateway()
                    // let data = await paymentGateway.charge(amount, "card_error")
                    const data = await paymentGateway.charge(amount, "done")
                    Payment.create({...data,reserve_id,mode,status:1})
                    .then(async () =>{
                        await Reservation.update({status:2},{where:{id:reserve_id}})
                        const html = `<div>Dear ${first_name},<br/>
                        <p>
                        Your payment for the reservation ID: ${token} has been made successfully the details for the transation is below:<br/>
                        </p>
                        <table>
                            <tbody>
                                <tr>
                                    <th>Fullname</th>
                                    <td>${first_name} ${last_name}</td>
                                </tr>
                                <tr>
                                    <th>Transaction ID</th>
                                    <td>${data.transact_id}</td>
                                </tr>
                                <tr>
                                    <th>Amount Paid</th>
                                    <td>${amount} EUR</td>
                                </tr>
                                <tr>
                                    <th>Total Ticket</th>
                                    <td>${no_of_tickets}</td>
                                </tr>
                                <tr>
                                    <th>Mode of Payment</th>
                                    <td>${mode}</td>
                                </tr>
                            </tbody>
                        </table>

                        <p>
                        Thanks for using our services, best regards...
                        </p>
                        </div>`
                        const to = email
                        sendMail({subject:`You made a reservation!!`,html,to,callback: async (error) => {
                            if (error) {
                                console.log("There is an error in sending email: ",error)
                            }
                            res.status(200).json({success:true,message:`Payment has been made successfully, your transaction id is ${data.transact_id}`})
                        }}) 
                        
                    })    
                    .catch(e =>{
                        res.status(500).json({success:false,message:`Failed to make reservation: ${e.toString()}`})
                        console.log(e)
                    })                             
                }
                catch(e){
                    res.status(500).json({success:false,messsage:`Failed to make reservation: ${e.toString()}`})
                    console.log(e)
                }
            }
            else{
                res.status(500).json({success:false,message:"Amount paid is not equal to the cost of booked ticket"})
            }
        }
        else{
            res.status(500).json({success:false,message:"Reservation has expired, make a new reservation and pay within 15 minutes of making the reservation"})
        }
        // console.log(reservation.dataValues)
    }
}

/**
 * This function make a reservation and deducts the number of ticket from the settings table.
 * It sends an email to the submitted email address 
 */
exports.makeReservation = async (req,res) =>{
    let {total_tickets} = res.locals.settings
    let {no_of_tickets} = req.body
    const token = uuidv4()
    total_tickets = Number(total_tickets)
    no_of_tickets = Number(no_of_tickets)    
    const remainingTickets = total_tickets - no_of_tickets  
    try{
        if(no_of_tickets > total_tickets){
            throw new Error(`There are only ${total_tickets} tickets available`)
        }
        else if(no_of_tickets % 2 !== 0 && total_tickets !== no_of_tickets){
            // the number of ticket must be even unless the [number of reservation] = [number of total tickets]
            throw new Error(`The number of ticket must be even`)
        }
        else if(remainingTickets === 1){
            throw new Error(`You cannot leave only one ticket avaialble, please buy a total of ${total_tickets} tickets`)
        }
        else{
            // persist data to the database
            Reservation.create({...req.body,token,status:1})
            .then(async (data) =>{
                // remove the number of booked ticket from avaialable ticket
                const update = await Setting.update({value:remainingTickets},{where:{name:"total_tickets"}})
                if(update === 0){
                    console.log("An error occurred while trying to update total_tickets")
                }
                const {email,first_name} = req.body
                const fiftenMins = 1000 * 60 * 15
                // the timezone is set to Africa/Lagos so that it will be at the same time zone as the database, sequelize does not accept string timezone which helps to catch the daylight savings
                const timeStamp = moment().tz("Africa/Lagos").unix() * 1000
                const next15Mins = moment(timeStamp+fiftenMins).tz("Africa/Lagos").format("LLLL")

                const html = `<p>Dear ${first_name},<br/>
                Thanks for making this ticket reservation, this mail is to inform you about your successful reservation made on our platform. We want to inform you that this reservation will expire in 15 minutes time at ${next15Mins} GMT +1 if you did not make the payment for this reservation.<br/>
                Follow this <a href='#'>link</a> to make the payment<br/>
                Your reservation ID: ${token}<br/>
                Thanks and best regards</p>`
                const to = email
                sendMail({subject:`You made a reservation!!`,html,to,callback: async (error) => {
                    if (error) {
                        console.log("There is an error in sending email: ",error)
                    }
                    res.status(200).json({success:true,data})
                }})      
                
            })    
            .catch(e =>{
                res.status(500).json({success:false,message:`Failed to make reservation: ${e.toString()}`})
                console.log(e)
            })
        }
    }
    catch(e){
        res.status(500).json({success:false,message:`Failed to make reservation: ${e.toString()}`})
    }
}

exports.getReservationByToken = async (req,res) =>{
    const {token} = req.params
    const reservation = await Reservation.findOne({where:{token}})
    if(reservation){
        res.status(200).json({success:true,data:reservation})
    }
    else{
        res.status(404).json({success:false,message:"Reservation does not exist"})
    }
}