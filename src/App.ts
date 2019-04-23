import * as express from 'express'
import { APIRouter } from './modules';

const app = express();
app.use('/', APIRouter);

export { app }