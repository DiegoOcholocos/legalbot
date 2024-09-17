import { OpenAI } from 'openai';

export const dynamic = 'force-dynamic'; // Configuración recomendada en Next.js 14

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req) {
  try {
    const formData = await req.formData();

    const text = formData.get('text');
    const file = formData.get('file');

    let fileContent = '';
    if (file) {
      const mimeType = file.type;

      if (mimeType === 'text/plain') {
        fileContent = await file.text(); // Lee archivos de texto
      } else if (mimeType === 'application/pdf') {
        fileContent = 'Contenido del archivo PDF'; // Implementa lógica para PDFs
      } else {
        return new Response(JSON.stringify({ error: 'Tipo de archivo no soportado' }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    const prompt = text || fileContent;

    if (!prompt) {
      return new Response(JSON.stringify({ error: 'Se requiere un mensaje o archivo.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    const textResponse = response.choices[0].message.content;

    return new Response(JSON.stringify({ text: textResponse }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error procesando la solicitud:', error);
    return new Response(JSON.stringify({ error: 'Error con la API' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
