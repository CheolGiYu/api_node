import express, { Request, Response, NextFunction } from 'express';

const api = require('./api/index');

const app = express();
const port = 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));



app.use('/api',api);

app.get('/', (req: Request, res: Response, next: NextFunction) => {
	res.send('api home');
	// res.sendStatus(404).send('file not found');
});


app.listen(port, () => {console.log(`Server listening on port: `+port);});