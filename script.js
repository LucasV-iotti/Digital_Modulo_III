// === Estado global (v9 — estrutura mantida; respostas mais similares) ===
const AVATARS = ['\uD83D\uDC69\uD83C\uDFFB\u200D\uD83D\uDCBB','\uD83D\uDC69\uD83C\uDFFC\u200D\uD83D\uDCBB','\uD83D\uDC69\uD83C\uDFFD\u200D\uD83D\uDCBB','\uD83D\uDC69\uD83C\uDFFE\u200D\uD83D\uDCBB','\uD83D\uDC69\uD83C\uDFFF\u200D\uD83D\uDCBB','\uD83E\uDDD1\uD83C\uDFFB\u200D\uD83D\uDCBB','\uD83E\uDDD1\uD83C\uDFFD\u200D\uD83D\uDCBB','\uD83E\uDDD1\uD83C\uDFFF\u200D\uD83D\uDCBB'];
const SEGMENTS = ['Cartões','Imobiliário','Preventivo','Over','Consignado','Financeira'];
let state = { playerName:'', avatar: AVATARS[0], missionIndex:0, mood:50, emp:0, cla:0, tec:0, transcript:[], results:[], traps:0, selectedSegment:null };

const TRAP_WORDS = ['garantido','garantia','sempre','nunca','100%','de forma alguma','sem exceção','qualquer valor','taxa zero','zerar juros','obrigatoriamente','imediatamente'];
function shuffleArray(arr){ const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; }

// Réplica automática curta — evita eco
function smartReply(){ return 'Perfeito, pode seguir.'; }

// ============= MISSÕES =============
const MISSIONS = [ missionDesemprego(), missionDoencaFamilia(), missionReducaoRenda(), missionOutrasDividas(), missionSegmentos() ];

// Utilitários de conteúdo
function sOK(t){ return msgC(`Perfeito — sobre ${t}, seguimos nessa linha.`); }

function missionDesemprego(){
  return {
    id:'m1',
    title:'Missão 1 — Desemprego',
    intro:'Receba com entusiasmo, humanize e passe segurança. Faça uma sondagem breve e explique benefícios antes da proposta.',
    nodes:[
      msgC('Oi, aqui é o João... estou desempregado e com receio de assumir qualquer parcela agora.'),
      choicesSimilar([
        opt('João, obrigado por confiar em mim. Vamos construir algo leve e adequado ao seu momento, com clareza de passos.', +3, {emp:+1, cla:+1}, 'Empatia + segurança + clareza.', 'Obrigado por considerar meu momento.'),
        opt('João, entendo a fase. Vamos organizar um caminho leve, alinhado ao que você consegue agora.', +2, {emp:+1}, 'Similar, porém sem reforço explícito de clareza.', 'Ok, podemos olhar algo leve.'),
        opt('João, posso adiantar uma proposta agora e depois ajustamos se necessário.', -1, {}, 'Queima etapas; sem sondagem.', 'Prefiro entender primeiro.'),
        opt('João, preciso dos seus dados antes de falar de proposta.', -2, {}, 'Processual cedo demais.', 'Quero conhecer a proposta antes dos dados.')
      ]),

      msgC('Perfeito — sobre começar leve e sem apertar: talvez eu consiga algo pequeno a partir do mês que vem.'),
      choicesSimilar([
        opt('Dá pra iniciar com 1º vencimento em até 59 dias e, melhorando, você pode antecipar para reduzir juros.', +3, {tec:+1, cla:+1}, 'Benefício de prazo + antecipação.', 'Ok, 1º vencimento adiante ajuda.'),
        opt('Mantemos leve agora e, conforme sua rotina estabilizar, avaliamos antecipações pontuais.', +2, {cla:+1}, 'Parecida; não cita “59 dias”.', 'Certo, entendi a lógica.'),
        opt('Se fechar agora eu consigo um cenário único, 100% garantido.', -4, {}, 'Promessa absoluta (pegadinha).', '“100% garantido” me deixa inseguro.'),
        opt('Podemos começar em 59 dias e você paga o que achar melhor, qualquer valor.', -3, {}, 'Vago/irresponsável (pegadinha).', 'Prefiro algo definido, sem “qualquer valor”.')
      ]),

      msgC('Certo — sobre os detalhes, queria um resumo objetivo antes de seguir.'),
      choicesSimilar([
        opt('Faço uma recapitulação rápida dos pontos essenciais para confirmar entendimento.', +2, {cla:+1}, 'Checagem de compreensão.', 'Beleza, manda o resumo.'),
        opt('Explico de forma direta e já envio o link em seguida.', -1, {}, 'Pula confirmação antes do link.', 'Prefiro confirmar antes do link.'),
        opt('Explico e garanto que está tudo certo, pode confiar.', -3, {}, 'Tom absoluto (pegadinha).', '“Garantir” sem detalhar não ajuda.'),
        opt('Fecho agora e te passo datas mais tarde.', -3, {}, 'Fechamento incompleto.', 'Quero as datas agora.')
      ]),

      msgC('Perfeito — pra fechar com segurança, confirma tudo por favor.'),
      choicesSimilar([
        opt('Confirmando: total R$ 900 em 3× de R$ 300; 1º venc. em 59 dias (10/10); seguintes dia 10; nº do contrato 456789. Correto?', +4, {cla:+2, tec:+1}, 'Checklist completo.', 'Agora sim, claro e completo.'),
        opt('Confirmando: 3× de R$ 300 com vencimento no dia 10. Certo?', 0, {cla:+1}, 'Faltam total e nº do contrato.', 'Falta o total e o nº do contrato.'),
        opt('Confirmando: R$ 900 em 3×, começando em 10/10. Podemos seguir.', +1, {cla:+1}, 'Falta nº do contrato.', 'Inclua o nº do contrato.'),
        opt('Envio o link e validamos depois.', -2, {}, 'Link antes da validação.', 'Prefiro validar antes do link.')
      ])
    ]
  };
}

