import { Router } from 'express';
import {
  getMyEmployees,
  getEmployeeDetails,
  addEmployee,
  updateEmployee,
  deleteEmployee,
} from '../controllers/managerController';
import { authenticateToken, authorizeRoles } from '../middlewares/authMiddleware';

const router = Router();

// ✅ Apply middlewares correctly with path
router.use('/', authenticateToken, authorizeRoles('manager'));

router.get('/employees', getMyEmployees);
router.get('/employees/:id', getEmployeeDetails);
router.post('/employees', addEmployee);
router.put('/employees/:id', updateEmployee);
router.delete('/employees/:id', deleteEmployee);

export default router;
