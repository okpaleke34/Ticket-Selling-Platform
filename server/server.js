const express = require('express')
const cors = require('cors')
const moment = require('moment')
const cron = require('node-cron')
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const { Op } = require('sequelize')

const db = require('./v1/models')
require('dotenv').config()

const { Setting, Reservation } = require('./v1/models')

const ticketsRouter = require('./v1/routes/tickets')

const app = express()
const port = process.env.PORT || 4000

app.use(cors())
app.use(express.json())

db.con.sync({
    logging:false
});

const appSettings = async () => {
    let settingsArr = await Setting.findAll({ attributes: ['name', 'value', 'id'] })
    if(settingsArr){
        settingsArr = settingsArr.map(setting => setting.dataValues)
        const settings = {}
        settingsArr.forEach(setting =>{
            settings[setting.name] = setting.value
        })      
        return settings
    }
    return false
}

cron.schedule('1 * * * * *',()=>{
    const fiftenMins = 1000 * 60 * 15
    // the timezone is set to Africa/Lagos so that it will be at the same time zone as the database, sequelize does not accept string timezone which helps to catch the daylight savings
    const timeStamp = moment().tz('Africa/Lagos').unix() * 1000
    const last15Mins = moment(timeStamp-fiftenMins).tz('Africa/Lagos').format()

    Reservation.findAll({where:{status:1,createdAt:{[Op.lte]:last15Mins} }})
    .then(async reservations =>{
        if(reservations.length){
            const settings = await appSettings()   
            let totalTickets = Number(settings.total_tickets);

            [...reservations].map(async reservation =>{
                const {id,number_booked} = reservation.dataValues
                totalTickets += number_booked
                // update reservation table and set the status to 0(expired) 
                await Reservation.update({status:0},{where:{id}})            
            })
            // update settings table with the new total tickets value
            await Setting.update({value:totalTickets},{where:{name:'total_tickets'}})
        }   
    })
    .catch(e =>{
        console.log(e)
    })
})



const swaggerOptions = {
    swaggerDefinition:{
        openapi:'3.0.0',
        info:{
            title:'Ticket Selling API',
            version:'1.0.0',
            description:'An API for ticket selling platform',
            contact:{
                name:'Okpaleke Chukwudi Prosper',
                email:'okpaleke34.pl@gmail.com'
            },
            servers:[`http:localhost:${port}`]
        }
    },
    apis: ['./v1/routes/*.js']
}

const swaggerSpecs = swaggerJSDoc(swaggerOptions)
app.use('/api-docs',swaggerUi.serve, swaggerUi.setup(swaggerSpecs))

app.use('/api/v1/ticket/', ticketsRouter)
if(!module.parent){
    app.listen(port, ()=>{
        console.log(`Server is running on port: ${port}`)
    })
}
module.exports = app
