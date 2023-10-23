import express, { Request, Response, NextFunction } from 'express';
const security = require('../middleware/security');

//router
const aws = require('./aws/index');
const naver = require('./naver/index');
const server = require('./server/index');

const router = express.Router();

router.use(security.applyCors);

router.use('/', (req: Request, res: Response, next: NextFunction) => {
	const apply = security.authority(req.body,req.headers);
	if(apply === 200) next();
	else res.sendStatus(404).send('file not found');
});

router.use('/aws',aws);
router.use('/naver',naver);
router.use('/server',server);
// app.get('/addKey', (req: Request, res: Response, next: NextFunction) => {
// 	// console.log(uuidAPIKey.create());
// })

module.exports = router;