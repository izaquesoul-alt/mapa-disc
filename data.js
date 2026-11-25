/* =====================================================================
   MAPA DISC · data.js (conteúdo REAL, v2 — 24/11/2026)
   ---------------------------------------------------------------------
   Base científica (ver "01 - Pesquisa cientifica.md" no vault):
   • Big Five: Mini-IPIP, 20 itens (Donnellan, Oswald, Baird & Lucas,
     2006, Psychological Assessment 18(2):192-203). Itens do IPIP
     (domínio público, uso comercial livre — ipip.ori.org). Tradução
     pt-BR de K. Brockveld (listada no IPIP), revisada.
   • Dimensões emocionais: facetas de Neuroticismo do IPIP-NEO
     (Goldberg, 1999; chave em ipip.ori.org/newNEOKey.htm), 4 itens por
     faceta (2 diretos, 2 invertidos). Tradução própria.
   • Faixas: provisórias (média ≤2,6 baixo · 2,6–3,7 médio · ≥3,7 alto,
     convertidas para 0-100). Não há normas brasileiras para o IPIP:
     recalibrar com as respostas reais após 300+ pessoas.
   • Posicionamento: ferramenta de AUTOCONHECIMENTO. Não chamar de
     "teste psicológico" nem "diagnóstico" (Res. CFP 31/2022).
   ===================================================================== */

