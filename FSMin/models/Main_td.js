const Sequelize = require('sequelize');

module.exports = ((sequelize,DataTypes)=>{
    return sequelize.define('Main_td',{
        idx:{
            type: Sequelize.INTEGER,
            primaryKey : true,
            allowNull: true,
            autoIncrement : true
        },
        tb_num1:{
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        tb_num2:{
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        src:{
            type: Sequelize.STRING(100),
            allowNull: true,
        },
        byte:{
            type: Sequelize.INTEGER,
            allowNull: true,
        }
    },{
        timestamps:true,
        paranoid : false, // 삭제일 (복구용)
    })
})