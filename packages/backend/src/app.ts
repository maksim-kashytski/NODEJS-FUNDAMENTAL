import express from 'express';
import morgan from 'morgan';

import { Application, Request, Response } from 'express';
import { routerUsers } from './api/users';
import * as bodyParser from 'body-parser';
import cors from 'cors';

const port = process.env.PORT || 3000;
const app: Application = express();
const corsOptions = {
    origin: '*',
    credentials: true,
    optionSuccessStatus: 200,
}

app.use(cors(corsOptions));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use('/users', routerUsers);
app.use((req: Request, res: Response) => {
    res.status(400).json({
        error: {
            message: 'Not found'
        }
    });
});
app.use((err: Error, req: Request, res: Response) => {
    res.status(404);
    res.json({
        error: {
            message: err.message
        }
    });
});

app.listen(port, () => console.log(`server is running on port ${port}`));
