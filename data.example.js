/* =====================================================================
   MAPA EMOCIONAL · data.js
   ---------------------------------------------------------------------
   TODO o conteúdo do Mapa mora aqui. O app (app.js) é genérico:
   funciona com qualquer número de seções, escalas e perguntas.

   ⚠️ ESTE ARQUIVO É UM EXEMPLO. Perguntas, textos e regras abaixo são
   placeholders para testar o fluxo; substitua pelos itens validados.

   CONTRATO (campos marcados com * são obrigatórios)
   ---------------------------------------------------------------------
   version       string. Mude quando trocar as perguntas: invalida o
                 progresso salvo no localStorage de quem já começou.
   intro*        [string]  mensagens antes de pedir o nome.
   askName       string    pergunta do nome.
   afterName     [string]  mensagens logo após o nome ({nome} disponível).
   outro         [string]  mensagens antes de mostrar o resultado.
   likert        [5 strings] rótulos dos botões (1..5).
   sections*     [{id, title, transition}]
                 transition: string ou [string]; aparece ao ENTRAR na seção.
   scales*       [{id, name, group:'big5'|'emocional', color, descLow,
                   descHigh, polarity?}]
                 polarity: 'positive' (alto = recurso), 'negative' (alto =
                 ponto de atenção, ex. ansiedade) ou 'neutral' (nenhum polo
                 é melhor: vira ponto forte quando alto, nunca ponto fraco).
                 Padrão: big5 = 'neutral', emocional = 'positive'.
                 Usado para separar pontos fortes de pontos fracos.
   questions*    [{id, section, scale, text, reverse:boolean}]
                 A ordem do array = ordem no chat.
   bands*        {low:[0,40], mid:[40,60], high:[60,100]}
   results*      {[scaleId]: {low:{title,text,impact}, mid:{...}, high:{...}}}
   weakPointRules (opcional) [{when:{scaleId:'low'|'mid'|'high', ...},
                 title, text, impact}] → card extra quando TODAS as
                 condições batem (combinações entre escalas).
   strengthRules (opcional) mesmo formato, para pontos fortes.
   profileSummary função(ctx) → {title, text, short}
                 ctx = {nome, scores:{id:0-100}, bands:{id:'low'|..},
                        scales, strengths:[scale], weaknesses:[scale]}
                 `short` vai para o {perfil} da mensagem do WhatsApp.
                 Se omitido, o app gera um resumo padrão.
   disclaimer*   string.
   whatsapp*     {number:'55DDDNUMERO', text:'... {nome} ... {perfil}'}
   cta           texto do botão final.

   PONTUAÇÃO: item invertido = 6 - resposta; escore da escala =
   média dos itens convertida para 0-100 → (m - 1) / 4 * 100.
   ===================================================================== */

