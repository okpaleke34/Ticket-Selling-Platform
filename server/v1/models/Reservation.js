module.exports = (con,Sequelize) =>{
    const {STRING,INTEGER} = Sequelize
    const Reservation = con.define("reservation",{
        token:{
            type:STRING(65),
            allowNull:false
        },
        first_name:{
            type:STRING(65),
            allowNull:false
        },
        last_name:{
            type:STRING(65),
            allowNull:false
        },
        email:{
            type:STRING(65),
            allowNull:false
        },
        no_of_tickets:{
            type:INTEGER(11),
            allowNull:false
        },
        status:{
            type: INTEGER(1),
            allowNull:false,
            comment:"0:expired; 1:reserved; 2:paid;"
        }
    })
    return Reservation
}