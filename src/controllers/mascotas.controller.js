import {pool} from '../db.js';

export const getMascotas=async (req,res)=>{

    const [rows]=await pool.query(`SELECT m.mascota_id, m.nombre AS mascota_nombre, m.especie, m.raza,
            c.cliente_id, p.nombre AS cliente_nombre
     FROM mascotas m
     INNER JOIN clientes c ON m.cliente_id = c.cliente_id
     INNER JOIN personas p ON c.persona_id = p.persona_id`);
    res.json(rows);    
}