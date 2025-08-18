import {createPool} from 'mysql2/promise'

export const pool=createPool({
    host:"localhost",
    user:"root",
    password:"mipmopmap26PanQ",
    port:3306,
    database:"VeterinariaZoosfera"
})