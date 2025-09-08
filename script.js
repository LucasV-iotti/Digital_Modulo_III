// === Estado global (v7.1 — sem modos, HUD/feedback ON) ===
const AVATARS = ['\uD83D\uDC69\uD83C\uDFFB\u200D\uD83D\uDCBB','\uD83D\uDC69\uD83C\uDFFC\u200D\uD83D\uDCBB','\uD83D\uDC69\uD83C\uDFFD\u200D\uD83D\uDCBB','\uD83D\uDC69\uD83C\uDFFE\u200D\uD83D\uDCBB','\uD83D\uDC69\uD83C\uDFFF\u200D\uD83D\uDCBB','\uD83E\uDDD1\uD83C\uDFFB\u200D\uD83D\uDCBB','\uD83E\uDDD1\uD83C\uDFFD\u200D\uD83D\uDCBB','\uD83E\uDDD1\uD83C\uDFFF\u200D\uD83D\uDCBB'];
let state = { playerName:'', avatar: AVATARS[0], missionIndex:0, mood:50, emp:0, cla:0, tec:0, transcript:[], results:[], traps:0 };

const TRAP_WORDS = ['garantido','garantia','sempre','nunca','100%','de forma alguma','sem exceção','qualquer valor','taxa zero','zerar juros','obrigatoriamente','imediatamente'];

function shuffleArray(arr){ const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; }

// Resposta inteligente (fallback) do cliente
function smartReply(agentText){ const t=agentText.toLowerCase();
  if(/contrato|nº da negocia|n[ºo]\s*do\s*contrato/.test(t) && /total|parcelas|venc|dia/.test(t)) return 'Perfeito, com total, datas e nº do contrato eu fico mais tranquilo.';
  if(/59\s*dias|primeiro venc|1º\s*venc/.test(t)) return 'Esse 1º vencimento em 59 dias ajuda. Como fica a data certinha?';
  if(/antecipar|antecipação|amortiza|amortizaç/.test(t)) return 'Se eu conseguir antecipar, como funciona a redução dos juros?';
  if(/boleto|link/.test(t) && !/confirm|recapitul|total|contrato|venc/.test(t)) return 'Antes do boleto/link, você pode recapitular os termos pra eu validar?';
  if(/obrigatoriamente|holerite|laudo|comprovante/.test(t)) return 'Isso é obrigatório mesmo? Tem alguma alternativa mais simples?';
  if(/limite|cart[ãa]o/.test(t)) return 'E o meu limite, volta conforme eu pago as parcelas?';
  if(/escalon|incorpor|imobili[áa]rio|amortiza/.test(t)) return 'Entendi. Escalonando, eu deixo de pagar esses juros em atraso?';
  if(/inss|consignado|folha/.test(t)) return 'Como eu recebo esses boletos então? Tem passo a passo?';
  if(/juros|encargo/.test(t)) return 'Qual seria o desconto de juros/encargos nesse cenário?';
  if(/como est[áa]|faixa|valor mensal|confort[áa]vel/.test(t)) return 'Posso dizer uma faixa, só não quero que aperte. Pode me orientar?';
  if(/parcelas/.test(t) && !/total|contrato|venc/.test(t)) return 'Faltou o total e o nº do contrato. Pode confirmar pra mim?';
  if(TRAP_WORDS.some(w=> t.includes(w))) return '“Garantido/100%”? Pode me explicar melhor essa parte?';
  return 'Certo, continua por favor.'; }

// === MISSÕES (iguais à v7) ===
const MISSIONS = [ missionDesemprego(), missionDoencaFamilia(), missionReducaoRenda(), missionOutrasDividas(), missionSegmentos() ];

