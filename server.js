// Requiriendo las dependencias necesarias
var express = require('express');
var cors = require('cors');
var path = require('path');
var mysql = require('mysql2');

// Crear una instancia de la aplicación Express
var app = express();

// Usar CORS para permitir solicitudes desde el puerto 5500 (o el origen de tu frontend)
app.use(cors({
  origin: 'http://127.0.0.1:5500', // Aquí puedes ajustar esto al origen de tu frontend
}));

// Middlewares para la configuración básica de Express
app.use(express.json()); // Para parsear JSON en las solicitudes
app.use(express.urlencoded({ extended: false })); // Para parsear formularios

// Rutas del servidor
app.get('/', (req, res) => {
  res.send('¡Hola desde mi backend en Express!');
});

// Rutas adicionales
app.get('/hola', (req, res) => {
  res.send('!Hola MUNDO Ariel!');
});


//-------------------------------------------------------------------------
// CONSULTAS A MI BASE DE DATOS SQL EN MYSQL SERVER

const db = mysql.createConnection({

  host: 'localhost',
  user: 'root',
  password: 'Patitos.123',
  database: 'todo_list'

})

db.connect((err) => {

  if(err){
    console.error('Error de conexión a la base de datos: ', err);
    return;
  }
  console.log('Conexión a la base de datos establecida');

});

// Ruta para consultar los usuarios desde la base de datos
app.get('/usuarios', (req, res) => {
  // Realiza una consulta SELECT a la base de datos
  
  db.query('SELECT * FROM tarea', (err, results) => {
  if (err) {
    console.error('Error al ejecutar la consulta: ', err);
    res.status(500).send('Error en la consulta');
  return;
  }
  //Enviar los resultados de la consulta como respuesta en formato JSON
  res.json(results);

  });

});

app.post('/agregar', (req, res) => {
  const { nombre, estado } = req.body;
  
  if (!nombre || !estado) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }
  
  const query = 'INSERT INTO tarea (nombre, estado) VALUES (?, ?)';
  db.query(query, [nombre, estado], (err, result) => {
  
    if (err) {
      console.error('Error al insertar la tarea: ', err);
      return res.status(500).json({ error: 'Error al guardar la tarea' });
  }
    res.status(201).json({ id: result.insertId, nombre, estado });
  });
});



app.post('/agregarUsuario', (req, res) => {
  const { usuario, contraseña, correo } = req.body;
  
  // Validar que los campos necesarios estén presentes
  if (!usuario || !contraseña || !correo) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios' });
  }
  
  // Crear la consulta SQL para insertar los datos
  const query = 'INSERT INTO usuario (usuario, contraseña, correo) VALUES (?, ?, ?)';
  
  // Ejecutar la consulta en la base de datos
  db.query(query, [usuario, contraseña, correo], (err, result) => {
    if (err) {
      console.error('Error al insertar el usuario: ', err);
      return res.status(500).json({ error: 'Error al guardar el usuario' });
    }
    
    // Responder con el ID del nuevo usuario insertado
    res.status(201).json({ id: result.insertId, usuario, correo });
  });
});


app.get('/usuariosExistentes', (req, res) => {
  // Realiza una consulta SELECT a la base de datos para obtener los usuarios, incluyendo la contraseña
  db.query('SELECT id, usuario, contraseña, correo FROM usuario', (err, results) => {
    if (err) {
      console.error('Error al ejecutar la consulta: ', err);
      return res.status(500).send('Error en la consulta');
    }
    
    // Enviar los resultados de la consulta como respuesta en formato JSON
    res.json(results);
  });
});




//-------------------------------------------------------------------------


// Configurar el puerto en el que se escucharán las solicitudes
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

module.exports = app;