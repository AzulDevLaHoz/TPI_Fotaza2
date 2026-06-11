import 'dotenv/config';
import bcrypt from 'bcrypt';
import sequelize from './models/config/config.js';
import './models/sync/sync.js';
import { User } from './models/sync/sync.js';

async function seed() {
    try {
        await sequelize.authenticate();

        const usuario = {
            username: 'DocenteTop',
            email: 'docente@fotaza.com',
            password: await bcrypt.hash('user123', 10),
            firstname: 'Docente',
            lastname: 'Web',
            rol: 'usuario'
        };

        const [user, created] = await User.findOrCreate({
            where: { email: usuario.email },
            defaults: usuario
        });

        if (created) {
            console.log(`Usuario creado: ${usuario.email}`);
        } else {
            console.log(`Ya existe: ${usuario.email}`);
        }

        console.log('Seed completado.');
        process.exit(0);
    } catch (error) {
        console.error('Error en seed:', error.message);
        process.exit(1);
    }
}

seed();