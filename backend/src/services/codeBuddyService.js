function buildCodeBuddyPrompt(question, context = {}) {
  const safeContext = context && typeof context === "object" ? context : {};

  return `
Contexto atual do aluno:

Nível: ${safeContext.student?.level || "não informado"}
Módulo atual: ${safeContext.student?.currentModule || "não informado"}
Lição atual: ${safeContext.student?.currentLesson || "não informado"}
Página atual: ${safeContext.page?.type || "não informado"}

Título da página:
${safeContext.page?.title || "não informado"}

Descrição:
${safeContext.page?.description || "não informado"}

Código atual do aluno:
\`\`\`${safeContext.editor?.language || "javascript"}
${safeContext.editor?.code || ""}
\`\`\`

Último erro:
${safeContext.execution?.lastError || "nenhum erro informado"}

Testes:
- Aprovados: ${safeContext.execution?.testsPassed ?? 0}
- Falhos: ${safeContext.execution?.testsFailed ?? 0}
- Tentativas: ${safeContext.execution?.attempts ?? 0}

Pergunta do aluno:
${question}
`;
}

module.exports = {
  buildCodeBuddyPrompt,
};
