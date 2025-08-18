import {pool} from '../db.js';

export const getClientes= async (req,res)=>{
    const [rows]=await pool.query(`SELECT p.nombre, p.primer_apellido,p.segundo_apellido
        ,p.telefono,p.direccion,p.email,p.fecha_registro,p.activo,c.cliente_id
        FROM personas p INNER JOIN clientes c ON p.persona_id = c.persona_id;`);
    res.json(rows);
    

}