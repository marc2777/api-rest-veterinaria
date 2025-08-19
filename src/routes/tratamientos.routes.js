import { Router } from 'express';
import { getTratamientos } from '../controllers/tratamientos.controller.js';

const router = Router();

// Ruta simple para obtener todos los tratamientos
router.get('/tratamientos', getTratamientos);

export default router;
