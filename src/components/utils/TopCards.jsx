'use client';

import { useState } from 'react';
import { Card, Button, Input, Spacer } from '@nextui-org/react';

const TopCards = () => {
  const [input, setInput] = useState('');
  const [responseData, setResponseData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input) {
      alert('Por favor, escribe algo.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta de la red');
      }

      const data = await response.json();
      setResponseData((prev) => [...prev, { prompt: input, response: data.text }]);

      // Limitar el número de mensajes mostrados
      if (setResponseData.length > 5) {
        setResponseData((prev) => prev.slice(-5));
      }
    } catch (error) {
      console.error('Error al llamar a la API de chat:', error);
    } finally {
      setLoading(false);
      setInput('');
    }
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '2rem',
      }}
    >
      {/* Vista del chat */}
      <Card css={{ flex: 1, overflowY: 'auto', padding: '1rem', marginBottom: '1rem' }}>
        {responseData.length === 0 ? (
          <div
            style={{ textAlign: 'center', color: '#888', fontSize: '1.25rem', paddingTop: '2rem' }}
          >
            No hay mensajes aún
          </div>
        ) : (
          responseData.map((item, index) => (
            <div key={index} style={{ marginBottom: '1.5rem' }}>
              <Card css={{ backgroundColor: '#e0f7fa', padding: '1rem', marginBottom: '1rem' }}>
                <strong>Usuario:</strong> {item.prompt}
              </Card>
              <Spacer y={0.5} />
              <Card css={{ backgroundColor: '#e8f5e9', padding: '1rem', marginBottom: '1rem' }}>
                <strong>LegalBot:</strong> {item.response}
              </Card>
            </div>
          ))
        )}
      </Card>

      {/* Formulario para enviar el texto */}
      <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
        <Input
          clearable
          underlined
          placeholder='Escribe algo...'
          value={input}
          onChange={handleInputChange}
          fullWidth
          css={{ marginBottom: '0.5rem' }}
        />
        <Button type='submit' fullWidth disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar'}
        </Button>
      </form>
    </div>
  );
};

export default TopCards;
