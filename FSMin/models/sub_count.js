const Sequelize = require('sequelize');

module.exports = ((sequelize,DataTypes)=>{
    return sequelize.define('sub_count',{
        td_idx:{
            type: Sequelize.INTEGER,
            primaryKey : true,
            allowNull: true,
        },
        num:{
            type: Sequelize.INTEGER,
            allowNull: true,
        },
    },{
        timestamps: false,
        paranoid : false, // 삭제일 (복구용)
    })
})