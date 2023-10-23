import express, { Request, Response, NextFunction } from 'express';

const router = express.Router();
const papago_image_translation = require('./papago_image_translation/index');

router.use('/papago_image_translation',papago_image_translation);

module.exports = router;