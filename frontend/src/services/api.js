import { validateStudyMaterial, AINetworkError, AIValidationError, AITimeoutError } from '../utils/aiValidation';

const API_URL = 'http://localhost:3001/api';

export const generateStudyMaterial = async (title, content, quizMode, signal) => {
  try {
    const response = await fetch(`${API_URL}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, content, quizMode }),
      signal
    });

    if (!response.ok) {
      throw new AINetworkError(`Server Error: ${response.status} ${response.statusText}`, response.status);
    }

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      throw new AIValidationError("Received malformed data from the server.");
    }

    validateStudyMaterial(data);

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new AITimeoutError("Request was aborted or timed out.");
    }
    console.error('Error calling AI generation API:', error);
    throw error;
  }
};



export const refineSection = async (title, target, content, prompt, signal) => {
  try {
    const response = await fetch(`${API_URL}/refine`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ title, target, content, prompt }),
      signal
    });

    if (!response.ok) {
      throw new AINetworkError(`Server Error: ${response.status} ${response.statusText}`, response.status);
    }

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      throw new AIValidationError("Received malformed data from the server.");
    }

    if (!data || !data.target || data.data === undefined) {
      throw new AIValidationError("Refinement response missing required schema.");
    }

    return data;
  } catch (error) {
    if (error.name === 'AbortError') {
      throw new AITimeoutError("Request was aborted or timed out.");
    }
    console.error('Error calling AI refinement API:', error);
    throw error;
  }
};
