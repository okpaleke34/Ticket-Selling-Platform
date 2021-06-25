const joi = require('joi')

const  schema = {
    reservation:joi.object({
        first_name:joi.string().max(65).required(),
        last_name:joi.string().max(65).required(),
        email:joi.string().email().max(65).required(),
        no_of_tickets:joi.number().greater(1).required(),
        token:joi.string().max(65),
        status:joi.number(),
    }),

    payment:joi.object({
        reserve_id:joi.number().required(),
        amount:joi.number().required(),
        currency:joi.string().max(10).required(),
        mode:joi.string().max(65).required(),
        transact_id:joi.string().max(65),
        token:joi.string().max(65),
        status:joi.number(),
    })
}

module.exports = schema