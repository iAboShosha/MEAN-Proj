import {Router} from 'express'
import {middleware as body} from 'bodymen'
import {uploadFile} from './controller'
import multer from 'multer'

const router = new Router()

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../uploads')
  },
  filename: function (req, file, cb) {
    var fileParts = file.originalname.split('.');
    var fileName = fileParts[0]+'-'+Date.now()+'.'+fileParts[1];
    cb(null, fileName)
  }
});

var upload = multer({ storage: storage }).any();

router.post('/',
  upload,
  uploadFile
)

export default router
