import dotenv from 'dotenv';
dotenv.config();

console.log('🔍 Verificando configuración de variables de entorno...\n');

const requiredEnvVars = [
  'MONGO_URI',
  'JWT_SECRET',
  'NODE_ENV'
];

const optionalEnvVars = [
  'PORT',
  'RENDER_EXTERNAL_URL',
  'ALLOWED_ORIGINS'
];

console.log('📋 Variables de entorno requeridas:');
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${varName === 'JWT_SECRET' ? '***configurado***' : value.substring(0, 20) + '...'}`);
  } else {
    console.log(`❌ ${varName}: NO CONFIGURADA`);
  }
});

console.log('\n📋 Variables de entorno opcionales:');
optionalEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`✅ ${varName}: ${value}`);
  } else {
    console.log(`⚠️ ${varName}: No configurada (usando valor por defecto)`);
  }
});

console.log('\n🔧 Configuración actual:');
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`PORT: ${process.env.PORT || 3001}`);
console.log(`MONGO_URI: ${process.env.MONGO_URI ? 'Configurada' : 'NO CONFIGURADA'}`);
console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? 'Configurado' : 'NO CONFIGURADO'}`);

// Verificar si las variables críticas están configuradas
const missingRequired = requiredEnvVars.filter(varName => !process.env[varName]);

if (missingRequired.length > 0) {
  console.log('\n❌ ERROR: Faltan variables de entorno requeridas:');
  missingRequired.forEach(varName => console.log(`   - ${varName}`));
  console.log('\n💡 Asegúrate de configurar estas variables en Render o en tu archivo .env');
} else {
  console.log('\n✅ Todas las variables de entorno requeridas están configuradas');
}

console.log('\n🌐 URLs de despliegue:');
console.log(`Backend: ${process.env.RENDER_EXTERNAL_URL || 'No configurada'}`);
console.log(`Frontend: https://api-heroes-frontend.onrender.com`);

console.log('\n📝 Configuración de CORS:');
const allowedOrigins = process.env.ALLOWED_ORIGINS ? 
  process.env.ALLOWED_ORIGINS.split(',') : 
  ['http://localhost:3000', 'http://localhost:3001', 'https://api-heroes-frontend.onrender.com'];
console.log('Orígenes permitidos:', allowedOrigins); 