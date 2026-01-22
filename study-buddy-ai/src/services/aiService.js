const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;

// GitHub Models Endpoint
const API_ENDPOINT = "https://models.inference.ai.azure.com/chat/completions";

// Reliable models available on GitHub Models
const MODELS = [
    "gpt-4o",
    "gpt-4o-mini",
    "Phi-3-medium-4k-instruct"
];

if (!GITHUB_TOKEN) {
    console.error("Missing GitHub Token. Please set VITE_GITHUB_TOKEN in .env");
}

const parseResponse = (text) => {
    try {
        let cleaned = text.replace(/```json|```/g, '').trim();
        const firstOpen = cleaned.search(/[{\[]/);
        const lastClose = cleaned.lastIndexOf('}') > cleaned.lastIndexOf(']')
            ? cleaned.lastIndexOf('}')
            : cleaned.lastIndexOf(']');

        if (firstOpen !== -1 && lastClose !== -1) {
            cleaned = cleaned.substring(firstOpen, lastClose + 1);
        }
        return JSON.parse(cleaned);
    } catch (e) {
        console.error("Failed to parse AI response:", text);
        throw new Error("Invalid response format from AI");
    }
};

const callGitHubModels = async (prompt) => {
    if (!GITHUB_TOKEN) throw new Error("GitHub Token missing. Please restart development server.");

    // Try primary model first, fall back if needed
    for (const model of MODELS) {
        try {
            console.log(`🤖 Trying GitHub Model: ${model}`);

            const response = await fetch(API_ENDPOINT, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${GITHUB_TOKEN}`
                },
                body: JSON.stringify({
                    messages: [
                        { role: "system", content: "You represent a helpful study assistant. ALWAYS return purely valid JSON." },
                        { role: "user", content: prompt }
                    ],
                    model: model,
                    temperature: 0.2,
                    max_tokens: 1000
                })
            });

            if (!response.ok) {
                const err = await response.json();
                console.warn(`⚠️ ${model} failed:`, err);
                continue; // Try next model
            }

            const data = await response.json();
            const content = data.choices[0]?.message?.content;
            if (!content) throw new Error("No content received");

            console.log(`✅ Success: ${model}`);
            return content;
        } catch (error) {
            console.warn(`Error with ${model}:`, error);
        }
    }

    throw new Error("All GitHub models failed to respond. Please check your network or token.");
};

export const aiService = {
    explainTopic: async (topic, difficulty) => {
        const prompt = `Explain "${topic}" for ${difficulty} level. Return ONLY valid JSON:
{
  "summary": "detailed explanation",
  "keyPoints": ["point 1", "point 2", "point 3"],
  "analogy": "helpful analogy",
  "example": "real example"
}`;

        const text = await callGitHubModels(prompt);
        return { topic, difficulty, content: parseResponse(text) };
    },

    summarizeContent: async (content, mode = 'revision') => {
        const isExam = mode === 'exam';
        const prompt = `Summarize for ${isExam ? 'exam' : 'revision'}: "${content.substring(0, 5000)}"
Return ONLY valid JSON:
{
  "summary": ["point 1", "point 2"],
  "keyDefinitions": [{"term": "T", "definition": "D"}],
  "formulas": ["formula if any"],
  "examTips": ["tip if any"]
}`;

        const text = await callGitHubModels(prompt);
        return parseResponse(text);
    },

    generateQuiz: async (topic) => {
        const prompt = `Create 5-question quiz on "${topic}". Return ONLY valid JSON array:
[
  {
    "id": 1,
    "question": "Q text",
    "options": ["A", "B", "C", "D"],
    "correctAnswer": 0,
    "explanation": "why correct"
  }
]`;

        const text = await callGitHubModels(prompt);
        return parseResponse(text);
    },

    generateFlashcards: async (topic) => {
        const prompt = `Create 6 flashcards for "${topic}". Return ONLY valid JSON array:
[
  {"id": 1, "front": "question", "back": "answer"}
]`;

        const text = await callGitHubModels(prompt);
        return parseResponse(text);
    }
};
