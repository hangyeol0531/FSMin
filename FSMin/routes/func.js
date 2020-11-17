const models = require('../models/index.js');
const Sequelize = require('sequelize');
const fs = require('fs')

exports.sub_data_check = () =>{
    // count
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
    ///byte
    models.sub_td1.sum('byte').then(sum1 =>{
        models.sub_count.update({
            byte : sum1
        },{
            where : {td_idx : 1}
        })
    })

    models.sub_td2.sum('byte').then(sum2 =>{
        models.sub_count.update({
            byte : sum2
        },{
            where : {td_idx : 2}
        })
    })

    models.sub_td3.sum('byte').then(sum3 =>{
        models.sub_count.update({
            byte : sum3
        },{
            where : {td_idx : 3}
        })
    })
}

exports.main_table_delete = (req, cb) =>{
    console.log(req.body.img_name)
    models.Main_td.destroy({
        where: {
          'src' : req.body.img_name
        }
      }).then(result => {
        this.sub_data_check();
        console.log('데이터 순차 삭제 완료')
        cb()
    })
}
