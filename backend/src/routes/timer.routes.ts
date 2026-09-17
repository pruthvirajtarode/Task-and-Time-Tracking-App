import { Router } from 'express';
import * as timerController from '../controllers/timer.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/active', timerController.getActiveTimer);
router.get('/', timerController.getAllTimeLogs);

export default router;