window.MAPA_DATA = {
  version: "disc-1",

  intro: [
    "Oi! Aqui é o Izaque. 👋",
    "Que bom que você veio fazer o seu <b>Mapa DISC</b>.",
    "Ele mostra o seu <b>perfil comportamental DISC</b> e, por baixo dele, as suas emoções. As perguntas vêm do <b>IPIP</b>, o banco científico internacional de itens de personalidade, usado em pesquisas do mundo inteiro.",
    "Não existe resposta certa ou errada. Responda pensando em como você <b>realmente é hoje</b>, não em como gostaria de ser.",
    "São 46 frases rápidas, uns 6 minutos. Se precisar parar, eu guardo o seu progresso."
  ],
  askName: "Antes de começar: qual é o seu primeiro nome?",
  afterName: [
    "Prazer, {nome}! 😊",
    "Para cada frase, toque no quanto ela combina com você. Vai no primeiro impulso, sem pensar demais."
  ],
  outro: [
    "Pronto, {nome}. Você foi até o fim, e isso já diz muito sobre você. 💛",
    "Estou cruzando as suas 46 respostas e montando o seu Mapa DISC…"
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
      transition: ["Boa, {nome}! Agora quero entender como você se relaciona com as pessoas."] },
    { id: "emocoes", title: "Suas emoções",
      transition: ["Você já passou da metade! 🙌", "Agora vamos olhar para as suas emoções. É a parte mais importante do Mapa.", "Respira e responde com calma. Ninguém além de você vê essas respostas."] },
    { id: "pressao", title: "Você sob pressão",
      transition: ["Falta pouco! Últimas frases: como você reage quando a vida aperta."] }
  ],

  /* polarity: positive = alto é recurso · negative = alto é ponto de atenção */
  scales: [
    // ---- Big Five (Mini-IPIP) ----
    { id: "extroversao", name: "Extroversão", group: "big5", color: "#E0A74A", polarity: "positive",
      descLow: "mais reservada, que recarrega a energia no silêncio",
      descHigh: "expansiva, que ganha energia com as pessoas" },
    { id: "amabilidade", name: "Amabilidade", group: "big5", color: "#2FB38A", polarity: "positive",
      descLow: "direta e objetiva, que prioriza a razão",
      descHigh: "acolhedora, que sente e cuida das pessoas" },
    { id: "conscienciosidade", name: "Conscienciosidade", group: "big5", color: "#C9A24B", polarity: "positive",
      descLow: "flexível e espontânea, que funciona por impulso",
      descHigh: "organizada e responsável, que entrega o que promete" },
    { id: "estabilidade", name: "Equilíbrio emocional", group: "big5", color: "#5FA8D3", polarity: "positive",
      descLow: "intensa, que sente tudo com muita força",
      descHigh: "serena, que se mantém de pé quando a vida balança" },
    { id: "abertura", name: "Abertura e imaginação", group: "big5", color: "#B07CC6", polarity: "positive",
      descLow: "prática e concreta, com os pés no chão",
      descHigh: "criativa, curiosa e cheia de ideias" },

    // ---- Apoio ao DISC (faceta Assertividade, IPIP-NEO E3) — não aparece no radar ----
    { id: "assertividade", name: "Assertividade", group: "apoio", color: "#C0566B", polarity: "positive",
      descLow: "que prefere deixar os outros tomarem a frente", descHigh: "que assume o comando" },

    // ---- Dimensões emocionais (facetas de Neuroticismo, IPIP-NEO) ----
    { id: "ansiedade", name: "Ansiedade", group: "emocional", color: "#E0A74A", polarity: "negative",
      descLow: "tranquila diante do futuro", descHigh: "preocupada com o que pode dar errado" },
    { id: "irritabilidade", name: "Irritabilidade", group: "emocional", color: "#D9785F", polarity: "negative",
      descLow: "paciente", descHigh: "de pavio curto" },
    { id: "desanimo", name: "Desânimo e autocrítica", group: "emocional", color: "#8C7AB8", polarity: "negative",
      descLow: "em paz consigo mesma", descHigh: "dura consigo mesma" },
    { id: "inseguranca", name: "Insegurança", group: "emocional", color: "#5FA8D3", polarity: "negative",
      descLow: "segura para se posicionar", descHigh: "com medo de errar e de se expor" },
    { id: "sobrecarga", name: "Sobrecarga emocional", group: "emocional", color: "#C0566B", polarity: "negative",
      descLow: "firme sob pressão", descHigh: "que se sente engolida pelas emoções" }
  ],

  /* Ordem = ordem no chat (escalas intercaladas). reverse:true → 6 - resposta.
     Código entre colchetes = item original do IPIP. */
  questions: [
    // Seção 1 · jeito de ser (E, C, O)
    { id: "q01", section: "jeito", scale: "extroversao", reverse: false, text: "Eu sou a alma da festa." },                                    // Am the life of the party
    { id: "q02", section: "jeito", scale: "conscienciosidade", reverse: false, text: "Eu faço minhas tarefas logo, sem deixar para depois." }, // Get chores done right away
    { id: "q03", section: "jeito", scale: "abertura", reverse: false, text: "Eu tenho uma imaginação muito viva." },                          // Have a vivid imagination
    { id: "q04", section: "jeito", scale: "extroversao", reverse: true, text: "Eu não falo muito." },                                         // Don't talk a lot
    { id: "q05", section: "jeito", scale: "conscienciosidade", reverse: true, text: "Frequentemente esqueço de colocar as coisas de volta no lugar." }, // Often forget to put things back
    { id: "q06", section: "jeito", scale: "abertura", reverse: true, text: "Eu não me interesso por ideias abstratas." },                      // Am not interested in abstract ideas
    { id: "q07", section: "jeito", scale: "extroversao", reverse: false, text: "Em festas e encontros, eu converso com muitas pessoas diferentes." }, // Talk to a lot of different people at parties
    { id: "q08", section: "jeito", scale: "conscienciosidade", reverse: false, text: "Eu gosto de ordem e organização." },                     // Like order
    { id: "q09", section: "jeito", scale: "abertura", reverse: true, text: "Eu tenho dificuldade para entender ideias abstratas." },          // Have difficulty understanding abstract ideas
    { id: "q10", section: "jeito", scale: "extroversao", reverse: true, text: "Eu prefiro ficar nos bastidores, em segundo plano." },          // Keep in the background
    { id: "q11", section: "jeito", scale: "conscienciosidade", reverse: true, text: "Eu costumo bagunçar as coisas." },                       // Make a mess of things
    { id: "q12", section: "jeito", scale: "abertura", reverse: true, text: "Eu não tenho uma boa imaginação." },                              // Do not have a good imagination

    // Seção 2 · relações (A)
    { id: "q13", section: "relacoes", scale: "amabilidade", reverse: false, text: "Eu me solidarizo com o que os outros sentem." },             // Sympathize with others' feelings
    { id: "q14", section: "relacoes", scale: "amabilidade", reverse: true, text: "Eu não me interesso pelos problemas dos outros." },          // Am not interested in other people's problems
    { id: "q15", section: "relacoes", scale: "amabilidade", reverse: false, text: "Eu sinto as emoções das outras pessoas." },                 // Feel others' emotions
    { id: "q16", section: "relacoes", scale: "amabilidade", reverse: true, text: "No fundo, eu não me interesso muito pelas pessoas." },       // Am not really interested in others
    { id: "q16a", section: "relacoes", scale: "assertividade", reverse: false, text: "Eu assumo o comando das situações." },                // Take charge
    { id: "q16b", section: "relacoes", scale: "amabilidade", reverse: false, text: "Eu dedico tempo aos outros." },                         // Make time for others (IPIP-50)
    { id: "q16c", section: "relacoes", scale: "assertividade", reverse: true, text: "Eu espero que os outros tomem a frente." },             // Wait for others to lead the way
    { id: "q16d", section: "relacoes", scale: "assertividade", reverse: false, text: "Eu procuro liderar as pessoas." },                     // Try to lead others
    { id: "q16e", section: "relacoes", scale: "amabilidade", reverse: true, text: "Eu sinto pouca preocupação pelos outros." },              // Feel little concern for others (IPIP-50)
    { id: "q16f", section: "relacoes", scale: "assertividade", reverse: true, text: "Eu guardo as minhas opiniões para mim." },              // Hold back my opinions

    // Seção 3 · emoções (Estabilidade + Ansiedade, Irritabilidade, Desânimo, Insegurança)
    { id: "q17", section: "emocoes", scale: "estabilidade", reverse: true, text: "Meu humor muda com frequência." },                           // Have frequent mood swings (N+)
    { id: "q18", section: "emocoes", scale: "ansiedade", reverse: false, text: "Eu me preocupo com as coisas." },                             // Worry about things
    { id: "q19", section: "emocoes", scale: "irritabilidade", reverse: false, text: "Eu me irrito com facilidade." },                         // Get irritated easily
    { id: "q20", section: "emocoes", scale: "desanimo", reverse: false, text: "Eu sinto que a minha vida está sem direção." },                // Feel that my life lacks direction
    { id: "q21", section: "emocoes", scale: "inseguranca", reverse: false, text: "Eu me sinto intimidada(o) com facilidade." },               // Am easily intimidated
    { id: "q22", section: "emocoes", scale: "estabilidade", reverse: false, text: "Na maior parte do tempo, eu me sinto relaxada(o)." },        // Am relaxed most of the time (N−)
    { id: "q23", section: "emocoes", scale: "ansiedade", reverse: true, text: "Eu não me deixo abalar facilmente pelas coisas." },            // Am not easily bothered by things
    { id: "q24", section: "emocoes", scale: "irritabilidade", reverse: true, text: "Raramente eu fico com raiva." },                           // Seldom get mad
    { id: "q25", section: "emocoes", scale: "desanimo", reverse: true, text: "Eu me sinto bem comigo mesma(o)." },                            // Feel comfortable with myself
    { id: "q26", section: "emocoes", scale: "inseguranca", reverse: true, text: "Eu não fico sem graça com facilidade." },                    // Am not embarrassed easily
    { id: "q27", section: "emocoes", scale: "estabilidade", reverse: true, text: "Eu fico chateada(o) com facilidade." },                     // Get upset easily (N+)
    { id: "q28", section: "emocoes", scale: "ansiedade", reverse: false, text: "Eu sempre espero o pior." },                                 // Fear for the worst
    { id: "q29", section: "emocoes", scale: "irritabilidade", reverse: false, text: "Eu perco a paciência e explodo." },                      // Lose my temper
    { id: "q30", section: "emocoes", scale: "desanimo", reverse: false, text: "Eu não gosto de mim." },                                       // Dislike myself
    { id: "q31", section: "emocoes", scale: "inseguranca", reverse: false, text: "Eu tenho medo de fazer a coisa errada." },                   // Am afraid that I will do the wrong thing
    { id: "q32", section: "emocoes", scale: "estabilidade", reverse: false, text: "Raramente eu me sinto triste." },                          // Seldom feel blue (N−)

    // Seção 4 · sob pressão (Sobrecarga + fechamentos das facetas)
    { id: "q33", section: "pressao", scale: "sobrecarga", reverse: false, text: "Eu me sinto sobrecarregada(o) pelos acontecimentos." },       // Become overwhelmed by events
    { id: "q34", section: "pressao", scale: "ansiedade", reverse: true, text: "Eu me adapto com facilidade a situações novas." },             // Adapt easily to new situations
    { id: "q35", section: "pressao", scale: "sobrecarga", reverse: true, text: "Eu mantenho a calma sob pressão." },                          // Remain calm under pressure
    { id: "q36", section: "pressao", scale: "irritabilidade", reverse: true, text: "Eu mantenho a cabeça fria." },                            // Keep my cool
    { id: "q37", section: "pressao", scale: "sobrecarga", reverse: false, text: "Minhas emoções tomam conta de mim." },                       // Get overwhelmed by emotions
    { id: "q38", section: "pressao", scale: "inseguranca", reverse: true, text: "Eu consigo me posicionar e me defender." },                  // Am able to stand up for myself
    { id: "q39", section: "pressao", scale: "desanimo", reverse: true, text: "Eu estou satisfeita(o) comigo." },                              // Am very pleased with myself
    { id: "q40", section: "pressao", scale: "sobrecarga", reverse: true, text: "Eu me recupero rápido dos contratempos." }                     // Readily overcome setbacks
  ],

  /* média ≤2,6 → 40 · média ≥3,7 → 67,5 */
  bands: { low: [0, 40], mid: [40, 67.5], high: [67.5, 100] },

  results: {
    extroversao: {
      low: { title: "Energia que vem de dentro",
        text: "Você recarrega no silêncio e prefere poucas conversas profundas a muitas conversas rápidas. Isso não é timidez: é um jeito de funcionar.",
        impact: "Ambientes barulhentos e agendas sociais cheias drenam você mais rápido. Sem pausas planejadas, o cansaço vira irritação ou isolamento." },
      mid: { title: "Social na medida certa",
        text: "Você transita bem entre estar com as pessoas e ficar no seu canto, conforme o momento pede.",
        impact: "Sua flexibilidade é um recurso. O risco é não perceber quando já passou do seu limite social e seguir no automático." },
      high: { title: "Energia que vem das pessoas",
        text: "Você se acende perto de gente, puxa conversa e ocupa o espaço com naturalidade.",
        impact: "Na pesquisa, a extroversão aparece ligada a mais emoções positivas e à liderança. O ponto de atenção é decidir no calor do momento e ter dificuldade de ficar só com os próprios pensamentos." }
    },
    amabilidade: {
      low: { title: "Objetividade acima de tudo",
        text: "Você é direta, fala o que pensa e não se deixa levar pela emoção dos outros com facilidade.",
        impact: "Isso ajuda a negociar e a dizer não. Mas pode soar frio e gerar atritos em casa e no trabalho, quando as pessoas precisavam primeiro se sentir ouvidas." },
      mid: { title: "Equilíbrio entre cuidar e se posicionar",
        text: "Você sabe acolher, mas também sabe defender o que é seu.",
        impact: "Seu desafio é perceber em quais relações você cede demais e em quais endurece demais." },
      high: { title: "Coração que acolhe",
        text: "Você sente o que os outros sentem e cuida das pessoas ao seu redor.",
        impact: "A pesquisa liga a amabilidade a relacionamentos mais estáveis e satisfatórios. O risco é carregar o peso de todo mundo, ter dificuldade de dizer não e se colocar sempre em último lugar." }
    },
    conscienciosidade: {
      low: { title: "Espontaneidade sem trilho",
        text: "Você funciona por impulso e inspiração, e rotinas rígidas te sufocam.",
        impact: "Dos cinco fatores, este é o que mais prevê desempenho no trabalho e até saúde a longo prazo. Quando está baixo, a procrastinação e a sensação de 'começo e não termino' costumam pesar na autoestima." },
      mid: { title: "Organizada quando importa",
        text: "Você dá conta do que é prioridade, mas nem sempre sustenta a disciplina em tudo.",
        impact: "Pequenos sistemas (agenda, listas, rituais) fazem uma grande diferença no seu caso: a base você já tem." },
      high: { title: "Força realizadora",
        text: "Você é organizada e responsável, e entrega o que promete.",
        impact: "É o traço mais ligado a desempenho profissional e longevidade. O ponto de atenção é a autoexigência: quando ela se junta à ansiedade, vira perfeccionismo e culpa por descansar." }
    },
    estabilidade: {
      low: { title: "Emoções em alta intensidade",
        text: "Você sente tudo com muita força: o que é bom e o que é ruim. Seu humor oscila e as coisas te atingem com facilidade.",
        impact: "Na pesquisa, a baixa estabilidade emocional é um dos fatores mais ligados ao estresse, aos conflitos nos relacionamentos e à queda da qualidade de vida. A boa notícia: é a dimensão que mais responde a treino de regulação emocional." },
      mid: { title: "Estável, com alguns gatilhos",
        text: "No geral você se mantém de pé, mas há situações específicas que te tiram do eixo.",
        impact: "Identificar com clareza os seus gatilhos é o que separa um dia ruim de uma semana inteira perdida." },
      high: { title: "Calma interior",
        text: "Você mantém o equilíbrio quando a vida balança e se recupera bem dos golpes.",
        impact: "Esse é um recurso enorme para a saúde, a carreira e as relações. Atenção apenas para não confundir calma com engolir o que sente." }
    },
    abertura: {
      low: { title: "Pés no chão",
        text: "Você prefere o concreto e o prático ao abstrato e à teoria.",
        impact: "Você executa com objetividade. Em momentos de mudança, porém, pode resistir ao novo e ficar presa a um jeito antigo de fazer as coisas." },
      mid: { title: "Curiosidade com propósito",
        text: "Você se abre para ideias novas quando enxerga utilidade nelas.",
        impact: "Seu equilíbrio entre imaginar e executar é raro. Use isso para planejar mudanças pessoais com realismo." },
      high: { title: "Mente criativa",
        text: "Você é curiosa, imaginativa e vive cheia de ideias.",
        impact: "A abertura está ligada à criatividade e à adaptação a mudanças. O risco é começar muitos projetos e se frustrar com a distância entre a ideia e a realidade." }
    },

    ansiedade: {
      low: { title: "Pouca preocupação", text: "O futuro não costuma tirar o seu sono.", impact: "Recurso de tranquilidade. Só fique atenta a riscos reais que pedem planejamento." },
      mid: { title: "Preocupação moderada", text: "Você se preocupa, mas na maior parte do tempo consegue seguir em frente.", impact: "Em fases de pressão, essa preocupação pode crescer e roubar o seu foco e o seu sono." },
      high: { title: "Mente em alerta constante", text: "Você se preocupa muito e tende a esperar o pior.", impact: "A preocupação crônica cansa o corpo, atrapalha o sono e trava as decisões: você gasta energia com o que ainda não aconteceu." }
    },
    irritabilidade: {
      low: { title: "Paciência", text: "Você raramente perde a cabeça.", impact: "Isso protege as suas relações. Cuide só para não acumular raiva calada." },
      mid: { title: "Raiva sob controle, na maioria das vezes", text: "Você se irrita em alguns contextos específicos.", impact: "Mapear o que te tira do sério evita explosões nas horas e com as pessoas erradas." },
      high: { title: "Pavio curto", text: "Você se irrita com facilidade e às vezes explode.", impact: "As explosões geram culpa e desgaste nos relacionamentos mais próximos. Muitas vezes, a raiva é a capa de um cansaço ou de uma dor que não foi cuidada." }
    },
    desanimo: {
      low: { title: "Paz consigo mesma", text: "Você gosta de quem é e sente que a sua vida tem direção.", impact: "Essa é a base de uma autoestima saudável. Proteja-a." },
      mid: { title: "Autoestima oscilante", text: "Tem dias em que você se gosta e tem dias em que se cobra demais.", impact: "Quando a autocrítica aparece, ela pesa nas escolhas: você pode deixar oportunidades passarem por achar que não está pronta." },
      high: { title: "Autocrítica pesada", text: "Você tem sido muito dura consigo mesma e sente a vida meio sem direção.", impact: "Esse peso costuma minar a motivação e a confiança. Se a tristeza estiver frequente ou intensa, converse com um profissional de saúde: você não precisa carregar isso sozinha." }
    },
    inseguranca: {
      low: { title: "Segurança para se posicionar", text: "Você se coloca, discorda e se defende sem grande desconforto.", impact: "Esse recurso abre portas na carreira e nas relações." },
      mid: { title: "Segurança seletiva", text: "Em alguns ambientes você se posiciona bem; em outros, se encolhe.", impact: "Perceber onde você se diminui mostra onde está o seu próximo nível de crescimento." },
      high: { title: "Medo de errar e de se expor", text: "Você se intimida com facilidade e tem medo de fazer a coisa errada.", impact: "A insegurança faz você calar opiniões, aceitar menos do que merece e adiar decisões, e isso alimenta ainda mais a sensação de não ser capaz." }
    },
    sobrecarga: {
      low: { title: "Firme sob pressão", text: "Você mantém a calma e se recupera rápido quando a vida aperta.", impact: "É a sua maior proteção nas fases difíceis." },
      mid: { title: "Aguenta, mas sente", text: "Você dá conta da pressão, mas ela cobra um preço.", impact: "Sem pausas e válvulas de escape, a conta chega em forma de cansaço e irritação." },
      high: { title: "Emoções que transbordam", text: "Em momentos de pressão, as emoções tomam conta e você se sente sobrecarregada.", impact: "A sobrecarga frequente é um caminho comum para o esgotamento. Aprender a regular as emoções no momento da pressão é uma das habilidades que mais mudam a qualidade de vida." }
    }
  },

  /* Combinações (todas as condições precisam bater) */
  weakPointRules: [
    { when: { conscienciosidade: "high", ansiedade: "high" },
      title: "Perfeccionismo ansioso",
      text: "Você se cobra muito e ainda vive esperando o pior.",
      impact: "Essa combinação costuma levar à culpa por descansar e ao esgotamento: nada parece bom o suficiente." },
    { when: { conscienciosidade: "low", ansiedade: "high" },
      title: "Procrastinação ansiosa",
      text: "A preocupação trava a ação, e a ação adiada aumenta a preocupação.",
      impact: "É um ciclo que rouba produtividade e autoestima ao mesmo tempo." },
    { when: { amabilidade: "high", inseguranca: "high" },
      title: "Dificuldade de dizer não",
      text: "Você cuida de todo mundo e tem medo de desagradar.",
      impact: "Com o tempo, isso gera ressentimento silencioso e a sensação de viver para os outros." },
    { when: { irritabilidade: "high", sobrecarga: "high" },
      title: "Explosões por acúmulo",
      text: "A pressão vai enchendo o copo até transbordar em irritação.",
      impact: "Quem mais sente costuma ser quem está mais perto de você." },
    { when: { extroversao: "low", desanimo: "high" },
      title: "Risco de isolamento",
      text: "Quando você se sente mal, a tendência é se fechar.",
      impact: "O isolamento aumenta o peso da autocrítica. Ter com quem conversar faz diferença." }
  ],
  strengthRules: [
    { when: { estabilidade: "high", amabilidade: "high" },
      title: "Porto seguro",
      text: "Você acolhe as pessoas sem perder o próprio equilíbrio.",
      impact: "Isso te torna referência para quem está perto." },
    { when: { conscienciosidade: "high", sobrecarga: "low" },
      title: "Execução sob pressão",
      text: "Você entrega e mantém a calma quando a cobrança aumenta.",
      impact: "É um perfil de liderança natural em momentos de crise." },
    { when: { abertura: "high", inseguranca: "low" },
      title: "Coragem criativa",
      text: "Você tem ideias e coragem para colocá-las no mundo.",
      impact: "Essa combinação é motor de mudança na carreira e na vida." }
  ],

  /* ===================== DISC =====================
     O DISC (Marston, 1928) é um modelo de 2 eixos: dominância (ativo ×
     reservado) e afiliação (pessoas × tarefas). Esses eixos coincidem com o
     circumplexo interpessoal, que é uma rotação de Extroversão e Amabilidade
     do Big Five (McCrae & Costa, 1989, JPSP 56:586-595; Wiggins, 1979).
     Por isso o DISC aqui é CALCULADO a partir de itens IPIP validados:
       dom   = média(Assertividade, Extroversão)
       calor = Amabilidade
       D = média(dom, 100-calor)
       I = média(dom, calor)
       S = média(100-dom, calor, Equilíbrio emocional)
       C = média(100-dom, 100-calor, Conscienciosidade)
     Estilo principal = maior escore; estilo combinado quando o 2º fica a
     até 8 pontos do 1º (ex.: "DI").  */
  disc: {
    title: "Seu perfil DISC",
    compute: function (sc) {
      function m() { var t = 0; for (var i = 0; i < arguments.length; i++) t += arguments[i]; return t / arguments.length; }
      var dom = m(sc.assertividade, sc.extroversao), calor = sc.amabilidade;
      return {
        D: m(dom, 100 - calor),
        I: m(dom, calor),
        S: m(100 - dom, calor, sc.estabilidade),
        C: m(100 - dom, 100 - calor, sc.conscienciosidade)
      };
    },
    order: function (d) { return ["D", "I", "S", "C"].sort(function (a, b) { return d[b] - d[a]; }); },
    styles: {
      D: { name: "Dominância", label: "Dominante", color: "#C0566B", eixo: "Ativo + foco em resultado",
        text: "Você é movida a desafio. Decide rápido, vai direto ao ponto e não tem medo de assumir o comando.",
        forcas: ["Decisão e coragem", "Foco em resultado", "Assume responsabilidades"],
        riscos: ["Impaciência com o ritmo dos outros", "Pode atropelar sentimentos", "Dificuldade de pedir ajuda"],
        pressao: "Sob pressão, tende a ficar autoritária e a querer controlar tudo.",
        cresce: "Cresce quando aprende a ouvir antes de decidir e a confiar nas pessoas." },
      I: { name: "Influência", label: "Influente", color: "#E0A74A", eixo: "Ativo + foco em pessoas",
        text: "Você é movida a conexão. Comunica, entusiasma e contagia quem está por perto.",
        forcas: ["Comunicação e carisma", "Otimismo", "Cria conexões com facilidade"],
        riscos: ["Começar muito e terminar pouco", "Sensibilidade à rejeição", "Decidir pela emoção do momento"],
        pressao: "Sob pressão, tende a se dispersar e a buscar aprovação.",
        cresce: "Cresce quando transforma entusiasmo em rotina e aprende a sustentar o 'não'." },
      S: { name: "Estabilidade", label: "Estável", color: "#2FB38A", eixo: "Reservado + foco em pessoas",
        text: "Você é movida a segurança e harmonia. É leal, paciente e o porto seguro de muita gente.",
        forcas: ["Lealdade e constância", "Escuta e acolhimento", "Calma no dia a dia"],
        riscos: ["Dificuldade de dizer não", "Resistência a mudanças", "Engolir o que sente para evitar conflito"],
        pressao: "Sob pressão, tende a ceder, se calar e acumular por dentro.",
        cresce: "Cresce quando aprende a se posicionar e a se colocar também na lista de prioridades." },
      C: { name: "Conformidade", label: "Analítico", color: "#5FA8D3", eixo: "Reservado + foco em tarefas",
        text: "Você é movida a qualidade e precisão. Analisa, planeja e quer fazer do jeito certo.",
        forcas: ["Organização e método", "Senso crítico", "Qualidade na entrega"],
        riscos: ["Perfeccionismo", "Medo de errar trava a ação", "Autocrítica pesada"],
        pressao: "Sob pressão, tende a se fechar, se cobrar demais e adiar decisões.",
        cresce: "Cresce quando aceita o 'bom o suficiente' e age antes de ter todas as respostas." }
    }
  },

  profileSummary: function (ctx) {
    var DISC = window.MAPA_DATA.disc, d = DISC.compute(ctx.scores), o = DISC.order(d);
    var combo = (d[o[0]] - d[o[1]] <= 8) ? o[0] + o[1] : o[0];
    var nomes = combo.split("").map(function (k) { return DISC.styles[k].label; }).join("-");
    var emo = ctx.scales.filter(function (s) { return s.group === "emocional"; })
      .sort(function (a, b) { return ctx.scores[b.id] - ctx.scores[a.id]; });
    var pressao = emo[0], temPressao = pressao && ctx.bands[pressao.id] !== "low";
    var st = DISC.styles[o[0]];
    var t = ctx.nome + ", o seu perfil DISC é <b>" + combo + " (" + nomes + ")</b>. " + st.text + " " + st.pressao;
    if (temPressao) t += " Hoje, o que mais está presente na sua vida emocional é <b>" + pressao.name.toLowerCase() + " (" + Math.round(ctx.scores[pressao.id]) + "%)</b>. É aí que está a sua maior oportunidade de transformação.";
    else t += " As suas emoções estão, no geral, sob controle: uma base excelente para crescer.";
    t += " " + st.cresce;
    var short = "perfil DISC " + combo + " (" + nomes + ")" + (temPressao ? ", com " + pressao.name.toLowerCase() + " em " + Math.round(ctx.scores[pressao.id]) + "%" : "");
    return { title: "Perfil " + combo + " · " + nomes, text: t, short: short, disc: d, discOrder: o, combo: combo };
  },

  disclaimer: "O Mapa DISC é uma ferramenta de autoconhecimento. O perfil DISC é calculado a partir de itens do International Personality Item Pool (IPIP, domínio público) pelos eixos do circumplexo interpessoal (McCrae & Costa, 1989), junto com o modelo dos Cinco Grandes Fatores (Mini-IPIP, Donnellan et al., 2006) e as facetas emocionais do IPIP-NEO. Não é teste psicológico, avaliação psicológica nem diagnóstico, e não substitui o acompanhamento de psicólogo ou psiquiatra. As faixas são provisórias, sem normas brasileiras publicadas. Se você está em sofrimento intenso, procure um profissional de saúde ou ligue 188 (CVV, gratuito, 24h).",

  whatsapp: {
    number: "5521969013920",
    text: "Oi, Izaque! Sou {nome} e acabei de fazer o meu Mapa DISC. Deu {perfil}. Quero compreender mais a mim mesma."
  },

  cta: "Compreenda mais a si mesma"
};