function missionDesemprego(){ return { id:'m1', title:'Missão 1 — Desemprego', intro:'Cliente informa desemprego e insegurança para negociar.', nodes:[
  msgC('Oi… aqui é o João. Estou desempregado e não sei se consigo pagar nada agora.'),
  choicesSimilar([
    opt('João, obrigado por compartilhar. Vamos construir algo leve ao seu momento.', +3, {emp:+1}, 'Boa abertura: empatia personalizada.', 'Valeu por considerar meu momento. O que seria “leve” na prática?'),
    opt('João, entendo a fase. Posso orientar opções que não apertem agora.', +2, {emp:+1, cla:+1}, 'Direciona sem pressionar.', 'Ok, me mostra essas opções sem apertar.'),
    opt('João, compreendo. Se topar, já avanço com um acordo aqui.', -1, {}, 'Antecipou sem sondar.', 'Como assim já avançar sem entender meu caso?'),
    opt('Entendo. Precisamos do seu CPF e data de nascimento primeiro.', -2, {}, 'Frio/impessoal.', 'Calma, antes dos dados, queria entender a proposta.')
  ]),
  msgC('Talvez eu consiga algo pequeno mês que vem.'),
  choicesSimilar([
    opt('Podemos iniciar hoje com 1º venc. em até 59 dias; depois você pode antecipar para reduzir juros.', +3, {tec:+1, cla:+1}, 'Técnico e realista.', '59 dias ajuda. E como eu antecipo depois?'),
    opt('Melhor aguardar até você voltar ao mercado.', -2, {}, 'Adia sem plano.', 'Se deixar pra depois, fico mais enrolado.'),
    opt('Consigo isenção total de juros se fechar agora, garantido.', -4, {}, 'Promessa absoluta (trap).', 'Garantido? Isso existe mesmo?'),
    opt('Faço poucas parcelas altas para acabar rápido.', -3, {}, 'Desalinha com capacidade.', 'Parcelas altas não cabem pra mim.'),
    opt('Podemos iniciar em 59 dias e você paga o que der, qualquer valor.', -3, {}, 'Vago/irresponsável.', '“Qualquer valor” me preocupa. Preciso de algo definido.')
  ]),
  msgC('Ok, e como ficam os detalhes?'),
  choicesSimilar([
    opt('Recapitulo os pontos essenciais e confirmo se ficou claro.', +2, {cla:+1}, '', 'Perfeito, pode resumir agora.'),
    opt('Envio os boletos e depois alinhamos.', -2, {}, 'Sem confirmação.', 'Prefiro entender antes dos boletos.'),
    opt('Explico rapidamente e seguimos; está 100% garantido.', -3, {}, 'Absoluta (trap).', 'Garantido como? Tem contrato?'),
    opt('Fecho e aviso datas mais tarde.', -3, {}, '', 'Preciso das datas agora pra me organizar.')
  ]),
  msgC('Certo, pode confirmar para mim?'),
  choicesSimilar([
    opt('Confirmando: total R$ 900 em 3× de R$ 300, 1º venc. em 59 dias (10/10), seguintes dia 10, contrato nº 456789. Correto?', +4, {cla:+2, tec:+1}, 'Checklist completo.', 'Aí sim, claro e completo. Obrigado.'),
    opt('Serão 3× de R$ 300 com vencimento no dia 10. Certo?', 0, {cla:+1}, 'Faltam total e nº do contrato.', 'E o total e o número do contrato?'),
    opt('R$ 900 em 3×, começando em 10/10. Podemos seguir.', +1, {cla:+1}, 'Sem nº do contrato.', 'Falta só o nº do contrato.'),
    opt('Mando o link e a gente confirma depois.', -2, {}, 'Fechamento incompleto.', 'Sem detalhes eu fico inseguro.')
  ])
]};}

