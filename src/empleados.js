import { Router } from "express";
import { pool } from "./config/database.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [rows] =
      await pool.query(`SELECT p.nombre, p.primer_apellido,p.segundo_apellido
        ,p.telefono,p.direccion,p.email,p.fecha_registro,p.activo,e.empleado_id,c.nombre AS cargo
        FROM personas p INNER JOIN empleados e ON p.persona_id = e.persona_id
        LEFT JOIN cargos c ON e.cargo_id=c.cargo_id; `);
    res.json(rows);
  } catch (error) {
    console.log(`Error al obtener empleados: ${error}`);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      nombre,
      primer_apellido,
      segundo_apellido,
      telefono,
      direccion,
      email,
      cargo,
    } = req.body;
    const [personaResult] = await pool.query(
      `INSERT INTO personas (nombre, primer_apellido, segundo_apellido, telefono, direccion, email)
        VALUES (?,?,?,?,?,?);`,
      [nombre, primer_apellido, segundo_apellido, telefono, direccion, email]
    );
    const personaId = personaResult.insertId;
    console.log(`ID de la persona generada: ${personaId}`);
    const [empleadoResult] = await pool.query(
      `INSERT INTO empleados(persona_id,cargo_id)
                                            VALUES(?,?)`,
      [personaId, cargo]
    );
    const empleadoId = empleadoResult.insertId;
    console.log(`ID empleado: ${empleadoId}`);
    res.json({ mensaje: "Empleado creado exitosamente." });
  } catch (error) {
    console.log(`Error al crear empleado: ${error}`);

    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.put("/:id", (req, res) => {});

router.delete("/:id", (req, res) => {});

export default router;
