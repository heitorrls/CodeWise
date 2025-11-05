require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testarSDK() {
  try {
    console.log("Iniciando teste do SDK Gemini...");
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

    console.log("\nTestando conexão com gemini-pro...");
    const model = genAI.getGenerativeModel({
      model: "gemini-pro",
      generationConfig: { temperature: 0.7, maxOutputTokens: 512 }
    });

    console.log("Criando sessão de chat com histórico (formato correto: content.parts)...");
    const chat = model.startChat({
      history: [
        {
          role: "user",
          content: { parts: [{ text: "Olá, você pode responder em português?" }] }
        },
        {
          role: "model",
          content: { parts: [{ text: "Sim, posso responder em português! Como posso ajudar?" }] }
        }
      ]
    });

    console.log("Enviando prompt de teste...");
    const result = await chat.sendMessage({
      content: { parts: [{ text: "Me diga apenas: OK" }] }
    });

    const response = await result.response;
    console.log("\nResposta do modelo:");
    console.log(response.text());

    console.log("\nInformações do ambiente:");
    console.log("Node version:", process.version);
    console.log("SDK version:", require('@google/generative-ai/package.json').version);

    return true;
  } catch (error) {
    console.error("\nErro detalhado:", error);
    console.log("\nInformações do ambiente:");
    console.log("Node version:", process.version);
    console.log("SDK version:", require('@google/generative-ai/package.json').version);
    console.log("API Key format:", process.env.GEMINI_API_KEY?.startsWith('AIza') ? 'Válido' : 'Inválido');

    if (error.status === 403) {
      console.log("\nPossível problema com a chave API - verifique em https://makersuite.google.com/app/apikeys");
    }
    return false;
  }
}

testarSDK().then(sucesso => {
  console.log(sucesso ? "\nTeste concluído com sucesso!" : "\nTeste falhou - verifique os erros acima.");
}).catch(console.error);