const express = require('express');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 8000;

app.use(express.json());

app.use(express.static(path.join(__dirname, 'public')));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'St123', 
    database: 'reporte_consola' 
});

db.connect(err => {
    if (err) {
        console.error('Error al conectar con la base de datos (MySQL):', err);
        return;
    }
    console.log('Conectado exitosamente a la base de datos');
});



app.listen(port, () => {
    console.log(`Servidor ejecutandose en: http://localhost:${port}`);
});