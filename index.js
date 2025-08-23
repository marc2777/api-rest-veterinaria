import express from "express";
import clientes from "./src/clientes.js";
import empleados from "./src/empleados.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/clientes", clientes);
app.use("/empleados", empleados);

app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}...`);
});
