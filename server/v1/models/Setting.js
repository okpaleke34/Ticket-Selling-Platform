module.exports = (con,Sequelize) =>{
    const {STRING,INTEGER} = Sequelize
    const Setting = con.define("setting",{
        name:{
            type:STRING(65),
            allowNull:false
        },
        value:{
            type:STRING(65),
            allowNull:false
        }
    })
    return Setting
}