import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic'; // Reemplaza esto con la configuración necesaria

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

  // Instrucciones del sistema para mantener el contexto legal
  const systemInstructions = {
    role: 'system',
    content: `Eres LegalBot, un asistente legal diseñado específicamente para abogados. Tu función es proporcionar información precisa y relevante sobre temas legales, ayudar en la investigación de casos y ofrecer recursos útiles para el ejercicio de la abogacía. Responde exclusivamente a preguntas relacionadas con la práctica del derecho y utiliza terminología legal adecuada.`,
  };

  // Añadir las instrucciones del sistema al historial
  const messages = [systemInstructions, ...conversationHistory];

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
      }),
    });

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    // Añadir la respuesta del asistente al historial
    conversationHistory.push({ role: 'assistant', content: assistantMessage });

    return NextResponse.json({ text: assistantMessage });
  } catch (error) {
    console.error('Error al comunicarse con OpenAI:', error);
    return NextResponse.json({ error: 'Error al comunicarse con OpenAI.' }, { status: 500 });
  }
}
