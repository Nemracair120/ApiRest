// Importar el módulo express para crear el servidor
const express = require('express');
const app = express();

// Middleware para permitir que el servidor interprete solicitudes con cuerpo JSON
app.use(express.json());

// Definir el puerto donde correrá el servidor
const PORT = process.env.PORT || 8080;

// Estructura inicial de datos: Array de concesionarios
let concesionarios = [
  {
    id: 1, // ID único del concesionario
    nombre: "Concesionario A", // Nombre del concesionario
    direccion: "Calle Trigal 10", // Dirección del concesionario
    coches: [ // Lista de coches disponibles en el concesionario
      { id: 1, modelo: "Renault Clio", cv: 75, precio: 9000 }, // Coche con ID único, modelo, potencia (CV) y precio
      { id: 2, modelo: "Nissan Skyline R34", cv: 280, precio: 40000 },
    ],
  },
  {
    id: 2,
    nombre: "Concesionario B",
    direccion: "Avenida de la Libertad 5",
    coches: [
      { id: 1, modelo: "Ford Fiesta", cv: 90, precio: 10000 },
      { id: 2, modelo: "Toyota Corolla", cv: 130, precio: 12000 },
    ],
  },
];

// Iniciar el servidor y escuchar en el puerto definido
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Endpoint para obtener todos los concesionarios
app.get('/concesionarios', (req, res) => {
  res.json(concesionarios); // Responder con el array completo de concesionarios en formato JSON
});

// Endpoint para crear un nuevo concesionario
app.post('/concesionarios', (req, res) => {
  const { nombre, direccion } = req.body; // Extraer datos del cuerpo de la solicitud
  const nuevoConcesionario = {
    id: concesionarios.length + 1, // Generar un ID único basado en el tamaño del array
    nombre,
    direccion,
    coches: [] // Iniciar la lista de coches vacía
  };
  concesionarios.push(nuevoConcesionario); // Añadir el nuevo concesionario al array
  res.status(201).json(nuevoConcesionario); // Responder con el objeto creado y un código HTTP 201 (Creado)
});

// Endpoint para obtener un concesionario por su ID
app.get('/concesionarios/:id', (req, res) => {
  const { id } = req.params; // Extraer el ID de los parámetros de la URL
  const concesionario = concesionarios.find(c => c.id === parseInt(id)); // Buscar el concesionario con el ID indicado
  if (!concesionario) { // Si no existe, devolver un error 404
    return res.status(404).json({ error: 'Concesionario no encontrado' });
  }
  res.json(concesionario); // Responder con los datos del concesionario
});

// Endpoint para actualizar un concesionario por su ID
app.put('/concesionarios/:id', (req, res) => {
  const { id } = req.params; // Extraer el ID de los parámetros de la URL
  const { nombre, direccion } = req.body; // Extraer los nuevos datos del cuerpo de la solicitud
  let concesionario = concesionarios.find(c => c.id === parseInt(id)); // Buscar el concesionario
  if (!concesionario) { // Si no se encuentra, devolver un error 404
    return res.status(404).json({ error: 'Concesionario no encontrado' });
  }
  // Actualizar los datos solo si se proporcionan en la solicitud
  concesionario.nombre = nombre || concesionario.nombre;
  concesionario.direccion = direccion || concesionario.direccion;
  res.json(concesionario); // Responder con los datos actualizados
});

// Endpoint para eliminar un concesionario por su ID
app.delete('/concesionarios/:id', (req, res) => {
  const { id } = req.params; // Extraer el ID de los parámetros de la URL
  const index = concesionarios.findIndex(c => c.id === parseInt(id)); // Buscar el índice del concesionario
  if (index === -1) { // Si no se encuentra, devolver un error 404
    return res.status(404).json({ error: 'Concesionario no encontrado' });
  }
  concesionarios.splice(index, 1); // Eliminar el concesionario del array
  res.status(204).send(); // Responder con un código HTTP 204 (Sin contenido)
});

// Endpoint para obtener todos los coches de un concesionario por su ID
app.get('/concesionarios/:id/coches', (req, res) => {
  const { id } = req.params; // Extraer el ID del concesionario
  const concesionario = concesionarios.find(c => c.id === parseInt(id)); // Buscar el concesionario
  if (!concesionario) { // Si no se encuentra, devolver un error 404
    return res.status(404).json({ error: 'Concesionario no encontrado' });
  }
  res.json(concesionario.coches); // Responder con la lista de coches del concesionario
});

// Endpoint para añadir un coche a un concesionario
app.post('/concesionarios/:id/coches', (req, res) => {
  const { id } = req.params; // Extraer el ID del concesionario
  const { modelo, cv, precio } = req.body; // Extraer los datos del coche del cuerpo de la solicitud
  const concesionario = concesionarios.find(c => c.id === parseInt(id)); // Buscar el concesionario
  if (!concesionario) { // Si no se encuentra, devolver un error 404
    return res.status(404).json({ error: 'Concesionario no encontrado' });
  }
  // Crear un nuevo coche con un ID único
  const nuevoCoche = { id: concesionario.coches.length + 1, modelo, cv, precio };
  concesionario.coches.push(nuevoCoche); // Añadir el coche al array de coches del concesionario
  res.status(201).json(nuevoCoche); // Responder con el coche creado y un código HTTP 201
});

// Endpoint para obtener un coche específico de un concesionario
app.get('/concesionarios/:id/coches/:cocheId', (req, res) => {
  const { id, cocheId } = req.params; // Extraer el ID del concesionario y del coche
  const concesionario = concesionarios.find(c => c.id === parseInt(id)); // Buscar el concesionario
  if (!concesionario) {
    return res.status(404).json({ error: 'Concesionario no encontrado' });
  }
  const coche = concesionario.coches.find(c => c.id === parseInt(cocheId)); // Buscar el coche
  if (!coche) {
    return res.status(404).json({ error: 'Coche no encontrado' });
  }
  res.json(coche); // Responder con los datos del coche
});

// Endpoint para actualizar un coche específico
app.put('/concesionarios/:id/coches/:cocheId', (req, res) => {
  const { id, cocheId } = req.params; // Extraer los IDs
  const { modelo, cv, precio } = req.body; // Extraer los datos actualizados
  const concesionario = concesionarios.find(c => c.id === parseInt(id)); // Buscar el concesionario
  if (!concesionario) {
    return res.status(404).json({ error: 'Concesionario no encontrado' });
  }
  const coche = concesionario.coches.find(c => c.id === parseInt(cocheId)); // Buscar el coche
  if (!coche) {
    return res.status(404).json({ error: 'Coche no encontrado' });
  }
  // Actualizar solo los campos proporcionados
  coche.modelo = modelo || coche.modelo;
  coche.cv = cv || coche.cv;
  coche.precio = precio || coche.precio;
  res.json(coche); // Responder con los datos del coche actualizado
});

// Endpoint para eliminar un coche específico
app.delete('/concesionarios/:id/coches/:cocheId', (req, res) => {
  const { id, cocheId } = req.params; // Extraer los IDs
  const concesionario = concesionarios.find(c => c.id === parseInt(id)); // Buscar el concesionario
  if (!concesionario) {
    return res.status(404).json({ error: 'Concesionario no encontrado' });
  }
  const index = concesionario.coches.findIndex(c => c.id === parseInt(cocheId)); // Buscar el índice del coche
  if (index === -1) {
    return res.status(404).json({ error: 'Coche no encontrado' });
  }
  concesionario.coches.splice(index, 1); // Eliminar el coche del array
  res.status(204).send(); // Responder con un código HTTP 204
});
