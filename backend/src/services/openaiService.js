import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const BLOOM_LEVELS = ['Remember', 'Understand', 'Apply', 'Analyze', 'Evaluate', 'Create'];

export const generateStudyMaterial = async (grade, subject, topic) => {
  const prompt = `You are an expert K12 educator. Create a COMPREHENSIVE and DETAILED study guide for:
- Grade: ${grade}
- Subject: ${subject}
- Topic: ${topic}

The study guide must include:

1. **Introduction** (2-3 paragraphs): Clear explanation of what this topic is about and why it's important

2. **Key Concepts** (5-8 main points): Detailed explanation of fundamental ideas, with examples appropriate for grade ${grade}

3. **Detailed Explanation**: 
   - Break down the topic into digestible sections
   - Use simple language appropriate for grade ${grade} students
   - Include real-world examples and analogies
   - Add relevant formulas, rules, or principles (if applicable)

4. **Step-by-Step Examples**: At least 2-3 worked examples showing how to apply the concepts

5. **Important Terms**: Define 5-10 key vocabulary words related to this topic

6. **Common Mistakes**: List 3-5 common errors students make and how to avoid them

7. **Tips and Tricks**: Practical advice for mastering this topic

8. **Summary**: Concise recap of the most important points

Then create 6 practice questions with DETAILED solutions, one for each Bloom's Taxonomy level (Remember, Understand, Apply, Analyze, Evaluate, Create).

Format as JSON:
{
  "studyGuide": {
    "introduction": "detailed introduction text",
    "keyConcepts": ["concept 1 with explanation", "concept 2 with explanation", ...],
    "detailedExplanation": "comprehensive explanation with sections",
    "examples": ["example 1 with solution", "example 2 with solution", ...],
    "importantTerms": [{"term": "word", "definition": "meaning"}, ...],
    "commonMistakes": ["mistake 1 and how to avoid it", ...],
    "tipsAndTricks": ["tip 1", "tip 2", ...],
    "summary": "concise summary"
  },
  "questions": [
    {
      "bloomLevel": "Remember",
      "question": "question text",
      "solution": "detailed step-by-step solution",
      "hint": "helpful hint"
    },
    ... (one for each Bloom level)
  ]
}

Make the content rich, educational, and perfectly suited for grade ${grade} students learning ${subject}.`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert K12 educator who creates comprehensive, engaging learning materials aligned with Bloom\'s Taxonomy. Always respond with valid JSON only. Make study guides detailed and thorough - students should be able to learn the entire topic from your guide.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: 'json_object' }
    });

    const content = JSON.parse(response.choices[0].message.content);
    return content;
  } catch (error) {
    console.error('Error generating study material:', error);
    throw error;
  }
};

export const generateChatbotResponse = async (grade, subject, topic, chatHistory, currentBloomLevel) => {
  const bloomIndex = BLOOM_LEVELS.indexOf(currentBloomLevel);
  const nextLevel = bloomIndex < BLOOM_LEVELS.length - 1 ? BLOOM_LEVELS[bloomIndex + 1] : currentBloomLevel;

  const systemPrompt = `You are a patient and encouraging K12 tutor helping a grade ${grade} student learn ${subject}: ${topic}.

Your current focus is on Bloom's Taxonomy level: ${currentBloomLevel}.

Guide the student through questions at this level. When they demonstrate mastery, progress to the next level (${nextLevel}).

Always:
1. Label your questions/tasks with the Bloom's level
2. Provide hints before giving away answers
3. Celebrate progress and encourage effort
4. Adapt difficulty to grade ${grade}
5. When the student answers correctly, acknowledge and consider moving to the next Bloom's level

Respond with JSON:
{
  "message": "your response to the student",
  "bloomLevel": "${currentBloomLevel}",
  "suggestNextLevel": false or true,
  "feedback": "encouraging feedback on their learning"
}`;

  try {
    const messages = [
      { role: 'system', content: systemPrompt },
      ...chatHistory.map(msg => ({
        role: msg.is_user ? 'user' : 'assistant',
        content: msg.message
      }))
    ];

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      temperature: 0.8,
      response_format: { type: 'json_object' }
    });

    const content = JSON.parse(response.choices[0].message.content);
    return content;
  } catch (error) {
    console.error('Error generating chatbot response:', error);
    throw error;
  }
};

export const assessBloomLevel = async (question, studentAnswer, bloomLevel) => {
  const prompt = `Evaluate this student answer for a ${bloomLevel} level question on Bloom's Taxonomy.

Question: ${question}
Student Answer: ${studentAnswer}

Provide a score from 0-100 and constructive feedback.

Respond with JSON:
{
  "score": 0-100,
  "feedback": "constructive feedback",
  "strengths": "what they did well",
  "improvements": "areas to improve"
}`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are an expert educator evaluating student responses based on Bloom\'s Taxonomy criteria. Be fair but encouraging.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.5,
      response_format: { type: 'json_object' }
    });

    const content = JSON.parse(response.choices[0].message.content);
    return content;
  } catch (error) {
    console.error('Error assessing answer:', error);
    throw error;
  }
};
