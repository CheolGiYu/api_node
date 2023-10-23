const multer = require("multer");
const multerS3 = require('multer-s3');
const { v4: uuidv4 } = require("uuid");
const aws = require('aws-sdk');
const {S3Key} = require('../api/aws/key');


const MIME_TYPE_MAP: {[key: string]:string} = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
  "application/pdf": "pdf",
};

const fileUpload = multer({
  limits: 10000000,
  storage: multer.diskStorage({
    destination: (req: any, file: any, cb: any) => {
      cb(null, "public/images");
    },
    filename: (req: any, file: any, cb: any) => {
      const ext = MIME_TYPE_MAP[file.mimetype];

      console.log(file);

      // 한글 파일명 깨짐 해결
      file.originalname = Buffer.from(file.originalname, "latin1").toString(
        "utf8"
      );

      // file.originalname에서 확장자 제거한 파일명 추출하기
      file.originalname = file.originalname.split(`.${ext}`)[0];

      // 파일명 중복을 방지하기 위해 uuid 붙여주기
      cb(null, file.originalname + uuidv4() + "." + ext);
    },
  }),
  fileFilter: (req: any, file: any, cb: any) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];

    let error = isValid ? null : new Error("Invalid mime type!");

    cb(error, isValid);
  },
});


const S3FileUpload = multer({
  storage: multerS3({
    s3: new aws.S3(S3Key),
    bucket: S3Key.bucket,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    cacheControl: 'max-age=31536000',
    key: function (req: any, file: any, cb: any) {
      cb(null, `${Date.now()}_${file.originalname}`);
    },
  }),
});

const noData = multer({ storage: multer.memoryStorage() });

const multerPath: string = "file[]";

module.exports = {
  fileUpload: fileUpload,
  noData: noData,
  S3FileUpload: S3FileUpload,
  multerPath: multerPath
};