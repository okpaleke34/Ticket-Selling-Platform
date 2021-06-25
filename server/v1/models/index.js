const Sequelize = require("sequelize")
const dbConfig = require("../config/db.config")

const con = new Sequelize(dbConfig.DB,dbConfig.USER, dbConfig.PASSWORD,{
    host: dbConfig.HOST,
    dialect: dbConfig.dialect,
    operatorAliases:false,
    pool:{
        max:dbConfig.pool.max,
        min:dbConfig.pool.min,
        acquire:dbConfig.pool.acquire,
        idle:dbConfig.pool.idle
    },
    logging:false,
    timezone: '+01:00' 
})

const db = {}

db.Sequelize = Sequelize
db.con = con

db.Reservation = require("./Reservation")(con,Sequelize)
db.Payment = require("./Payment")(con,Sequelize)
db.Setting = require("./Setting")(con,Sequelize)


db.Payment.belongsTo(db.Reservation,{foreignKey:'reserve_id'}) //   targetKey:'id'

module.exports = db