function missionDoencaFamilia(){ return { id:'m2', title:'Missão 2 — Doença na família', intro:'Cliente relata despesas com saúde; exige sensibilidade e orientação.', nodes:[
  msgC('Estou gastando com remédios da minha mãe. Não consigo ver acordo agora.'),
  choicesSimilar([
    opt('Sinto muito, João, e desejo melhoras. Para emergências, manter seu nome regular ajuda; ajustamos algo leve.', +3, {emp:+2, tec:+1}, 'Empatia + benefício.', 'Obrigado. Se for leve, consigo tentar.'),
    opt('Sinto muito. Podemos deixar para quando estabilizar e falamos depois.', -1, {}, 'Adia sem plano.', 'Se adiar, posso perder acesso a crédito quando eu mais precisar.'),
    opt('Lamento. Posso emitir um acordo e você avalia em seguida.', -1, {}, 'Sem sondagem.', 'Prefiro entender antes de emitir.'),
    opt('Entendo. É obrigatório fechar algo agora.', -3, {}, 'Impositivo (trap).', 'Obrigatório? Isso me desanima.')
  ]),
  msgC('Se tiver algo leve, posso tentar.'),
  choicesSimilar([
    opt('Para ajustar, como estão sua renda e gastos de saúde neste mês?', +2, {emp:+1, cla:+1}, '', 'Te explico a minha situação pra você ajustar.'),
    opt('Qual valor consegue hoje para começarmos?', 0, {}, '', 'Hoje é pouco; preciso que caiba no mês.'),
    opt('Envie laudos obrigatoriamente.', -2, {}, 'Jargão/impositivo.', 'Isso é mesmo necessário agora?'),
    opt('Você deveria ter se planejado melhor.', -4, {}, '', 'Isso não ajuda no momento...')
  ]),
  msgC('Consigo algo pequeno por alguns meses.'),
  choicesSimilar([
    opt('Fechamos parcelas leves e, quando puder, você antecipa para reduzir juros.', +2, {tec:+1, cla:+1}, '', 'Antecipar quando der é uma boa.'),
    opt('Melhor quitar tudo logo para não alongar.', -2, {}, '', 'À vista não consigo.'),
    opt('Dividimos sem possibilidade de antecipar.', -1, {}, '', 'Seria bom poder antecipar se melhorar.'),
    opt('Faço um plano padrão; dá no mesmo.', -1, {}, 'Sem personalização.', 'Queria algo ajustado à minha realidade.')
  ]),
  msgC('Tá, confirma por favor.'),
  choicesSimilar([
    opt('Total R$ 1.200 em 4× de R$ 300, venc. dia 10 (início 10/06), contrato nº 456789. Alguma dúvida?', +4, {cla:+2, tec:+1}, '', 'Assim fica bem claro.'),
    opt('4× de R$ 300 a partir de 10/06. Confere?', +1, {cla:+1}, 'Falta total e nº.', 'Faltou o total e o nº do contrato.'),
    opt('4 parcelas de R$ 300. Ok?', 0, {}, 'Faltam datas e nº.', 'Queria as datas e o número do contrato.'),
    opt('Te envio o link e finalizamos.', -2, {}, '', 'Prefiro confirmar antes do link.')
  ])
]};}

function missionReducaoRenda(){ return { id:'m3', title:'Missão 3 — Redução de renda', intro:'Cliente teve queda de renda e faz bicos; foque em adequação.', nodes:[
  msgC('Minha renda caiu. Faço bicos e não tenho como pagar alto agora.'),
  choicesSimilar([
    opt('Obrigado por compartilhar. Vamos ajustar algo que elimine o débito sem apertar seu orçamento.', +3, {emp:+1, tec:+1}, '', 'Boa, preciso que caiba sem apertar.'),
    opt('Entendo. Posso propor um acordo padrão.', -1, {}, 'Genérico.', 'Padrão talvez não funcione na minha realidade.'),
    opt('Sem valor alto não consigo avançar.', -4, {}, '', 'Então vai ser difícil pra mim...'),
    opt('Qualquer valor serve para começarmos.', -2, {}, 'Vago (trap).', '“Qualquer valor” me deixa confuso; quanto exatamente?')
  ]),
  msgC('Ok. Como seria a proposta?'),
  choicesSimilar([
    opt('Para calibrar, qual faixa confortável por mês nos próximos 3–6 meses?', +2, {cla:+1}, '', 'Entre 150 e 200 eu consigo.'),
    opt('Quanto consegue hoje?', 0, {}, '', 'Hoje é baixo; preciso de prazo.'),
    opt('Envie comprovantes para eu ver.', -1, {}, '', 'Consigo depois; agora queria entender a proposta.'),
    opt('Preciso de holerite recente obrigatoriamente.', -2, {}, 'Impositivo.', 'Holerite eu não tenho, faço bicos.')
  ]),
  msgC('Entre 150 e 200.'),
  choicesSimilar([
    opt('Fechamos nessa faixa e, melhorando, você pode antecipar sem penalidade.', +2, {tec:+1, cla:+1}, '', 'Se eu melhorar eu antecipo, beleza.'),
    opt('Sugiro valores maiores para terminar logo.', -2, {}, '', 'Maior eu não consigo agora.'),
    opt('Mantenho fixo sem antecipação.', -1, {}, '', 'Queria poder antecipar se der.'),
    opt('Fecho nessa faixa, 100% garantido que não muda.', -3, {}, 'Absoluta (trap).', '“100% garantido” me deixa desconfiado.')
  ]),
  msgC('Beleza. Confirma os detalhes.'),
  choicesSimilar([
    opt('Total R$ 900 em 5× de R$ 180, venc. dia 15, contrato nº 987654. Confere?', +4, {cla:+2, tec:+1}, '', 'Assim eu consigo me planejar.'),
    opt('5× de R$ 180 começando dia 15.', +1, {cla:+1}, '', 'Qual é o total e o nº do contrato?'),
    opt('5 boletos de R$ 180.', 0, {}, '', 'Preciso das datas e do total.'),
    opt('Depois mando os boletos, combinado.', -2, {}, '', 'Prefiro os termos antes dos boletos.')
  ])
]};}

