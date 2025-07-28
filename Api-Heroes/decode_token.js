import jwt from 'jsonwebtoken';

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2ODgyZjA4MWI1ZDljY2JhYmE3MTFhZmQiLCJpYXQiOjE3NTM2NzE0NzUsImV4cCI6MTc1Mzc1Nzg3NX0.iQX_D9xYEy3ovkjl1_D4FX1A_qU-iENqRYDjHL9l-AY";

try {
  const decoded = jwt.decode(token);
  console.log('Token decodificado:', JSON.stringify(decoded, null, 2));
} catch (error) {
  console.error('Error decodificando token:', error);
} 