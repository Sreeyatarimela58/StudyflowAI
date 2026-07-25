import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Groq from 'groq-sdk';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '10mb' }));

const port = process.env.PORT || 3001;

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;

app.post('/api/generate', async (req, res) => {
  try {
    const { title, content } = req.body;
    
    if (!content || content.length < 20) {
      return res.status(400).json({ error: 'Content is too short or missing' });
    }

    if (!groq) {
      // Mock mode if no API key
      console.log('No GROQ_API_KEY provided. Using mock response.');
      // Simulate delay
      await new Promise(r => setTimeout(r, 2000));
      return res.json({
        title: title || 'Mock Generated Study',
        summary: 'This is a mock summary because the API key is missing. The provided content was analyzed to extract key themes and concepts.',
        recommendations: ['Review basic concepts', 'Try the flashcards multiple times'],
        flashcards: [
          { front: 'Mock Concept 1', back: 'Definition of concept 1' },
          { front: 'Mock Concept 2', back: 'Definition of concept 2' }
        ],
        quiz: [
          {
            question: 'What is the mock concept?',
            options: ['Option A', 'Option B', 'Option C', 'Option D'],
            correctIndex: 1,
            explanation: 'Option B is correct because this is a mock.'
          }
        ]
      });
    }

    // The prompt now delegates length entirely to the LLM based on concepts


    const schema = {
      type: "object",
      properties: {
        title: { type: "string" },
        summary: { type: "string" },
        keyPoints: { type: "array", items: { type: "string" } },
        recommendations: {
          type: "array",
          items: { type: "string" }
        },
        flashcards: {
          type: "array",
          items: {
            type: "object",
            properties: {
              front: { type: "string" },
              back: { type: "string" }
            },
            required: ["front", "back"]
          }
        },
        quiz: {
          type: "array",
          items: {
            type: "object",
            properties: {
              question: { type: "string" },
              options: {
                type: "array",
                items: { type: "string" }
              },
              correctIndex: { type: "number" },
              explanation: { type: "string" }
            },
            required: ["question", "options", "correctIndex", "explanation"]
          }
        }
      },
      required: ["title", "summary", "recommendations", "flashcards", "quiz"]
    };

    const prompt = `You are StudyFlow AI, an expert educational assistant.
Your purpose is to transform study material into structured learning resources.
Read the ENTIRE input carefully before responding.
Never focus only on the beginning of the text.
Never ignore later sections.
If the input contains multiple topics, people, concepts, events, chapters, or sections, include ALL major ones.
Do not invent facts. Use only the information provided by the user.

Generate the following JSON structure exactly:
{
  "title": "...",
  "summary": "...",
  "keyPoints": [
    "point 1",
    "point 2"
  ],
  "flashcards": [],
  "quiz": [],
  "recommendations": [
    "recommendation 1",
    "recommendation 2"
  ]
}

------------------------------------------
SUMMARY
------------------------------------------
Create a high-quality study summary.
Requirements:
• Read the COMPLETE document before writing.
• Cover every important topic, person, concept, and event.
• Preserve the logical flow.
• Do not over-focus on the first paragraph.
• Do not ignore the ending.
• Do not repeat information.
• Write naturally.
Do NOT write things like "This summary discusses..."
Start immediately with the actual summary. Length: 120-180 words.

------------------------------------------
KEY POINTS
------------------------------------------
Generate between 5 and 10 concise bullet points. Each point should contain one important fact.

------------------------------------------
FLASHCARDS
------------------------------------------
The number of flashcards should depend on BOTH:
1. The length of the document.
2. The number of unique concepts, topics, people, or events.
Never force extra flashcards simply to reach a target number. Generate only enough high-quality study material to comprehensively cover the content.
Each flashcard must contain:
{
  "front": "...",
  "back": "..."
}
Questions should test understanding. Avoid yes/no questions.

------------------------------------------
QUIZ
------------------------------------------
The number of multiple-choice questions should depend on BOTH:
1. The length of the document.
2. The number of unique concepts, topics, people, or events.
Never force extra quiz questions simply to reach a target number. Generate only enough high-quality study material to comprehensively cover the content.
Each question must follow this format:
{
  "question": "...",
  "options": ["...", "...", "...", "..."],
  "correctIndex": 0,
  "explanation": "..."
}
Rules:
• Exactly four options.
• correctIndex must be an integer (0, 1, 2, or 3) representing the index of the correct option.
• Only one correct answer.
• Incorrect answers must be believable.
• Include easy, medium and difficult questions.

------------------------------------------
RECOMMENDATIONS
------------------------------------------
Generate 5 study recommendations (e.g. Review..., Memorize..., Compare...).

------------------------------------------
QUALITY RULES
------------------------------------------
Before producing the output verify:
✓ The summary covers ALL major topics.
✓ Every important person/concept is represented.
✓ JSON is valid.
✓ CRITICAL: You MUST properly escape all double quotes inside strings using a backslash (e.g. \\"). Do not use unescaped double quotes inside your text strings.

Respond ONLY with a valid JSON object exactly matching the schema. Do not include markdown blocks or any other text, just the raw JSON.

Material:
${title ? `Title: ${title}\n` : ''}${content}`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });

    const resultText = response.choices[0].message.content;
    const resultJson = JSON.parse(resultText);

    res.json(resultJson);
  } catch (error) {
    console.error('AI Generation Error:', error.message || error);
    
    // Fallback to mock data if quota exceeded or other errors occur
    console.log('Falling back to mock response due to error.');
    return res.json({
      title: req.body.title || 'Mock Generated Study (Fallback)',
      summary: 'This is a mock summary because the API request failed (likely due to rate limits or quota). The app successfully communicated with the backend, but the LLM provider rejected the request.',
      recommendations: ['Check your API Key quota', 'Try again in a few minutes', 'Verify billing details if on a paid plan'],
      flashcards: [
        { front: 'Rate Limit (429)', back: 'When an API rejects requests because too many were sent in a short time.' },
        { front: 'Fallback Mechanism', back: 'A system designed to provide alternative functionality when the primary system fails.' }
      ],
      quiz: [
        {
          question: 'Why did the AI generation fail?',
          options: ['Syntax Error', 'Rate Limit Exceeded', 'Server Crash', 'Missing Package'],
          correctIndex: 1,
          explanation: 'The LLM provider returned a 429 Resource Exhausted error, indicating the API key has hit its quota limits.'
        }
      ]
    });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
