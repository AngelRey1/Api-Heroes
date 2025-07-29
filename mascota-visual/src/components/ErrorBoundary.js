import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#FF69B4',
          color: '#000',
          textAlign: 'center',
          padding: '20px'
        }}>
          <div style={{
            background: '#FFB6C1',
            border: '4px solid #000',
            borderRadius: '15px',
            padding: '30px',
            boxShadow: '8px 8px 0px #000',
            maxWidth: '500px'
          }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              marginBottom: '20px',
              textShadow: '2px 2px 0px #fff'
            }}>
              ¡Ups! Algo salió mal 😅
            </h1>
            <p style={{
              fontSize: '18px',
              marginBottom: '20px',
              textShadow: '1px 1px 0px #fff'
            }}>
              Parece que hubo un pequeño problema técnico. ¡No te preocupes!
            </p>
            <button
              onClick={() => window.location.reload()}
              style={{
                background: '#FFD700',
                color: '#000',
                border: '3px solid #000',
                borderRadius: '10px',
                padding: '15px 30px',
                fontSize: '18px',
                fontWeight: 'bold',
                cursor: 'pointer',
                fontFamily: 'inherit'
              }}
            >
              🔄 Recargar página
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary; 