function missionOutrasDividas(){ return { id:'m4', title:'Missão 4 — Outras dívidas', intro:'Cliente tem outras contas; redirecione com benefícios e fechamento completo.', nodes:[
  msgC('Tenho outras contas vencendo. Não sei se priorizo isso agora.'),
  choicesSimilar([
    opt('Entendo o aperto. Regularizar este contrato ajuda a manter crédito para emergências.', +3, {emp:+1, tec:+1}, '', 'Manter crédito pra emergência faz sentido.'),
    opt('Com tantas contas, talvez seja melhor adiar.', -1, {}, '', 'Adiando, posso piorar a situação.'),
    opt('Fechando agora, garanto condições únicas.', -3, {}, 'Absoluta (trap).', '“Garanto” me soa estranho.'),
    opt('Posso dar um super desconto se pagar tudo hoje.', -1, {}, '', 'À vista eu não consigo.')
  ]),
  msgC('Tá, até quanto dá pra ajustar?'),
  choicesSimilar([
    opt('Qual valor mensal caberia sem risco para você neste período?', +2, {cla:+1}, '', 'Algo baixo por alguns meses eu consigo.'),
    opt('Qual valor tem hoje?', 0, {}, '', 'Hoje é pouco, preciso de prazo.'),
    opt('Precisa decidir agora.', -2, {}, '', 'Pressão assim não ajuda.'),
    opt('Defina um valor qualquer e seguimos.', -2, {}, 'Vago (trap).', '“Qualquer valor” não me passa confiança.')
  ]),
  msgC('Consigo algo baixo por alguns meses.'),
  choicesSimilar([
    opt('Fechamos leve agora e você pode antecipar depois para reduzir encargos.', +2, {tec:+1, cla:+1}, '', 'Antecipar depois ajuda bastante.'),
    opt('Melhor empurrar para frente.', -2, {}, '', 'Prefiro resolver logo com parcelas leves.'),
    opt('Leve, mas sem antecipação.', -1, {}, '', 'Seria bom poder antecipar.'),
    opt('Leve e garantido que não altera.', -3, {}, 'Absoluta (trap).', '“Garantido” me deixa com o pé atrás.')
  ]),
  msgC('Confirma direitinho, por favor.'),
  choicesSimilar([
    opt('Confirmo total, parcelas, vencimentos e nº do contrato; está claro?', +4, {cla:+2, tec:+1}, '', 'Perfeito, agora está claro.'),
    opt('Envio o link e combinamos depois.', -1, {}, '', 'Sem confirmar eu não fico seguro.'),
    opt('Falo os valores por alto para agilizar.', 0, {}, '', 'Prefiro os detalhes completos.'),
    opt('Tá tudo certo, é garantido.', -2, {}, 'Absoluta (trap).', 'Evito “garantido” sem detalhar.')
  ])
]};}

