// /models/usuario.js
const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  descripcion: String,
  peso: Number,
  bultos: Number,
  fecha_entrega: Date
});

const envioSchema = new mongoose.Schema({
  direccion: String,
  telefono: String,
  referencia: String,
  observacion: String,
  producto: productoSchema,
  costo: Number,
  fecha_envio: { type: Date, default: Date.now }
});

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true },
  credito: { type: Number, required: true },  // Monto en dólares
  envios: [envioSchema]
});

module.exports = mongoose.model('Usuario', usuarioSchema);