function missionDoencaFamilia(){
  return {
    id:'m2',
    title:'Missão 2 — Doença na família',
    intro:'Acolha, conecte a necessidade (remédios/emergências) e ofereça um caminho leve e claro.',
    nodes:[
      msgC('Estou com despesas com os remédios da minha mãe. Não consigo ver acordo agora.'),
      choicesSimilar([
        opt('Sinto muito, João. Quero te apoiar com algo leve para manter seu nome regular caso precise de crédito para os remédios.', +3, {emp:+2, tec:+1}, 'Empatia + benefício prático.', 'Obrigado, isso ajuda.'),
        opt('Entendo o momento. Podemos organizar um plano leve pra não te apertar agora.', +2, {emp:+1}, 'Similar; sem citar crédito/remédios.', 'Ok, se for leve eu avalio.'),
        opt('Posso emitir um acordo agora e depois ajustamos.', -1, {}, 'Emissão sem alinhamento.', 'Quero entender antes.'),
        opt('É obrigatório fechar algo agora.', -3, {}, 'Impositivo (pegadinha).', 'Isso me desmotiva.')
      ]),

      msgC('Beleza — sobre encontrar algo leve: se ajustar, eu tento encaixar.'),
      choicesSimilar([
        opt('Para eu entender melhor a sua situação, como estão sua renda e as despesas de saúde neste mês?', +2, {emp:+1, cla:+1}, 'Sondagem personalizada.', 'Te explico meu cenário.'),
        opt('Para eu entender melhor a sua situação, qual faixa mensal você considera viável neste início?', +1, {cla:+1}, 'Similar; pergunta por faixa direta.', 'Algo baixo por enquanto.'),
        opt('Preciso de laudos neste momento.', -2, {}, 'Impositivo fora de timing (pegadinha).', 'É necessário agora?'),
        opt('Você deveria ter se planejado melhor.', -4, {}, 'Culpabilização.', 'Isso não ajuda.')
      ]),

      msgC('Entendi — considerando algo leve por alguns meses, o que você sugere?'),
      choicesSimilar([
        opt('Fechamos parcelas leves e, quando melhorar, você pode antecipar para reduzir juros.', +2, {tec:+1, cla:+1}, 'Flexibilidade + benefício.', 'Antecipar quando der ajuda.'),
        opt('Mantemos leve, mas sem falar de antecipação por enquanto.', -1, {}, 'Retira benefício relevante.', 'Preferia ter a opção de antecipar.'),
        opt('Quitar tudo logo seria melhor pra não alongar.', -2, {}, 'Desalinhado com capacidade.', 'À vista não consigo.'),
        opt('Faço um plano padrão que costuma funcionar.', -1, {}, 'Pouca personalização.', 'Queria algo mais ajustado.')
      ]),

      msgC('Perfeito — pra eu me organizar, recapitula os termos.'),
      choicesSimilar([
        opt('Total R$ 1.200 em 4× de R$ 300; vencimentos dia 10 (início 10/06); nº do contrato 456789. Alguma dúvida?', +4, {cla:+2, tec:+1}, 'Fechamento completo.', 'Agora está bem claro.'),
        opt('4× de R$ 300 a partir de 10/06. Confere?', +1, {cla:+1}, 'Faltam total e nº.', 'Falta total e nº do contrato.'),
        opt('4 parcelas de R$ 300. Ok?', 0, {}, 'Faltam datas e nº.', 'Quero as datas e o nº do contrato.'),
        opt('Te envio o link e finalizamos.', -2, {}, 'Link antes da validação.', 'Prefiro confirmar antes do link.')
      ])
    ]
  };
}

