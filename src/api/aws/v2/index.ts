import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();
const s3 = require('./s3/index');
router.use('/s3',s3);


module.exports = router;