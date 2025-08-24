import { Router } from "express";
import { pool } from "./config/database.js";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [rows] =
      await pool.query(`SELECT p.nombre, p.primer_apellido,p.segundo_apellido
        ,p.telefono,p.direccion,p.email,p.fecha_registro,e.activo,e.empleado_id,c.nombre AS cargo
        FROM personas p INNER JOIN empleados e ON p.persona_id = e.persona_id
        LEFT JOIN cargos c ON e.cargo_id=c.cargo_id WHERE e.activo=1; `);
    res.json(rows);
  } catch (error) {
    console.log(`Error al obtener empleados: ${error}`);
    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      nombre,
      primer_apellido,
      segundo_apellido,
      telefono,
      direccion,
      email,
      cargo,
    } = req.body;
    const [personaResult] = await pool.query(
      `INSERT INTO personas (nombre, primer_apellido, segundo_apellido, telefono, direccion, email)
        VALUES (?,?,?,?,?,?);`,
      [nombre, primer_apellido, segundo_apellido, telefono, direccion, email]
    );
    const personaId = personaResult.insertId;
    console.log(`ID de la persona generada: ${personaId}`);
    const [empleadoResult] = await pool.query(
      `INSERT INTO empleados(persona_id,cargo_id)
                                            VALUES(?,?)`,
      [personaId, cargo]
    );
    const empleadoId = empleadoResult.insertId;
    console.log(`ID empleado: ${empleadoId}`);
    res.json({ mensaje: "Empleado creado exitosamente." });
  } catch (error) {
    console.log(`Error al crear empleado: ${error}`);

    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params; // empleado_id
  const campos = req.body;
  const columnasPersonas = [
    "nombre",
    "primer_apellido",
    "segundo_apellido",
    "telefono",
    "direccion",
    "email",
  ];

  try {
    const [empleado] = await pool.query(
      "SELECT persona_id FROM empleados WHERE empleado_id = ?",
      [id]
    );

    if (!empleado || empleado.length === 0) {
      return res.json({ mensaje: "Empleado no encontrado..." });
    }

    const personaId = empleado[0].persona_id;

    let keysPersonas = [];
    let valoresPersonas = [];

    for (let i = 0; i < columnasPersonas.length; i++) {
      let key = columnasPersonas[i];
      if (campos[key] !== undefined && campos[key] !== null) {
        keysPersonas.push(key);
        valoresPersonas.push(campos[key]);
      }
    }

    if (keysPersonas.length > 0) {
      let columnas = keysPersonas.map((k) => `${k} = ?`).join(", ");
      const sql = `UPDATE personas SET ${columnas} WHERE persona_id = ?`;
      await pool.query(sql, [...valoresPersonas, personaId]);
    }

    if (campos.cargo !== undefined && campos.cargo !== null) {
      await pool.query(
        "UPDATE empleados SET cargo_id = ? WHERE empleado_id = ?",
        [campos.cargo, id]
      );
    }

    res.json({ mensaje: "Empleado actualizado exitosamente." });
  } catch (error) {
    console.error(`Error al actualizar empleado: ${error}`);
    res.status(500).json({ mensaje: "Error al actualizar empleado." });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(`UPDATE empleados SET activo=0 WHERE empleado_id=?`, [id]);

    res.json({ mensaje: "Empleado dado de BAJA exitosamente." });
  } catch (error) {
    console.log(`Error al dar de baja al empleado: ${error}`);

    res.status(500).json({ error: "Error en el servidor" });
  }
});

export default router;