function missionReducaoRenda(){
  return {
    id:'m3',
    title:'Missão 3 — Redução de renda',
    intro:'Valorize o esforço, sonde faixa confortável e proponha algo que caiba agora, mantendo possibilidade de antecipar após melhora.',
    nodes:[
      msgC('Minha renda caiu. Faço bicos e não consigo assumir valor alto agora.'),
      choicesSimilar([
        opt('Obrigado por compartilhar. Vamos ajustar algo que resolva a pendência sem pressionar seu orçamento.', +3, {emp:+1, tec:+1}, 'Empatia + foco no objetivo.', 'Seguir assim me ajuda.'),
        opt('Entendo. Podemos estruturar um plano leve e evoluir conforme sua renda melhorar.', +2, {emp:+1}, 'Similar; menos técnico.', 'Faz sentido.'),
        opt('Sem um valor alto não consigo avançar.', -4, {}, 'Pressão inadequada.', 'Assim complica.'),
        opt('A gente começa com o valor que você quiser, qualquer valor.', -2, {}, 'Vago/irresponsável (pegadinha).', 'Prefiro orientação clara.')
      ]),

      msgC('Certo — sobre a proposta, qual seria o caminho em linhas gerais?'),
      choicesSimilar([
        opt('Para eu entender melhor a sua situação, qual faixa mensal funciona nos próximos 3–6 meses?', +2, {cla:+1}, 'Sondagem respeitosa.', 'Entre 150 e 200 eu consigo.'),
        opt('Para eu entender melhor a sua situação, que valor mensal não compromete seu orçamento hoje?', +1, {cla:+1}, 'Similar; foca no presente.', 'Algo próximo de 180.'),
        opt('Envie comprovantes agora para eu ver.', -1, {}, 'Pedido antecipado; quebra ritmo.', 'Vemos isso depois.'),
        opt('Preciso de holerite recente obrigatoriamente.', -2, {}, 'Impositivo; desalinhado.', 'Não tenho holerite.')
      ]),

      msgC('Beleza — considerando a faixa de 150 a 200, o que dá pra montar?'),
      choicesSimilar([
        opt('Fechamos nessa faixa e, quando melhorar, você pode antecipar pagamentos pra reduzir juros.', +2, {tec:+1, cla:+1}, 'Flexibilidade + benefício.', 'Boa, dá pra tocar.'),
        opt('Fico nessa faixa, mas sem falar de antecipação por ora.', -1, {}, 'Retira benefício.', 'Preferia ter a opção de antecipar.'),
        opt('Sugiro valores maiores para terminar mais rápido.', -2, {}, 'Desalinhado com capacidade.', 'Agora não comporta.'),
        opt('Fecho nessa faixa e asseguro que nada muda, 100% garantido.', -3, {}, 'Absoluta (pegadinha).', '“100%” me soa exagerado.')
      ]),

      msgC('Show — pra eu planejar, confirma os termos por favor.'),
      choicesSimilar([
        opt('Total R$ 900 em 5× de R$ 180; vencimento dia 15; nº do contrato 987654. Confere?', +4, {cla:+2, tec:+1}, 'Fechamento completo.', 'Com isso eu me organizo.'),
        opt('5× de R$ 180 começando dia 15.', +1, {cla:+1}, 'Faltam total e nº.', 'Falta o total e o nº do contrato.'),
        opt('5 boletos de R$ 180.', 0, {}, 'Faltam datas e total.', 'Preciso das datas e do total.'),
        opt('Depois mando os boletos, combinado.', -2, {}, 'Link antes da validação.', 'Prefiro validar antes dos boletos.')
      ])
    ]
  };
}

