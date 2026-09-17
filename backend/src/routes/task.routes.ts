import { Router } from 'express';
import * as taskController from '../controllers/task.controller';
import * as timerController from '../controllers/timer.controller';
import { validate } from '../middleware/validation.middleware';
import { createTaskSchema, updateTaskSchema, updateTaskStatusSchema } from '../schemas/task.schema';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/enhance', taskController.enhance);
router.post('/', validate(createTaskSchema), taskController.create);
router.get('/', taskController.getAll);
router.get('/:id', taskController.getById);
router.put('/:id', validate(updateTaskSchema), taskController.update);
router.patch('/:id/status', validate(updateTaskStatusSchema), taskController.update);
router.delete('/:id', taskController.remove);

// Timer sub-routes for a specific task
router.post('/:id/timer/start', timerController.startTimer);
router.post('/:id/timer/stop', timerController.stopTimer);
router.get('/:id/time-logs', timerController.getTaskTimeLogs);
router.get('/:id/time-summary', timerController.getTaskTimeSummary);

export default router;
