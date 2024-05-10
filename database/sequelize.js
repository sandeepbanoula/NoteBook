const { Sequelize } = require("sequelize");

const sequelize = new Sequelize({
    dialect: "mysql",
    host: process.env.DB_HOST,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_DATABASE,
    port: process.env.DB_PORT,
    define: {
        underscored: true
    },
    pool: {
        max: 10,
        min: 0,
        idle: 10000
    },
});

module.exports = sequelize;