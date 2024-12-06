import { Router } from 'express';
import Auth from '../controllers/auth.controller';

const router = Router();

router.post('/signup', Auth.signup);
router.post('/login', Auth.login);

router.use(Auth.protect);
router.get('/me', Auth.getUserInfo);
export default router;
