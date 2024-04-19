import os from 'node:os';
import path from 'node:path';
import fsp from 'node:fs/promises';

// Se encarga de crear el directorio donde se almacena el reporte
const crearDirectorio = (datos) => {
    return new Promise(async (resolver, rechazar) => {
    // Probamos crear el directorio
        try {
            await fsp.mkdir(datos.nombre);
            resolver();
        } catch (error) {
            rechazar (error);
        }
    });
};

// Se encarga de crear y abrir el archivo donde se escribirán los datos
const abrirArchivo = (datos) => {
    return new Promise (async (resolver, rechazar) => {
        // Probamos abrir el archivo
        let manejador;
        try {
            manejador = await fsp.open(datos.ruta, 'a');
            resolver(manejador);
        } catch (error) {
            // Si hubo error cerramos el archivo
            manejador.close();
            // resolvemos, de lo contrario no podemos avanzar
            rechazar(error);
        }
    });
};

// Se encarga de apuntar los datos en el archivo abierto
const escribirReporte = ( datos ) => {
    return new Promise (async(resolver, rechazar) => {
        // Probamos escribir el archivo
        try {
            // Escribimos datos
            const escritura = await datos.manejador.write(datos.contenido);
            // Cerramos el manejador del archivo abierto
            datos.manejador.close();
            resolver(escritura);
        } catch (error) {
            rechazar(error);
        }
    });
};

// Función principal
const crearReporte = (datos) => {
    return new Promise (async (resolver, rechazar) => {
        // Intentamos crear el directorio
        try {
        await crearDirectorio({ nombre: datos.directorio });
        } catch (error) {
        console.log ('El directorio ya existe');
            }
        // Creamos la ruta
        const ruta = path.join(datos.directorio, datos.archivo);
        // Abrimos el archivo para apuntar
        // Si no existe el recurso, se crea
        let manejador;
        try {
            manejador = await abrirArchivo({ ruta });
        } catch ( error ) {
        rechazar (error);
        }
        // Obtenemos datos del estado del servidor
        const fechaActual = new Date(Date.now());
        const inicioActividad = new Date(Date.now() - os.uptime() * 1000);
   
        // Obtenemos y formateamos los datos
        const cpus = JSON.stringify(os.cpus());
        const memoriaTotal = os.totalmem() / 1024 / 1024;
        const memoriaLibre = os.freemem() / 1024 / 1024;
        const memoriaEnUso = memoriaTotal - memoriaLibre;
        const interfacesDeRed = JSON.stringify(os.networkInterfaces());
        // Variable que almacenará los datos del servidor
        let contenidoLog = '';
        contenidoLog += `---------------------------------`;
        contenidoLog += os.EOL;
        contenidoLog += `Fecha: ${fechaActual} `;
        contenidoLog += os.EOL;
        contenidoLog += `Inicio de actividad: ${inicioActividad} `;
        contenidoLog += os.EOL;
        contenidoLog += `Tiempo de actividad: ${os.uptime()} segundos`;
        contenidoLog += os.EOL;
        contenidoLog += `Estado de los CPU: ${os.EOL}${cpus} `;
        contenidoLog += os.EOL;
        contenidoLog += `Memoria RAM total: ${memoriaTotal} Mb`;
        contenidoLog += os.EOL;
        contenidoLog += `Memoria RAM utilizada: ${memoriaEnUso} Mb`;
        contenidoLog += os.EOL;
        contenidoLog += `Interfaces de red: ${os.EOL}${interfacesDeRed} `;
        contenidoLog += os.EOL;

        // Escribimos los datos
        let escritura ;
        try {
            escritura = await escribirReporte({
            manejador ,
            contenido: contenidoLog,
            });
            resolver(escritura);
        } catch (error) {
            rechazar(error);
        }
    });
};

// Exportamos la función principal
export default crearReporte ;