import http from 'node:http';
import os from 'node:os';
import path from 'node:path';
import fsp from 'node:fs/promises';

import crearReporte from './manejoDelReporte.mjs';

// Creamos una constante con el número de puerto
const PUERTO = 3000;

//Obtengo la fecha actual para pasarla al nombre del archivo
const fechaActual = new Date();
const dia = fechaActual.getDate();
const mes = fechaActual.getMonth() + 1;
const año = fechaActual.getFullYear();

// Creamos en una constate o variable el nombre del directorio
const directorio = 'reportes';

// Creamos también el nombre y extensión del archivo
//const archivo = 'log.txt';
let archivo = `./log-(${dia}-${mes}-${año}).txt`;

const servidor = http.createServer(async (peticion, respuesta) => {
    // La ruta debe ser /log
    if (peticion.url === '/log') {
        // El metodo debe ser post
        if (peticion.method === 'POST') {
            // Creamos reporte
            let reporte;
            try {
                // Debemos pasar el nombre del directorio y del archivo
                // como un objeto:
                reporte = await crearReporte({directorio, archivo});
            } catch (error) {
                console.log(error);
            }
            if (reporte) {
            respuesta.statusCode = 201;
            respuesta.end();
            } else {
                respuesta.statusCode = 500;
                respuesta.end();
            }
        } else {
            // Si el método no es POST, devolvemos un código 404
            respuesta.statusCode = 404;
            respuesta.end();
        }
    } else {
    // Si no está configurada la ruta, devolvemos un código 404
    respuesta.statusCode = 404;
    respuesta.end();
    }
});

servidor.listen(PUERTO);