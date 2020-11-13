const Sequelize = require('sequelize');

module.exports = ((sequelize,DataTypes)=>{
    return sequelize.define('Main_td',{
        idx:{
            type: Sequelize.INTEGER,
            primaryKey : true,
            allowNull: true,
            autoIncrement : true
        },
        tb_num:{
            type: Sequelize.INTEGER,
            allowNull: true,
        },
        src:{
            type: Sequelize.STRING(100),
            allowNull: true,
        },
        cap:{
            type: Sequelize.INTEGER,
            allowNull: true,
        }
    },{
        timestamps:true,
        paranoid : true, // 삭제일 (복구용)
    })
})