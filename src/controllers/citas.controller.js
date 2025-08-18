import {pool} from '../db.js';

export const getCitasPendientes= async (req,res)=>{
    const [rows]=await pool.query(`SELECT citas.*, m.nombre AS mascota, p.nombre AS cliente
     FROM citas
     INNER JOIN mascotas m ON citas.mascota_id = m.mascota_id
     INNER JOIN clientes c ON m.cliente_id = c.cliente_id
     INNER JOIN personas p ON c.persona_id = p.persona_id
     WHERE citas.estado = 'Pendiente'`);
    res.json(rows);
    

}