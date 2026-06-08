import 'dotenv/config';
import sequelize from './models/config/config.js';
import './models/sync/sync.js';
import { exit } from 'node:process'

async function initDb() {
    try {
        await sequelize.authenticate();
        console.log('Conexión a la DB realizada con exito!!');

        console.log('Eliminamos tablas cargadas...');
        await sequelize.sync({ force: true });

        console.log('Base de datos inicializada desde cero con exito!!');
        process.exit(0);
    } catch (error) {
        console.error('Error al inicializar la BD:', error.message);
        process.exit(1);
    }
}
initDb();