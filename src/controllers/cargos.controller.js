import { pool } from '../db.js';

export const getCargos = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT cargo_id, nombre, descripcion, activo
      FROM cargos;
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener cargos:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
