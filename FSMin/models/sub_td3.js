const Sequelize = require('sequelize');

module.exports = ((sequelize,DataTypes)=>{
    return sequelize.define('sub_td3',{
        idx:{
            type: Sequelize.INTEGER,
            primaryKey : true,
            allowNull: true,
            autoIncrement : true
        },
        src:{
            type: Sequelize.STRING(100),
            allowNull: true,
        },
    },{
        timestamps:true,
        paranoid : true, // 삭제일 (복구용)
    })
})