function missionSegmentos(){ return { id:'m5', title:'Missão 5 — Objeções por Segmento', intro:'Segmento aleatório; use a técnica correta com alternativas muito parecidas.',
  setup:()=>{ const s=['Cartões','Imobiliário','Preventivo','Over','Consignado','Financeira']; return s[Math.floor(Math.random()*s.length)]; },
  nodesFactory:(segment)=>{
    const heads={
      'Cartões':[ msgC('Se eu renegociar, perco meu limite?'), choicesSimilar([
        opt('O limite permanece ativo e vai sendo retomado conforme as parcelas são pagas; 1º venc. pode ser em até 59 dias; você pode antecipar depois.', +4, {tec:+2, cla:+1}, '', 'Então meu limite volta aos poucos conforme eu pago?'),
        opt('Seu limite não será afetado de forma alguma, é garantido.', -4, {}, 'Absoluta (trap).', '“De forma alguma” me parece exagero.'),
        opt('O limite fica comprometido e depois some de vez.', -3, {}, 'Falso.', 'Sumir de vez? Aí fica complicado.'),
        opt('Seu limite volta automaticamente sem depender de pagamento.', -2, {}, 'Falso.', 'Voltar sem pagar? Não faz sentido.')
      ])],
      'Imobiliário':[ msgC('Não aceito boleto hoje e não quero incorporar parcelas.'), choicesSimilar([
        opt('Podemos escalonar para amanhã/depois e retirar juros de atraso (se houver 1 parcela), aumentando amortização e regularizando.', +4, {tec:+2, cla:+1}, '', 'Escalonar pra amanhã pode funcionar; retirar juros ajuda.'),
        opt('Tem que pagar hoje, é o único jeito.', -3, {}, '', 'Único jeito não dá.'),
        opt('Incorporamos tudo com juros obrigatórios.', -2, {}, 'Impositivo (trap).', 'Obrigatório por quê?'),
        opt('Deixamos como está; a taxa corrige sozinha depois.', -2, {}, 'Falso.', 'Taxa corrigir sozinha? Não parece certo.')
      ])],
      'Preventivo':[ msgC('Taxa alta e medo de perder limites.'), choicesSimilar([
        opt('Unificando seus produtos, você paga uma única taxa menor que a soma atual e reduz o risco de perder limites.', +4, {tec:+2, cla:+1}, '', 'Como funciona a unificação na prática?'),
        opt('Mantemos separado; as taxas se ajustam sozinhas.', -2, {}, '', 'Ajustar sozinho não me convence.'),
        opt('A taxa é fixa e não muda nunca.', -3, {}, 'Absoluta.', 'Nunca muda? Difícil acreditar.'),
        opt('Unificar não altera nada, é só burocracia.', -2, {}, '', 'Se não altera, por que fariam?')
      ])],
      'Over':[ msgC('Parcela está alta e estou desempregado.'), choicesSimilar([
        opt('Por 1 ano oferecemos parcelas menores com taxa competitiva; você paga sem apertar e pode antecipar quando melhorar.', +4, {tec:+2, emp:+1, cla:+1}, '', '1 ano de parcelas menores ajuda. Posso antecipar quando arrumar trabalho.'),
        opt('Sem renda, não há o que fazer.', -4, {}, '', 'Assim fica impossível.'),
        opt('Alongamos com juros elevados para acelerar quitação.', -2, {}, '', 'Juros elevados me preocupam.'),
        opt('Mantenha como está; a parcela baixa sozinha.', -2, {}, 'Falso.', 'Baixar sozinha? Não faz sentido.')
      ])],
      'Consignado':[ msgC('Fui para o INSS e parou de descontar em folha.'), choicesSimilar([
        opt('Como o desconto em folha cessou, as parcelas devem ser pagas via boleto. Posso enviar e te orientar no passo a passo?', +4, {tec:+2, cla:+1}, '', 'Ok, me mande o passo a passo com os boletos.'),
        opt('Isso normaliza sozinho depois.', -3, {}, '', 'Se normaliza sozinho, por que estou devendo?'),
        opt('Precisa ir à agência obrigatoriamente.', -2, {}, 'Impositivo.', 'Não consigo ir agora; tem outro caminho?'),
        opt('Volta a descontar no próximo mês automaticamente.', -3, {}, 'Falso.', 'Automático? Não foi o que aconteceu.')
      ])],
      'Financeira':[ msgC('Não quero pagar juros.'), choicesSimilar([
        opt('Há possibilidade de desconto em juros/encargos do atraso e até 5 dias úteis para pagar; a renegociação regulariza com novo contrato.', +4, {tec:+2, cla:+1}, '', 'Qual seria esse desconto de juros/encargos?'),
        opt('Zeramos todos os juros agora, 100% garantido.', -4, {}, 'Absoluta (trap).', '“100%”? Duvido que zere tudo.'),
        opt('Juros não são negociáveis em hipótese alguma.', -3, {}, 'Absoluta.', 'Nada negociável? Difícil.'),
        opt('Só reduz se quitar tudo hoje.', -2, {}, '', 'À vista eu não consigo.')
      ])]
    };
    const seq=heads[segment];
    return [ msgS(`Segmento: ${segment}`), ...seq,
      msgC('Certo, confirma os termos?'),
      choicesSimilar([
        opt('Fechamento: confirmar total, parcelas, datas (inclui 1º venc.) e nº da negociação; está claro?', +4, {cla:+2, tec:+1}, '', 'Confirmando tudo fica claro pra mim.'),
        opt('Envio o boleto e qualquer dúvida depois.', -1, {}, '', 'Prefiro confirmar antes do boleto.'),
        opt('Falo só o valor mensal para agilizar.', -1, {}, '', 'Quero o total e o nº do contrato também.'),
        opt('Está garantido, podemos seguir.', -2, {}, 'Absoluta (trap).', '“Garantido” sem detalhes? Prefiro confirmar.')
      ])
    ];
  }
};}

