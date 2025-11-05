const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const DEFAULT_MODEL = process.env.GEMINI_MODEL || "models/gemini-2.5-flash";

exports.handleChat = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Campo 'prompt' obrigatório." });

    const systemInstruction = [
      "Você é o CodeBuddy, um assistente especialista em JavaScript.",
      "Responda apenas sobre JavaScript, Node.js e frameworks frontend relacionados.",
      "Forneça explicações concisas e, quando aplicável, inclua um pequeno exemplo de código.",
      "Se o usuário pedir depuração, solicite um exemplo mínimo reproduzível.",
      "Responda sempre em Português do Brasil."
    ].join(" ");

    console.log("Usando modelo configurado:", DEFAULT_MODEL);
    const model = genAI.getGenerativeModel({
      model: DEFAULT_MODEL,
      generationConfig: { temperature: 0.2, topP: 0.95, maxOutputTokens: 1024 }
    });

    const combinedPrompt = `${systemInstruction}\n\nPergunta: ${prompt}`;

    const result = await model.generateContent(combinedPrompt);

    const response = await result.response;
    const text = response.text();

    if (!text || text.trim().length === 0) {
      console.warn("Resposta vazia do modelo, retornando mensagem de fallback.");
      return res.json({
        response: "Desculpe — não obtive uma resposta clara. Tente reformular a pergunta ou pedir um exemplo específico em JavaScript.",
        modelUsed: DEFAULT_MODEL
      });
    }

    return res.json({ response: text, modelUsed: DEFAULT_MODEL });
  } catch (error) {
    console.error("Erro ao chamar a API do Gemini:", error);
    if (error.status === 403) {
      return res.status(500).json({
        error: "Generative Language API desativada ou chave sem permissão.",
        action: "Ative a API no Console e verifique restrições da chave."
      });
    }
    if (error.status === 404) {
      return res.status(500).json({
        error: "Modelo não encontrado (404).",
        action: 'Liste modelos: curl "https://generativelanguage.googleapis.com/v1/models?key=YOUR_API_KEY"'
      });
    }
    return res.status(500).json({ error: "Erro interno ao processar a solicitação." });
  }
};