function missionOutrasDividas(){
  return {
    id:'m4',
    title:'Missão 4 — Outras dívidas',
    intro:'Mostre o benefício de regularizar este contrato para preservar crédito e organizar o financeiro.',
    nodes:[
      msgC('Tenho outras contas vencendo. Não sei se priorizo isso agora.'),
      choicesSimilar([
        opt('Entendo o aperto. Regularizar este contrato ajuda a manter seu crédito para emergências e reduz custos do atraso.', +3, {emp:+1, tec:+1}, 'Benefício concreto.', 'Faz sentido manter crédito disponível.'),
        opt('Com várias contas, podemos organizar algo leve aqui e revisar depois.', +1, {}, 'Similar; menos explícito sobre benefício.', 'Ok, pode ser um caminho.'),
        opt('Fechando agora, garanto condições únicas.', -3, {}, 'Absoluta (pegadinha).', 'Não curto “garanto”.'),
        opt('Vamos definir um valor qualquer e seguir.', -2, {}, 'Vago (pegadinha).', 'Prefiro algo definido.')
      ]),

      msgC('Ok — sobre o valor mensal, o que você sugere pra caber sem risco?'),
      choicesSimilar([
        opt('Para eu entender melhor a sua situação, qual valor mensal cabe sem risco neste período?', +2, {cla:+1}, 'Sondagem centrada na capacidade.', 'Algo baixo por alguns meses eu consigo.'),
        opt('Para eu entender melhor a sua situação, que valor te deixa confortável agora?', +1, {cla:+1}, 'Similar; foca no conforto.', 'Algo leve ajuda.'),
        opt('Precisa decidir agora.', -2, {}, 'Pressão indevida.', 'Pressão não ajuda.'),
        opt('Pode ser qualquer valor e a gente ajusta depois.', -2, {}, 'Vago (pegadinha).', 'Prefiro algo definido.')
      ]),

      msgC('Beleza — com algo leve por alguns meses, qual formato funciona melhor?'),
      choicesSimilar([
        opt('Fechamos leve agora e, se melhorar, você pode antecipar depois para reduzir encargos.', +2, {tec:+1, cla:+1}, 'Flexibilidade + benefício.', 'Antecipar depois ajuda.'),
        opt('Mantemos leve e revisamos mais à frente, sem falar de antecipação agora.', -1, {}, 'Retira benefício.', 'Preferia ter a opção de antecipar.'),
        opt('Melhor empurrar para frente.', -2, {}, 'Não resolve.', 'Quero resolver com leveza.'),
        opt('Leve e garantido que nada muda.', -3, {}, 'Absoluta (pegadinha).', '“Garantido” sem detalhes não ajuda.')
      ]),

      msgC('Fechamos — pra confirmar direitinho, recapitula os termos.'),
      choicesSimilar([
        opt('Confirmo total, parcelas, vencimentos (inclui 1º venc.) e nº do contrato; está claro?', +4, {cla:+2, tec:+1}, 'Fechamento completo + checagem.', 'Perfeito, agora está claro.'),
        opt('Envio o link e combinamos depois.', -1, {}, 'Link antes de confirmar.', 'Prefiro confirmar antes do link.'),
        opt('Falo valores por alto para agilizar.', 0, {}, 'Superficial.', 'Quero os detalhes completos.'),
        opt('Tá tudo certo, pode confiar.', -2, {}, 'Tom absoluto (pegadinha).', 'Prefiro confirmação completa.')
      ])
    ]
  };
}

