import sequelize from "./models/config/config.js";
import "./models/sync/sync.js";

async function connectDataBase() {
    try {

        // Probar la conexion
        await sequelize.authenticate();
        console.log("Conexión a la base de datos exitosa");

        // Crear tablas y relaciones
        await sequelize.sync({ alter: true });

        console.log("Modelos sincronizados");

    } catch (error) {
        console.error("Error:", error);
    }
}

connectDataBase();