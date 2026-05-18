export async function generateWithGemini(prompt: string): Promise<string> {
  try {
     const API_URL = import.meta.env.VITE_API_URL || '';
     const response = await fetch(`${API_URL}/api/ai/run`, {
       method: 'POST',
       headers: {
         'Content-Type': 'application/json'
       },
       // We use a pseudo actionType just to tunnel the raw prompt
       body: JSON.stringify({
         actionType: 'consultor_question',
         payload: { customPrompt: prompt }
       })
     });

     if (!response.ok) {
       throw new Error('Erro de comunicação com a inteligência artificial.');
     }

     const data = await response.json();
     if (data.result && typeof data.result === 'string') {
        return data.result;
     }

     return JSON.stringify(data.result || data);
  } catch (error) {
    console.error("Gemini Generation Error:", error);
    throw error;
  }
}
