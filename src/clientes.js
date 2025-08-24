import { pool } from "./config/database.js";
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
        SELECT p.nombre, p.primer_apellido, p.segundo_apellido,
               p.telefono, p.direccion, p.email, p.fecha_registro, c.activo,
               c.cliente_id
        FROM personas p
        INNER JOIN clientes c ON p.persona_id = c.persona_id WHERE c.activo=1;
    `);
    res.json(rows);
  } catch (error) {
    console.log(`Error al obtener clientes: ${error}`);

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
    } = req.body;
    const [personaResult] = await pool.query(
      `INSERT INTO personas(nombre,primer_apellido,segundo_apellido,telefono,direccion,email)
        VALUES(?,?,?,?,?,?);`,
      [nombre, primer_apellido, segundo_apellido, telefono, direccion, email]
    );

    const personaId = personaResult.insertId;
    const [clienteResult] = await pool.query(
      `INSERT INTO clientes(persona_id)VALUES(?);`,
      [personaId]
    );
    console.log(
      `persona_id: ${personaId}, cliente_id: ${clienteResult.insertId}`
    );
    res.json({ mensaje: "Cliente registrado exitosamente." });
  } catch (error) {
    console.log(`Error al registrar cliente: ${error}`);

    res.status(500).json({ error: "Error en el servidor" });
  }
});

router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const campos = req.body;
  const clientes = ["nombre", "primer_apellido", "segundo_apellido", "telefono", "direccion", "email"];

  try {
    const [rows] = await pool.query(
      `SELECT persona_id FROM clientes WHERE cliente_id = ?`,
      [id]
    );

    if (!rows || rows.length === 0) {
      return res.json({ mensaje: "Cliente no encontrado." });
    }

    const personaId = rows[0].persona_id;
    let columnas = [];
    let valores = [];

    for (let i = 0; i < clientes.length; i++) {
      let key = clientes[i];

      if (campos[key] !== undefined && campos[key] !== null) {
        columnas.push(key);
        valores.push(campos[key]);
      }
    }

    if (columnas.length > 0) {
      let keyPersonas = columnas.map(k => `${k} = ?`).join(", ");
      await pool.query(
        `UPDATE personas SET ${keyPersonas} WHERE persona_id = ?`,
        [...valores, personaId]
      );
      return res.json({ mensaje: "Cliente actualizado exitosamente." });
    } else {
      return res.json({ mensaje: "No se enviaron campos para actualizar." });
    }

  } catch (error) {
    console.error(`Error al actualizar cliente: ${error}`);
    res.status(500).json({ mensaje: "Error al actualizar cliente." });
  }
});


router.delete("/:id", async (req, res) => {
  try {

    const { id } = req.params;

    await pool.query(`UPDATE clientes SET activo=0 WHERE cliente_id=?`, [id]);

    res.json({ mensaje: "Cliente dado de baja exitosamente." });

  } catch (error) {
    console.log(`Error al dar de baja al cliente: ${error}`);
    res.status(500).json({ mensaje: "Error al dar de baja al cliente." });
    
  }

});

export default router;
