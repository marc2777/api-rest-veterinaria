import {pool} from '../db.js';

export const getEmpleados=async (req,res)=>{

    const [rows]=await pool.query(`SELECT p.nombre, p.primer_apellido,p.segundo_apellido
        ,p.telefono,p.direccion,p.email,p.fecha_registro,p.activo,e.empleado_id,c.nombre AS cargo
        FROM personas p INNER JOIN empleados e ON p.persona_id = e.persona_id
        LEFT JOIN cargos c ON e.cargo_id=c.cargo_id; `);
    res.json(rows);    
}



