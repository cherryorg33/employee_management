import { Router } from 'express';
import { login ,registerManager} from '../controllers/authController';

const router = Router();

router.post('/login', login);
router.post('/register', registerManager);


export default router;
