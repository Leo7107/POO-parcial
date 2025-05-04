const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const Usuario = require('./models/usuario');
require('./services/database');

const app = express();
dotenv.config();
app.use(express.json());

// Crear usuario con asignación de créditos según plan
app.post('/crear-usuario', async (req, res) => {
  try {
    const { nombre, plan } = req.body;
    let creditos, costoPorEnvio;

    if (plan === 1) {
      creditos = 30;
      costoPorEnvio = 135 / 30;
    } else if (plan === 2) {
      creditos = 40;
      costoPorEnvio = 160 / 40;
    } else if (plan === 3) {
      creditos = 60;
      costoPorEnvio = 180 / 60;
    } else {
      return res.status(400).json({ mensaje: 'Plan inválido. Usa 1, 2 o 3.' });
    }

    const usuario = new Usuario({ nombre, creditos, costoPorEnvio });
    await usuario.save();
    res.status(201).json({ mensaje: 'Usuario creado correctamente', usuario });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear usuario', detalles: error.message });
  }
});

// Ver créditos de un usuario
app.get('/credito/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    res.json({
      nombre: usuario.nombre,
      creditosDisponibles: usuario.creditos,
      costoPorEnvio: usuario.costoPorEnvio
    });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener créditos', detalles: error.message });
  }
});

// Registrar un nuevo envío
app.post('/envio/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    const {
      nombre, direccion, telefono, referencia, observacion,
      descripcion, peso, bultos, fecha_entrega
    } = req.body;

    const envioData = { nombre, direccion, telefono, referencia, observacion };
    const productoData = { descripcion, peso, bultos, fecha_entrega };

    // Usamos método encapsulado
    usuario.registrarEnvio(envioData, productoData);

    await usuario.save();
    res.json({ mensaje: 'Envío registrado correctamente' });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al registrar el envío', detalles: error.message });
  }
});

// Consultar todos los envíos de un usuario
app.get('/envios/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    res.json({ envios: usuario.envios });
  } catch (error) {
    res.status(500).json({ mensaje: 'Error al obtener envíos', detalles: error.message });
  }
});

// Eliminar envío y devolver créditos
app.delete('/envio/:userId/:envioId', async (req, res) => {
  try {
    const { userId, envioId } = req.params;
    const usuario = await Usuario.findById(userId);
    if (!usuario) return res.status(404).json({ mensaje: 'Usuario no encontrado' });

    // Usamos método encapsulado
    usuario.eliminarEnvio(envioId);

    await usuario.save();
    res.json({ mensaje: 'Envío eliminado y créditos devueltos' });
  } catch (error) {
    res.status(400).json({ mensaje: 'Error al eliminar envío', detalles: error.message });
  }
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

