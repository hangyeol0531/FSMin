const express = require('express');
const multer = require('multer')
const router = express.Router();
const fs = require('fs')
const models = require('../models/index.js');
const img_file_path = '../public/userimage/'
const bodyParser = require('body-parser');
const func = require('./func');
var cors = require('cors');

// CORS 설정
router.use(cors());

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
      let file_name = new Date().valueOf()+file.originalname
      cb(null, file_name);
    }
  }),
});

router.get('/', function (req, res, next) {
  console.log('/ 접속')
  fs.readdir(img_file_path, (err, file_list) => {
    res.render('index', {
      title: 'FSM in',
      file_num: file_list.length,
      file_arr: file_list
    });
  })
});


router.post('/delete', (req, res) => {
  let path = `${img_file_path}/${req.body.img_name}`
  fs.unlink(path, function (err) {
    if (err && err.code == 'ENOENT') {
      // file doens't exist
      console.info("File doesn't exist, won't remove it.");
    } else if (err) {
      // other errors, e.g. maybe we don't have enough permission
      console.error("Error occurred while trying to remove file");
    } else {
      console.log("filename :  " + req.body.img_name)
      models.Main_td.findAll({
        where: {
          src : req.body.img_name
        }
      }).then(result =>{
        let tb1 = Number(result[0].dataValues.tb_num1)
        let tb2 = Number(result[0].dataValues.tb_num2)
        console.log(`tb1 : ${tb1} tb2 : ${tb2}`)
        if(tb1 + tb2 == 3){
          console.log('1접속')
          models.sub_td1.destroy({
            where: {
              src : req.body.img_name
            }
          }).then(result => {
            models.sub_td2.destroy({
              where: {
                src : req.body.img_name
              }
            }).then(result => {
              func.main_table_delete(req)
            })
          })
        }else if(tb1+tb2 == 4){
          console.log('3접속')
          models.sub_td1.destroy({
            where: {
              src : req.body.img_name
            }
          }).then(result => {
            models.sub_td3.destroy({
              where: {
                src : req.body.img_name
              }
            }).then(result => {
              func.main_table_delete(req)
            })
          })
        }else if(tb1 + tb2 == 5){
          console.log('5접속')
          console.log(req.body.img_name)
          models.sub_td2.destroy({
            where: {
              src : req.body.img_name
            }
          }).then(result => {
            console.log('---------------')
            models.sub_td3.destroy({
              where: {
                src : req.body.img_name
              }
            }).then(result => {
              func.main_table_delete(req)
            })
          })
        }
      })
      res.status(200).send("<script>alert('파일이 정상적으로 삭제되었습니다.'); window.location = '/' </script>")
    }
  });
})

router.get('/download', (req, res) =>{
  const path = `${img_file_path}${req.query.img_name}`
  console.log(path)
  res.status(200).download(path);
})

router.post('/save_Image', upload.single('userfile'), (req, res) => {
  console.log('save Image 접속')
  console.log('파일 전송 완료')
  let file_name = req.file.filename
  console.log(file_name)
  let sub_route_value = []
  let sub_route_min = []
  models.sub_count.findAll({
  }).then(result =>{///
    models.sub_count.findAll({
      attributes : ['byte']
    }).then((byte_num)=>{
      sub_route_value.push(byte_num[0].byte)
      sub_route_value.push(byte_num[1].byte)
      sub_route_value.push(byte_num[2].byte)
    //sub_route_value : 여기에다가 바이트 배열을 만들어야함
      let high = sub_route_value.findIndex((e)=> e === Math.max.apply(null, sub_route_value))
      if(high == 0){
        sub_route_min = [1, 2]
      }else if(high == 1){
        sub_route_min = [0, 2]
      }else if(high == 2){
        sub_route_min = [0, 1]
      }
      console.log(sub_route_min)
      models.Main_td.bulkCreate([
      {
        'tb_num1' : `${sub_route_min[0] + 1}`,
        'tb_num2' : `${sub_route_min[1] + 1}`,
        'src' : file_name,
        'byte' : req.file.size
      }
      ]).then(result =>{
        // console.log(file)
        if(sub_route_min[0] + sub_route_min[1] == 1){
          models.sub_td1.create({
            'src' : file_name,
            'byte' : req.file.size
            }).then(result =>{
            models.sub_td2.create({
              'src' : file_name,
              'byte' : req.file.size
              }).then(() =>{
              func.sub_data_check()
            })
          })
        }else if(sub_route_min[0] + sub_route_min[1] == 2){
          models.sub_td1.create({
            'src' : file_name,
            'byte' : req.file.size
            }).then(result =>{
            models.sub_td3.create({
              'src' : file_name,
              'byte' : req.file.size
              }).then(() =>{
                func.sub_data_check()
              })
            })
        }else if(sub_route_min[0] + sub_route_min[1] == 3){
          models.sub_td2.create({
            'src' : file_name,
            'byte' : req.file.size
            }).then(result =>{
            models.sub_td3.create({
              'src' : file_name,
              'byte' : req.file.size
              }).then(() =>{
              func.sub_data_check()
            })
          })
        }
      })
    })
    res.status(200).send("<script>alert('파일이 정상적으로 전송되었습니다.'); window.location = '/' </script>")
  })
})

module.exports = router;