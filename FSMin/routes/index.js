var express = require('express');
var multer = require('multer')
var router = express.Router();
var fs = require('fs')

/* GET home page. */
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'public/userimage/');
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf()+file.originalname);
    }
  }),
});

router.get('/', function(req, res, next) {
  console.log('/ 접속')
  fs.readdir('./public/userimage', (err, file_list) =>{
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
