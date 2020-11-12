const models = require('../models/index.js');
const Sequelize = require('sequelize');

exports.sub_data_check = () =>{
    models.sub_count.findAndCountAll({
    }).then(result1 =>{
        models.sub_count.findAndCountAll({
        }).then(result2 =>{
            models.sub_count.findAndCountAll({
            }).then(result3 =>{
                models.sub_count.update({
                    num : result1.count
                },{
                    where : {td_idx : 1}
                }).then(result =>{
                    models.sub_count.update({
                        num : result2.count
                    },{
                        where : {td_idx : 2}
                    }).then(result =>{
                        models.sub_count.update({
                            num : result3.count
                        },{
                            where : {td_idx : 3}
                        })
                    })
                })
            })
        })
    })
}