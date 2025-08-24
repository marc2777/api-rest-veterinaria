import { Router } from "express";
import { pool } from "./config/database.js";

const router = Router();


router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM usuarios WHERE activo = 1;`);
    res.json(rows);
  } catch (error) {
    console.log(`Error al obtener usuarios: ${error}`);
    res.status(500).json({ error: "Error en el servidor" });
  }
});


router.post("/", async (req, res) => {
  try {
    const { username, password, empleado_id } = req.body;

    const [result] = await pool.query(
      `INSERT INTO usuarios (username, password, empleado_id) VALUES (?, ?, ?);`,
      [username, password, empleado_id || null]
    );

    res.json({ mensaje: "Usuario creado exitosamente", id: result.insertId });
  } catch (error) {
    console.log(`Error al crear usuario: ${error}`);
    res.status(500).json({ error: "Error en el servidor" });
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { username, password, empleado_id, activo } = req.body;

    const [result] = await pool.query(
      `UPDATE usuarios 
       SET username = ?, password = ?, empleado_id = ?, activo = ? 
       WHERE usuario_id = ?;`,
      [username, password, empleado_id || null, activo ?? 1, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ mensaje: "Usuario actualizado exitosamente" });
  } catch (error) {
    console.log(`Error al actualizar usuario: ${error}`);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      `UPDATE usuarios SET activo = 0 WHERE usuario_id = ?;`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    res.json({ mensaje: "Usuario desactivado exitosamente" });
  } catch (error) {
    console.log(`Error al desactivar usuario: ${error}`);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;
