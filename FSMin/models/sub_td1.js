const Sequelize = require('sequelize');

module.exports = ((sequelize,DataTypes)=>{
    return sequelize.define('sub_td1',{
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
        cap:{
            type: Sequelize.INTEGER,
            allowNull: true,
        }
    },{
        timestamps:true,
        paranoid : false, // 삭제일 (복구용)
    })
})