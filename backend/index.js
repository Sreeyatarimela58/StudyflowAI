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


async function coreGenerate(title, content, mode) {
  if (!groq) {
    console.log('No GROQ_API_KEY provided. Using mock response.');
    await new Promise(r => setTimeout(r, 2000));
    return {
      title: title || 'Mock Generated Study',
      summary: 'This is a mock summary because the API key is missing. The provided content was analyzed to extract key themes and concepts.',
      recommendations: ['Review basic concepts', 'Try the flashcards multiple times'],
      flashcards: [
        { front: 'Mock Concept 1', back: 'Definition of concept 1' },
        { front: 'Mock Concept 2', back: 'Definition of concept 2' }
      ],
      quiz: [
        {
          question: mode === 'True/False' ? 'This is a mock true/false statement.' : mode === 'Fill in the Blanks' ? 'This is a mock ____ question.' : 'What is the mock concept?',
          options: mode === 'True/False' ? ['True', 'False'] : ['Option A', 'Option B', 'Option C', 'Option D'],
          correctIndex: 1,
          explanation: 'Option B is correct because this is a mock.'
        }
      ]
    };
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

    let quizRules = '';
    if (mode === 'True/False') {
      quizRules = `Rules:
• Exactly two options: ["True", "False"].
• correctIndex must be 0 or 1.
• Questions must be statements that are unambiguously true or false.`;
    } else if (mode === 'Fill in the Blanks') {
      quizRules = `Rules:
• The question must be a sentence containing a blank represented by "____".
• Exactly four options to fill the blank.
• correctIndex must be an integer (0, 1, 2, or 3) representing the correct option.
• Incorrect answers must be believable.`;
    } else {
      quizRules = `Rules:
• Exactly four options.
• correctIndex must be an integer (0, 1, 2, or 3) representing the index of the correct option.
• Only one correct answer.
• Incorrect answers must be believable.
• Include easy, medium and difficult questions.`;
    }

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
------------------------------------------
QUIZ (${mode})
------------------------------------------
The number of ${mode} questions should depend on BOTH:
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
${quizRules}

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
    return JSON.parse(resultText);
}

app.post('/api/generate', async (req, res) => {
  try {
    const { title, content, quizMode } = req.body;
    const mode = quizMode || 'Multiple Choice';
    
    if (!content || content.length < 20) {
      return res.status(400).json({ error: 'Content is too short or missing' });
    }

    const resultJson = await coreGenerate(title, content, mode);
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


app.post('/api/refine', async (req, res) => {
  try {
    const { title, target, content, prompt } = req.body;
    
    if (!target || !content || !prompt) {
      return res.status(400).json({ error: 'Missing required fields: target, content, prompt' });
    }

    if (!groq) {
      console.log('No GROQ_API_KEY provided. Using mock refinement.');
      await new Promise(r => setTimeout(r, 1500));
      return res.json({
        target,
        data: typeof content === 'string' ? content + ' (Refined: ' + prompt + ')' : content
      });
    }

    let schema;
    let targetInstructions;

    if (target === 'summary') {
      schema = { type: "object", properties: { summary: { type: "string" } }, required: ["summary"] };
      targetInstructions = "Return a JSON object with a single key 'summary' containing the refined summary text.";
    } else if (target === 'quiz') {
      schema = {
        type: "object",
        properties: {
          quiz: {
            type: "array",
            items: {
              type: "object",
              properties: {
                question: { type: "string" },
                options: { type: "array", items: { type: "string" } },
                correctIndex: { type: "number" },
                explanation: { type: "string" }
              },
              required: ["question", "options", "correctIndex", "explanation"]
            }
          }
        },
        required: ["quiz"]
      };
      targetInstructions = "Return a JSON object with a single key 'quiz' containing the refined array of quiz questions.";
    } else if (target === 'flashcards') {
      schema = {
        type: "object",
        properties: {
          flashcards: {
            type: "array",
            items: {
              type: "object",
              properties: { front: { type: "string" }, back: { type: "string" } },
              required: ["front", "back"]
            }
          }
        },
        required: ["flashcards"]
      };
      targetInstructions = "Return a JSON object with a single key 'flashcards' containing the refined array of flashcards.";
    } else if (target === 'recommendations') {
      schema = {
        type: "object",
        properties: { recommendations: { type: "array", items: { type: "string" } } },
        required: ["recommendations"]
      };
      targetInstructions = "Return a JSON object with a single key 'recommendations' containing the refined array of recommendations.";
    } else {
      return res.status(400).json({ error: 'Invalid target section' });
    }

    const systemPrompt = `You are StudyFlow AI, an expert educational assistant.
Your task is to refine a specific section of a study session based on the user's request.
${title ? `Session Title: ${title}` : ''}
Target Section: ${target}

Current Content:
${JSON.stringify(content, null, 2)}

User Request:
"${prompt}"

Instructions:
1. Apply the user's request to the current content.
2. If they ask to "Add more", generate additional high-quality items and append them.
3. If they ask to "Make it harder", rewrite the items to be more difficult.
4. If they ask to "Simplify", rewrite to be easier to understand.
5. ${targetInstructions}
6. Respond ONLY with a valid JSON object exactly matching the requested schema. Do not include markdown blocks or any other text. Properly escape all double quotes inside strings.`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: systemPrompt }],
      response_format: { type: 'json_object' }
    });

    const resultJson = JSON.parse(response.choices[0].message.content);
    
    // We only want the data inside the target key
    const refinedData = resultJson[target] || resultJson;

    res.json({ target, data: refinedData });
  } catch (error) {
    console.error('AI Refinement Error:', error.message || error);
    res.status(500).json({ error: 'Failed to refine section' });
  }
});

