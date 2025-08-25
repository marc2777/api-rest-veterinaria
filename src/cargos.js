import { pool } from "./config/database.js";
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT cargo_id, nombre, descripcion, activo 
      FROM cargos
      WHERE activo=1;
    `);
    res.json(rows);
  } catch (error) {
    console.log(`Error al obtener cargos: ${error}`);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { nombre, descripcion } = req.body;
    await pool.query(
      `INSERT INTO cargos(nombre, descripcion, activo) VALUES(?,?,1);`,
      [nombre, descripcion]
    );
    res.json({ mensaje: "Cargo registrado exitosamente." });
  } catch (error) {
    console.log(`Error al registrar cargo: ${error}`);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, descripcion } = req.body;

    await pool.query(
      `UPDATE cargos SET nombre=?, descripcion=? WHERE cargo_id=?;`,
      [nombre, descripcion, id]
    );

    res.json({ mensaje: "Cargo actualizado correctamente." });
  } catch (error) {
    console.log(`Error al actualizar cargo: ${error}`);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await pool.query(`UPDATE cargos SET activo=0 WHERE cargo_id=?;`, [id]);
    res.json({ mensaje: "Cargo eliminado (borrado lógico)." });
  } catch (error) {
    console.log(`Error al eliminar cargo: ${error}`);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;
