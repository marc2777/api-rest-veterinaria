import { pool } from "./config/database.js";
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT tratamiento_id, nombre, descripcion, precio FROM tratamientos WHERE activo = 1"
    );
    res.json(rows);
  } catch (error) {
    console.log("Error al mostrar los tratamientos:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.post("/", async (req, res) => {
  try {
    const [maxIdResult] = await pool.query(
      "SELECT MAX(tratamiento_id) AS ultimo FROM tratamientos"
    );

    let siguiente = 1;
    if (maxIdResult[0].ultimo !== null) {
      siguiente = maxIdResult[0].ultimo + 1;
    }

    const { nombre, descripcion, precio } = req.body;

    const [result] = await pool.query(
      `INSERT INTO tratamientos (tratamiento_id, nombre, descripcion, precio, activo)
       VALUES (?, ?, ?, ?, 1)`,
      [siguiente, nombre, descripcion, precio]
    );

    res.json({ mensaje: "Tratamiento agregado correctamente", id: siguiente });
    console.log("Tratamiento agregado correctamente");
  } catch (error) {
    console.log("Error al insertar tratamiento:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.put("/:cod", async (req, res) => {
  try {
    const tratamiento_id = req.params.cod;
    const { nombre, descripcion, precio } = req.body;

    const [result] = await pool.query(
      `UPDATE tratamientos 
       SET nombre = ?, descripcion = ?, precio = ?, activo = 1 
       WHERE tratamiento_id = ?`,
      [nombre, descripcion, precio, tratamiento_id]
    );

    res.json({ mensaje: "Tratamiento actualizado correctamente" });
  } catch (error) {
    console.log("Error en update:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.delete("/del/:cod", async (req, res) => {
  try {
    const tratamiento_id = req.params.cod;

    const [result] = await pool.query(
      "UPDATE tratamientos SET activo = 0 WHERE tratamiento_id = ?",
      [tratamiento_id]
    );

    res.json({ mensaje: "Tratamiento eliminado correctamente" });
    console.log("Tratamiento eliminado correctamente");
  } catch (error) {
    console.log("Error al borrar:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;
