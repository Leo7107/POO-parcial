const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema({
  descripcion: { type: String, trim: true },
  peso: { type: Number, required: true, min: 0 },
  bultos: { type: Number, required: true, min: 1 },
  fecha_entrega: { type: Date }
});

const envioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  direccion: { type: String, required: true, trim: true },
  telefono: { type: String, required: true, trim: true },
  referencia: { type: String, trim: true },
  observacion: { type: String, default: "", trim: true },
  producto: { type: productoSchema, required: true },
  costo: { type: Number, required: true },
  fecha_envio: { type: Date, default: Date.now }
});

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true, unique: true, trim: true },
  creditos: { type: Number, required: true },
  costoPorEnvio: { type: Number, required: true },
  envios: [envioSchema]
});

// MÉTODOS DE CLASE (Encapsulamiento + Abstracción)

usuarioSchema.methods.tieneCreditoSuficiente = function (peso) {
  const multiplicadorPeso = Math.ceil(peso / 3);
  return this.creditos >= multiplicadorPeso;
};

usuarioSchema.methods.registrarEnvio = function (envioData, productoData) {
  const multiplicadorPeso = Math.ceil(productoData.peso / 3);
  const costo = this.costoPorEnvio * multiplicadorPeso;

  // Si no tiene créditos suficientes, no continúa
  if (this.creditos < multiplicadorPeso) {
    throw new Error('Créditos insuficientes');
  }

  // Descuenta crédito
  this.creditos -= multiplicadorPeso;

  // Agrega el envío
  this.envios.push({
    ...envioData,
    producto: productoData,
    costo
  });
};

usuarioSchema.methods.eliminarEnvio = function (envioId) {
  const envio = this.envios.id(envioId);
  if (!envio) throw new Error('Envío no encontrado');

  const multiplicadorPeso = Math.ceil(envio.producto.peso / 3);
  this.creditos += multiplicadorPeso;

  this.envios.pull({_id: envioId}); // lo elimina del arreglo de envíos
};

module.exports = mongoose.model('Usuario', usuarioSchema);