// Helpers
function msgC(text){ return {type:'msg', who:'client', text}; }
function msgS(text){ return {type:'msg', who:'system', text}; }
function choicesSimilar(options){ return {type:'choices', options: shuffleArray(options)}; }
function opt(text, moodDelta=0, metrics={}, feedback='', reply=''){ return { text, moodDelta, metrics, feedback, reply }; }

// === Engine e UI ===
const el = { screenStart:document.getElementById('screenStart'), screenGame:document.getElementById('screenGame'), screenEnd:document.getElementById('screenEnd'), chat:document.getElementById('chat'), choices:document.getElementById('choices'), missionTitle:document.getElementById('missionTitle'), barMood:document.getElementById('barMood'), mEmp:document.getElementById('mEmp'), mCla:document.getElementById('mCla'), mTec:document.getElementById('mTec'), btnStart:document.getElementById('btnStart'), playerName:document.getElementById('playerName'), avatarGrid:document.getElementById('avatarGrid'), btnRanking:document.getElementById('btnRanking'), btnInfo:document.getElementById('btnInfo'), btnSkip:document.getElementById('btnSkip'), summary:document.getElementById('summary'), btnSaveScore:document.getElementById('btnSaveScore'), btnPlayAgain:document.getElementById('btnPlayAgain'), modalRanking:document.getElementById('modalRanking'), rankingList:document.getElementById('rankingList'), btnCloseRanking:document.getElementById('btnCloseRanking'), btnClearRanking:document.getElementById('btnClearRanking'), modalInfo:document.getElementById('modalInfo'), btnCloseInfo:document.getElementById('btnCloseInfo'), overlay:document.getElementById('transitionOverlay'), ovTitle:document.getElementById('ovTitle'), ovSubtitle:document.getElementById('ovSubtitle'), ovBadge:document.getElementById('ovBadge') };

const AVS = AVATARS; // alias
function renderAvatars(){ el.avatarGrid.innerHTML=''; AVS.forEach(a=>{ const d=document.createElement('div'); d.className='avatar'+(state.avatar===a?' selected':''); d.textContent=a; d.onclick=()=>{ state.avatar=a; renderAvatars(); checkStartReady(); }; el.avatarGrid.appendChild(d); }); }
function checkStartReady(){ const ok=el.playerName.value.trim().length>1 && !!state.avatar; el.btnStart.disabled=!ok; }
el.playerName.addEventListener('input', checkStartReady); renderAvatars(); checkStartReady();

el.btnRanking.onclick=()=>{ renderRanking(); el.modalRanking.showModal(); };
el.btnCloseRanking.onclick=()=> el.modalRanking.close();
el.btnClearRanking.onclick=()=>{ localStorage.removeItem('neg_ranking'); renderRanking(); };
el.btnInfo.onclick=()=> el.modalInfo.showModal(); el.btnCloseInfo.onclick=()=> el.modalInfo.close();

el.btnStart.onclick=()=>{ state.playerName=el.playerName.value.trim(); state.missionIndex=0; Object.assign(state,{mood:50, emp:0, cla:0, tec:0, transcript:[], results:[], traps:0}); document.getElementById('hud').style.display='flex'; swapScreen('screenStart','screenGame'); // transição inicial
  showMissionOverlay('Iniciando', MISSIONS[0].title, 'Boa sorte!'); setTimeout(playMission, 1200); };
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

