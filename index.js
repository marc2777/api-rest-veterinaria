import express from "express";
import clientes from "./src/clientes.js";
import empleados from "./src/empleados.js";
import tratamientos from "./src/tratamientos.js";
import consultas from "./src/consultas.js";
import consulta_tratamientos from "./src/consulta_tratamientos.js";

const app = express();
const PORT = 3000;

app.use(express.json());

app.use("/clientes", clientes);
app.use("/empleados", empleados);
app.use('/tratamientos',tratamientos);
app.use('/consultas',consultas);
app.use('/consulta_tratamiento',consulta_tratamientos); 

app.listen(PORT, () => {
  console.log(`Servidor iniciado en puerto ${PORT}...`);
});

