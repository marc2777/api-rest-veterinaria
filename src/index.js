import express from 'express'
import empleadosRoutes from './routes/empleados.route.js';
import clientesRoutes from './routes/clientes.route.js';
import mascotasRoutes from './routes/mascotas.route.js';
import tratamientosRoutes from './routes/tratamientos.routes.js';

const app = express();
const PORT = 3000;

app.use(express.json());

app.use('/api', empleadosRoutes);
app.use('/api', clientesRoutes);
app.use('/api', mascotasRoutes);  
app.use('/api', tratamientosRoutes);

app.listen(PORT, () => {
    console.log(`Servidor iniciado en puerto ${PORT}`);
});
