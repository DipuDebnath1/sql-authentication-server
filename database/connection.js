// import { Sequelize } from "sequelize";
const { Sequelize } = require('sequelize')

const sequelize = new Sequelize({
    dialect: "mysql",
    host: "localhost",
    username: "root",
    database: "signup",
    password: ""
})

sequelize.authenticate()
    .then(() => {
        console.log("database connected");
    })
    .catch(error => console.log("connection failed:", error.messsage))

sequelize.sync({ force: false })
module.exports = sequelize


