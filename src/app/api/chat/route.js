import { NextResponse } from 'next/server';

export async function POST(req) {
  try {
    const { prompt } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: 'No se proporcionó un prompt.' }, { status: 400 });
    }

    const messages = [
      { role: 'user', content: prompt }
    ];

    const openAiResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`, // La clave API debe estar en las variables de entorno
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
      }),
    });

    if (!openAiResponse.ok) {
      throw new Error('Error en la respuesta de OpenAI.');
    }

    const data = await openAiResponse.json();

    return NextResponse.json({ text: data.choices[0].message.content });
  } catch (error) {
    console.error('Error en la API de chat:', error);
    return NextResponse.json({ error: 'Error interno del servidor.' }, { status: 500 });
  }
}
