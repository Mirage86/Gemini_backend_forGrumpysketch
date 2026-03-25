import express from "express";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import path from "path";
import cors from "cors";

const app = express();
app.use(cors());
const PORT = 3000;

// Növeljük a JSON payload limitet a base64 képek miatt
app.use(express.json({ limit: '50mb' }));

// Inicializáljuk a Gemini API-t a szerveren
// Először a VITE_GEMINI_API_KEY-t próbáljuk (ha a .env-ből jön), majd a sima GEMINI_API_KEY-t
const apiKey = process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.warn("FIGYELMEZTETÉS: Nincs beállítva a GEMINI_API_KEY vagy VITE_GEMINI_API_KEY környezeti változó!");
}
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

// 1. Végpont: Egyjátékos értékelés
app.post("/api/evaluate", async (req, res) => {
  try {
    const { base64Image, targetWord, lang } = req.body;
    const base64Data = base64Image.includes(',') ? base64Image.split(',')[1] : base64Image;

    const promptHu = `A játékosnak ezt kellett lerajzolnia: "${targetWord}". 
            Viselkedj úgy, mint egy nagyon morcos, kritikus, szarkasztikus és flegma művészetkritikus (egy "Morcos Cica" karakter, de macskás utalások nélkül). 
            Kérlek, értékeld a rajzot 1-től 10-ig terjedő skálán aszerint, hogy mennyire hasonlít a megadott dologra. 
            Ezután adj egy nagyon vicces, szarkasztikus, de játékos visszajelzést magyar nyelven. 
            Ha a rajz borzalmas, nyugodtan tedd szóvá viccesen! Ha jó, akkor is lehetsz kicsit ironikus.
            FONTOS PONTOZÁSI SZABÁLY: A pontozásnál legyél igazságosabb! Ha a rajz felismerhető és hasonlít a feladatra, adj magasabb pontot (7-10). A 2-3 pontot csak azokra a rajzokra tartogasd, amik tényleg felismerhetetlen firkák (még akkor is, ha a szöveges értékelésed flegma).
            FONTOS: Ne írd minden értékelés végére, hogy "utálom" vagy "ezt is utálom". Tilos a rajzot "krumplihoz" hasonlítani! Legyél változatosabb és kreatívabb a kritikában!
            KIFEJEZETTEN TILOS: Bármilyen macskás utalás használata (pl. karmolás, macskaszőr, nyávogás, alomtálca, dorombolás, egérfogás stb.). Csak a puszta szarkazmus maradjon!`;

    const promptEn = `The player had to draw: "${targetWord}". 
            Act like a highly cynical, sarcastic, and unimpressed art critic (a "Cranky Cat" character, but without any cat references). 
            Please evaluate the drawing on a scale of 1 to 10 based on how much it resembles the given object. 
            Then provide a very funny, sarcastic, and condescending feedback in English. 
            If the drawing is terrible, roast it hilariously! If it's good, still find a flaw.
            IMPORTANT SCORING RULE: Be fairer with the scoring! If the drawing is recognizable and resembles the target, give it a higher score (7-10). Reserve 2-3 points only for truly unrecognizable scribbles (even if your textual feedback is condescending).
            IMPORTANT: Do not end every evaluation with "I hate it" or "I hate everything". Do not compare the drawing to a "potato"! Be more creative and varied in your roasts!
            STRICTLY FORBIDDEN: Do not use any cat-related references (e.g., scratching, fur, meowing, litter box, purring, catching mice, etc.). Just pure sarcasm!`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { inlineData: { mimeType: "image/png", data: base64Data } },
          { text: lang === 'hu' ? promptHu : promptEn }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.INTEGER },
            feedback: { type: Type.STRING }
          },
          required: ["score", "feedback"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("Nem érkezett válasz az AI-tól.");
    
    res.json(JSON.parse(text));
  } catch (error) {
    console.error("Hiba az értékelés során:", error);
    res.status(500).json({
      score: 0,
      feedback: req.body.lang === 'hu' 
        ? "Borzalmas. Még a szerver is összeomlott ettől a rajztól. Próbáld újra, bár nem fűzök hozzá sok reményt."
        : "Terrible. Even the server crashed looking at this drawing. Try again, though I don't have high hopes."
    });
  }
});

