var express = require('express');
var multer = require('multer')
var router = express.Router();

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
  res.render('index', { title: 'Express' });
});

router.post('/save_Image', upload.single('user_images', (req,res) =>{
  console.log('save Image 접속')
}))

module.exports = router;
