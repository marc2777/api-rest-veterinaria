const express = require('express');
const mysql = require('mysql2');
const app = express();
const puerto = 3000;

app.use(express.json());

// Conexión a MySQL
const conexion = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'mipmopmap26PanQ',
  database: 'veterinaria'
});

conexion.connect(err => {
  if (err) throw err;
  console.log('Conexión exitosa a la base de datos veterinaria');
});

// ======================
// ENDPOINTS GET
// ======================

//  Persona
app.get("/personas", (req, res) => {
  const sql = "SELECT * FROM personas";
  conexion.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

//  Clientes
app.get("/clientes", (req, res) => {
  const sql = `
    SELECT c.*, p.nombre, p.primer_apellido, p.segundo_apellido
    FROM clientes c
    LEFT JOIN personas p ON c.persona_id = p.persona_id
  `;
  conexion.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// Cargos
app.get("/cargos", (req, res) => {
  const sql = "SELECT * FROM cargos";
  conexion.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

//  Empleados
app.get("/empleados", (req, res) => {
  const sql = `
    SELECT e.*, p.nombre, p.primer_apellido, c.nombre AS cargo
    FROM empleados e
    LEFT JOIN personas p ON e.persona_id = p.persona_id
    LEFT JOIN cargos c ON e.cargo_id = c.cargo_id
  `;
  conexion.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

//  Mascotas
app.get("/mascotas", (req, res) => {
  const sql = `
    SELECT m.*, p.nombre AS nombre_cliente, p.primer_apellido AS apellido_cliente
    FROM mascotas m
    LEFT JOIN clientes c ON m.cliente_id = c.cliente_id
    LEFT JOIN personas p ON c.persona_id = p.persona_id
  `;
  conexion.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

//  Tratamientos
app.get("/tratamientos", (req, res) => {
  const sql = "SELECT tratamiento_id, cantidad, precio FROM consulta_tratamientos";
  conexion.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// 7️⃣ Citas
app.get("/citas", (req, res) => {
  const sql = `
    SELECT ci.*, m.nombre AS mascota, mp.nombre AS cliente_mascota, ep.nombre AS empleado
    FROM citas ci
    LEFT JOIN mascotas m ON ci.mascota_id = m.mascota_id
    LEFT JOIN clientes mc ON m.cliente_id = mc.cliente_id
    LEFT JOIN personas mp ON mc.persona_id = mp.persona_id
    LEFT JOIN empleados e ON ci.empleado_id = e.empleado_id
    LEFT JOIN personas ep ON e.persona_id = ep.persona_id
  `;
  conexion.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

//  Consultas
app.get("/consultas", (req, res) => {
  const sql = `
    SELECT co.*, ci.fecha, ci.hora, m.nombre AS mascota
    FROM consultas co
    LEFT JOIN citas ci ON co.cita_id = ci.cita_id
    LEFT JOIN mascotas m ON ci.mascota_id = m.mascota_id
  `;
  conexion.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

//  Consulta_Tratamientos
app.get("/consulta_tratamientos", (req, res) => {
  const sql = `
    SELECT ct.*, t.nombre AS tratamiento
    FROM consulta_tratamientos ct
    LEFT JOIN tratamientos t ON ct.tratamiento_id = t.tratamiento_id
  `;
  conexion.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// 🔟 Roles
app.get("/roles", (req, res) => {
  const sql = "SELECT * FROM roles";
  conexion.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// 1️⃣1️⃣ Usuarios
app.get("/usuarios", (req, res) => {
  const sql = `
    SELECT u.*, p.nombre AS empleado, p.primer_apellido AS apellido_empleado
    FROM usuarios u
    LEFT JOIN empleados e ON u.empleado_id = e.empleado_id
    LEFT JOIN personas p ON e.persona_id = p.persona_id
  `;
  conexion.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// 1️⃣2️⃣ Usuario_Rol
app.get("/usuario_rol", (req, res) => {
  const sql = `
    SELECT ur.*, u.username, r.nombre AS rol
    FROM usuario_rol ur
    LEFT JOIN usuarios u ON ur.usuario_id = u.usuario_id
    LEFT JOIN roles r ON ur.rol_id = r.rol_id
  `;
  conexion.query(sql, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(result);
  });
});

// Levantar servidor
app.listen(puerto, () => {
  console.log(`Servidor levantado en http://localhost:${puerto}`);
});
