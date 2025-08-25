import { pool } from "./config/database.js";
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT ct.id, ct.consulta_id, ct.tratamiento_id, t.nombre, ct.cantidad, ct.precio
      FROM consulta_tratamientos ct
      INNER JOIN tratamientos t ON ct.tratamiento_id = t.tratamiento_id
      WHERE ct.activo = 1
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error al mostrar consulta tratamientos:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { consulta_id, tratamiento_id, cantidad, precio } = req.body;

    const [maxResult] = await pool.query(
      `SELECT MAX(id) AS ultimo FROM consulta_tratamientos`
    );
    let siguiente = maxResult[0].ultimo !== null ? maxResult[0].ultimo + 1 : 1;

    await pool.query(
      `INSERT INTO consulta_tratamientos (id, consulta_id, tratamiento_id, cantidad, precio, estado)
       VALUES (?, ?, ?, ?, ?, 1)`,
      [siguiente, consulta_id, tratamiento_id, cantidad, precio]
    );

    res.json({ mensaje: "Consulta tratamiento agregado correctamente" });
    console.log("Consulta tratamiento agregado correctamente");
  } catch (error) {
    console.error("Error al insertar consulta tratamiento:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.put("/:cod", async (req, res) => {
  try {
    const id = req.params.cod;
    const { consulta_id, tratamiento_id, cantidad, precio } = req.body;

    const [result] = await pool.query(
      `UPDATE consulta_tratamientos 
       SET consulta_id=?, tratamiento_id=?, cantidad=?, precio=?, estado=1 
       WHERE id=?`,
      [consulta_id, tratamiento_id, cantidad, precio, id]
    );

    res.json({ mensaje: "Consulta tratamiento actualizado correctamente", result });
    console.log("Consulta tratamiento actualizado correctamente");
  } catch (error) {
    console.error("Error en update consulta_tratamiento:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.delete("/del/:cod", async (req, res) => {
  try {
    const id = req.params.cod;
    const [result] = await pool.query(
      `UPDATE consulta_tratamientos SET activo = 0 WHERE id = ?`,
      [id]
    );

    res.json({ mensaje: "Consulta tratamiento eliminado correctamente", result });
    console.log("Consulta tratamiento eliminado correctamente");
  } catch (error) {
    console.error("Error al eliminar consulta_tratamiento:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;
