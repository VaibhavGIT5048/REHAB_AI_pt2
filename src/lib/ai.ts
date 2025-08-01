const openRouterApiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
const openRouterModel = 'qwen/qwen3-30b-a3b-instruct-2507';

export interface AIResponse {
  content: string;
  success: boolean;
  error?: string;
}

export interface DoctorContext {
  name: string;
  specialty: string;
  experience: string;
  personality: string;
}

const doctorContexts: Record<string, DoctorContext> = {
  mitchell: {
    name: 'Dr. Sarah Mitchell',
    specialty: 'Sports Physiotherapist',
    experience:
      '12 years of experience in sports rehabilitation and ACL recovery',
    personality:
      'Encouraging, detail-oriented, and focuses on proper form and gradual progression',
  },
  chen: {
    name: 'Dr. Marcus Chen',
    specialty: 'Orthopedic Surgeon',
    experience: '15 years of experience in joint surgery and trauma care',
    personality:
      'Professional, thorough, and emphasizes evidence-based treatment approaches',
  },
  rodriguez: {
    name: 'Emma Rodriguez',
    specialty: 'Physical Therapist',
    experience:
      '8 years of experience in manual therapy and post-surgical rehabilitation',
    personality:
      'Compassionate, patient-focused, and believes in holistic recovery approaches',
  },
};

export { doctorContexts };

export async function generateAIResponse(
  message: string,
  doctorId: string,
  conversationHistory: Array<{
    role: 'user' | 'assistant';
    content: string;
  }> = []
): Promise<AIResponse> {
  const doctor = doctorContexts[doctorId];

  if (!doctor) {
    return {
      content: "I'm sorry, I couldn't find the doctor you're trying to reach.",
      success: false,
      error: 'Doctor not found',
    };
  }

  try {
    return await generateOpenRouterResponse(
      message,
      doctor,
      conversationHistory
    );
  } catch (error) {
    console.error('AI Response Error:', error);
    return {
      content:
        "I'm experiencing some technical difficulties. Please try again in a moment.",
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

async function generateOpenRouterResponse(
  message: string,
  doctor: DoctorContext,
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>
): Promise<AIResponse> {
  try {
    const historyFormatted = conversationHistory.map((msg) => ({
      role: msg.role,
      content: msg.content,
    }));

    const systemPrompt = `
You are ${doctor.name}, a ${doctor.specialty} with ${doctor.experience}.
Your personality: ${doctor.personality}.

INSTRUCTIONS FOR RESPONSE GENERATION:

1INSTRUCTIONS FOR REPLY:

1. Keep responses brief, helpful, and natural—no fluff or long paragraphs.
2. Speak like a real, caring physiotherapist—not a chatbot.
3. Avoid all formatting (no asterisks, numbered lists, emojis, markdown).
4. Use short, clear paragraphs with one idea per sentence.
5. Be warm, positive, and supportive—but don't overdo it.
6. Give quick, practical advice. Focus on what the patient should do next.
7. Never copy or repeat the user's question—respond naturally.
8. Acknowledge progress or discomfort in 1–2 lines.
9. If there's pain, recommend stopping and checking with a physio.
10. Do not give medical diagnoses. Refer to a real professional if unsure.
11. End with a short check-in or supportive line (e.g., "Let me know how that goes." / "You're on the right track." / "Happy to adjust if needed.").

TONE: Friendly, efficient, and human—not robotic or overly formal.
LENGTH: 1-2 short paragraphs max. No long essays.
`.trim();

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${openRouterApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: openRouterModel,
          messages: [
            { role: 'system', content: systemPrompt },
            ...historyFormatted,
            { role: 'user', content: message },
          ],
          temperature: 0.7,
          max_tokens: 512,
        }),
      }
    );

    if (!response.ok) {
      throw new Error(
        `OpenRouter API error! status: ${
          response.status
        } ${await response.text()}`
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    return {
      content: content || "I'm sorry, I couldn't generate a response.",
      success: true,
    };
  } catch (error) {
    console.error('OpenRouter API Error:', error);
    return {
      content: '',
      success: false,
      error: error instanceof Error ? error.message : 'OpenRouter API error',
    };
  }
}
