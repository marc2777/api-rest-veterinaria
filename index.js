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


function formatPlain(result) {
  return result.map(row => {
    return Object.entries(row)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
  }).join('\n\n'); 
}

// ======================
// ENDPOINTS GET
// ======================

// 1️⃣ Personas
app.get("/personas", (req, res) => {
  const sql = "SELECT * FROM personas";
  conexion.query(sql, (err, result) => {
    if (err) return res.status(500).send(err.message);
    res.type('text/plain').send(formatPlain(result));
  });
});

// 2️⃣ Clientes
app.get("/clientes", (req, res) => {
  const sql = `
    SELECT c.*, p.nombre, p.primer_apellido, p.segundo_apellido
    FROM clientes c
    LEFT JOIN personas p ON c.persona_id = p.persona_id
  `;
  conexion.query(sql, (err, result) => {
    if (err) return res.status(500).send(err.message);
    res.type('text/plain').send(formatPlain(result));
  });
});

// 3️⃣ Cargos
app.get("/cargos", (req, res) => {
  const sql = "SELECT * FROM cargos";
  conexion.query(sql, (err, result) => {
    if (err) return res.status(500).send(err.message);
    res.type('text/plain').send(formatPlain(result));
  });
});

// 4️⃣ Empleados
app.get("/empleados", (req, res) => {
  const sql = `
    SELECT e.*, p.nombre, p.primer_apellido, c.nombre AS cargo
    FROM empleados e
    LEFT JOIN personas p ON e.persona_id = p.persona_id
    LEFT JOIN cargos c ON e.cargo_id = c.cargo_id
  `;
  conexion.query(sql, (err, result) => {
    if (err) return res.status(500).send(err.message);
    res.type('text/plain').send(formatPlain(result));
  });
});

// 5️⃣ Mascotas
app.get("/mascotas", (req, res) => {
  const sql = `
    SELECT m.*, c.nombre AS nombre_cliente
    FROM mascotas m
    LEFT JOIN clientes c ON m.cliente_id = c.cliente_id
  `;
  conexion.query(sql, (err, result) => {
    if (err) return res.status(500).send(err.message);
    res.type('text/plain').send(formatPlain(result));
  });
});

// 6️⃣ Tratamientos
app.get("/tratamientos", (req, res) => {
  const sql = "SELECT * FROM tratamientos";
  conexion.query(sql, (err, result) => {
    if (err) return res.status(500).send(err.message);
    res.type('text/plain').send(formatPlain(result));
  });
});

// 7️⃣ Citas
app.get("/citas", (req, res) => {
  const sql = `
    SELECT ci.*, m.nombre AS mascota, e.nombre AS empleado
    FROM citas ci
    LEFT JOIN mascotas m ON ci.mascota_id = m.mascota_id
    LEFT JOIN empleados e ON ci.empleado_id = e.empleado_id
  `;
  conexion.query(sql, (err, result) => {
    if (err) return res.status(500).send(err.message);
    res.type('text/plain').send(formatPlain(result));
  });
});

// 8️⃣ Consultas
app.get("/consultas", (req, res) => {
  const sql = `
    SELECT co.*, ci.fecha, ci.hora, m.nombre AS mascota
    FROM consultas co
    LEFT JOIN citas ci ON co.cita_id = ci.cita_id
    LEFT JOIN mascotas m ON ci.mascota_id = m.mascota_id
  `;
  conexion.query(sql, (err, result) => {
    if (err) return res.status(500).send(err.message);
    res.type('text/plain').send(formatPlain(result));
  });
});

// 9️⃣ Consulta_Tratamientos
app.get("/consulta_tratamientos", (req, res) => {
  const sql = `
    SELECT ct.*, t.nombre AS tratamiento
    FROM consulta_tratamientos ct
    LEFT JOIN tratamientos t ON ct.tratamiento_id = t.tratamiento_id
  `;
  conexion.query(sql, (err, result) => {
    if (err) return res.status(500).send(err.message);
    res.type('text/plain').send(formatPlain(result));
  });
});

// 🔟 Roles
app.get("/roles", (req, res) => {
  const sql = "SELECT * FROM roles";
  conexion.query(sql, (err, result) => {
    if (err) return res.status(500).send(err.message);
    res.type('text/plain').send(formatPlain(result));
  });
});

// 1️⃣1️⃣ Usuarios
app.get("/usuarios", (req, res) => {
  const sql = `
    SELECT u.*, e.nombre AS empleado
    FROM usuarios u
    LEFT JOIN empleados e ON u.empleado_id = e.empleado_id
  `;
  conexion.query(sql, (err, result) => {
    if (err) return res.status(500).send(err.message);
    res.type('text/plain').send(formatPlain(result));
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
    if (err) return res.status(500).send(err.message);
    res.type('text/plain').send(formatPlain(result));
  });
});

// Levantar servidor
app.listen(puerto, () => {
  console.log(`Servidor levantado en http://localhost:${puerto}`);
});
