import express, { Request, Response, NextFunction } from 'express';
const multer = require("multer");
const axios = require('axios');
const https = require('https');
const fs = require('fs');
const FormData = require('form-data');


const router = express.Router();

router.post('/image',multer({storage: multer.memoryStorage()}).array('file[]'), async (req: Request<any>, res: Response, next: NextFunction) => {
  interface MulterRequest extends Request {
      files: any;
  }
  const file = (req as MulterRequest).files[0];
  console.log(file);
  const clientId = 'rbpu66soyd';
  const clientSecret = '2uTKSAkCyKiPpdmSWe3kXXj1TqYiNkswZe76mfoo';
  const sourceLanguage = 'auto';
  const targetLanguage = 'ko';

  const translateImage = async () => {
    const formData = new FormData();
    formData.append('image', file.buffer, file.originalname, {
      'Content-Type': file.mimetype,
      'Content-Disposition': `form-data; name="image"; filename="${file.originalname}"; filename*=UTF-8''${file.originalname}`,
    });
    formData.append('source', sourceLanguage);
    formData.append('target', targetLanguage);

  //   const response = await axios.post('https://naveropenapi.apigw.ntruss.com/image-to-image/v1/translate', formData, {
  //     headers: {
  //       'X-NCP-APIGW-API-KEY-ID': clientId,
  //       'X-NCP-APIGW-API-KEY': clientSecret,
  //       'Content-Type': 'multipart/form-data',
  //     },
  //   });

  //   const responseData = await response;

  //   return responseData;
  };

  // const result = await translateImage();

  // res.send(JSON.stringify(result.data, null, 2));

})

module.exports = router;