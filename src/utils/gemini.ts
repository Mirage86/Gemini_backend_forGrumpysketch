export interface EvaluationResult {
  score: number;
  feedback: string;
}

export interface MultiplayerEvaluationResult {
  player1Score: number;
  player1Feedback: string;
  player2Score: number;
  player2Feedback: string;
  winner: 1 | 2 | 0;
  overallFeedback: string;
}

// A Renderen futó backend szervered címe
const API_BASE_URL = 'https://gemini-backend-forgrumpysketch.onrender.com';

export async function evaluateDrawing(base64Image: string, targetWord: string, lang: 'hu' | 'en'): Promise<EvaluationResult> {
  try {
    const url = `${API_BASE_URL}/api/evaluate`;
    console.log("Fetching URL:", url);
    
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64Image, targetWord, lang })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Szerver hiba (${response.status}): ${errText.substring(0, 50)}`);
    }

    const text = await response.text();
    try {
      const result = JSON.parse(text);
      return result as EvaluationResult;
    } catch (parseError: any) {
      throw new Error(`A szerver nem JSON-t küldött (Status: ${response.status}): ${text.substring(0, 50)}...`);
    }
  } catch (error: any) {
    console.error("Hiba az értékelés során:", error);
    return {
      score: 0,
      feedback: lang === 'hu' 
        ? `Hiba történt a telefonon: ${error.message}. (Lehet, hogy a Render szerver alszik, várj 1 percet és próbáld újra!)`
        : `Error on phone: ${error.message}. (Render server might be sleeping, wait 1 min!)`
    };
  }
}

export async function evaluateMultiplayerDrawing(base64Image1: string, base64Image2: string, targetWord: string, lang: 'hu' | 'en'): Promise<MultiplayerEvaluationResult> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/evaluate-multiplayer`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64Image1, base64Image2, targetWord, lang })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Szerver hiba (${response.status}): ${errText.substring(0, 50)}`);
    }

    const text = await response.text();
    try {
      const result = JSON.parse(text);
      return result as MultiplayerEvaluationResult;
    } catch (parseError: any) {
      throw new Error(`A szerver nem JSON-t küldött (Status: ${response.status}): ${text.substring(0, 50)}...`);
    }
  } catch (error: any) {
    console.error("Multiplayer evaluation error:", error);
    return {
      player1Score: 0, player1Feedback: lang === 'hu' ? "Hiba" : "Error",
      player2Score: 0, player2Feedback: lang === 'hu' ? "Hiba" : "Error",
      winner: 0, overallFeedback: lang === 'hu' 
        ? `Hiba történt a telefonon: ${error.message}. (Lehet, hogy a Render szerver alszik, várj 1 percet!)` 
        : `Error on phone: ${error.message}. (Render server might be sleeping!)`
    };
  }
}

export async function generateHintImage(targetWord: string, lang: 'hu' | 'en'): Promise<string | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/generate-hint`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetWord, lang })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Szerver hiba (${response.status}): ${errText.substring(0, 50)}`);
    }

    const text = await response.text();
    try {
      const result = JSON.parse(text);
      return result.image || null;
    } catch (parseError: any) {
      throw new Error(`A szerver nem JSON-t küldött (Status: ${response.status}): ${text.substring(0, 50)}...`);
    }
  } catch (error) {
    console.error("Hiba a kép generálása során:", error);
    return null;
  }
}
