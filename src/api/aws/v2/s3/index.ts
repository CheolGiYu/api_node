import express, { Request, Response, NextFunction } from 'express';
const {upload, multerPath} = require('./multer-s3');
const bucket = require('./bucket');
const router = express.Router();


router.post('/bucketList', async (req: Request, res: Response, next: NextFunction) => {
	try{
		res.send(await bucket.bucketList());
	} catch {
		res.sendStatus(404).send('file not found');
	}
});

router.post('/bucketCreate', async (req: Request, res: Response, next: NextFunction) => {
	const {name} = req.body.data;
	try{
		res.send(await bucket.bucketCreate(name));
	} catch {
		res.sendStatus(404).send('file not found');
	}
});

router.post('/bucketAcl', async (req: Request, res: Response, next: NextFunction) => {
	const {name, BlockPublicAcls, BlockPublicPolicy, IgnorePublicAcls, RestrictPublicBuckets} = req.body.data;
	try{
		res.send(await bucket.bucketAcl(name, BlockPublicAcls, BlockPublicPolicy, IgnorePublicAcls, RestrictPublicBuckets));
	} catch {
		res.sendStatus(404).send('file not found');
	}
});


router.post('/bucketCors', async (req: Request, res: Response, next: NextFunction) => {
	const {origin} = req.headers;
	const {name} = req.body.data;
	try{
		res.send(await bucket.bucketCors(name, origin));
	} catch {
		res.sendStatus(404).send('file not found');
	}
});

router.post('/bucketPolicy', async (req: Request, res: Response, next: NextFunction) => {
	const {origin} = req.headers;
	const {name} = req.body.data;
	try{
		res.send(await bucket.bucketPolicy(name, origin));
	} catch {
		res.sendStatus(404).send('file not found');
	}
});

router.post('/bucketFileList', async (req: Request, res: Response, next: NextFunction) => {
	const {name} = req.body.data;
	try{
		res.send(await bucket.bucketFileList(name));
	} catch {
		res.sendStatus(404).send('file not found');
	}
});



router.post('/fileUpload',upload.array(multerPath), async (req: Request, res: Response, next: NextFunction) => {
	interface MulterRequest extends Request {
	    files: any;
	}
	const post = req.body;
	post.file = (req as MulterRequest).files;
	res.send(JSON.stringify(post, null, 2));
});

router.post('/fileBuffer', async (req: Request, res: Response, next: NextFunction) => {
	const {name, key} = req.body.data;
	try{
		const sse = 'base64';
		const data = await bucket.fileBuffer(name, key);
		res.setHeader('Cache-Control', 'max-age=604800');//1주일
		res.setHeader('ETag', data.ETag);
		res.setHeader('Content-Type', data.ContentType);
		res.send("data:" + data.ContentType + ";"+ sse + "," + Buffer.from(data.Body).toString(sse));
	} catch {
		res.send('file not found');
	}
});


module.exports = router;

