import 'dotenv/config';
import sequelize from './models/config/config.js';
import './models/sync/sync.js';

async function dbInit() {
    try {
        console.log('Conectando a la base de datos...');
        await sequelize.authenticate();
        console.log('Conexión exitosa');

        console.log('Limpiando base de datos...');
        await sequelize.sync({ force: true });

        console.log('Base de datos inicializada con exito!');
        console.log('Estructura creada desde cero. No hay datos cargados.');
        process.exit(0);
    } catch (error) {
        console.error('Error al inicializar la BD:', error.message);
        process.exit(1);
    }
}

dbInit();