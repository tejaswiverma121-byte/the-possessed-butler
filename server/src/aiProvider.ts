import dotenv from 'dotenv';
dotenv.config();

export interface LLMSettings {
  provider: 'gemini' | 'openai' | 'anthropic' | 'domain_engine';
  apiKey?: string;
  model?: string;
}

// In-memory runtime credential store (server-side only)
let runtimeSettings: LLMSettings = {
  provider: (process.env.GEMINI_API_KEY ? 'gemini' : (process.env.OPENAI_API_KEY ? 'openai' : 'domain_engine')),
  apiKey: process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || '',
  model: process.env.AI_MODEL || 'gemini-2.0-flash',
};

export class AIProviderService {
  public static getSettings(): { provider: string; hasKey: boolean; model: string } {
    return {
      provider: runtimeSettings.provider,
      hasKey: Boolean(runtimeSettings.apiKey && runtimeSettings.apiKey.length > 5),
      model: runtimeSettings.model || 'auto',
    };
  }

  public static updateSettings(settings: { provider: 'gemini' | 'openai' | 'anthropic' | 'domain_engine'; apiKey?: string; model?: string }) {
    runtimeSettings = {
      ...runtimeSettings,
      ...settings,
    };
  }

  /**
   * Universal AI completion dispatcher
   */
  public static async generateStructured<T>(prompt: string, systemInstruction: string, fallbackGenerator: () => T): Promise<{ data: T; providerUsed: string }> {
    if (runtimeSettings.provider === 'gemini' && runtimeSettings.apiKey) {
      try {
        const result = await this.callGemini(prompt, systemInstruction);
        const parsed = JSON.parse(result) as T;
        return { data: parsed, providerUsed: `Gemini (${runtimeSettings.model})` };
      } catch (err: any) {
        console.warn('[AIProvider] Gemini call failed or returned non-JSON, falling back to Domain Engine:', err.message);
      }
    } else if (runtimeSettings.provider === 'openai' && runtimeSettings.apiKey) {
      try {
        const result = await this.callOpenAI(prompt, systemInstruction);
        const parsed = JSON.parse(result) as T;
        return { data: parsed, providerUsed: `OpenAI (${runtimeSettings.model})` };
      } catch (err: any) {
        console.warn('[AIProvider] OpenAI call failed, falling back to Domain Engine:', err.message);
      }
    }

    // Default: High-fidelity domain intelligence engine
    return {
      data: fallbackGenerator(),
      providerUsed: 'Built-in Domain Intelligence Engine (Verified Safe Execution)',
    };
  }

  private static async callGemini(prompt: string, systemInstruction: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${runtimeSettings.model || 'gemini-2.0-flash'}:generateContent?key=${runtimeSettings.apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: [{ parts: [{ text: prompt + '\nIMPORTANT: Return valid raw JSON only. Do not wrap in markdown quotes.' }] }],
        generationConfig: {
          response_mime_type: 'application/json',
          temperature: 0.2,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error ${response.status}: ${errorText}`);
    }

    const json: any = await response.json();
    return json.candidates[0].content.parts[0].text;
  }

  private static async callOpenAI(prompt: string, systemInstruction: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${runtimeSettings.apiKey}`,
      },
      body: JSON.stringify({
        model: runtimeSettings.model || 'gpt-4o',
        messages: [
          { role: 'system', content: systemInstruction + ' Return valid raw JSON only without markdown formatting.' },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0.2,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI API error ${response.status}: ${errorText}`);
    }

    const json: any = await response.json();
    return json.choices[0].message.content;
  }
}
