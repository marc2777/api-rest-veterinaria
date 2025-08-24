import express from "express";
import clientes from "./src/clientes.js";
import empleados from "./src/empleados.js";
import usuarios from "./src/usuarios.js";
import roles from "./src/roles.js";
import usuarioRoles from "./src/usuario_roles.js";


const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/clientes", clientes);
app.use("/empleados", empleados);
app.use("/usuarios", usuarios);
app.use("/roles", roles);
app.use("/usuario_roles", usuarioRoles);


app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}...`);
});