// 2. Végpont: Kétjátékos értékelés
app.post("/api/evaluate-multiplayer", async (req, res) => {
  try {
    const { base64Image1, base64Image2, targetWord, lang } = req.body;
    const b64_1 = base64Image1.includes(',') ? base64Image1.split(',')[1] : base64Image1;
    const b64_2 = base64Image2.includes(',') ? base64Image2.split(',')[1] : base64Image2;

    const promptHu = `A két játékosnak ezt kellett lerajzolnia: "${targetWord}". 
            Viselkedj úgy, mint egy nagyon morcos, kritikus, szarkasztikus és flegma művészetkritikus (egy "Morcos Cica" karakter, de macskás utalások nélkül). 
            Két képet kapsz. Az ELSŐ kép az 1. Játékos rajza, a MÁSODIK kép a 2. Játékos rajza.
            Értékeld mindkét rajzot 1-től 10-ig terjedő skálán aszerint, hogy mennyire hasonlít a megadott dologra. 
            Adj mindkettőnek egy nagyon vicces, szarkasztikus visszajelzést magyar nyelven. 
            Végül hirdess győztest (1, 2, vagy 0 ha döntetlen), és adj egy általános összegző kritikát a küzdelemről.
            FONTOS PONTOZÁSI SZABÁLY: A pontozásnál legyél igazságosabb! Ha a rajz felismerhető és hasonlít a feladatra, adj magasabb pontot (7-10). A 2-3 pontot csak azokra a rajzokra tartogasd, amik tényleg felismerhetetlen firkák.
            FONTOS: Ne írd minden értékelés végére, hogy "utálom". Tilos a rajzot "krumplihoz" hasonlítani!
            KIFEJEZETTEN TILOS: Bármilyen macskás utalás használata. Csak a puszta szarkazmus maradjon!`;

    const promptEn = `The two players had to draw: "${targetWord}". 
            Act like a highly cynical, sarcastic, and unimpressed art critic (a "Cranky Cat" character, but without any cat references). 
            You will receive two images. The FIRST image is Player 1's drawing, the SECOND image is Player 2's drawing.
            Evaluate both drawings on a scale of 1 to 10 based on how much they resemble the given object. 
            Provide a very funny, sarcastic feedback for both in English. 
            Finally, declare a winner (1, 2, or 0 for a tie), and give an overall summary of their pathetic battle.
            IMPORTANT SCORING RULE: Be fairer with the scoring! If the drawing is recognizable and resembles the target, give it a higher score (7-10). Reserve 2-3 points only for truly unrecognizable scribbles.
            IMPORTANT: Do not end every evaluation with "I hate it". Do not compare the drawing to a "potato"!
            STRICTLY FORBIDDEN: Do not use any cat-related references. Just pure sarcasm!`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: {
        parts: [
          { text: "Image 1 (Player 1):" },
          { inlineData: { mimeType: "image/png", data: b64_1 } },
          { text: "Image 2 (Player 2):" },
          { inlineData: { mimeType: "image/png", data: b64_2 } },
          { text: lang === 'hu' ? promptHu : promptEn }
        ]
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            player1Score: { type: Type.INTEGER },
            player1Feedback: { type: Type.STRING },
            player2Score: { type: Type.INTEGER },
            player2Feedback: { type: Type.STRING },
            winner: { type: Type.INTEGER, description: "1 for Player 1, 2 for Player 2, 0 for tie" },
            overallFeedback: { type: Type.STRING }
          },
          required: ["player1Score", "player1Feedback", "player2Score", "player2Feedback", "winner", "overallFeedback"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response");
    
    res.json(JSON.parse(text));
  } catch (error) {
    console.error("Multiplayer evaluation error:", error);
    res.status(500).json({
      player1Score: 0, player1Feedback: req.body.lang === 'hu' ? "Hiba" : "Error",
      player2Score: 0, player2Feedback: req.body.lang === 'hu' ? "Hiba" : "Error",
      winner: 0, overallFeedback: req.body.lang === 'hu' ? "A szerver összeomlott a rajzok csúnyaságától." : "Server crashed from the sheer ugliness of both drawings."
    });
  }
});

// 3. Végpont: Segítség (Hint) generálása
app.post("/api/generate-hint", async (req, res) => {
  try {
    const { targetWord, lang } = req.body;
    const promptHu = `Egy nagyon egyszerű, letisztult, fekete-fehér vonalrajz, ami egy ${targetWord}-t ábrázol. Fehér háttér, fekete vonalak, minimalista vázlat, doodle stílus.`;
    const promptEn = `A very simple, clean, black and white line art doodle of a ${targetWord}. White background, black strokes, minimalist sketch.`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { text: lang === 'hu' ? promptHu : promptEn }
        ]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
          imageSize: "1K"
        }
      }
    });

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString: string = part.inlineData.data;
          return res.json({ image: `data:image/png;base64,${base64EncodeString}` });
        }
      }
    }
    res.status(500).json({ error: "Nem sikerült képet generálni." });
  } catch (error) {
    console.error("Hiba a kép generálása során:", error);
    res.status(500).json({ error: "Szerver hiba a generálás során." });
  }
});

async function startServer() {
  // Vite middleware a fejlesztői környezethez
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Éles (production) környezetben a lefordított fájlokat szolgálja ki
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(\`Szerver fut a http://localhost:${PORT} címen`);
  });
}

startServer();
