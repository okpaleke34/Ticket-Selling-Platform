
const { v4 }  = require('uuid')

const uuidv4 = v4

// PAYMENT ADAPTER
class PaymentGateway{
    charge(amount, token, currency = 'EUR') {
        return new Promise((resolve, reject) => {
            switch (token) {
                case 'card_error':
                    return reject(new Error('Your card has been declined.'))
                case 'payment_error':
                    return reject(new Error('Something went wrong with your transaction.'))
                default:
                   return resolve({
                        amount,
                        currency,
                        transact_id:uuidv4().split("-").join("")
                    })
            }
        })
    }
}

module.exports = PaymentGateway