function missionSegmentos(){
  return {
    id:'m5',
    title:'Missão 5 — Objeções por Segmento',
    intro:'Aplicar a técnica correta por segmento, com benefícios claros e fechamento completo.',
    setup:()=> state.selectedSegment || SEGMENTS[0],
    nodesFactory:(segment)=>{
      const heads={
        'Cartões':[ 
          msgC('Certo — sobre o meu limite, se eu renegociar eu perco?'),
          choicesSimilar([
            opt('O limite permanece ativo e vai sendo retomado conforme as parcelas são pagas; podemos iniciar com 1º vencimento em até 59 dias e você pode antecipar depois.', +4, {tec:+2, cla:+1}, 'Explica efeito no limite + prazo + antecipação.', 'Entendi, o limite retorna gradualmente conforme pagamento.'),
            opt('Seu limite não será afetado de forma alguma, é garantido.', -4, {}, 'Absoluta (pegadinha).', 'Prefiro evitar garantias absolutas.'),
            opt('O limite fica comprometido e depois some de vez.', -3, {}, 'Generalização indevida.', 'Isso me preocupa.'),
            opt('Seu limite volta automaticamente sem depender de pagamento.', -2, {}, 'Falso.', 'Não parece correto.')
          ])
        ],
        'Imobiliário':[ 
          msgC('Ok — sobre o boleto de hoje e a incorporação, eu não aceito. Tem alternativa?'),
          choicesSimilar([
            opt('Podemos escalonar o pagamento para amanhã ou depois; com 1 parcela em atraso, dá pra retirar juros de atraso e aumentar a amortização.', +4, {tec:+2, cla:+1}, 'Escalonamento + retirada de juros (condicional).', 'Escalonar pra amanhã ajuda sim.'),
            opt('Tem que pagar hoje, é o único jeito.', -3, {}, 'Impositivo/absoluto.', 'Isso não me atende.'),
            opt('Incorporamos tudo com juros obrigatórios.', -2, {}, 'Impositivo (pegadinha).', 'Soa ruim.'),
            opt('Deixamos como está; a taxa corrige sozinha depois.', -2, {}, 'Falso.', 'Não procede.')
          ])
        ],
        'Preventivo':[ 
          msgC('Certo — sobre a taxa alta e meus limites, como fica se eu unificar?'),
          choicesSimilar([
            opt('Hoje você paga produtos separados; unificando, a taxa total fica menor que a soma e reduz o risco de perder limites.', +4, {tec:+2, cla:+1}, 'Unificação + benefício direto.', 'Ficou claro o ganho da unificação.'),
            opt('Mantemos separado; as taxas se ajustam sozinhas.', -2, {}, 'Falso/omisso.', 'Prefiro mais clareza.'),
            opt('A taxa é fixa e não muda nunca.', -3, {}, 'Absoluta (pegadinha).', 'Soa exagerado.'),
            opt('Unificar não altera nada, é só burocracia.', -2, {}, 'Desvaloriza a solução.', 'Não faz sentido.')
          ])
        ],
        'Over':[ 
          msgC('Beleza — sobre a parcela alta enquanto estou desempregado, o que vocês conseguem?'),
          choicesSimilar([
            opt('Conseguimos por 1 ano parcelas menores com taxa competitiva; você paga com folga e, quando melhorar, pode antecipar para quitar mais rápido.', +4, {tec:+2, emp:+1, cla:+1}, 'Benefício temporal + acolhimento.', 'Ajuda a atravessar essa fase.'),
            opt('Sem renda, não há o que fazer.', -4, {}, 'Negação sem alternativa.', 'Isso desanima.'),
            opt('Alongamos com juros elevados para acelerar quitação.', -2, {}, 'Mensagem confusa.', 'Juros altos preocupam.'),
            opt('Mantenha como está; a parcela baixa sozinha.', -2, {}, 'Falso.', 'Não procede.')
          ])
        ],
        'Consignado':[ 
          msgC('Certo — sobre ter ido pro INSS e ter parado o desconto em folha: como eu pago agora?'),
          choicesSimilar([
            opt('Como o desconto em folha cessou, as parcelas passam a ser pagas via boleto. Posso te enviar e orientar o passo a passo?', +4, {tec:+2, cla:+1}, 'Explica mudança + guia.', 'Tudo bem, me orienta com os boletos.'),
            opt('Isso normaliza sozinho depois.', -3, {}, 'Falso.', 'Não foi o que aconteceu.'),
            opt('Precisa ir à agência obrigatoriamente.', -2, {}, 'Impositivo sem necessidade.', 'Difícil pra mim.'),
            opt('Volta a descontar no próximo mês automaticamente.', -3, {}, 'Falso.', 'Não condiz com meu caso.')
          ])
        ],
        'Financeira':[ 
          msgC('Ok — sobre os juros/encargos, existe alguma flexibilidade?'),
          choicesSimilar([
            opt('Há possibilidade de desconto sobre juros/encargos do atraso e até 5 dias úteis para pagamento do boleto; a renegociação regulariza com novo contrato adequado à sua realidade.', +4, {tec:+2, cla:+1}, 'Desconto + prazo + regularização.', 'Desconto e prazo dão fôlego.'),
            opt('Zeramos todos os juros agora, 100% garantido.', -4, {}, 'Absoluta (pegadinha).', 'Soa improvável.'),
            opt('Juros não são negociáveis em hipótese alguma.', -3, {}, 'Absoluta e desmotivadora.', 'Entendo.'),
            opt('Só reduz se quitar tudo hoje.', -2, {}, 'Pressão à vista.', 'À vista não dá pra mim.')
          ])
        ]
      };

      return [
        msgS(`Segmento escolhido: ${segment}`),
        ...heads[segment],
        msgC('Perfeito — pra eu ficar tranquilo, confirma os termos completos.'),
        choicesSimilar([
          opt('Fechamento: confirmo total, parcelas, datas (inclui 1º venc.) e nº da negociação; está claro pra você?', +4, {cla:+2, tec:+1}, 'Fechamento completo com checagem.', 'Com isso fica claro pra mim.'),
          opt('Envio o boleto e qualquer dúvida depois.', -1, {}, 'Link antes de validar.', 'Prefiro validar antes do boleto.'),
          opt('Falo só o valor mensal para agilizar.', -1, {}, 'Superficial; faltam total e nº.', 'Quero o total e o nº também.'),
          opt('Está garantido, podemos seguir.', -2, {}, 'Absoluta (pegadinha).', 'Prefiro confirmação completa.')
        ])
      ];
    }
  };
}

