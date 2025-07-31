import React from 'react';
import './ColorPicker.css';

const ColorPicker = ({ selectedColor, onColorChange, colors = [], previewFigure = null }) => {
  const defaultColors = [
    { id: '#3498db', name: 'Azul', emoji: '🔵' },
    { id: '#e74c3c', name: 'Rojo', emoji: '🔴' },
    { id: '#2ecc71', name: 'Verde', emoji: '🟢' },
    { id: '#f39c12', name: 'Naranja', emoji: '🟠' },
    { id: '#9b59b6', name: 'Púrpura', emoji: '🟣' },
    { id: '#1abc9c', name: 'Turquesa', emoji: '🔷' },
    { id: '#e67e22', name: 'Caramelo', emoji: '🟤' },
    { id: '#34495e', name: 'Gris', emoji: '⚫' },
    { id: '#f1c40f', name: 'Amarillo', emoji: '🟡' },
    { id: '#e91e63', name: 'Rosa', emoji: '🌸' },
    { id: '#795548', name: 'Marrón', emoji: '🟫' },
    { id: '#607d8b', name: 'Azul Gris', emoji: '🔷' }
  ];

  const colorList = colors.length > 0 ? colors : defaultColors;

  const handleColorChange = (colorId) => {
    onColorChange(colorId);
    // Efecto visual de confirmación
    const button = document.querySelector(`[data-color="${colorId}"]`);
    if (button) {
      button.classList.add('color-selected');
      setTimeout(() => button.classList.remove('color-selected'), 300);
    }
  };

  return (
    <div className="color-picker">
      <h4>🎨 Color del Cuerpo</h4>
      
      {/* Preview en tiempo real */}
      {previewFigure && (
        <div className="color-preview">
          <div className="preview-figure">
            {previewFigure}
          </div>
          <div className="color-info">
            <span className="current-color" style={{ backgroundColor: selectedColor }}></span>
            <span className="color-name">
              {colorList.find(c => c.id === selectedColor)?.name || 'Personalizado'}
            </span>
          </div>
        </div>
      )}
      
      <div className="color-grid">
        {colorList.map((color) => (
          <button
            key={color.id}
            className={`color-option ${selectedColor === color.id ? 'selected' : ''}`}
            style={{ backgroundColor: color.id }}
            onClick={() => handleColorChange(color.id)}
            title={color.name}
            data-color={color.id}
          >
            <span className="color-emoji">{color.emoji}</span>
            <div className="color-check">
              {selectedColor === color.id && '✓'}
            </div>
            <div className="color-ripple"></div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorPicker; 