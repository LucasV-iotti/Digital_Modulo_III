// === Estado global ===
// Avatares: somente quem usa computador, com femininos e tons variados
const AVATARS = ['\uD83D\uDC69\uD83C\uDFFB\u200D\uD83D\uDCBB','\uD83D\uDC69\uD83C\uDFFC\u200D\uD83D\uDCBB','\uD83D\uDC69\uD83C\uDFFD\u200D\uD83D\uDCBB','\uD83D\uDC69\uD83C\uDFFE\u200D\uD83D\uDCBB','\uD83D\uDC69\uD83C\uDFFF\u200D\uD83D\uDCBB','\uD83E\uDDD1\uD83C\uDFFB\u200D\uD83D\uDCBB','\uD83E\uDDD1\uD83C\uDFFC\u200D\uD83D\uDCBB','\uD83E\uDDD1\uD83C\uDFFD\u200D\uD83D\uDCBB','\uD83E\uDDD1\uD83C\uDFFE\u200D\uD83D\uDCBB','\uD83E\uDDD1\uD83C\uDFFF\u200D\uD83D\uDCBB'];
let state = {
  playerName:'', avatar: AVATARS[0], hard:false, insane:false,
  missionIndex:0, mood:50, emp:0, cla:0, tec:0,
  transcript:[], results:[], traps:0
};

// Config
const TRAP_WORDS = ['garantido','garantia','sempre','de forma alguma','qualquer valor','obrigatoriamente'];

function shuffleArray(arr){ const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(Math.random()*(i+1)); [a[i],a[j]]=[a[j],a[i]];} return a; }

// === Missões com alternativas ainda mais similares (4 opções) ===
const MISSIONS = [
  missionDesemprego(), missionDoencaFamilia(), missionReducaoRenda(), missionOutrasDividas(), missionSegmentos()
];

function missionDesemprego(){ return { id:'m1', title:'Missão 1 — Desemprego', intro:'Cliente informa desemprego e insegurança para negociar.', nodes:[
  msgC('Oi… aqui é o João. Estou desempregado e não sei se consigo pagar nada agora.'),
  choicesSimilar([
    opt('João, obrigado por compartilhar. Vamos construir algo leve para o seu momento.', +3, {emp:+1}),
    opt('João, entendo a fase. Posso orientar opções sem apertar agora.', +2, {emp:+1, cla:+1}),
    opt('João, compreendo. Se topar, já avanço com um acordo aqui.', -1, {}, 'Antecipou sem sondar.'),
    opt('Entendo. Precisamos do seu CPF e data de nascimento primeiro.', -2, {}, 'Frio/impessoal abrevia vínculo.')
  ]),
  msgC('Talvez eu consiga algo pequeno mês que vem.'),
  choicesSimilar([
    opt('Podemos iniciar hoje com 1º vencimento em até 59 dias; depois você pode antecipar para reduzir juros.', +3, {tec:+1, cla:+1}),
    opt('Melhor aguardar até você voltar ao mercado.', -2, {}, 'Adia sem plano.'),
    opt('Consigo isenção total de juros se fechar agora, garantido.', -4, {}, 'Promessa absoluta (trap).'),
    opt('Faço em poucas parcelas altas para acabar logo.', -3, {}, 'Desalinha com capacidade atual.')
  ]),
  msgC('Ok, e como ficam os detalhes?'),
  choicesSimilar([
    opt('Recapitulo os pontos essenciais e confirmo se ficou claro.', +2, {cla:+1}),
    opt('Envio os boletos e depois alinhamos.', -2, {}, 'Sem confirmação.'),
    opt('Explico rapidamente e seguimos, qualquer valor serve.', -3, {}, 'Inconsistência/trap textual.'),
    opt('Fecho e aviso datas mais tarde.', -3, {})
  ]),
  choicesSimilar([
    opt('Confirmando: total R$ 900 em 3× de R$ 300, 1º venc. em 59 dias (10/10), seguintes todo dia 10, contrato nº 456789. Correto?', +4, {cla:+2, tec:+1}),
    opt('Serão 3× de R$ 300 com vencimento no dia 10. Certo?', 0, {cla:+1}, 'Faltam total e nº do contrato.'),
    opt('Fechamos R$ 900 em 3×, primeiro para 10/10.', +1, {cla:+1}, 'Sem nº do contrato.'),
    opt('Como combinado, te mando o link e pronto.', -2, {}, 'Fechamento incompleto.')
  ]),
  choicesSimilar([
    opt('Registro: valores/condições, datas, nº da negociação e observações do atendimento.', +2, {tec:+1}),
    opt('Registro: principais valores e vencimentos.', 0, {}, 'Incompleto.'),
    opt('Registro: que o cliente aceitou e está tudo certo.', -1, {}),
    opt('Registro: não é necessário, já está garantido.', -3, {}, 'Palavra trap + omissão de registro.')
  ])
]};}