// ===== Helpers =====
function msgC(text){ return {type:'msg', who:'client', text}; }
function msgS(text){ return {type:'msg', who:'system', text}; }
function choicesSimilar(options){ return {type:'choices', options: shuffleArray(options)}; }
function opt(text, moodDelta=0, metrics={}, feedback='', reply=''){ return { text, moodDelta, metrics, feedback, reply }; }

// === Engine e UI (iguais ao v8) ===
const el = {
  screenStart:document.getElementById('screenStart'),
  screenGame:document.getElementById('screenGame'),
  screenEnd:document.getElementById('screenEnd'),
  chat:document.getElementById('chat'),
  choices:document.getElementById('choices'),
  missionTitle:document.getElementById('missionTitle'),
  barMood:document.getElementById('barMood'),
  mEmp:document.getElementById('mEmp'),
  mCla:document.getElementById('mCla'),
  mTec:document.getElementById('mTec'),
  btnStart:document.getElementById('btnStart'),
  playerName:document.getElementById('playerName'),
  avatarGrid:document.getElementById('avatarGrid'),
  segmentGrid:document.getElementById('segmentGrid'),
  btnRanking:document.getElementById('btnRanking'),
  btnInfo:document.getElementById('btnInfo'),
  btnSkip:document.getElementById('btnSkip'),
  summary:document.getElementById('summary'),
  btnSaveScore:document.getElementById('btnSaveScore'),
  btnPlayAgain:document.getElementById('btnPlayAgain'),
  modalRanking:document.getElementById('modalRanking'),
  rankingList:document.getElementById('rankingList'),
  btnCloseRanking:document.getElementById('btnCloseRanking'),
  btnClearRanking:document.getElementById('btnClearRanking'),
  modalInfo:document.getElementById('modalInfo'),
  btnCloseInfo:document.getElementById('btnCloseInfo'),
  overlay:document.getElementById('transitionOverlay'),
  ovTitle:document.getElementById('ovTitle'),
  ovSubtitle:document.getElementById('ovSubtitle'),
  ovBadge:document.getElementById('ovBadge')
};

