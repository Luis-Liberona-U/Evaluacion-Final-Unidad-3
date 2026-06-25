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

app.post('/api/guardar', (req, res) => {
    const { cliente, consola, anio, falla } = req.body;

    if (!cliente || !consola || !anio || !falla) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    const query = 'INSERT INTO reporte (cliente, consola, anio, falla) VALUES (?, ?, ?, ?)';
    
    db.query(query, [cliente, consola, anio, falla], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Error al insertar en la base de datos.' });
        }
        res.status(201).json({ success: true });
    });
});

app.get('/api/ultimo', (req, res) => {
    const query = 'SELECT * FROM reporte ORDER BY id DESC LIMIT 1'; // Consulta ultimo registro
    
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al consultar la base de datos.' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'No hay reportes guardados aún.' });
        }
        res.json(results[0]); 
    });
});


app.listen(port, () => {
    console.log(`Servidor ejecutandose en: http://localhost:${port}`);
});