function missionDoencaFamilia(){ return { id:'m2', title:'Missão 2 — Doença na família', intro:'Cliente relata despesas com saúde; exige sensibilidade e orientação.', nodes:[
  msgC('Estou gastando com remédios da minha mãe. Não consigo ver acordo agora.'),
  choicesSimilar([
    opt('Sinto muito, João, e desejo melhoras. Para emergências, manter seu nome regular ajuda; ajustamos algo leve.', +3, {emp:+2, tec:+1}),
    opt('Sinto muito. Podemos deixar para quando estabilizar e falamos depois.', -1, {}, 'Adia sem plano.'),
    opt('Lamento. Posso emitir um acordo e você avalia em seguida.', -1, {}, 'Sem sondagem.'),
    opt('Entendo. É obrigatório fechar algo agora.', -3, {}, 'Impositivo/trap.')
  ]),
  choicesSimilar([
    opt('Para ajustar à sua realidade, como estão sua renda e gastos de saúde neste mês?', +2, {emp:+1, cla:+1}),
    opt('Qual valor consegue hoje para começarmos?', 0, {}),
    opt('Você deveria ter se planejado melhor.', -4, {}),
    opt('Envie laudos e comprovantes obrigatoriamente.', -2, {}, 'Tom inadequado/jargão desnecessário.')
  ]),
  msgC('Consigo algo pequeno por alguns meses.'),
  choicesSimilar([
    opt('Fechamos parcelas leves agora e, quando puder, você antecipa para reduzir juros.', +2, {tec:+1, cla:+1}),
    opt('Melhor quitar tudo logo para não alongar.', -2, {}),
    opt('Dividimos, mas sem possibilidade de antecipar.', -1, {}),
    opt('Faço um plano padrão; dá no mesmo.', -1, {}, 'Não personaliza.')
  ]),
  choicesSimilar([
    opt('Recapitulo em linguagem simples e confirmo se ficou claro.', +2, {cla:+1}),
    opt('Envio os detalhes por mensagem e seguimos.', -1, {}),
    opt('Acredito que esteja claro, vou emitir.', 0, {}),
    opt('Já está tudo garantido, prossigo.', -2, {}, 'Promessa absoluta/trap.')
  ]),
  choicesSimilar([
    opt('Confirmando: total R$ 1.200 em 4× de R$ 300, venc. dia 10 (início 10/06), contrato nº 456789. Alguma dúvida?', +4, {cla:+2, tec:+1}),
    opt('Serão 4× de R$ 300, começando dia 10/06. Confere?', +1, {cla:+1}),
    opt('Vamos em 4× de R$ 300. Ok?', 0, {}),
    opt('Envio o link e finalizamos depois.', -2, {})
  ])
]};}