const AVS = AVATARS; // alias
function renderAvatars(){ el.avatarGrid.innerHTML=''; AVS.forEach(a=>{ const d=document.createElement('div'); d.className='avatar'+(state.avatar===a?' selected':''); d.textContent=a; d.onclick=()=>{ state.avatar=a; renderAvatars(); checkStartReady(); }; el.avatarGrid.appendChild(d); }); }

function renderSegments(){
  el.segmentGrid.innerHTML='';
  SEGMENTS.forEach(seg=>{
    const b=document.createElement('button');
    b.className='segment'+(state.selectedSegment===seg?' selected':'');
    b.textContent=seg;
    b.type='button';
    b.onclick=()=>{ state.selectedSegment=seg; renderSegments(); checkStartReady(); };
    el.segmentGrid.appendChild(b);
  });
}

function checkStartReady(){ const ok=el.playerName.value.trim().length>1 && !!state.avatar && !!state.selectedSegment; el.btnStart.disabled=!ok; }
el.playerName.addEventListener('input', checkStartReady);

renderAvatars();
renderSegments();
checkStartReady();

el.btnRanking.onclick=()=>{ renderRanking(); el.modalRanking.showModal(); };
el.btnCloseRanking.onclick=()=> el.modalRanking.close();
el.btnClearRanking.onclick=()=>{ localStorage.removeItem('neg_ranking'); renderRanking(); };
el.btnInfo.onclick=()=> el.modalInfo.showModal(); el.btnCloseInfo.onclick=()=> el.modalInfo.close();

el.btnStart.onclick=()=>{
  state.playerName=el.playerName.value.trim();
  state.missionIndex=0;
  Object.assign(state,{mood:50, emp:0, cla:0, tec:0, transcript:[], results:[], traps:0});
  document.getElementById('hud').style.display='flex';
  swapScreen('screenStart','screenGame');
  showMissionOverlay('Iniciando', MISSIONS[0].title, 'Boa sorte!');
  setTimeout(playMission, 1200);
};

el.btnSkip.onclick=()=> endMission(false,'Pulado');
el.btnPlayAgain.onclick=()=>{ swapScreen('screenEnd','screenStart'); window.scrollTo(0,0); };
el.btnSaveScore.onclick=saveScore;

function swapScreen(from,to){ document.getElementById(from).classList.remove('active'); document.getElementById(to).classList.add('active'); }
function setHUD(){ const mood=Math.max(0,Math.min(100,state.mood)); el.barMood.style.width=mood+'%'; el.mEmp.textContent=state.emp; el.mCla.textContent=state.cla; el.mTec.textContent=state.tec; }
function scrollChat(){ el.chat.scrollTop = el.chat.scrollHeight; }
function pushMsg(who,text){ const d=document.createElement('div'); d.className='msg '+who; d.textContent=text; el.chat.appendChild(d); state.transcript.push({who,text}); scrollChat(); }

let currentNodes=[]; let nodeIndex=0;
function playMission(){ el.chat.innerHTML=''; el.choices.innerHTML=''; state.transcript=[]; const m=MISSIONS[state.missionIndex]; el.missionTitle.textContent=m.title; pushMsg('system', m.intro); if(m.nodesFactory){ const seg=(m.setup? m.setup(): 'Cartões'); currentNodes=m.nodesFactory(seg); } else { currentNodes=m.nodes; } nodeIndex=0; setHUD(); nextNode(); }

function nextNode(){ if(nodeIndex>=currentNodes.length){ const success=state.mood>=60 && state.cla>=3; endMission(success); return; } const node=currentNodes[nodeIndex++]; if(node.type==='msg'){ pushMsg(node.who,node.text); setTimeout(nextNode,450); } else if(node.type==='choices'){ renderChoices(node.options); } }

