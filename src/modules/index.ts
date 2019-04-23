import { Router } from 'express';

import { CommonRouter } from './common/index';

const router = Router();

router.use('/status', CommonRouter);

export {
  router as APIRouter
}