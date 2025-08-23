import { pool } from "./config/database.js";
import { Router } from "express";

const router = Router();

router.get("/", async (req, res) => {
  try {
    const [rows] = await pool.query(`
        SELECT p.nombre, p.primer_apellido, p.segundo_apellido,
               p.telefono, p.direccion, p.email, p.fecha_registro, p.activo,
               c.cliente_id
        FROM personas p
        INNER JOIN clientes c ON p.persona_id = c.persona_id;
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

router.put("/:id", (req, res) => {});

router.delete("/:id", (req, res) => {
  //Aqui debe ir codigo de BORRAD LOGICO (active=0) de
  //la tabla en la que se esta trabajando, NO HACEMOS BORRADO FISICO
  //OSEA NO USAREMOS EL TIPO DE QUERY "DELETE FROM ...".
});

export default router;