function missionReducaoRenda(){ return { id:'m3', title:'Missão 3 — Redução de renda', intro:'Cliente teve queda de renda e faz bicos; foque em adequação.', nodes:[
  msgC('Minha renda caiu. Faço bicos e não tenho como pagar alto agora.'),
  choicesSimilar([
    opt('Obrigado por compartilhar. Vamos ajustar algo que elimine o débito sem apertar seu orçamento.', +3, {emp:+1, tec:+1}),
    opt('Entendo. Posso propor um acordo padrão.', -1, {}, 'Genérico, sem personalização.'),
    opt('Sem valor alto não consigo avançar.', -4, {}),
    opt('Qualquer valor serve para começarmos.', -2, {}, 'Inconsistência/trap.')
  ]),
  choicesSimilar([
    opt('Para calibrar, qual faixa confortável por mês nos próximos 3–6 meses?', +2, {cla:+1}),
    opt('Quanto consegue hoje?', 0, {}),
    opt('Envie comprovantes para eu ver.', -1, {}),
    opt('Preciso de holerite recente obrigatoriamente.', -2, {}, 'Tom inadequado/jargão')
  ]),
  msgC('Entre 150 e 200.'),
  choicesSimilar([
    opt('Fechamos nessa faixa e, melhorando, você pode antecipar sem penalidade.', +2, {tec:+1, cla:+1}),
    opt('Sugiro valores maiores para terminar logo.', -2, {}),
    opt('Mantenho fixo sem antecipação.', -1, {}),
    opt('Fecho nessa faixa, garantido que não muda.', -3, {}, 'Promessa absoluta.')
  ]),
  choicesSimilar([
    opt('Repito os pontos principais e confirmo o entendimento.', +2, {cla:+1}),
    opt('Já mando o boleto.', -1, {}),
    opt('Acho que ficou claro, seguimos.', 0, {}),
    opt('Está 100% garantido, prossigo.', -2, {}, 'Promessa absoluta.')
  ]),
  choicesSimilar([
    opt('Confirmo: total R$ 900 em 5× de R$ 180, venc. dia 15, contrato nº 987654. Confere?', +4, {cla:+2, tec:+1}),
    opt('5 boletos de R$ 180 para o dia 15.', 0, {}),
    opt('5× de R$ 180 começando dia 15.', +1, {cla:+1}),
    opt('Mandarei os boletos depois.', -2, {})
  ])
]};}

function missionOutrasDividas(){ return { id:'m4', title:'Missão 4 — Outras dívidas', intro:'Cliente tem outras contas; redirecione com benefícios e fechamento completo.', nodes:[
  msgC('Tenho outras contas vencendo. Não sei se priorizo isso agora.'),
  choicesSimilar([
    opt('Entendo o aperto. Regularizar este contrato ajuda a manter acesso a crédito em emergências.', +3, {emp:+1, tec:+1}),
    opt('Com tantas contas, talvez seja melhor adiar.', -1, {}, 'Desvia do objetivo.'),
    opt('Fechando agora, garanto condições únicas.', -3, {}, 'Promessa absoluta.'),
    opt('Posso dar um super desconto se pagar tudo hoje.', -1, {}, 'Agressivo sem sondagem.')
  ]),
  choicesSimilar([
    opt('Qual valor mensal caberia sem risco para você neste período?', +2, {cla:+1}),
    opt('Qual valor tem hoje?', 0, {}),
    opt('Precisa decidir agora.', -2, {}),
    opt('Defina um valor qualquer e seguimos.', -2, {}, 'Inconsistência.')
  ]),
  msgC('Consigo algo baixo por alguns meses.'),
  choicesSimilar([
    opt('Fechamos leve agora e você pode antecipar depois para reduzir encargos.', +2, {tec:+1, cla:+1}),
    opt('Melhor empurrar para frente.', -2, {}),
    opt('Faço leve, mas sem antecipação.', -1, {}),
    opt('Faço leve e garantido que não altera.', -3, {}, 'Promessa absoluta.')
  ]),
  choicesSimilar([
    opt('Confirmo total, parcelas, vencimentos e nº do contrato; está claro?', +4, {cla:+2, tec:+1}),
    opt('Envio o link e combinamos depois.', -1, {}),
    opt('Falo os valores por alto para agilizar.', 0, {}),
    opt('Tá tudo certo, é garantido.', -2, {}, 'Promessa absoluta.')
  ])
]};}

