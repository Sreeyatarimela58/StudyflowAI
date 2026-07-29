export class AIValidationError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AIValidationError';
  }
}

export class AINetworkError extends Error {
  constructor(message, status = null) {
    super(message);
    this.name = 'AINetworkError';
    this.status = status;
  }
}

export class AITimeoutError extends Error {
  constructor(message) {
    super(message);
    this.name = 'AITimeoutError';
  }
}

export function validateStudyMaterial(data) {
  if (!data || typeof data !== 'object') {
    throw new AIValidationError("Invalid response: Expected a JSON object.");
  }

  // Check empty response
  if (Object.keys(data).length === 0) {
    throw new AIValidationError("Received an empty response.");
  }

  const requiredKeys = ['title', 'summary', 'flashcards', 'quiz', 'recommendations'];
  
  for (const key of requiredKeys) {
    if (!(key in data)) {
      throw new AIValidationError(`Missing required field: ${key}`);
    }
  }

  // Validate Summary
  if (typeof data.summary !== 'string' || data.summary.trim() === '') {
    throw new AIValidationError("Invalid or empty summary field.");
  }

  // Validate Arrays
  if (!Array.isArray(data.recommendations) || data.recommendations.length === 0) {
    throw new AIValidationError("recommendations must be a non-empty array.");
  }

  if (!Array.isArray(data.flashcards) || data.flashcards.length === 0) {
    throw new AIValidationError("flashcards must be a non-empty array.");
  }

  if (!Array.isArray(data.quiz) || data.quiz.length === 0) {
    throw new AIValidationError("quiz must be a non-empty array.");
  }

  // Validate flashcards structure
  for (const card of data.flashcards) {
    if (!card || typeof card !== 'object' || !card.front || !card.back) {
      throw new AIValidationError("Invalid flashcard structure.");
    }
  }

  // Validate quiz structure
  for (const q of data.quiz) {
    if (!q || typeof q !== 'object' || !q.question || !Array.isArray(q.options) || typeof q.correctIndex !== 'number') {
      throw new AIValidationError("Invalid quiz question structure.");
    }
  }

  return true;
}
