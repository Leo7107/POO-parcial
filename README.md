# Proyecto POSTMAIL - API para Gestión de Envíos

Este proyecto consiste en una API para la gestión de envíos de la empresa POSTMAIL, que permite a los usuarios registrar sus envíos, verificar créditos disponibles y gestionar productos a enviar. Utiliza MongoDB como base de datos y Express.js para crear el servidor y manejar las rutas.

## Endpoints de la API

### 1. Crear un usuario con créditos según el plan
- **Método:** `POST`  
- **Ruta:** `/crear-usuario`  
- **Descripción:** Crea un nuevo usuario asignándole créditos según el plan que elija.  
  **Planes disponibles:**
  - Plan 1: 30 envíos por $135
  - Plan 2: 40 envíos por $160
  - Plan 3: 60 envíos por $180

**Ejemplo de cuerpo (JSON):**
```json
{
  "nombre": "Juan Pérez",
  "plan": 1
}
```

**Respuesta esperada:**
```json
{
  "mensaje": "Usuario creado correctamente",
  "usuario": {
    "nombre": "Juan Pérez",
    "creditos": 30,
    "costoPorEnvio": 4.5
  }
}
```

---

### 2. Ver créditos de un usuario
- **Método:** `GET`  
- **Ruta:** `/credito/:id`  
- **Descripción:** Verifica los créditos disponibles del usuario.

**Respuesta esperada:**
```json
{
  "nombre": "Juan Pérez",
  "creditosDisponibles": 30,
  "costoPorEnvio": 4.5
}
```

---

### 3. Registrar un nuevo envío
- **Método:** `POST`  
- **Ruta:** `/envio/:id`  
- **Descripción:** Registra un nuevo envío para un usuario, asignando el producto y los detalles del envío.

**Ejemplo de cuerpo (JSON):**
```json
{
  "nombre": "Juan Pérez",
  "direccion": "Calle Falsa 123",
  "telefono": "123456789",
  "referencia": "Ref123",
  "observacion": "Entregar de lunes a viernes",
  "descripcion": "Paquete con documentos",
  "peso": 2,
  "bultos": 1,
  "fecha_entrega": "2025-05-10T10:00:00Z"
}
```

**Respuesta esperada:**
```json
{
  "mensaje": "Envío registrado correctamente"
}
```

---

### 4. Consultar todos los envíos de un usuario
- **Método:** `GET`  
- **Ruta:** `/envios/:id`  
- **Descripción:** Consulta todos los envíos registrados de un usuario.

**Respuesta esperada:**
```json
{
  "envios": [
    {
      "nombre": "Juan Pérez",
      "direccion": "Calle Falsa 123",
      "telefono": "123456789",
      "referencia": "Ref123",
      "observacion": "Entregar de lunes a viernes",
      "producto": {
        "descripcion": "Paquete con documentos",
        "peso": 2,
        "bultos": 1,
        "fecha_entrega": "2025-05-10T10:00:00Z"
      },
      "costo": 4.5,
      "fecha_envio": "2025-05-01T10:00:00Z"
    }
  ]
}
```

---

### 5. Eliminar un envío y devolver créditos
- **Método:** `DELETE`  
- **Ruta:** `/envio/:userId/:envioId`  
- **Descripción:** Elimina un envío registrado y devuelve los créditos al usuario.

**Respuesta esperada:**
```json
{
  "mensaje": "Envío eliminado y créditos devueltos"
}
```

---

## ¿Cómo ejecutar el proyecto?

1. Clona este repositorio:
```bash
git clone https://github.com/Leo7107/POO-parcial.git
```

2. Instala las dependencias:
```bash
npm install
```

3. Configura las variables de entorno:
Crea un archivo `.env` en la raíz del proyecto y agrega tus credenciales de MongoDB y otras configuraciones necesarias.

4. Ejecuta el servidor:
```bash
npm start
```

5. Prueba la API:
Puedes usar herramientas como Postman o Insomnia para hacer pruebas con los endpoints descritos arriba.

---

## Tecnologías utilizadas

- Node.js  
- Express.js  
- MongoDB  
- Mongoose  

---

## Autor

**Eduardo Leopoldo Hernández López**