function missionSegmentos(){ return { id:'m5', title:'Missão 5 — Objeções por Segmento', intro:'Segmento aleatório; use a técnica correta com alternativas muito parecidas.',
  setup:()=>{ const s=['Cartões','Imobiliário','Preventivo','Over','Consignado','Financeira']; return s[Math.floor(Math.random()*s.length)]; },
  nodesFactory:(segment)=>{
    const heads={
      'Cartões':[ msgC('Se eu renegociar, perco meu limite?'), choicesSimilar([
        opt('O limite permanece ativo e vai sendo retomado conforme as parcelas são pagas; 1º vencimento pode ser em até 59 dias e você pode antecipar depois.', +4, {tec:+2, cla:+1}),
        opt('Seu limite não será afetado de forma alguma, é garantido.', -4, {}, 'Promessa absoluta.'),
        opt('O limite pode até ficar comprometido um período e depois some de vez.', -3, {}, 'Informação incorreta.'),
        opt('Seu limite volta automaticamente sem depender de pagamento.', -2, {}, 'Falso.')
      ])],
      'Imobiliário':[ msgC('Não aceito boleto hoje e não quero incorporar parcelas.'), choicesSimilar([
        opt('Podemos escalonar para amanhã/depois e retirar juros de atraso se houver só 1 parcela, aumentando a amortização e regularizando a situação.', +4, {tec:+2, cla:+1}),
        opt('Tem que pagar hoje, é o único jeito.', -3, {}),
        opt('Incorporamos tudo com juros obrigatórios.', -2, {}, 'Jargão/rigidez desnecessária.'),
        opt('Deixamos como está; depois a taxa corrige sozinha.', -2, {}, 'Falso.')
      ])],
      'Preventivo':[ msgC('Taxa alta e medo de perder limites.'), choicesSimilar([
        opt('Unificando seus produtos, você paga uma única taxa menor que a soma atual e reduz o risco de perder limites.', +4, {tec:+2, cla:+1}),
        opt('Mantemos separado; as taxas se ajustam sozinhas.', -2, {}),
        opt('A taxa é fixa e não muda nunca.', -3, {}, 'Absoluta.'),
        opt('Unificar não altera nada, é só burocracia.', -2, {})
      ])],
      'Over':[ msgC('Parcela está alta e estou desempregado.'), choicesSimilar([
        opt('Ofereço por 1 ano parcelas menores com taxa competitiva; assim você paga sem apertar e pode antecipar quando melhorar.', +4, {tec:+2, emp:+1, cla:+1}),
        opt('Sem renda, não há o que fazer.', -4, {}),
        opt('Alongamos com juros elevados para acelerar a quitação.', -2, {}),
        opt('Mantenha como está e depois a parcela baixa sozinha.', -2, {}, 'Falso.')
      ])],
      'Consignado':[ msgC('Fui para o INSS e parou de descontar em folha.'), choicesSimilar([
        opt('Como o desconto em folha cessou, as parcelas devem ser pagas via boleto. Posso enviar e te orientar no passo a passo?', +4, {tec:+2, cla:+1}),
        opt('Isso normaliza sozinho depois.', -3, {}),
        opt('Precisa ir à agência obrigatoriamente.', -2, {}, 'Imposição desnecessária.'),
        opt('Vai voltar a descontar automaticamente no próximo mês.', -3, {}, 'Falso.')
      ])],
      'Financeira':[ msgC('Não quero pagar juros.'), choicesSimilar([
        opt('Há possibilidade de desconto em juros/encargos do atraso e até 5 dias úteis para pagamento; a renegociação regulariza com novo contrato.', +4, {tec:+2, cla:+1}),
        opt('Consigo zerar todos os juros agora, garantido.', -4, {}, 'Absoluta.'),
        opt('Juros não são negociáveis em hipótese alguma.', -3, {}, 'Absoluta.'),
        opt('Dá para reduzir juros só se pagar tudo hoje.', -2, {})
      ])]
    };
    const seq=heads[segment];
    return [ msgS(`Segmento: ${segment}`), ...seq,
      choicesSimilar([
        opt('Fechamento: confirmar total, parcelas, vencimentos e nº da negociação; verificar entendimento.', +4, {cla:+2, tec:+1}),
        opt('Envio o boleto direto; qualquer dúvida depois.', -1, {}),
        opt('Falo só o valor mensal para agilizar.', -1, {}),
        opt('Está garantido, podemos seguir.', -2, {}, 'Absoluta.')
      ])
    ];
  }
};}

// Helpers
function msgC(text){ return {type:'msg', who:'client', text}; }
function msgS(text){ return {type:'msg', who:'system', text}; }
function choicesSimilar(options){ return {type:'choices', options: shuffleArray(options)}; }
function opt(text, moodDelta=0, metrics={}, feedback=''){ return { text, moodDelta, metrics, feedback }; }

