const express = require('express');
const multer = require('multer')
const router = express.Router();
// const { sequelize } = require('./models/index.js');
const fs = require('fs')
const img_file_path = './public/userimage'

/* GET home page. */
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, img_file_path);
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf()+file.originalname);
    }
  }),
});

router.get('/', function(req, res, next) {
  console.log('/ 접속')
  fs.readdir(img_file_path, (err, file_list) =>{
    // console.log(file_list.length)
    // console.log(file_list)
    res.render('index', { title: 'FSM in',
      file_num : file_list.length,
      file_arr : file_list
    });
  })
});

router.post('/save_Image', upload.single('userfile'), (req,res)=>{
  console.log('save Image 접속')
  console.log('파일 전송 완료')
  res.status(401).send("<script>alert('파일이 정상적으로 전송되었습니다.'); window.location = '/' </script>")
})


module.exports = router;
