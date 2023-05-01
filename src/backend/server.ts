import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import limit from 'express-rate-limit';
import { CorsOptions } from 'cors';
import router from './routes';
import bodyParser from 'body-parser';

let app: Express | null = null;

export type TServerConfig = {
    port: number;
    corsOptions: CorsOptions;
    limiter: {
        time: number;
        max: number;
    };
};
export const startServer = ({ port, corsOptions, limiter }: TServerConfig) => {
    if (app != null) return null;
    app = express();
    app.use(helmet());
    app.use(cors(corsOptions));
    app.disable('x-powered-by');
    app.use(limit({ windowMs: limiter.time, max: limiter.max }));
    app.use(express.json());
    app.use(router);
    return app.listen(port, () => {
        console.log(`App listening on port ${port}`);
    });
};
