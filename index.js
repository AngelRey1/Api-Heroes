const express = require('express');
const app = express();
app.use(express.json());

// Muestra algo en el navegador
app.get('/', (req, res) => {
  res.send(`
    <h1>API de Encriptado César</h1>
    <p>Usa Postman para probar las rutas:</p>
    <ul>
      <li><strong>POST</strong> /encriptar</li>
      <li><strong>POST</strong> /desencriptar</li>
    </ul>
    <p>Ejemplo en el body JSON:<br>
    { "mensaje": "hola", "desplazamiento": 3 }</p>
  `);
});

// Algoritmo para encriptar
function cifrarCesar(texto, desplazamiento) {
  return texto.split('').map(char => {
    let code = char.charCodeAt(0);
    if (code >= 97 && code <= 122) {
      return String.fromCharCode(((code - 97 + desplazamiento) % 26) + 97);
    }
    return char;
  }).join('');
}

// Algoritmo para desencriptar
function descifrarCesar(texto, desplazamiento) {
  return texto.split('').map(char => {
    let code = char.charCodeAt(0);
    if (code >= 97 && code <= 122) {
      return String.fromCharCode(((code - 97 - desplazamiento + 26) % 26) + 97);
    }
    return char;
  }).join('');
}

// Middleware para validar el body
function validarBody(req, res, next) {
  const { mensaje, desplazamiento } = req.body;
  
  if (!mensaje || typeof mensaje !== 'string') {
    return res.status(400).json({ 
      error: 'El campo "mensaje" es requerido y debe ser una cadena de texto' 
    });
  }
  
  if (desplazamiento === undefined || typeof desplazamiento !== 'number') {
    return res.status(400).json({ 
      error: 'El campo "desplazamiento" es requerido y debe ser un número' 
    });
  }

  next();
}

// Ruta para encriptar
app.post('/encriptar', validarBody, (req, res) => {
  const { mensaje, desplazamiento } = req.body;
  const resultado = cifrarCesar(mensaje.toLowerCase(), desplazamiento);
  res.json({ mensaje_encriptado: resultado });
});

// Ruta para desencriptar
app.post('/desencriptar', validarBody, (req, res) => {
  const { mensaje, desplazamiento } = req.body;
  const resultado = descifrarCesar(mensaje.toLowerCase(), desplazamiento);
  res.json({ mensaje_desencriptado: resultado });
});

// Puerto
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