// === Engine ===
const el = { screenStart:document.getElementById('screenStart'), screenGame:document.getElementById('screenGame'), screenEnd:document.getElementById('screenEnd'), chat:document.getElementById('chat'), choices:document.getElementById('choices'), missionTitle:document.getElementById('missionTitle'), barMood:document.getElementById('barMood'), mEmp:document.getElementById('mEmp'), mCla:document.getElementById('mCla'), mTec:document.getElementById('mTec'), btnStart:document.getElementById('btnStart'), playerName:document.getElementById('playerName'), avatarGrid:document.getElementById('avatarGrid'), btnRanking:document.getElementById('btnRanking'), btnInfo:document.getElementById('btnInfo'), btnSkip:document.getElementById('btnSkip'), summary:document.getElementById('summary'), btnSaveScore:document.getElementById('btnSaveScore'), btnPlayAgain:document.getElementById('btnPlayAgain'), modalRanking:document.getElementById('modalRanking'), rankingList:document.getElementById('rankingList'), btnCloseRanking:document.getElementById('btnCloseRanking'), btnClearRanking:document.getElementById('btnClearRanking'), modalInfo:document.getElementById('modalInfo'), btnCloseInfo:document.getElementById('btnCloseInfo'), chkHard:document.getElementById('chkHard'), chkInsane:document.getElementById('chkInsane'), hud:document.getElementById('hud') };

function renderAvatars(){ el.avatarGrid.innerHTML=''; AVATARS.forEach(a=>{ const d=document.createElement('div'); d.className='avatar'+(state.avatar===a?' selected':''); d.textContent=a; d.onclick=()=>{ state.avatar=a; renderAvatars(); checkStartReady(); }; el.avatarGrid.appendChild(d); }); }
function checkStartReady(){ const ok = el.playerName.value.trim().length>1 && !!state.avatar; el.btnStart.disabled=!ok; }
el.playerName.addEventListener('input', checkStartReady); renderAvatars(); checkStartReady();

el.btnRanking.onclick=()=>{ renderRanking(); el.modalRanking.showModal(); };
el.btnCloseRanking.onclick=()=> el.modalRanking.close();
el.btnClearRanking.onclick=()=>{ localStorage.removeItem('neg_ranking'); renderRanking(); };
el.btnInfo.onclick=()=> el.modalInfo.showModal(); el.btnCloseInfo.onclick=()=> el.modalInfo.close();

el.btnStart.onclick=()=>{ state.playerName=el.playerName.value.trim(); state.hard=el.chkHard.checked; state.insane=el.chkInsane.checked; state.missionIndex=0; Object.assign(state,{mood:50, emp:0, cla:0, tec:0, transcript:[], results:[], traps:0}); if(state.insane){ el.hud.style.display='none'; } else { el.hud.style.display='flex'; } swapScreen('screenStart','screenGame'); playMission(); };
el.btnSkip.onclick=()=> endMission(false,'Pulado');
el.btnPlayAgain.onclick=()=>{ swapScreen('screenEnd','screenStart'); window.scrollTo(0,0); };
el.btnSaveScore.onclick=saveScore;

function swapScreen(from,to){ document.getElementById(from).classList.remove('active'); document.getElementById(to).classList.add('active'); }
function setHUD(){ const mood=Math.max(0,Math.min(100,state.mood)); el.barMood.style.width=mood+'%'; el.mEmp.textContent=state.emp; el.mCla.textContent=state.cla; el.mTec.textContent=state.tec; }
function scrollChat(){ el.chat.scrollTop = el.chat.scrollHeight; }
function pushMsg(who,text){ if(state.hard && who==='system' && !text.startsWith('✅') && !text.startsWith('Resultado') && !text.startsWith('Segmento')) return; const d=document.createElement('div'); d.className='msg '+who; d.textContent=text; el.chat.appendChild(d); state.transcript.push({who,text}); scrollChat(); }

let currentNodes=[]; let nodeIndex=0;
function playMission(){ el.chat.innerHTML=''; el.choices.innerHTML=''; state.transcript=[]; const m=MISSIONS[state.missionIndex]; el.missionTitle.textContent=m.title; pushMsg('system', m.intro); if(m.nodesFactory){ const seg=(m.setup? m.setup(): 'Cartões'); currentNodes=m.nodesFactory(seg); } else { currentNodes=m.nodes; } nodeIndex=0; setHUD(); nextNode(); }

function nextNode(){ if(nodeIndex>=currentNodes.length){ const success = state.mood>=60 && state.cla>=3; endMission(success); return; } const node=currentNodes[nodeIndex++]; if(node.type==='msg'){ pushMsg(node.who,node.text); setTimeout(nextNode,450); } else if(node.type==='choices'){ renderChoices(node.options); } }

function applyInsaneScaling(delta){ if(!state.insane) return delta; // amplify negatives, dampen positives
  if(delta>0) return Math.ceil(delta*0.85); else return Math.floor(delta*1.25); }

