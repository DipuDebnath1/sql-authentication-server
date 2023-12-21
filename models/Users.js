const { DataTypes, STRING } = require("sequelize");
const sequelize = require("../database/connection");

const User = sequelize.define("user",{
    name:{
        allowNull:false,
        type:DataTypes.STRING
    },
    email:{
        allowNull:false,
        unique:true,
        type:STRING
    },
    password:{
        allowNull:false,
        type:DataTypes.STRING
    }
    
})
module.exports = User