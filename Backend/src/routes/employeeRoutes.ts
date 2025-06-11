import { Router } from 'express';
import { getMyManager } from '../controllers/employeeController';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

router.use(authenticateToken, authorizeRoles('employee'));

router.get('/my-manager', getMyManager);

export default router;
