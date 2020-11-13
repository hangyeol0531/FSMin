const express = require('express');
const multer = require('multer')
const router = express.Router();
const fs = require('fs')
const img_file_path = '../public/userimage'
const bodyParser = require('body-parser');

/* GET home page. */
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, img_file_path);
    },
    filename: function (req, file, cb) {
      cb(null, new Date().valueOf() + file.originalname);
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
  console.log(req.body);
  let path = `${img_file_path}/${req.body.img_name}`
  console.log(path)

  fs.unlink(path, function (err) {
    if (err && err.code == 'ENOENT') {
      // file doens't exist
      console.info("File doesn't exist, won't remove it.");
    } else if (err) {
      // other errors, e.g. maybe we don't have enough permission
      console.error("Error occurred while trying to remove file");
    } else {
      // console.info(`removed`);
      res.status(200).send("<script>alert('파일이 정상적으로 삭제되었습니다.'); window.location = '/' </script>")
    }
    res.redirect('/');
  });
})

router.post('/save_Image', upload.single('userfile'), (req, res) => {
  console.log('save Image 접속')
  console.log('파일 전송 완료')
  res.status(200).send("<script>alert('파일이 정상적으로 전송되었습니다.'); window.location = '/' </script>")
})


module.exports = router;