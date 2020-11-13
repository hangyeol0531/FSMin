const express = require('express');
const multer = require('multer')
const router = express.Router();
const models = require('../models/index.js');
const fs = require('fs')
const img_file_path = './public/userimage/'
const bodyParser = require('body-parser');
const { callbackify } = require('util');
const func = require('./func')

models.sequelize.sync().then(() => {
  console.log(" DB 연결 성공");
}).catch(err => {
  console.log("연결 실패");
  console.log(err);
});

/* GET home page. */
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, img_file_path);
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf()+file.originalname);
      let sub_route_value = []
      let sub_route_min = []
      models.sub_count.findAll({
      }).then(result =>{
        result.forEach(i => {
          sub_route_value.push(i.dataValues.num)
        });
        let high = sub_route_value.findIndex((e)=> e === Math.max.apply(null, sub_route_value))
        if(high == 0){
          sub_route_min = [1, 2]
        }else if(high == 1){
          sub_route_min = [0, 2]
        }else{
          sub_route_min = [0, 1]
        }
        console.log(sub_route_min)
        models.Main_td.bulkCreate([
        {'tb_num' : `${sub_route_min[0] + 1}`,'src' : new Date().valueOf()+file.originalname},
        {'tb_num' : `${sub_route_min[1] + 1}`,'src' : new Date().valueOf()+file.originalname},
        ]).then(result =>{
          // console.log(file)
          if(sub_route_min[0] + sub_route_min[1] == 1){
            models.sub_td1.create({
              'src' : new Date().valueOf()+file.originalname
             }).then(result =>{
              models.sub_td2.create({
                'src' : new Date().valueOf()+file.originalname
               }).then(() =>{
                func.sub_data_check()
             })
             })
          }else if(sub_route_min[0] + sub_route_min[1] == 2){
            models.sub_td1.create({
              'src' : new Date().valueOf()+file.originalname
             }).then(result =>{
              models.sub_td3.create({
                'src' : new Date().valueOf()+file.originalname
               }).then(() =>{
                  func.sub_data_check()
               })
             })
          }else if(sub_route_min[0] + sub_route_min[1] == 3){
            models.sub_td2.create({
              'src' : new Date().valueOf()+file.originalname
             }).then(result =>{
              models.sub_td3.create({
                'src' : new Date().valueOf()+file.originalname
               }).then(() =>{
                func.sub_data_check()
             })
             })
          }
        })
      })
    }
  }),
});

router.get('/', function(req, res, next) {
  console.log('/ 접속')
  fs.readdir(img_file_path, (err ,file_list)=>{
    res.render('index', { title: 'FSM in',
      file_num : file_list.length,
      file_arr : file_list
    });
  })
});

router.post('/delete', (req, res) =>{
  let path = `${img_file_path}/${req.body.img_name}`
  console.log(path)
  fs.unlink(path, (err) =>{
    if(err) throw err
    res.status(200).send("<script>alert('파일이 정상적으로 삭제되었습니다.'); window.location = '/' </script>")
  })
})

router.post('/save_Image', upload.single('userfile'), (req,res)=>{
  console.log('파일 전송 완료')
  // let sub_route_value = []
  // let sub_route_min = []
  // models.sub_count.findAll({
  // }).then(result =>{
  //   result.forEach(i => {
  //     sub_route_value.push(i.dataValues.num)
  //   });
  //   let high = sub_route_value.findIndex((e)=> e === Math.max.apply(null, sub_route_value))
  //   if(high == 0){
  //     sub_route_min = [1, 2]
  //   }else if(high == 1){
  //     sub_route_min = [0, 2]
  //   }else{
  //     sub_route_min = [0, 1]
  //   }
  //   console.log(sub_route_min)
  //   models.Main_td.bulkCreate([
  //   {'td_idx' : sub_route_min[0],'src' : td1_count},
  //   {'td_idx' : sub_route_min[1],'src' : td2_count},
  //   ])
  // })
  res.status(200).send("<script>alert('파일이 정상적으로 전송되었습니다.'); window.location = '/' </script>")
})

router.get('/download', (req, res) =>{
  const path = `${img_file_path}${req.query.img_name}`
  console.log(path)
  res.status(200).download(path);
})

module.exports = router;
