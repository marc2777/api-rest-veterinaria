import { Router } from "express";
import { getMascotas } from "../controllers/mascotas.controller.js";
const router=Router();

router.get('/mascotas',getMascotas);

export default router;