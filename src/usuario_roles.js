import { Router } from "express";
import { pool } from "./config/database.js";

const router = Router();


router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`SELECT * FROM usuario_rol WHERE activo = 1;`);
    res.json(rows);
  } catch (error) {
    console.log(`Error al obtener usuario_rol: ${error}`);
    res.status(500).json({ error: "Error en el servidor" });
  }
});


router.post("/", async (req, res) => {
  try {
    const { usuario_id, rol_id } = req.body;

    const [result] = await pool.query(
      `INSERT INTO usuario_rol (usuario_id, rol_id) VALUES (?, ?);`,
      [usuario_id, rol_id]
    );

    res.json({ mensaje: "Rol asignado exitosamente", id: result.insertId });
  } catch (error) {
    console.log(`Error al asignar rol: ${error}`);
    if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json({ error: "Ese usuario ya tiene este rol asignado" });
    } else {
      res.status(500).json({ error: "Error en el servidor" });
    }
  }
});


router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { usuario_id, rol_id, activo } = req.body;

    const [result] = await pool.query(
      `UPDATE usuario_rol 
       SET usuario_id = ?, rol_id = ?, activo = ? 
       WHERE usuario_rol_id = ?;`,
      [usuario_id, rol_id, activo ?? 1, id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Asignación no encontrada" });
    }

    res.json({ mensaje: "Asignación de rol actualizada exitosamente" });
  } catch (error) {
    console.log(`Error al actualizar rol: ${error}`);
    if (error.code === "ER_DUP_ENTRY") {
      res.status(400).json({ error: "Ese usuario ya tiene este rol asignado" });
    } else {
      res.status(500).json({ error: "Error en el servidor" });
    }
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await pool.query(
      `UPDATE usuario_rol SET activo = 0 WHERE usuario_rol_id = ?;`,
      [id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Asignación no encontrada" });
    }

    res.json({ mensaje: "Asignación de rol desactivada exitosamente" });
  } catch (error) {
    console.log(`Error al desactivar asignación de rol: ${error}`);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;
