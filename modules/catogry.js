sequelize = require('../database/sequelize')
const Sequelize = require('sequelize')
module.exports = sequelize.define('catogry', {
catogryId:{
    field:'catogryId',
    type: Sequelize.INTEGER,
    autoIncrement:true,
    primaryKey:true

},
name:{
    field:'name',
    type:Sequelize.STRING,
    defaultValue:""
},
sample:{
    field:'sample',
    type:Sequelize.STRING
},
desc:{
    type:Sequelize.STRING
},

image:{
    type:Sequelize.STRING
},


createdAt:{
    field:'createdAt',
    type:Sequelize.DATE
},
updatedAt:{
    field:'updatedAt',
    type:Sequelize.DATE
}

   

},{ freezeTableName:true})