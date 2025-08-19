import { Router } from 'express';
import { getCargos } from '../controllers/cargos.controller.js';

const router = Router();

router.get('/cargos', getCargos);

export default router;
