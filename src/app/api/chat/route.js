import { NextResponse } from 'next/server';

export const config = {
  api: {
    bodyParser: true,
  },
};

let conversationHistory = []; // Historial de la conversación
const MAX_HISTORY = 5; // Limitar a los últimos 5 mensajes

export async function POST(req) {
  const { prompt } = await req.json();

  if (!prompt) {
    return NextResponse.json({ error: 'El campo de texto está vacío.' }, { status: 400 });
  }

  // Añadir el nuevo mensaje del usuario al historial
  conversationHistory.push({ role: 'user', content: prompt });

  // Limitar el historial a los últimos N mensajes
  if (conversationHistory.length > MAX_HISTORY) {
    conversationHistory = conversationHistory.slice(-MAX_HISTORY);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: conversationHistory,
      }),
    });

    const data = await response.json();
    conversationHistory.push({ role: 'assistant', content: data.choices[0].message.content });

    return NextResponse.json({ text: data.choices[0].message.content });
  } catch (error) {
    console.error('Error al comunicarse con OpenAI:', error);
    return NextResponse.json({ error: 'Error al comunicarse con OpenAI.' }, { status: 500 });
  }
}