function renderChoices(options){ el.choices.innerHTML=''; shuffleArray(options).forEach(op=>{ const b=document.createElement('button'); b.className='choice'; b.textContent=op.text; b.onclick=()=>{ let moodDelta=op.moodDelta||0, empDelta=op.metrics?.emp||0, claDelta=op.metrics?.cla||0, tecDelta=op.metrics?.tec||0; const lower=op.text.toLowerCase(); let trapHit=false; for(const t of TRAP_WORDS){ if(lower.includes(t)){ trapHit=true; break; } } if(trapHit){ state.traps++; moodDelta += -2; claDelta += -1; } state.mood += moodDelta; state.emp += empDelta; state.cla += claDelta; state.tec += tecDelta; setHUD(); pushMsg('agent', op.text); const reply = (op.reply && op.reply.trim())? op.reply : smartReply(op.text); pushMsg('client', reply); if(op.feedback){ pushMsg('system','Feedback: '+op.feedback); } el.choices.innerHTML=''; setTimeout(nextNode, 350); }; el.choices.appendChild(b); }); }

function endMission(success, reason=''){ const m=MISSIONS[state.missionIndex]; const score=Math.max(0, Math.round(state.mood + state.emp*5 + state.cla*7 + state.tec*6 + (success?50:0))); state.results.push({mission:m.title, success, mood:state.mood, emp:state.emp, cla:state.cla, tec:state.tec, score, reason}); state.mood=50; state.emp=0; state.cla=0; state.tec=0; state.missionIndex++; if(state.missionIndex<MISSIONS.length){ const nextTitle = MISSIONS[state.missionIndex].title; showMissionOverlay(success? 'Missão concluída' : 'Missão pendente', nextTitle, success? 'Bom trabalho!': 'Revise e tente avançar.'); setTimeout(playMission, 1300); } else { showSummary(); swapScreen('screenGame','screenEnd'); } }

function showMissionOverlay(badge, nextTitle, subtitle){ el.ovBadge.textContent=badge; el.ovTitle.textContent=nextTitle; el.ovSubtitle.textContent=subtitle||'Preparando…'; el.overlay.classList.add('show'); const prog = el.overlay.querySelector('.overlay-progress .bar'); prog.style.animation='none'; void prog.offsetWidth; prog.style.animation='loadBar 1.6s ease forwards'; setTimeout(()=>{ el.overlay.classList.remove('show'); }, 1000); }

function showSummary(){ const totalScore=state.results.reduce((a,b)=>a+b.score,0); let html=`<p><strong>Jogador:</strong> ${state.playerName} ${state.avatar}</p>`; html+=`<p><strong>Pontuação total:</strong> ${totalScore} • <strong>Pegadinhas acionadas:</strong> ${state.traps}</p>`; html+='<div class="panel">'; state.results.forEach(r=>{ html+=`<p><strong>${r.mission}</strong> — ${r.success? '✔️ Sucesso':'❌ Não atingiu'} — Pontos: ${r.score}</p>`; }); html+='</div>'; el.summary.innerHTML=html; }

function saveScore(){ const total=state.results.reduce((a,b)=>a+b.score,0); const entry={ name:state.playerName, avatar:state.avatar, score:total, date:new Date().toISOString(), traps:state.traps, segment: state.selectedSegment||SEGMENTS[0] }; const key='neg_ranking'; const arr=JSON.parse(localStorage.getItem(key)||'[]'); arr.push(entry); arr.sort((a,b)=> b.score-a.score); localStorage.setItem(key, JSON.stringify(arr.slice(0,50))); renderRanking(); el.modalRanking.showModal(); }

function renderRanking(){ const arr=JSON.parse(localStorage.getItem('neg_ranking')||'[]'); el.rankingList.innerHTML=''; if(!arr.length){ const li=document.createElement('li'); li.textContent='Sem registros ainda.'; el.rankingList.appendChild(li); return; } arr.forEach((r,i)=>{ const li=document.createElement('li'); const d=new Date(r.date); li.textContent = `#${i+1} — ${r.avatar} ${r.name} — ${r.score} pts — ${d.toLocaleDateString()} — Segmento: ${r.segment||'-'} — Pegadinhas: ${r.traps}`; el.rankingList.appendChild(li); }); }
