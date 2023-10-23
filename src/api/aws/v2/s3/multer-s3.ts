const multer = require("multer");
const multerS3 = require('multer-s3');
const aws = require('aws-sdk');
const {S3Key} = require('../../key');


const upload = multer({
  storage: multerS3({
    s3: new aws.S3(S3Key),
    bucket: S3Key.bucket,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    cacheControl: 'max-age=31536000',
    key: function (req: any, file: any, cb: any) {
      let name = file.originalname.replace('=', '/');
      let ext = name.substring(name.lastIndexOf('.') + 1);
      name = name.split('.')
      name.pop();
      let path: string = '';
      for(let i of name) {
        path += i;
      }
      path = Date.now() + "_" + path + "." +  ext;
      cb(null, `${path}`);
    },
  }),
});

const multerPath: string = "file[]";

module.exports = {
  upload: upload,
  multerPath: multerPath
};