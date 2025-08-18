import express from 'express'
import empleadosRoutes from './routes/empleados.route.js';
import clientesRoutes from './routes/clientes.route.js';

const app =express();
const PORT=3000;
app.use(express.json());
app.get('/',(req,res)=>{
    res.send("Bienvenido al servidor de la VETERINARIA");
})
app.use('/api',empleadosRoutes);
app.use('/api',clientesRoutes);

app.listen(PORT,()=>{
    console.log(`Servidor iniciado en puerto ${PORT}`);
})