window.MAPA_DATA = { /* EXEMPLO — o real é data.js */
  version: "exemplo-1",

  intro: [
    "Oi! Aqui é o Izaque. 👋",
    "Que bom que você veio fazer o seu Mapa Emocional.",
    "São perguntas rápidas. Não existe resposta certa ou errada: responda pensando em como você <b>realmente é</b>, não em como gostaria de ser.",
    "Leva poucos minutos. E você pode parar e voltar depois, que eu guardo o seu progresso."
  ],
  askName: "Antes de começar: qual é o seu primeiro nome?",
  afterName: [
    "Prazer, {nome}! 😊",
    "Para cada frase, toque no quanto ela combina com você."
  ],
  outro: [
    "Pronto, {nome}. Você foi até o fim, e isso já diz muito sobre você. 💛",
    "Estou montando o seu Mapa Emocional…"
  ],

  likert: [
    "Discordo totalmente",
    "Discordo",
    "Nem concordo, nem discordo",
    "Concordo",
    "Concordo totalmente"
  ],

  sections: [
    { id: "jeito", title: "Seu jeito de ser",
      transition: ["Vamos começar pelo seu jeito de ser no dia a dia."] },
    { id: "relacoes", title: "Você e as pessoas",
      transition: ["Ótimo, {nome}. Agora quero entender como você se relaciona.", "Lembra: sem resposta certa. 😉"] },
    { id: "emocoes", title: "Suas emoções",
      transition: ["Você já passou da metade! 🙌", "Agora vamos olhar para as suas emoções. Respira e responde com calma."] },
    { id: "interior", title: "Seu mundo interior",
      transition: ["Última parte, {nome}. Essas são as mais profundas, e as mais reveladoras."] }
  ],

  scales: [
    { id: "abertura", name: "Abertura", group: "big5", color: "#2FB38A",
      descLow: "prefere o conhecido e o prático", descHigh: "curiosa, criativa, aberta ao novo" },
    { id: "conscienciosidade", name: "Organização", group: "big5", color: "#2FB38A", polarity: "positive",
      descLow: "flexível, espontânea", descHigh: "disciplinada, focada em metas" },
    { id: "extroversao", name: "Extroversão", group: "big5", color: "#2FB38A",
      descLow: "reservada, recarrega sozinha", descHigh: "sociável, energizada por pessoas" },
    { id: "amabilidade", name: "Amabilidade", group: "big5", color: "#2FB38A",
      descLow: "direta, competitiva", descHigh: "acolhedora, cooperativa" },
    { id: "neuroticismo", name: "Sensibilidade emocional", group: "big5", color: "#2FB38A", polarity: "negative",
      descLow: "estável, serena sob pressão", descHigh: "sente tudo com intensidade" },

    { id: "ansiedade", name: "Ansiedade", group: "emocional", color: "#E0A74A", polarity: "negative",
      descLow: "pouca preocupação antecipada", descHigh: "mente acelerada, preocupação constante" },
    { id: "autocritica", name: "Autocrítica", group: "emocional", color: "#D9785F", polarity: "negative",
      descLow: "gentil consigo mesma", descHigh: "cobrança interna muito alta" },
    { id: "regulacao", name: "Regulação emocional", group: "emocional", color: "#3CC79A",
      descLow: "as emoções tomam o volante", descHigh: "consegue se acalmar e escolher a resposta" },
    { id: "autoestima", name: "Autoestima", group: "emocional", color: "#C9A45C",
      descLow: "dúvida sobre o próprio valor", descHigh: "sabe o próprio valor" }
  ],

  questions: [
    { id: "q1",  section: "jeito",    scale: "abertura",          text: "Eu gosto de experimentar coisas novas, mesmo sem saber se vou gostar.", reverse: false },
    { id: "q2",  section: "jeito",    scale: "abertura",          text: "Prefiro manter a rotina do que inventar moda.", reverse: true },
    { id: "q3",  section: "jeito",    scale: "conscienciosidade", text: "Quando começo uma tarefa, eu termino.", reverse: false },
    { id: "q4",  section: "jeito",    scale: "conscienciosidade", text: "Costumo deixar as coisas para a última hora.", reverse: true },
    { id: "q5",  section: "relacoes", scale: "extroversao",       text: "Estar com pessoas me dá energia.", reverse: false },
    { id: "q6",  section: "relacoes", scale: "extroversao",       text: "Em grupos, prefiro ficar mais na minha.", reverse: true },
    { id: "q7",  section: "relacoes", scale: "amabilidade",       text: "Eu me importo de verdade com o que os outros sentem.", reverse: false },
    { id: "q8",  section: "relacoes", scale: "amabilidade",       text: "Às vezes sou dura demais com as pessoas.", reverse: true },
    { id: "q9",  section: "emocoes",  scale: "neuroticismo",      text: "Fico abalada com facilidade.", reverse: false },
    { id: "q10", section: "emocoes",  scale: "neuroticismo",      text: "Geralmente me sinto calma e tranquila.", reverse: true },
    { id: "q11", section: "emocoes",  scale: "ansiedade",         text: "Minha mente fica imaginando o que pode dar errado.", reverse: false },
    { id: "q12", section: "emocoes",  scale: "ansiedade",         text: "Tenho dificuldade para desligar e descansar.", reverse: false },
    { id: "q13", section: "emocoes",  scale: "regulacao",         text: "Quando fico com raiva, consigo me acalmar antes de reagir.", reverse: false },
    { id: "q14", section: "emocoes",  scale: "regulacao",         text: "Minhas emoções costumam decidir por mim.", reverse: true },
    { id: "q15", section: "interior", scale: "autocritica",       text: "Quando erro, eu me culpo por muito tempo.", reverse: false },
    { id: "q16", section: "interior", scale: "autocritica",       text: "Nada do que eu faço parece bom o suficiente para mim.", reverse: false },
    { id: "q17", section: "interior", scale: "autoestima",        text: "Eu me sinto uma pessoa de valor.", reverse: false },
    { id: "q18", section: "interior", scale: "autoestima",        text: "Muitas vezes me sinto menos do que os outros.", reverse: true }
  ],

  bands: { low: [0, 40], mid: [40, 60], high: [60, 100] },

  results: {
    abertura: {
      low:  { title: "Pé no chão", text: "Você valoriza o que já funciona e prefere caminhos testados.", impact: "Pode deixar oportunidades passarem por medo do desconhecido." },
      mid:  { title: "Equilíbrio entre novo e seguro", text: "Você topa o novo, mas com critério.", impact: "Às vezes fica em cima do muro entre mudar e manter." },
      high: { title: "Mente curiosa", text: "Você se alimenta de ideias, experiências e possibilidades.", impact: "Pode começar muitas coisas e se dispersar." }
    },
    conscienciosidade: {
      low:  { title: "Espontaneidade", text: "Você se adapta rápido e não se prende a planos.", impact: "Metas importantes podem ficar sempre para depois." },
      mid:  { title: "Organização na medida", text: "Você se organiza quando precisa.", impact: "Em fases difíceis, a disciplina é a primeira a cair." },
      high: { title: "Disciplina", text: "Você cumpre o que promete, inclusive para si mesma.", impact: "Pode ficar rígida e se cobrar demais quando algo foge do plano." }
    },
    extroversao: {
      low:  { title: "Profundidade", text: "Você prefere poucas relações, mas verdadeiras.", impact: "Pode se isolar justamente quando mais precisa de apoio." },
      mid:  { title: "Social sob medida", text: "Você transita bem entre estar com gente e ficar sozinha.", impact: "Nem sempre percebe quando está no limite da sua energia." },
      high: { title: "Energia que contagia", text: "Pessoas são o seu combustível.", impact: "Pode ter dificuldade de ficar a sós com o que sente." }
    },
    amabilidade: {
      low:  { title: "Franqueza", text: "Você fala o que pensa e defende os seus interesses.", impact: "Pode gerar atritos e afastar quem você ama." },
      mid:  { title: "Gentileza com limites", text: "Você cuida dos outros sem se anular.", impact: "Em conflitos, pode oscilar entre ceder e endurecer." },
      high: { title: "Coração acolhedor", text: "Você se importa genuinamente com as pessoas.", impact: "Pode dizer sim quando queria dizer não, e se esgotar." }
    },
    neuroticismo: {
      low:  { title: "Estabilidade", text: "Você se mantém serena mesmo sob pressão.", impact: "Pode minimizar o que sente e demorar a pedir ajuda." },
      mid:  { title: "Sensibilidade equilibrada", text: "Você sente, mas costuma se recompor.", impact: "Em períodos de estresse acumulado, o equilíbrio fica frágil." },
      high: { title: "Intensidade emocional", text: "Você sente tudo com muita força.", impact: "As emoções podem pesar nas decisões, no sono e nas relações." }
    },
    ansiedade: {
      low:  { title: "Mente tranquila", text: "Você não sofre tanto por antecipação.", impact: "Atenção para não subestimar riscos reais." },
      mid:  { title: "Ansiedade presente", text: "A preocupação aparece em algumas áreas da sua vida.", impact: "Pode roubar energia e presença em momentos importantes." },
      high: { title: "Mente em alerta", text: "Sua mente vive alguns passos à frente, prevendo problemas.", impact: "Pode afetar sono, foco, corpo e a sua paz no dia a dia." }
    },
    autocritica: {
      low:  { title: "Autocompaixão", text: "Você se trata com gentileza quando erra.", impact: "Só cuide para não deixar de olhar para o que precisa mudar." },
      mid:  { title: "Cobrança moderada", text: "Você se cobra, mas também se perdoa.", impact: "Em erros importantes, a voz crítica pode crescer." },
      high: { title: "Juiz interno severo", text: "Existe uma voz dentro de você que nunca acha suficiente.", impact: "Pode gerar paralisia, procrastinação e sensação de nunca estar à altura." }
    },
    regulacao: {
      low:  { title: "Emoção no volante", text: "Quando a emoção vem, ela tende a decidir por você.", impact: "Pode gerar reações das quais você se arrepende depois." },
      mid:  { title: "Regulação em construção", text: "Às vezes você consegue respirar antes de reagir.", impact: "Em gatilhos fortes, o controle ainda escapa." },
      high: { title: "Domínio emocional", text: "Você consegue sentir sem ser dominada pelo que sente.", impact: "Atenção para não confundir controle com repressão." }
    },
    autoestima: {
      low:  { title: "Valor em dúvida", text: "Você nem sempre enxerga o próprio valor.", impact: "Pode aceitar menos do que merece em relações e no trabalho." },
      mid:  { title: "Autoestima oscilante", text: "Há dias em que você se sente forte, e outros nem tanto.", impact: "Opiniões dos outros podem pesar mais do que deveriam." },
      high: { title: "Valor reconhecido", text: "Você sabe quem é e o quanto vale.", impact: "Continue cuidando disso: é a base de todas as suas escolhas." }
    }
  },

  // Combinações entre escalas (opcional). Viram cards extras.
  weakPointRules: [
    { when: { ansiedade: "high", autocritica: "high" },
      title: "Ciclo da cobrança ansiosa",
      text: "A preocupação com o futuro se soma a uma cobrança interna forte.",
      impact: "É uma combinação que costuma levar ao esgotamento emocional." }
  ],
  strengthRules: [
    { when: { regulacao: "high", amabilidade: "high" },
      title: "Inteligência emocional relacional",
      text: "Você acolhe as pessoas sem perder o próprio equilíbrio.",
      impact: "Isso te torna referência e porto seguro para quem está perto." }
  ],

  // Monta o resumo do perfil. Retorne {title, text, short}.
  profileSummary: function (ctx) {
    var forte = ctx.strengths[0], atencao = ctx.weaknesses[0];
    var tracos = ctx.scales
      .filter(function (s) { return s.group === "big5" && ctx.bands[s.id] !== "mid"; })
      .map(function (s) { return ctx.bands[s.id] === "high" ? s.descHigh : s.descLow; });
    var t = ctx.nome + ", o que mais marca o seu jeito de ser: " +
      (tracos.length ? tracos.slice(0, 2).join("; ") + "." : "equilíbrio, você transita bem entre os extremos.");
    if (forte) t += " Seu maior recurso hoje é a " + forte.name.toLowerCase() + ".";
    if (atencao) t += " E o ponto que mais pede cuidado é a " + atencao.name.toLowerCase() + ".";
    return {
      title: "O seu Mapa, " + ctx.nome,
      text: t,
      short: (forte ? "força em " + forte.name : "perfil equilibrado") +
             (atencao ? "; atenção em " + atencao.name : "")
    };
  },

  disclaimer: "Este mapa é uma ferramenta de autoconhecimento e não é diagnóstico clínico. Ele não substitui avaliação de psicólogo ou psiquiatra. Se você está em sofrimento intenso, procure um profissional de saúde ou ligue 188 (CVV, gratuito, 24h).",

  whatsapp: {
    number: "55XXXXXXXXXXX",
    text: "Oi, Izaque! Sou {nome} e acabei de fazer o Mapa Emocional. Meu resultado: {perfil}. Quero compreender mais sobre mim."
  },

  cta: "Compreenda mais a si mesma"
};
