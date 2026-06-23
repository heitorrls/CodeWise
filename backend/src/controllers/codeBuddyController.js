const { GoogleGenerativeAI } = require("@google/generative-ai");
const { buildCodeBuddyPrompt } = require("../services/codeBuddyService");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const DEFAULT_MODEL = process.env.GEMINI_MODEL || "models/gemini-1.5-flash";

exports.handleChat = async (req, res) => {
  try {
    const { question, message, prompt, context } = req.body || {};
    const userQuestion = question || message || prompt;
    
    if (!userQuestion) {
      return res.status(400).json({ error: "Pergunta obrigatória." });
    }

    const finalPrompt = buildCodeBuddyPrompt(userQuestion, context);

    // --- INSTRUÇÕES DE SISTEMA APRIMORADAS ---
    const systemInstruction = `
Você é o CodeBuddy, assistente oficial da plataforma CodeWise.

Você atua como um mentor de programação sênior, direto e didático, ajudando alunos a aprenderem programação na prática.

Sua especialidade é:
- JavaScript
- TypeScript
- Node.js
- Express
- React
- Next.js
- HTML
- CSS
- APIs REST
- bancos de dados usados com Node.js
- Git e GitHub
- npm, yarn e pnpm

Responda sempre em Português do Brasil.

Seu estilo:
- seja direto;
- evite respostas longas sem necessidade;
- explique de forma simples;
- priorize exemplos práticos;
- use Markdown apenas quando ajudar na leitura;
- use código funcional quando for relevante;
- comente o código apenas quando necessário;
- adapte a explicação ao nível do aluno.

Quando responder:
- comece pela resposta direta;
- depois explique rapidamente;
- inclua exemplo prático quando fizer sentido;
- finalize com uma dica apenas se ela for realmente útil.

Se a pergunta estiver fora da stack CodeWise, responda educadamente que o CodeBuddy foi criado para auxiliar com tecnologia
Você poderá receber um contexto dinâmico da tela atual do aluno.

Use esse contexto para responder com mais precisão.

Se o aluno perguntar algo genérico como:
- "não entendi"
- "me ajuda"
- "o que está errado?"
- "por que deu erro?"
- "explica de novo"

interprete a pergunta com base no contexto recebido.

Se houver código atual do aluno, analise esse código antes de responder.

Se houver último erro, explique o erro em linguagem simples.

Se estiver em uma página de exercício ou desafio:
- dê dicas progressivas;
- não entregue a resposta completa imediatamente;
- explique o raciocínio;
- entregue a solução completa somente se o aluno pedir claramente.

Não diga que não sabe qual exercício é se o contexto trouxer essa informação.

Você poderá receber um contexto dinâmico da tela atua`;
    // --- FIM DAS INSTRUÇÕES ---

    console.log("Usando modelo configurado:", DEFAULT_MODEL);
    
    // Passando o systemInstruction de forma nativa e correta para o Gemini 1.5+
    const model = genAI.getGenerativeModel({
      model: DEFAULT_MODEL,
      systemInstruction: systemInstruction, 
      generationConfig: { temperature: 0.5, topP: 0.95, maxOutputTokens: 2048 }, 
    });

    let text = null;

    // Tentativa principal usando generateContent
    try {
      // Como o systemInstruction já foi passado acima, enviamos apenas o prompt do usuário!
      const genResult = await model.generateContent(finalPrompt);
      const genResp = await genResult.response;
      text = genResp.text();
      
    } catch (genErr) {
      console.warn("generateContent falhou, tentando fluxo de chat como fallback:", genErr?.message || genErr);
      
      // Fluxo de chat como fallback
      try {
        const chat = model.startChat();
        
        // CORREÇÃO AQUI: Passar a string diretamente
        const sendResult = await chat.sendMessage(finalPrompt);
        const response = await sendResult.response;
        text = response.text();
        
      } catch (chatErr) {
        console.error("Fluxo de chat também falhou:", chatErr);
        throw chatErr;
      }
    }

    if (!text || text.trim().length === 0) {
      console.warn("Resposta vazia do modelo, retornando mensagem de fallback.");
      return res.json({
        response: "Desculpe — não obtive uma resposta clara. Tente reformular a pergunta ou pedir um exemplo específico em JavaScript.",
        modelUsed: DEFAULT_MODEL,
      });
    }

    return res.json({ response: text, modelUsed: DEFAULT_MODEL });

  } catch (error) {
    console.error("Erro ao chamar a API do Gemini:", error);
    
    if (error.status === 403) {
      return res.status(500).json({
        error: "Generative Language API desativada ou chave sem permissão.",
        action: "Ative a API no Console e verifique restrições da chave.",
      });
    }
    if (error.status === 404) {
      return res.status(500).json({
        error: "Modelo não encontrado (404).",
        action: 'Liste modelos: curl "[https://generativelanguage.googleapis.com/v1/models?key=YOUR_API_KEY](https://generativelanguage.googleapis.com/v1/models?key=YOUR_API_KEY)"',
      });
    }
    return res.status(500).json({ error: "Erro interno ao processar a solicitação." });
  }
};
