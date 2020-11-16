const models = require('../models/index.js');

models.sub_td1.findAndCountAll({
}).then(result =>{
    models.sub_td1.sum('byte').then(sum =>{
        models.sub_count.create({
            'td_idx' : 1,
            'num' : String(result.count),
            'byte' : sum
        })
        console.log(`sub_td1의 개수 ${result.count}`)
    })
})

models.sub_td2.findAndCountAll({
}).then(result =>{
    models.sub_td2.sum('byte').then(sum =>{
        models.sub_count.create({
            'td_idx' : 2,
            'num' : String(result.count),
            'byte' : sum
        })
        console.log(`sub_td2의 개수 ${result.count}`)
    })
})

models.sub_td3.findAndCountAll({
}).then(result =>{
    models.sub_td3.sum('byte').then(sum =>{
        models.sub_count.create({
            'td_idx' : 3,
            'num' : String(result.count),
            'byte' : sum
        })
        console.log(`sub_td3의 개수 ${result.count}`)
    })
})

// models.sub_count.bulkCreate([
//     {'td_idx' : 1,'num' : td1_count},
//     {'td_idx' : 2,'num' : td2_count},
//     {'td_idx' : 3,'num' : td3_count}
// ])

