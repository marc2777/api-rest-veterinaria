import { pool } from "./config/database.js";
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT consulta_id, cita_id, diagnostico, observaciones 
      FROM consultas 
      WHERE activo = 1
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error al mostrar consultas:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { cita_id, diagnostico, observaciones } = req.body;

    const [maxResult] = await pool.query(
      `SELECT MAX(consulta_id) AS ultimo FROM consultas`
    );
    let siguiente =
      maxResult[0].ultimo !== null ? maxResult[0].ultimo + 1 : 1;

    await pool.query(
      `INSERT INTO consultas (consulta_id, cita_id, diagnostico, observaciones, estado)
       VALUES (?, ?, ?, ?, 1)`,
      [siguiente, cita_id, diagnostico, observaciones]
    );

    res.json({ mensaje: "Consulta agregada correctamente" });
  } catch (error) {
    console.error("Error al insertar consulta:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.put("/:cod", async (req, res) => {
  try {
    const consulta_id = req.params.cod;
    const { cita_id, diagnostico, observaciones } = req.body;

    const [result] = await pool.query(
      `UPDATE consultas 
       SET cita_id=?, diagnostico=?, observaciones=?, estado=1 
       WHERE consulta_id=?`,
      [cita_id, diagnostico, observaciones, consulta_id]
    );

    res.json({ mensaje: "Consulta actualizada correctamente", result });
    console.log("Consulta actualizada correctamente");
  } catch (error) {
    console.error("Error en update de consulta:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.delete("/del/:cod", async (req, res) => {
  try {
    const consulta_id = req.params.cod;
    const [result] = await pool.query(
      `UPDATE consultas SET activo = 0 WHERE consulta_id = ?`,
      [consulta_id]
    );

    res.json({ mensaje: "Consulta eliminada", result });
    console.log("Consulta eliminada correctamente");
  } catch (error) {
    console.error("Error al eliminar consulta:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;
