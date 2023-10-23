import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();
const v2 = require('./v2/index');

router.use('/v2',v2);

module.exports = router;