function renderChoices(options){ el.choices.innerHTML=''; shuffleArray(options).forEach(op=>{ const b=document.createElement('button'); b.className='choice'; b.textContent=op.text; b.onclick=()=>{
      // base effects
      let moodDelta = op.moodDelta||0;
      let empDelta = op.metrics?.emp||0;
      let claDelta = op.metrics?.cla||0;
      let tecDelta = op.metrics?.tec||0;
      // trap-word detection
      const lower = op.text.toLowerCase();
      let trapHit = false;
      TRAP_WORDS.forEach(t=>{ if(lower.includes(t)){ trapHit=true; }});
      if(trapHit){ state.traps++; moodDelta += -2; claDelta += -1; }
      // insane scaling
      moodDelta = applyInsaneScaling(moodDelta);
      empDelta = applyInsaneScaling(empDelta);
      claDelta = applyInsaneScaling(claDelta);
      tecDelta = applyInsaneScaling(tecDelta);
      // apply
      state.mood += moodDelta; state.emp += empDelta; state.cla += claDelta; state.tec += tecDelta;
      setHUD();
      pushMsg('agent', op.text);
      if(op.feedback && !state.hard){ pushMsg('system','Feedback: '+op.feedback); }
      el.choices.innerHTML=''; setTimeout(nextNode,300);
    }; el.choices.appendChild(b); }); }

function endMission(success, reason=''){ const m=MISSIONS[state.missionIndex]; const baseScore = Math.round(state.mood + state.emp*5 + state.cla*7 + state.tec*6 + (success?50:0)); const score=Math.max(0, baseScore - (state.insane? 5:0)); state.results.push({mission:m.title, success, mood:state.mood, emp:state.emp, cla:state.cla, tec:state.tec, score, reason}); if(state.hard||state.insane){ const tips=['Evite promessas absolutas ("garantido", "sempre").','Confirme entendimento antes de enviar boleto.','Fechamento completo: total, parcelas, datas e nº da negociação.']; pushMsg('system', 'Resultado — '+(success?'✔️ Sucesso':'❌ Revise os pontos-chave')+` • Pontos: ${score}`); tips.forEach(t=>pushMsg('system', t)); } state.mood=50; state.emp=0; state.cla=0; state.tec=0; state.missionIndex++; if(state.missionIndex<MISSIONS.length){ setTimeout(playMission,600); } else { showSummary(); swapScreen('screenGame','screenEnd'); } }

function showSummary(){ const totalScore=state.results.reduce((a,b)=>a+b.score,0); let html=`<p><strong>Jogador:</strong> ${state.playerName} ${state.avatar}</p>`; html+=`<p><strong>Pontuação total:</strong> ${totalScore} • <strong>Pegadinhas acionadas:</strong> ${state.traps}</p>`; html+='<div class="panel">'; state.results.forEach(r=>{ html+=`<p><strong>${r.mission}</strong> — ${r.success? '✔️ Sucesso':'❌ Não atingiu'} — Pontos: ${r.score}</p>`; }); html+='</div>'; el.summary.innerHTML=html; }

function saveScore(){ const total=state.results.reduce((a,b)=>a+b.score,0); const entry={ name:state.playerName, avatar:state.avatar, score:total, date:new Date().toISOString(), hard:state.hard, insane:state.insane, traps:state.traps }; const key='neg_ranking'; const arr=JSON.parse(localStorage.getItem(key)||'[]'); arr.push(entry); arr.sort((a,b)=> b.score-a.score); localStorage.setItem(key, JSON.stringify(arr.slice(0,50))); renderRanking(); el.modalRanking.showModal(); }

function renderRanking(){ const arr=JSON.parse(localStorage.getItem('neg_ranking')||'[]'); el.rankingList.innerHTML=''; if(!arr.length){ const li=document.createElement('li'); li.textContent='Sem registros ainda.'; el.rankingList.appendChild(li); return; } arr.forEach((r,i)=>{ const li=document.createElement('li'); const d=new Date(r.date); li.textContent = `#${i+1} — ${r.avatar} ${r.name} — ${r.score} pts — ${d.toLocaleDateString()}${r.hard?' — Difícil':''}${r.insane?' — Insano':''} — Pegadinhas: ${r.traps}`; el.rankingList.appendChild(li); }); }
