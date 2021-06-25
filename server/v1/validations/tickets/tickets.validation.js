const {reservation,payment} = require("./tickets.schema")

module.exports = {
    addReservationValidation: async (req,res,next) =>{
        const value = await reservation.validate(req.body);
        if(value.error){
            res.json({
                success:false,
                message: value.error.details[0].message
            })
        }
        else{
            next()
        }
    },
    addPaymentValidation: async (req,res,next) =>{
        const value = await payment.validate(req.body);
        if(value.error){
            res.json({
                success:false,
                message: value.error.details[0].message
            })
        }
        else{
            next()
        }
    },
}