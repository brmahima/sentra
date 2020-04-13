sequelize = require('../database/sequelize')
const Sequelize = require('sequelize')

module.exports = sequelize.define('payment', {
    userId: {
        field:"userId",
        type: Sequelize.INTEGER,
        foreignKey: true,
        primaryKey: true
      },
      resultId: {
        field:'resultId',
        type: Sequelize.INTEGER,
        foreignKey: true,
        primaryKey: true
      },
      isPaid:{
        field:'isPaid',
        type:Sequelize.BOOLEAN
      },

      createdAt:{
          field:'createdAt',
          type:Sequelize.DATE
      },
      updatedAt:{
          field:'updatedAt',
          type:Sequelize.DATE
      }
},{ freezeTableName:true,timestamps:true})