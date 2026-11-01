import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

export type LLMProvider = 'groq' | 'gemini' | 'openai' | 'anthropic' | 'domain_engine';

export interface LLMSettings {
  provider: LLMProvider;
  apiKey?: string;
  model?: string;
}

const SETTINGS_FILE = path.resolve(process.cwd(), 'data', 'ai_settings.json');

// In-memory runtime credential store (server-side only)
let runtimeSettings: LLMSettings = {
  provider: (process.env.GROQ_API_KEY ? 'groq' : (process.env.GEMINI_API_KEY ? 'gemini' : (process.env.OPENAI_API_KEY ? 'openai' : 'domain_engine'))),
  apiKey: process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || process.env.ANTHROPIC_API_KEY || '',
  model: process.env.GROQ_API_KEY ? 'llama-3.3-70b-versatile' : (process.env.AI_MODEL || 'gemini-2.0-flash'),
};

// Auto-load persisted settings if present
try {
  if (fs.existsSync(SETTINGS_FILE)) {
    const raw = fs.readFileSync(SETTINGS_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed.provider) {
      runtimeSettings = {
        ...runtimeSettings,
        ...parsed,
      };
      console.log(`[AIProvider] Loaded persisted AI provider settings: ${runtimeSettings.provider} (${runtimeSettings.model})`);
    }
  }
} catch (err) {
  console.warn('[AIProvider] Error loading persisted AI settings:', err);
}

export class AIProviderService {
  public static getSettings(): { provider: string; hasKey: boolean; model: string } {
    return {
      provider: runtimeSettings.provider,
      hasKey: Boolean(runtimeSettings.apiKey && runtimeSettings.apiKey.length > 5),
      model: runtimeSettings.model || 'auto',
    };
  }

  public static updateSettings(settings: { provider: LLMProvider; apiKey?: string; model?: string }) {
    runtimeSettings = {
      ...runtimeSettings,
      provider: settings.provider,
      model: settings.model || this.getDefaultModelForProvider(settings.provider),
      apiKey: settings.apiKey !== undefined && settings.apiKey.trim().length > 0 
        ? settings.apiKey.trim() 
        : runtimeSettings.apiKey,
    };

    // Persist to disk
    try {
      const dataDir = path.dirname(SETTINGS_FILE);
      if (!fs.existsSync(dataDir)) {
        fs.mkdirSync(dataDir, { recursive: true });
      }
      fs.writeFileSync(SETTINGS_FILE, JSON.stringify({
        provider: runtimeSettings.provider,
        model: runtimeSettings.model,
        apiKey: runtimeSettings.apiKey,
      }, null, 2), 'utf-8');
      console.log(`[AIProvider] Saved AI settings: provider=${runtimeSettings.provider}, model=${runtimeSettings.model}`);
    } catch (err) {
      console.error('[AIProvider] Failed to persist AI settings to disk:', err);
    }
  }

  public static getDefaultModelForProvider(provider: LLMProvider): string {
    switch (provider) {
      case 'groq':
        return 'openai/gpt-oss-120b';
      case 'gemini':
        return 'gemini-2.0-flash';
      case 'openai':
        return 'gpt-4o';
      case 'anthropic':
        return 'claude-3-5-sonnet-20241022';
      default:
        return 'domain-engine';
    }
  }

  public static hasActiveCloudKey(): boolean {
    return Boolean(runtimeSettings.apiKey && runtimeSettings.apiKey.length > 5 && runtimeSettings.provider !== 'domain_engine');
  }

  public static getActiveProvider(): string {
    return runtimeSettings.provider;
  }

