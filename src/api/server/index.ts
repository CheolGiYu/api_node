import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();
const img = require('./img');

router.use('/img',img);

module.exports = router;