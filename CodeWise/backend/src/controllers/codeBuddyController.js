const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const DEFAULT_MODEL = process.env.GEMINI_MODEL || "models/gemini-2.5-flash";

exports.handleChat = async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt)
      return res.status(400).json({ error: "Campo 'prompt' obrigatório." });

    // --- INSTRUÇÕES DE SISTEMA APRIMORADAS ---
    const systemInstruction = [
      // Definição de Persona e Tom
      'Você é o "CodeBuddy", um assistente de programação **sênior, didático e encorajador** da plataforma CodeWise. Seu foco é **JavaScript, Node.js e seus ecossistemas**.',
      "Sua principal missão é educar, fornecendo respostas que são fáceis de ler e implementar.",
      
      "Siga estritamente estas regras para todas as respostas:",
      "1. **Estrutura:** Use **Markdown** e comece com um título `###` relevante. Estruture a resposta em seções como: Explicação do Conceito, Exemplo Prático e Dicas Finais.",
      "2. **Formatação:** Use **negrito** para termos técnicos importantes. Use listas (`* ` ou `1. `) para organizar passos ou definições.",
      "3. **Código:** Sempre que relevante, inclua um **exemplo de código funcional e bem comentado** usando blocos Markdown com a linguagem correta (ex: ```javascript).",
      "4. **Linguagem:** Responda sempre em Português do Brasil.",
      "5. **Escopo Estrito:** Se a pergunta não for sobre JS, Node.js, TypeScript ou frameworks relacionados, **recuse educadamente**, explicando que seu conhecimento é focado na stack CodeWise.",
    ].join("\n");
    // --- FIM DAS INSTRUÇÕES ---

    console.log("Usando modelo configurado:", DEFAULT_MODEL);
    const model = genAI.getGenerativeModel({
      model: DEFAULT_MODEL,
      // Aumentando a criatividade e diversidade da resposta
      generationConfig: { temperature: 0.5, topP: 0.95, maxOutputTokens: 2048 }, 
    });

    const combinedPrompt = `${systemInstruction}\n\nPergunta: ${prompt}`;

    // Tentativa principal usando generateContent (mais simples)
    let text = null;

    try {
      const genResult = await model.generateContent(combinedPrompt);
      const genResp = await genResult.response;
      text = genResp.text();
    } catch (genErr) {
      console.warn(
        "generateContent falhou, tentando fluxo de chat como fallback:",
        genErr?.message || genErr
      );
      // Fluxo de chat como fallback (mantido por segurança, mas não deve ser necessário)
      try {
        const chat = model.startChat();
        const sendResult = await chat.sendMessage({
          content: { parts: [{ text: combinedPrompt }] },
        });
        const response = await sendResult.response;
        text = response.text();
      } catch (chatErr) {
        console.error("Fluxo de chat também falhou:", chatErr);
        throw chatErr;
      }
    }

    if (!text || text.trim().length === 0) {
      console.warn(
        "Resposta vazia do modelo, retornando mensagem de fallback."
      );
      return res.json({
        response:
          "Desculpe — não obtive uma resposta clara. Tente reformular a pergunta ou pedir um exemplo específico em JavaScript.",
        modelUsed: DEFAULT_MODEL,
      });
    }

    return res.json({ response: text, modelUsed: DEFAULT_MODEL });
  } catch (error) {
    console.error("Erro ao chamar a API do Gemini:", error);
    // ... (restante do tratamento de erro mantido)
    if (error.status === 403) {
      return res.status(500).json({
        error: "Generative Language API desativada ou chave sem permissão.",
        action: "Ative a API no Console e verifique restrições da chave.",
      });
    }
    if (error.status === 404) {
      return res.status(500).json({
        error: "Modelo não encontrado (404).",
        action:
          'Liste modelos: curl "[https://generativelanguage.googleapis.com/v1/models?key=YOUR_API_KEY](https://generativelanguage.googleapis.com/v1/models?key=YOUR_API_KEY)"',
      });
    }
    return res
      .status(500)
      .json({ error: "Erro interno ao processar a solicitação." });
  }
};