const Sequelize = require('sequelize')

module.exports = new Sequelize('centra_groub','root','',{
    port:3306,
    host: 'localhost',
    dialect:'mysql',
    operatorsAliases: false,
  
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },

    
  
})