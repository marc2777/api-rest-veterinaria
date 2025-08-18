import { Router } from "express";
import { getEmpleados } from "../controllers/empleados.controller.js";
const router=Router();

router.get('/empleados',getEmpleados);
// router.post('/empleados',);
// router.put('/empleados',);

export default router;