  /**
   * Universal natural text completion (for assistant conversation, email drafting, synthesis)
   */
  public static async generateText(prompt: string, systemInstruction?: string): Promise<{
    text: string;
    providerUsed: string;
  } | null> {
    if (!this.hasActiveCloudKey()) return null;

    const sys = systemInstruction || 'You are Sentinel AI, an autonomous local-first personal assistant. Write clearly, directly, and helpfully.';

    if (runtimeSettings.provider === 'groq' && runtimeSettings.apiKey) {
      try {
        const text = await this.callGroq(prompt, sys, false);
        return { text, providerUsed: `Groq (${runtimeSettings.model || 'openai/gpt-oss-120b'})` };
      } catch (err: any) {
        console.warn('[AIProvider] Groq completion failed:', err.message);
      }
    } else if (runtimeSettings.provider === 'openai' && runtimeSettings.apiKey) {
      try {
        const text = await this.callOpenAIText(prompt, sys);
        return { text, providerUsed: `OpenAI (${runtimeSettings.model || 'gpt-4o'})` };
      } catch (err: any) {
        console.warn('[AIProvider] OpenAI completion failed:', err.message);
      }
    } else if (runtimeSettings.provider === 'gemini' && runtimeSettings.apiKey) {
      try {
        const text = await this.callGeminiText(prompt, sys);
        return { text, providerUsed: `Gemini (${runtimeSettings.model || 'gemini-2.0-flash'})` };
      } catch (err: any) {
        console.warn('[AIProvider] Gemini completion failed:', err.message);
      }
    }

    return null;
  }

  /**
   * Universal AI structured completion dispatcher
   */
  public static async generateStructured<T>(prompt: string, systemInstruction: string, fallbackGenerator: () => T): Promise<{ data: T; providerUsed: string }> {
    if (runtimeSettings.provider === 'groq' && runtimeSettings.apiKey) {
      try {
        const result = await this.callGroq(prompt, systemInstruction, true);
        const parsed = JSON.parse(result) as T;
        return { data: parsed, providerUsed: `Groq (${runtimeSettings.model})` };
      } catch (err: any) {
        console.warn('[AIProvider] Groq call failed or returned non-JSON, falling back to Domain Engine:', err.message);
      }
    } else if (runtimeSettings.provider === 'gemini' && runtimeSettings.apiKey) {
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

  /**
   * Groq ultra-low-latency API execution with resilient candidate fallback
   */
  private static async callGroq(prompt: string, systemInstruction: string, jsonMode: boolean = false): Promise<string> {
    const candidateModels = [
      runtimeSettings.model,
      'openai/gpt-oss-120b',
      'openai/gpt-oss-20b',
      'qwen/qwen3.8-27b'
    ].filter(Boolean) as string[];

    let lastError: any;
    for (const model of candidateModels) {
      try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${runtimeSettings.apiKey}`,
          },
          body: JSON.stringify({
            model,
            messages: [
              { role: 'system', content: systemInstruction + (jsonMode ? ' Return valid raw JSON only.' : '') },
              { role: 'user', content: prompt },
            ],
            ...(jsonMode ? { response_format: { type: 'json_object' } } : {}),
            temperature: 0.3,
            max_tokens: 4096,
          }),
        });

        if (response.ok) {
          const json: any = await response.json();
          const content = json.choices?.[0]?.message?.content;
          if (content) {
            if (model !== runtimeSettings.model) {
              runtimeSettings.model = model;
            }
            return content;
          }
        } else {
          const errText = await response.text();
          lastError = new Error(`Groq API error ${response.status} (${model}): ${errText}`);
          if (response.status === 404 || errText.includes('model_not_found') || errText.includes('does not exist')) {
            console.warn(`[AIProvider] Groq model "${model}" not found, trying fallback model...`);
            continue;
          }
          throw lastError;
        }
      } catch (e: any) {
        lastError = e;
        if (e.message?.includes('model_not_found') || e.message?.includes('does not exist')) {
          continue;
        }
        throw e;
      }
    }
    throw lastError || new Error('All Groq candidate models failed');
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

  private static async callGeminiText(prompt: string, systemInstruction: string): Promise<string> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${runtimeSettings.model || 'gemini-2.0-flash'}:generateContent?key=${runtimeSettings.apiKey}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        system_instruction: { parts: [{ text: systemInstruction }] },
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.3,
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

  private static async callOpenAIText(prompt: string, systemInstruction: string): Promise<string> {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${runtimeSettings.apiKey}`,
      },
      body: JSON.stringify({
        model: runtimeSettings.model || 'gpt-4o',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt },
        ],
        temperature: 0.3,
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
