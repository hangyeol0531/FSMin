const models = require('../models/index.js');
const Sequelize = require('sequelize');

exports.sub_data_check = () =>{
    models.sub_td1.findAndCountAll({
    }).then(result1 =>{
        console.log(`result1 : ${result1.count}`)
        models.sub_count.update({
            num : result1.count
        },{
            where : {td_idx : 1}
        })
        models.sub_td2.findAndCountAll({
        }).then(result2 =>{
            console.log(`result2 : ${result2.count}`)
            models.sub_count.update({
                num : result2.count
            },{
                where : {td_idx : 2}
            })
            models.sub_td3.findAndCountAll({
            }).then(result3 =>{
                console.log(`result3 : ${result3.count}`)
                models.sub_count.update({
                    num : result3.count
                },{
                    where : {td_idx : 3}
                })
            })
        })
    })
}