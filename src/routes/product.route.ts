import { Router } from 'express';
import Auth from '../controllers/auth.controller';
import Product from '../controllers/product.controller';
import { uploadSingle } from '../middlewares/formidable';

const router = Router();

router.get('/verify-product', Product.verify);
router.post('/register-product', Auth.protect, uploadSingle, Product.register);
export default router;
