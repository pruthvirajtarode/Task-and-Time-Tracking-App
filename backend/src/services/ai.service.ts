export const enhanceTask = async (input: string) => {
  const apiKey = process.env.AI_API_KEY;
  
  if (!apiKey) {
    // Graceful fallback if no API key is configured
    return {
      title: input,
      description: 'AI enhancement is currently unavailable.'
    };
  }

  try {
    // We are simulating an AI call for OpenAI or any typical provider here.
    // In a real scenario, you'd use the official SDK (e.g. `import OpenAI from 'openai'`).
    // To keep it simple and dependency-light, we use fetch.
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a productivity assistant. Convert the user\'s natural-language task into a concise professional task title and a useful structured description. Return JSON strictly in this format: {"title": "...", "description": "..."}'
          },
          {
            role: 'user',
            content: input
          }
        ],
        temperature: 0.7,
      })
    });

    if (!response.ok) {
      throw new Error('AI API responded with an error');
    }

    const data: any = await response.json();
    const content = data.choices[0].message.content;
    const parsed = JSON.parse(content);
    
    return {
      title: parsed.title || input,
      description: parsed.description || ''
    };
  } catch (error) {
    console.error('AI Enhancement failed:', error);
    // Graceful fallback
    return {
      title: input,
      description: 'Failed to enhance task via AI.'
    };
  }
};
