import { pool } from '../db.js';

export const getTratamientos = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT tratamiento_id, nombre, descripcion, precio, activo
      FROM tratamientos;
    `);
    res.json(rows);
  } catch (error) {
    console.error("Error al obtener tratamientos:", error);
    res.status(500).json({ error: "Error en el servidor" });
  }
};