app.post('/api/analyze-quiz', async (req, res) => {
  try {
    const { sessionTitle, sessionSummary, quizResults } = req.body;
    
    if (!quizResults || quizResults.total === undefined) {
      return res.status(400).json({ error: 'Quiz results are missing' });
    }

    if (!groq) {
      console.log('No GROQ_API_KEY provided. Using mock analysis.');
      await new Promise(r => setTimeout(r, 1000));
      return res.json({
        strongAreas: ['Mock Strong Area 1: Fundamentals', 'Mock Strong Area 2: Definitions'],
        areasToFocus: ['Mock Weak Area 1: Advanced concepts', 'Mock Weak Area 2: Applications'],
        aiRecommendations: 'This is a mock recommendation because the API key is missing. Based on your mock results, review your mock weak areas carefully before retaking the quiz.'
      });
    }

    const schema = {
      type: "object",
      properties: {
        strongAreas: { type: "array", items: { type: "string" } },
        areasToFocus: { type: "array", items: { type: "string" } },
        aiRecommendations: { type: "string" }
      },
      required: ["strongAreas", "areasToFocus", "aiRecommendations"]
    };

    const prompt = `You are StudyFlow AI, an expert educational assistant.
Analyze the student's quiz performance and provide personalized feedback.

Context:
Session Title: ${sessionTitle}
Session Summary: ${sessionSummary}

Quiz Results:
Total Questions: ${quizResults.total}
Correct: ${quizResults.correct}
Incorrect: ${quizResults.incorrect}
Score: ${quizResults.score}%

Details of performance:
${(quizResults.details || []).map((r, i) => `Q${i+1}: ${r.question.question}\nCorrect Answer: ${r.question.options ? r.question.options[r.question.correctIndex] : r.question.correctAnswer}\nStudent Answer: ${r.userAnswer !== null ? (r.question.options ? r.question.options[r.userAnswer] : r.userAnswer) : 'Skipped'}\nStatus: ${r.isCorrect ? 'Correct' : 'Incorrect'}`).join('\n\n')}

Based on this performance, generate:
1. "strongAreas": 2-3 short bullet points (max 5 words each) of topics the student understands well.
2. "areasToFocus": 2-3 short bullet points (max 5 words each) of topics the student needs to review.
3. "aiRecommendations": A short paragraph (2-3 sentences) with actionable advice for their next study steps. Do not use markdown, just plain text.

Respond ONLY with a valid JSON object matching this structure:
{
  "strongAreas": ["...", "..."],
  "areasToFocus": ["...", "..."],
  "aiRecommendations": "..."
}`;

    const response = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: [{ role: 'user', content: prompt }],
      response_format: { type: 'json_object' }
    });

    const resultText = response.choices[0].message.content;
    const resultJson = JSON.parse(resultText);

    res.json(resultJson);
  } catch (error) {
    console.error('Quiz Analysis Error:', error.message || error);
    return res.json({
      strongAreas: ['General Concepts (Fallback)'],
      areasToFocus: ['Detailed Applications (Fallback)'],
      aiRecommendations: 'There was an error generating AI recommendations. Please review the questions you missed manually.'
    });
  }
});

app.listen(port, () => {
  console.log(`Backend server running on port ${port}`);
});
// Nodemon trigger
