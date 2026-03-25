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

export async function evaluateDrawing(base64Image: string, targetWord: string, lang: 'hu' | 'en'): Promise<EvaluationResult> {
  try {
    const response = await fetch('/api/evaluate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64Image, targetWord, lang })
    });

    if (!response.ok) {
      throw new Error("Hálózati hiba a szerverrel való kommunikáció során.");
    }

    const result = await response.json();
    return result as EvaluationResult;
  } catch (error) {
    console.error("Hiba az értékelés során:", error);
    return {
      score: 0,
      feedback: lang === 'hu' 
        ? "Borzalmas. Még a szerver is összeomlott ettől a rajztól. Próbáld újra, bár nem fűzök hozzá sok reményt."
        : "Terrible. Even the server crashed looking at this drawing. Try again, though I don't have high hopes."
    };
  }
}

export async function evaluateMultiplayerDrawing(base64Image1: string, base64Image2: string, targetWord: string, lang: 'hu' | 'en'): Promise<MultiplayerEvaluationResult> {
  try {
    const response = await fetch('/api/evaluate-multiplayer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ base64Image1, base64Image2, targetWord, lang })
    });

    if (!response.ok) {
      throw new Error("Hálózati hiba a szerverrel való kommunikáció során.");
    }

    const result = await response.json();
    return result as MultiplayerEvaluationResult;
  } catch (error) {
    console.error("Multiplayer evaluation error:", error);
    return {
      player1Score: 0, player1Feedback: lang === 'hu' ? "Hiba" : "Error",
      player2Score: 0, player2Feedback: lang === 'hu' ? "Hiba" : "Error",
      winner: 0, overallFeedback: lang === 'hu' ? "A szerver összeomlott a rajzok csúnyaságától." : "Server crashed from the sheer ugliness of both drawings."
    };
  }
}

export async function generateHintImage(targetWord: string, lang: 'hu' | 'en'): Promise<string | null> {
  try {
    const response = await fetch('/api/generate-hint', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ targetWord, lang })
    });

    if (!response.ok) {
      throw new Error("Hálózati hiba a szerverrel való kommunikáció során.");
    }

    const result = await response.json();
    return result.image || null;
  } catch (error) {
    console.error("Hiba a kép generálása során:", error);
    return null;
  }
}
