// No topo do arquivo CodeWise/backend/src/controllers/codeBuddyController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Se você ainda não tiver o dotenv configurado neste arquivo,
// adicione esta linha se o seu app.js principal ainda não o carregou.
// require('dotenv').config(); 
// (Mas é melhor que o app.js principal já tenha carregado no Passo 6)

// Inicializa o Google Generative AI com a chave do arquivo .env
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// ... (qualquer outro código que você já tenha no controller) ...

// ADICIONE ESTA NOVA FUNÇÃO EXPORTADA:
exports.handleChat = async (req, res) => {
  try {
    // Pega a mensagem do usuário do corpo da requisição
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: "Nenhum prompt fornecido." });
    }

    // Seleciona o modelo do Gemini
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // *** IMPORTANTE: Instrução do Sistema ***
    // Diga à IA como ela deve se comportar.
    const systemInstruction = `
      Você é o "CodeBuddy" (também conhecido como "CodeWise"), um assistente virtual 
      especializado em programação, focado em ensinar JavaScript para iniciantes.
      Seja amigável, didático e use exemplos de código simples.
      Responda apenas a perguntas relacionadas a JavaScript, HTML, CSS e lógica de programação.
      Se o usuário perguntar sobre outro assunto,
      gentilmente diga que você só pode ajudar com dúvidas de programação.
    `;

    // Combina a instrução do sistema com a pergunta do usuário
    // (Opcional: você pode gerenciar um histórico de chat aqui se quiser)
    const fullPrompt = `${systemInstruction}\n\nUsuário: ${prompt}\nCodeBuddy:`;

    // Gera o conteúdo
    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const text = response.text();

    // Envia a resposta do Gemini de volta para o frontend
    res.json({ reply: text });

  } catch (error) {
    console.error("Erro ao chamar a API do Gemini:", error);
    res.status(500).json({ error: "Erro ao processar sua solicitação." });
  }
};

// Se você já tem um module.exports = { ... }, 
// apenas adicione handleChat a ele, assim:
// module.exports = {
//   funcaoExistente1,
//   funcaoExistente2,
//   handleChat // <- adicione aqui
// };