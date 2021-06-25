module.exports = (con,Sequelize) =>{
    const {STRING,INTEGER,FLOAT} = Sequelize
    const Payment = con.define("payment",{
        reserve_id:{
            type:INTEGER(11),
            allowNull:false
        },
        amount:{
            type:FLOAT(11),
            allowNull:false
        },
        currency:{
            type:STRING(10),
            allowNull:false
        },
        mode:{
            type:STRING(65),
            allowNull:false,
            comment:"Mode of payment: cash, bank transfer, payu,paypal"
        },
        transact_id:{
            type:STRING(128),
            comment:"Transaction ID from the payment gateway or bank transfer"
        },
        status:{
            type: INTEGER(1),
            allowNull:false,
            comment:"0:failed; 1:success;"
        }
    },
    {
      engine: 'MYISAM',    // default: 'InnoDB'
    })
    return Payment
}