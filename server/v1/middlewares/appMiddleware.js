const {Setting} = require("../models/index")

module.exports.settings = async (req,res, next) =>{
    let settingsArr = await Setting.findAll({attributes:["name","value","id"]})
    if(settingsArr){
        settingsArr = settingsArr.map(setting => setting.dataValues)
        const settings = {}
        settingsArr.forEach(setting => {
            settings[setting.name] = setting.value
        })
        res.locals.settings = settings
    }
    else{
        res.locals.settings = {}
    }
    next()
}