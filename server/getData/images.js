const path = require('path');
let express = require('express');
const fs = require('fs');
const app = express();
const multer = require('multer');
const menuDir = path.join(__dirname, '../../src/assets/picture/menu');
app.use('/images', express.static(menuDir));

fs.readdir(menuDir, (err, files) => {
  if (err) {
    console.error('Error reading folder contents', err);
    return;
  }
  else console.log('All good')
})
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, menuDir)
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
})

const uploadMenu = multer({ storage: storage });

app.post('/upload', uploadMenu.array('photos', 13), (req, res) => {
  console.log(req.files);
  if (req.files.length === 0) {
    console.log('Upload error');
    res.status(400).send('Images are not upload');
  } else {
    res.send('Images are uploaded succefully');
  }
});

app.get('/images', (req, res) => {
  fs.readdir(menuDir, (err, files) => {
    if (err) {
      console.error('Images are not get', err);
      res.status(500).send('Error reading folder contents');
      return;
    }
    res.json(files);
  });
})


module.exports = app;