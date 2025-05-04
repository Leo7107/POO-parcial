const express = require('express');
const app = express();
const dotenv = require('dotenv');
const mongoose = require('mongoose');
require('./services/database'); // Importa y ejecuta la conexión desde la clase Database

// Cargar variables de entorno
dotenv.config();
app.use(express.json());

// Modelos
const Usuario = require('./models/usuario'); // Aquí estás usando el modelo único que agrupa Usuario, Envío y Producto

//Verificar crédito disponible del usuario (GET)
app.get('/credito/:id', async (req, res) => {
  const usuario = await Usuario.findById(req.params.id);
  if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

  res.json({
    nombre: usuario.nombre,
    creditosDisponibles: usuario.creditos,
    tipoPlan: usuario.plan
  });
});

//Agregar envío y producto (POST)
app.post('/envio/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const {
      nombre, direccion, telefono, referencia, observacion,
      descripcion, peso, bultos, fecha_entrega
    } = req.body;

    // Calcular costo por peso
    const pesoExtra = Math.ceil(peso / 3);
    let costoEnvio = usuario.costoPorEnvio * pesoExtra;

    if (usuario.creditos <= 0) return res.status(400).json({ mensaje: 'Créditos insuficientes' });

    // Restar crédito
    usuario.creditos -= pesoExtra;

    // Agregar envío y producto
    usuario.envios.push({
      nombre, direccion, telefono, referencia, observacion,
      producto: { descripcion, peso, bultos, fecha_entrega }
    });

    await usuario.save();

    res.json({ mensaje: 'Envío registrado correctamente', costoEnvio });
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el envío' });
  }
});

//Ver todos los envíos del usuario (GET)
app.get('/envios/:id', async (req, res) => {
  const usuario = await Usuario.findById(req.params.id);
  if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

  res.json({ envios: usuario.envios });
});

//Eliminar envío y devolver crédito (DELETE)
app.delete('/envio/:userId/:envioId', async (req, res) => {
  const { userId, envioId } = req.params;
  const usuario = await Usuario.findById(userId);
  if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

  const envio = usuario.envios.id(envioId);
  if (!envio) return res.status(404).json({ mensaje: 'Envío no encontrado' });

  const peso = envio.producto.peso;
  const pesoExtra = Math.ceil(peso / 3);
  usuario.creditos += pesoExtra;

  envio.remove();
  await usuario.save();

  res.json({ mensaje: 'Envío eliminado y crédito devuelto' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});
