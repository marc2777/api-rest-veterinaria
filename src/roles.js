import { Router } from "express";
import { pool } from "./config/database.js";

const router = Router();


router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM roles WHERE activo = 1;`);
    res.json(rows);
  } catch (error) {
    console.log(`Error al obtener roles: ${error}`);
    res.status(500).json({ error: "Error en el servidor" });
  }
});


router.post("/", async (req, res) => {
  try {
    const { nombre } = req.body;
    const [result] = await pool.query(
      `INSERT INTO roles (nombre) VALUES (?);`,
      [nombre]
    );
    res.json({ mensaje: "Rol creado exitosamente", id: result.insertId });
  } catch (error) {
    console.log(`Error al crear rol: ${error}`);
    if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json({ error: "Ya existe un rol con ese nombre" });
    } else {
      res.status(500).json({ error: "Error en el servidor" });
    }
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, activo } = req.body;

    const [result] = await pool.query(
      `UPDATE roles SET nombre = ?, activo = ? WHERE rol_id = ?;`,
      [nombre, activo ?? 1, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Rol no encontrado" });
    }

    res.json({ mensaje: "Rol actualizado exitosamente" });
  } catch (error) {
    console.log(`Error al actualizar rol: ${error}`);
    if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json({ error: "Ya existe un rol con ese nombre" });
    } else {
      res.status(500).json({ error: "Error en el servidor" });
    }
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await pool.query(
      `UPDATE roles SET activo = 0 WHERE rol_id = ?;`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Rol no encontrado" });
    }

    res.json({ mensaje: "Rol desactivado exitosamente" });
  } catch (error) {
    console.log(`Error al desactivar rol: ${error}`);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;
