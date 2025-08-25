import { pool } from "./config/database.js";
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT ci.cita_id, ci.fecha, ci.hora, ci.motivo, ci.estado, ci.activo,
             m.nombre AS mascota,
             p.nombre AS cliente, p.primer_apellido AS apellido_cliente,
             pe.nombre AS empleado
      FROM citas ci
      INNER JOIN mascotas m ON ci.mascota_id = m.mascota_id
      INNER JOIN clientes c ON m.cliente_id = c.cliente_id
      INNER JOIN personas p ON c.persona_id = p.persona_id
      LEFT JOIN empleados e ON ci.empleado_id = e.empleado_id
      LEFT JOIN personas pe ON e.persona_id = pe.persona_id
      WHERE ci.activo=1;
    `);
    res.json(rows);
  } catch (error) {
    console.log(`Error al obtener citas: ${error}`);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { mascota_id, fecha, hora, motivo, empleado_id } = req.body;
    await pool.query(
      `INSERT INTO citas(mascota_id, fecha, hora, motivo, empleado_id, estado, activo)
       VALUES(?,?,?,?,?,'Pendiente',1);`,
      [mascota_id, fecha, hora, motivo, empleado_id]
    );
    res.json({ mensaje: "Cita registrada exitosamente." });
  } catch (error) {
    console.log(`Error al registrar cita: ${error}`);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, hora, motivo, empleado_id, estado } = req.body;

    await pool.query(
      `UPDATE citas 
       SET fecha=?, hora=?, motivo=?, empleado_id=?, estado=? 
       WHERE cita_id=?;`,
      [fecha, hora, motivo, empleado_id, estado, id]
    );

    res.json({ mensaje: "Cita actualizada correctamente." });
  } catch (error) {
    console.log(`Error al actualizar cita: ${error}`);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`UPDATE citas SET activo=0 WHERE cita_id=?;`, [id]);
    res.json({ mensaje: "Cita eliminada (borrado lógico)." });
  } catch (error) {
    console.log(`Error al eliminar cita: ${error}`);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;