function renderChoices(options){ el.choices.innerHTML=''; shuffleArray(options).forEach(op=>{ const b=document.createElement('button'); b.className='choice'; b.textContent=op.text; b.onclick=()=>{
      let moodDelta=op.moodDelta||0, empDelta=op.metrics?.emp||0, claDelta=op.metrics?.cla||0, tecDelta=op.metrics?.tec||0;
      const lower=op.text.toLowerCase(); let trapHit=false; for(const t of TRAP_WORDS){ if(lower.includes(t)){ trapHit=true; break; }}
      if(trapHit){ state.traps++; moodDelta += -2; claDelta += -1; }
      state.mood += moodDelta; state.emp += empDelta; state.cla += claDelta; state.tec += tecDelta; setHUD();
      pushMsg('agent', op.text);
      const reply = (op.reply && op.reply.trim())? op.reply : smartReply(op.text);
      pushMsg('client', reply);
      if(op.feedback){ pushMsg('system','Feedback: '+op.feedback); }
      el.choices.innerHTML=''; setTimeout(nextNode, 350);
    }; el.choices.appendChild(b); }); }

function endMission(success, reason=''){ const m=MISSIONS[state.missionIndex]; const score=Math.max(0, Math.round(state.mood + state.emp*5 + state.cla*7 + state.tec*6 + (success?50:0))); state.results.push({mission:m.title, success, mood:state.mood, emp:state.emp, cla:state.cla, tec:state.tec, score, reason});
  // preparar próxima missão
  state.mood=50; state.emp=0; state.cla=0; state.tec=0; state.missionIndex++;
  if(state.missionIndex<MISSIONS.length){ const nextTitle = MISSIONS[state.missionIndex].title; showMissionOverlay(success? 'Missão concluída' : 'Missão pendente', nextTitle, success? 'Bom trabalho!': 'Revise e tente avançar.'); setTimeout(playMission, 1300); } else { showSummary(); swapScreen('screenGame','screenEnd'); } }

// === Overlay de transição ===
function showMissionOverlay(badge, nextTitle, subtitle){ el.ovBadge.textContent=badge; el.ovTitle.textContent=nextTitle; el.ovSubtitle.textContent=subtitle||'Preparando…'; el.overlay.classList.add('show'); // reset progress animation
  const prog = el.overlay.querySelector('.overlay-progress .bar'); prog.style.animation='none'; // trigger reflow
  void prog.offsetWidth; prog.style.animation='loadBar 1.6s ease forwards'; setTimeout(()=>{ el.overlay.classList.remove('show'); }, 1000); }

function showSummary(){ const totalScore=state.results.reduce((a,b)=>a+b.score,0); let html=`<p><strong>Jogador:</strong> ${state.playerName} ${state.avatar}</p>`; html+=`<p><strong>Pontuação total:</strong> ${totalScore} • <strong>Pegadinhas acionadas:</strong> ${state.traps}</p>`; html+='<div class="panel">'; state.results.forEach(r=>{ html+=`<p><strong>${r.mission}</strong> — ${r.success? '✔️ Sucesso':'❌ Não atingiu'} — Pontos: ${r.score}</p>`; }); html+='</div>'; el.summary.innerHTML=html; }

function saveScore(){ const total=state.results.reduce((a,b)=>a+b.score,0); const entry={ name:state.playerName, avatar:state.avatar, score:total, date:new Date().toISOString(), traps:state.traps }; const key='neg_ranking'; const arr=JSON.parse(localStorage.getItem(key)||'[]'); arr.push(entry); arr.sort((a,b)=> b.score-a.score); localStorage.setItem(key, JSON.stringify(arr.slice(0,50))); renderRanking(); el.modalRanking.showModal(); }

function renderRanking(){ const arr=JSON.parse(localStorage.getItem('neg_ranking')||'[]'); el.rankingList.innerHTML=''; if(!arr.length){ const li=document.createElement('li'); li.textContent='Sem registros ainda.'; el.rankingList.appendChild(li); return; } arr.forEach((r,i)=>{ const li=document.createElement('li'); const d=new Date(r.date); li.textContent = `#${i+1} — ${r.avatar} ${r.name} — ${r.score} pts — ${d.toLocaleDateString()} — Pegadinhas: ${r.traps}`; el.rankingList.appendChild(li); }); }
