// Función para verificar si el backend está funcionando
export const checkBackendStatus = async () => {
  try {
    const response = await fetch('http://localhost:3001/health');
    if (response.ok) {
      console.log('✅ Backend funcionando correctamente');
      return true;
    } else {
      console.log('❌ Backend respondió con error:', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Backend no disponible:', error.message);
    return false;
  }
};

// Función para mostrar un mensaje de error amigable
export const showBackendError = () => {
  const message = `
🚨 **Backend no disponible**

Para solucionar este problema:

1. **Abre una nueva terminal**
2. **Navega al directorio del backend:**
   \`\`\`bash
   cd Api-Heroes
   \`\`\`
3. **Instala las dependencias:**
   \`\`\`bash
   npm install
   \`\`\`
4. **Inicia el servidor:**
   \`\`\`bash
   npm start
   \`\`\`
5. **Verifica que esté funcionando:**
   \`\`\`bash
   curl http://localhost:3001/health
   \`\`\`

Una vez que el backend esté corriendo, recarga esta página.
  `;
  
  console.log(message);
  alert('Backend no disponible. Por favor, inicia el servidor backend y recarga la página.');
}; 