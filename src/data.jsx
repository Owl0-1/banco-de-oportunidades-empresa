/* global React */
// Dados fictícios para o protótipo Construtex Engenharia

window.MOCK_COMPANY = {
  name: 'Construtex Engenharia',
  tagline: 'Construímos o Nordeste que nasce com o futuro.',
  sector: 'Construção civil · Infraestrutura',
  founded: '2011',
  size: '420 colaboradores',
  hq: 'São Luís – MA',
  site: 'construtex.com.br',
  linkedin: '/company/construtex',
  logoLetter: 'C',
  about: 'A Construtex atua há 14 anos no Maranhão entregando obras residenciais de alto padrão, empreendimentos corporativos e projetos de infraestrutura pública. Somos movidos por engenharia de precisão, disciplina de obra e um time que acredita que bom projeto começa no canteiro.',
  culture: [
    'Decisões técnicas tomadas pelo time mais próximo do problema.',
    'Acompanhamento mensal 1:1 com liderança, sem burocracia.',
    'Plano de carreira com passagem clara Júnior → Pleno → Sênior → Especialista.'
  ],
  benefits: ['Plano de saúde Bradesco', 'Vale alimentação R$1.200', 'Auxílio creche', 'PLR semestral', 'Gympass', 'Home office flexível', 'Licença parental estendida', 'Cursos CREA custeados'],
  gallery: [
    { tint: '#0657F9', label: 'Canteiro · Obra Cohafuma' },
    { tint: '#40A27A', label: 'Escritório · São Luís' },
    { tint: '#F38354', label: 'Equipe · Engenharia civil' }
  ]
};

window.MOCK_USER = {
  name: 'Luiza Andrade',
  role: 'Head de People · Construtex',
  initials: 'LA',
  email: 'luiza.andrade@construtex.com.br'
};

// ─────────── Vagas ───────────
const SKILLS = {
  civil: ['AutoCAD', 'Revit', 'NBR 6118', 'Orçamento', 'CREA ativo'],
  estrutural: ['SAP2000', 'TQS', 'Concreto armado', 'Revit Structure'],
  eletrica: ['QGBT', 'NR-10', 'NBR 5410', 'AutoCAD Electrical'],
  hidraulica: ['Hidráulica predial', 'NBR 5626', 'AltoQi Hydros'],
  software: ['React', 'TypeScript', 'Node.js', 'AWS', 'PostgreSQL'],
  mecanica: ['SolidWorks', 'Manutenção preditiva', 'NR-12'],
  planejamento: ['MS Project', 'Primavera P6', 'Last Planner'],
  seguranca: ['NR-18', 'NR-35', 'Gestão de canteiro']
};

window.MOCK_VAGAS = [
  { id:'v1', title:'Engenheiro Civil Sênior — Obras Residenciais', level:'Sênior', mode:'Presencial', city:'São Luís – MA', salary:'R$ 11.000 – 14.500', salaryHidden:false, status:'Publicada', openedAt:'Há 3 dias', applicants:42, newApplicants:7, views:1280, skills: SKILLS.civil, benefits:['Plano de saúde','VA','PLR','Gympass'], pipeline:{novos:14, triagem:12, entrevista:9, oferta:4, contratado:3}, mustHire:true, tags:['Obra residencial','Alto padrão'], description:'Responsável por acompanhamento técnico e executivo de obras residenciais de alto padrão no litoral maranhense, coordenando equipes de produção, interface com projetistas e aprovação junto a órgãos públicos.' },
  { id:'v2', title:'Engenheiro Eletricista Pleno', level:'Pleno', mode:'Híbrido', city:'São Luís – MA', salary:'R$ 8.500 – 10.800', salaryHidden:false, status:'Publicada', openedAt:'Há 5 dias', applicants:28, newApplicants:3, views:940, skills: SKILLS.eletrica, benefits:['Plano de saúde','VA','Gympass'], pipeline:{novos:8, triagem:7, entrevista:6, oferta:4, contratado:3}, tags:['Infraestrutura'], description:'Projeto e supervisão de sistemas elétricos de baixa e média tensão em empreendimentos comerciais e residenciais.' },
  { id:'v3', title:'Engenheiro Estrutural Especialista', level:'Especialista', mode:'Remoto', city:'Brasil', salary:'R$ 16.000 – 22.000', salaryHidden:false, status:'Publicada', openedAt:'Há 1 dia', applicants:18, newApplicants:12, views:560, skills: SKILLS.estrutural, benefits:['Plano de saúde','PLR','Home office','Auxílio creche'], pipeline:{novos:10, triagem:5, entrevista:2, oferta:1, contratado:0}, mustHire:true, tags:['Estrutural','Concreto'], description:'Liderança técnica de projetos estruturais complexos em concreto armado e protendido.' },
  { id:'v4', title:'Estagiário em Engenharia Civil', level:'Júnior', mode:'Presencial', city:'São Luís – MA', salary:'Bolsa R$ 2.200', salaryHidden:false, status:'Publicada', openedAt:'Há 2 semanas', applicants:112, newApplicants:0, views:3240, skills:['AutoCAD','Excel','Organização'], benefits:['VA','VT','Cursos CREA'], pipeline:{novos:18, triagem:20, entrevista:8, oferta:2, contratado:1}, tags:['Estágio'], description:'Apoio à equipe de planejamento e orçamento em obras residenciais.' },
  { id:'v5', title:'Engenheira de Planejamento Pleno', level:'Pleno', mode:'Híbrido', city:'São Luís – MA', salary:'R$ 9.000 – 11.200', salaryHidden:false, status:'Publicada', openedAt:'Há 4 dias', applicants:22, newApplicants:2, views:680, skills: SKILLS.planejamento, benefits:['Plano de saúde','VA','PLR'], pipeline:{novos:5, triagem:8, entrevista:4, oferta:2, contratado:0}, tags:['Planejamento'], description:'Gestão de cronogramas integrados, curva S e controle de avanço físico-financeiro.' },
  { id:'v6', title:'Engenheiro de Segurança do Trabalho', level:'Pleno', mode:'Presencial', city:'São Luís – MA', salary:'R$ 7.800 – 9.500', salaryHidden:true, status:'Pausada', openedAt:'Há 3 semanas', applicants:51, newApplicants:0, views:1120, skills: SKILLS.seguranca, benefits:['Plano de saúde','VA','Seguro'], pipeline:{novos:4, triagem:6, entrevista:3, oferta:1, contratado:0}, tags:['Segurança'], description:'Gestão do programa de segurança em canteiros de obra.' },
  { id:'v7', title:'Engenheiro Mecânico — Manutenção Industrial', level:'Sênior', mode:'Presencial', city:'Imperatriz – MA', salary:'R$ 12.500 – 15.000', salaryHidden:false, status:'Publicada', openedAt:'Há 6 dias', applicants:14, newApplicants:1, views:320, skills: SKILLS.mecanica, benefits:['Plano de saúde','VA','Alojamento'], pipeline:{novos:3, triagem:4, entrevista:2, oferta:1, contratado:0}, tags:['Industrial'], description:'Manutenção preditiva e corretiva em plantas industriais de grande porte.' },
  { id:'v8', title:'Engenheiro Hidráulico', level:'Pleno', mode:'Híbrido', city:'São Luís – MA', salary:'R$ 8.000 – 10.000', salaryHidden:false, status:'Rascunho', openedAt:'—', applicants:0, newApplicants:0, views:0, skills: SKILLS.hidraulica, benefits:['Plano de saúde','VA'], pipeline:{novos:0, triagem:0, entrevista:0, oferta:0, contratado:0}, tags:['Predial'], description:'Projeto de sistemas hidrossanitários em edificações verticais.' },
  { id:'v9', title:'Engenheiro de Software Pleno', level:'Pleno', mode:'Remoto', city:'Brasil', salary:'R$ 10.000 – 13.500', salaryHidden:false, status:'Publicada', openedAt:'Há 8 dias', applicants:67, newApplicants:4, views:2100, skills: SKILLS.software, benefits:['Plano de saúde','PLR','Home office','Gympass'], pipeline:{novos:9, triagem:11, entrevista:5, oferta:2, contratado:1}, tags:['Software','Construtech'], description:'Time de produto interno desenvolvendo ferramentas de gestão de obra.' },
  { id:'v10', title:'Engenheira Civil Júnior', level:'Júnior', mode:'Presencial', city:'São Luís – MA', salary:'R$ 5.800 – 6.800', salaryHidden:false, status:'Publicada', openedAt:'Há 10 dias', applicants:89, newApplicants:0, views:1870, skills:['AutoCAD','Revit','NBR 6118'], benefits:['Plano de saúde','VA','Cursos CREA'], pipeline:{novos:10, triagem:12, entrevista:5, oferta:1, contratado:1}, tags:['Obra residencial'], description:'Apoio na execução e medição de obras residenciais.' },
  { id:'v11', title:'Engenheiro de Obras — Comercial', level:'Sênior', mode:'Presencial', city:'São Luís – MA', salary:'R$ 12.000 – 15.500', salaryHidden:false, status:'Encerrada', openedAt:'Há 45 dias', applicants:64, newApplicants:0, views:1540, skills: SKILLS.civil, benefits:['Plano de saúde','PLR'], pipeline:{novos:0, triagem:0, entrevista:0, oferta:0, contratado:2}, tags:['Comercial'], description:'Execução de shopping center em São Luís.' }
];

// ─────────── Candidatos ───────────
const AVATARS = ['#0657F9','#40A27A','#F38354','#8A38F5','#050805','#626B86','#FF854C','#0044CB'];
const pickColor = i => AVATARS[i % AVATARS.length];

const mkCand = (i, first, last, role, level, skills, stage, days, match, salary, hasChat=false, notes='') => ({
  id:'c'+i, name:first+' '+last, initials:(first[0]+last[0]).toUpperCase(), color:pickColor(i),
  role, level, skills, stage, daysInStage:days, match, salary, city:'São Luís – MA',
  university:'UFMA · Engenharia Civil · 2019', experience:'4 anos',
  available: match>70, applied:'Há '+(days+2)+' dias', hasChat, notes
});

window.MOCK_CANDIDATES = [
  // Vaga v1 — Engenheiro Civil Sênior
  mkCand(1, 'Rafael', 'Lima', 'Engenheiro Civil Sênior', 'Sênior', ['AutoCAD','Revit','NBR 6118','Orçamento'], 'novos', 1, 92, 'R$ 12.500', true, 'Indicado por ex-gerente.'),
  mkCand(2, 'Beatriz', 'Souza', 'Engenheira Civil Pleno', 'Sênior', ['AutoCAD','NBR 6118','CREA ativo'], 'novos', 2, 81, 'R$ 13.000', false),
  mkCand(3, 'Tiago', 'Carvalho', 'Engenheiro Civil', 'Sênior', ['Revit','AutoCAD','Orçamento'], 'novos', 0, 76, 'R$ 11.800'),
  mkCand(4, 'Marina', 'Cruz', 'Engenheira de Obras', 'Sênior', ['AutoCAD','Revit','NBR 6118'], 'novos', 3, 88, 'R$ 14.000'),
  mkCand(5, 'Eduardo', 'Nogueira', 'Engenheiro Civil', 'Sênior', ['AutoCAD','Orçamento'], 'novos', 1, 68, 'R$ 12.000'),
  mkCand(6, 'Camila', 'Freitas', 'Engenheira Civil Sênior', 'Sênior', ['Revit','NBR 6118','AutoCAD','CREA ativo'], 'triagem', 4, 95, 'R$ 13.500', true),
  mkCand(7, 'Felipe', 'Ramos', 'Engenheiro de Obras', 'Sênior', ['AutoCAD','Revit','Orçamento'], 'triagem', 2, 84, 'R$ 12.800'),
  mkCand(8, 'Juliana', 'Pires', 'Engenheira Civil', 'Sênior', ['AutoCAD','NBR 6118'], 'triagem', 5, 78, 'R$ 11.500'),
  mkCand(9, 'Gustavo', 'Melo', 'Engenheiro Civil Pleno', 'Sênior', ['AutoCAD','Revit','Orçamento'], 'triagem', 3, 72, 'R$ 12.200', true),
  mkCand(10, 'Patrícia', 'Barros', 'Engenheira de Projetos', 'Sênior', ['Revit','AutoCAD','CREA ativo'], 'entrevista', 1, 91, 'R$ 13.200', true),
  mkCand(11, 'Lucas', 'Teixeira', 'Engenheiro Civil Sênior', 'Sênior', ['AutoCAD','Revit','Orçamento','CREA ativo'], 'entrevista', 7, 89, 'R$ 14.200', true, 'Entrevista técnica marcada 21/04.'),
  mkCand(12, 'Ana', 'Rocha', 'Engenheira Civil', 'Sênior', ['Revit','AutoCAD'], 'entrevista', 2, 83, 'R$ 12.000', true),
  mkCand(13, 'Daniel', 'Araújo', 'Engenheiro Civil', 'Sênior', ['AutoCAD','NBR 6118','Orçamento'], 'oferta', 3, 87, 'R$ 13.800', true, 'Aguardando retorno da proposta.'),
  mkCand(14, 'Renata', 'Costa', 'Engenheira Civil Sênior', 'Sênior', ['Revit','AutoCAD','CREA ativo'], 'oferta', 1, 93, 'R$ 14.000', true),
  mkCand(15, 'Pedro', 'Almeida', 'Engenheiro Civil Pleno', 'Sênior', ['AutoCAD','Orçamento'], 'contratado', 14, 85, 'R$ 13.500', true, 'Início em 05/05.'),
  // Vaga v3 — Estrutural Especialista
  mkCand(16, 'Isabela', 'Monteiro', 'Engenheira Estrutural Sr.', 'Especialista', ['SAP2000','TQS','Concreto armado'], 'novos', 1, 94, 'R$ 20.000', true),
  mkCand(17, 'Vinícius', 'Sá', 'Engenheiro Estrutural', 'Especialista', ['TQS','Revit Structure'], 'novos', 0, 82, 'R$ 18.500'),
  mkCand(18, 'Fernanda', 'Dias', 'Engenheira Estrutural Especialista', 'Especialista', ['SAP2000','TQS','Concreto armado','Revit Structure'], 'triagem', 3, 96, 'R$ 21.000', true),
  // Vaga v9 — Software
  mkCand(19, 'Bruno', 'Castro', 'Engenheiro de Software', 'Pleno', ['React','TypeScript','Node.js'], 'novos', 1, 88, 'R$ 12.500', true),
  mkCand(20, 'Laura', 'Vieira', 'Software Engineer', 'Pleno', ['React','TypeScript','AWS','Node.js'], 'triagem', 4, 91, 'R$ 13.000', true),
  mkCand(21, 'Henrique', 'Moreira', 'Full-stack', 'Pleno', ['React','Node.js','PostgreSQL'], 'entrevista', 2, 79, 'R$ 11.800'),
];

// ─────────── Banco de Talentos (hunting) ───────────
window.MOCK_TALENT = [
  { id:'t1', name:'Larissa Mendes', initials:'LM', color:'#0657F9', role:'Engenheira Civil Sênior', level:'Sênior', skills:['Revit','AutoCAD','NBR 6118','CREA ativo','Orçamento'], match:97, available:true, salary:'R$ 13.500', education:'UFMA · Engenharia Civil · 2016', city:'São Luís – MA', experience:'8 anos', bio:'Experiência em obras residenciais e comerciais de médio e grande porte. Liderou equipes de até 40 pessoas em canteiro.', lastActive:'Há 2h' },
  { id:'t2', name:'Rodrigo Siqueira', initials:'RS', color:'#40A27A', role:'Engenheiro de Obras', level:'Sênior', skills:['AutoCAD','Orçamento','CREA ativo','MS Project'], match:89, available:true, salary:'R$ 12.800', education:'UEMA · Engenharia Civil · 2018', city:'São Luís – MA', experience:'6 anos', bio:'Focado em planejamento de obra e controle físico-financeiro.', lastActive:'Há 5h' },
  { id:'t3', name:'Priscila Tavares', initials:'PT', color:'#F38354', role:'Engenheira Estrutural Especialista', level:'Especialista', skills:['SAP2000','TQS','Concreto armado','Revit Structure'], match:95, available:true, salary:'R$ 21.500', education:'UFPE · Mestrado em Estruturas · 2014', city:'Recife – PE', experience:'12 anos', bio:'Especialista em estruturas de concreto armado e protendido para edifícios altos.', lastActive:'Há 1 dia' },
  { id:'t4', name:'Augusto Pereira', initials:'AP', color:'#8A38F5', role:'Engenheiro Eletricista', level:'Pleno', skills:['QGBT','NR-10','NBR 5410','AutoCAD Electrical'], match:84, available:false, salary:'R$ 10.200', education:'UFMA · Engenharia Elétrica · 2019', city:'São Luís – MA', experience:'4 anos', bio:'Projeto elétrico de baixa e média tensão em empreendimentos comerciais.', lastActive:'Há 3 dias' },
  { id:'t5', name:'Natália Brito', initials:'NB', color:'#0044CB', role:'Engenheira de Planejamento', level:'Pleno', skills:['MS Project','Primavera P6','Last Planner','Curva S'], match:78, available:true, salary:'R$ 9.800', education:'UFMA · Engenharia de Produção · 2020', city:'São Luís – MA', experience:'3 anos', bio:'Planejamento integrado e controle de avanço em obras civis.', lastActive:'Há 1h' },
  { id:'t6', name:'Thiago Nunes', initials:'TN', color:'#050805', role:'Engenheiro Civil Júnior', level:'Júnior', skills:['AutoCAD','Revit','NBR 6118'], match:72, available:true, salary:'R$ 6.500', education:'UFMA · Engenharia Civil · 2023', city:'São Luís – MA', experience:'1 ano', bio:'Recém-formado, passagem por estágio em grande construtora.', lastActive:'Há 20min' },
  { id:'t7', name:'Camila Xavier', initials:'CX', color:'#F38354', role:'Software Engineer', level:'Pleno', skills:['React','TypeScript','Node.js','AWS','PostgreSQL'], match:93, available:true, salary:'R$ 13.200', education:'IME-USP · Ciência da Computação · 2020', city:'Remoto · Brasil', experience:'4 anos', bio:'Full-stack com foco em produtos B2B de construtech.', lastActive:'Há 30min' },
  { id:'t8', name:'Marcos Antunes', initials:'MA', color:'#40A27A', role:'Engenheiro de Segurança', level:'Pleno', skills:['NR-18','NR-35','Gestão de canteiro'], match:81, available:false, salary:'R$ 9.200', education:'UEMA · Engenharia de Segurança · 2017', city:'São Luís – MA', experience:'6 anos', bio:'Programas de segurança para canteiros de grande porte.', lastActive:'Há 2 dias' },
  { id:'t9', name:'Aline Moura', initials:'AM', color:'#8A38F5', role:'Engenheira Civil', level:'Sênior', skills:['Revit','AutoCAD','Orçamento','NBR 6118'], match:91, available:true, salary:'R$ 13.000', education:'UFMA · Engenharia Civil · 2015', city:'São Luís – MA', experience:'9 anos', bio:'Experiência em obras residenciais de alto padrão.', lastActive:'Há 4h' },
  { id:'t10', name:'Diego Faria', initials:'DF', color:'#626B86', role:'Engenheiro Mecânico', level:'Sênior', skills:['SolidWorks','NR-12','Manutenção preditiva'], match:76, available:true, salary:'R$ 13.500', education:'UFMA · Engenharia Mecânica · 2016', city:'Imperatriz – MA', experience:'7 anos', bio:'Manutenção industrial preditiva em plantas de grande porte.', lastActive:'Há 1 dia' },
  { id:'t11', name:'Vivian Lopes', initials:'VL', color:'#0657F9', role:'Engenheira Hidráulica', level:'Pleno', skills:['Hidráulica predial','NBR 5626','AltoQi Hydros'], match:87, available:true, salary:'R$ 9.500', education:'UFMA · Engenharia Civil · 2018', city:'São Luís – MA', experience:'5 anos', bio:'Projetos hidrossanitários em edificações verticais.', lastActive:'Há 6h' },
  { id:'t12', name:'Otávio Guedes', initials:'OG', color:'#F38354', role:'Engenheiro Estrutural', level:'Sênior', skills:['SAP2000','TQS','Revit Structure','Concreto armado'], match:90, available:true, salary:'R$ 16.800', education:'USP · Engenharia Civil · 2015', city:'Remoto · Brasil', experience:'9 anos', bio:'Cálculo estrutural de edifícios residenciais e comerciais.', lastActive:'Há 40min' }
];

// ─────────── Chats ───────────
window.MOCK_CHATS = [
  { id:'ch1', candId:'c1', candName:'Rafael Lima', initials:'RL', color:'#0657F9', vaga:'Eng. Civil Sênior', unread:2, lastAt:'13:42', messages:[
    { from:'empresa', who:'Luiza Andrade', at:'09:12', text:'Olá Rafael, tudo bem? Somos da Construtex. Vimos seu perfil e gostaríamos de conversar sobre a vaga de Engenheiro Civil Sênior para obras residenciais em São Luís.' },
    { from:'cand', at:'10:30', text:'Oi, Luiza! Tudo sim. Obrigado pelo contato — tenho interesse em saber mais.' },
    { from:'empresa', who:'Luiza Andrade', at:'10:58', text:'Perfeito. Você pode me mandar um panorama da sua experiência mais recente? Obras residenciais de qual porte?' },
    { from:'cand', at:'11:22', text:'Últimos 3 anos em edifícios residenciais de 15 a 22 andares, alto padrão. CREA ativo, Revit avançado.' },
    { from:'empresa', who:'Luiza Andrade', at:'13:42', text:'Excelente. Estou te movendo para a etapa de triagem técnica. Nosso Eng. Chefe vai te chamar nos próximos 2 dias.' }
  ]},
  { id:'ch2', candId:'c10', candName:'Patrícia Barros', initials:'PB', color:'#F38354', vaga:'Eng. Civil Sênior', unread:0, lastAt:'ontem', messages:[
    { from:'empresa', who:'Luiza Andrade', at:'ontem 14:20', text:'Patrícia, convite para entrevista técnica na quinta às 10h. Presencial ou online?' },
    { from:'cand', at:'ontem 16:05', text:'Presencial funciona melhor pra mim. Podem me mandar o endereço?' },
    { from:'empresa', who:'Luiza Andrade', at:'ontem 16:40', text:'Av. Colares Moreira 444, sala 1210 — Renascença II.' }
  ]},
  { id:'ch3', candId:'c13', candName:'Daniel Araújo', initials:'DA', color:'#40A27A', vaga:'Eng. Civil Sênior', unread:1, lastAt:'10:15', messages:[
    { from:'empresa', who:'Luiza Andrade', at:'ontem 18:00', text:'Daniel, temos o prazer de estender uma proposta para a posição.' },
    { from:'empresa', who:'Luiza Andrade', at:'ontem 18:02', text:'Salário: R$ 13.800 + PLR + benefícios. Início previsto em 05/05.' },
    { from:'cand', at:'10:15', text:'Muito obrigado! Vou revisar os detalhes e retorno até amanhã.' }
  ]},
  { id:'ch4', candId:'c7', candName:'Felipe Ramos', initials:'FR', color:'#8A38F5', vaga:'Eng. Civil Sênior', unread:0, lastAt:'Há 2 dias', messages:[
    { from:'empresa', who:'Luiza Andrade', at:'seg 11:00', text:'Felipe, seu perfil foi aprovado na triagem. Vamos agendar o próximo passo?' },
    { from:'cand', at:'seg 12:45', text:'Perfeito, disponível na semana toda.' }
  ]},
  { id:'ch5', candId:'c16', candName:'Isabela Monteiro', initials:'IM', color:'#0044CB', vaga:'Eng. Estrutural Especialista', unread:1, lastAt:'08:30', messages:[
    { from:'empresa', who:'Luiza Andrade', at:'08:30', text:'Isabela, seu match no cargo de Eng. Estrutural Especialista está em 94%. Aceita conversar?' }
  ]},
  { id:'ch6', candId:'c19', candName:'Bruno Castro', initials:'BC', color:'#40A27A', vaga:'Eng. de Software Pleno', unread:0, lastAt:'quarta', messages:[
    { from:'empresa', who:'Luiza Andrade', at:'qua 14:00', text:'Bruno, vamos agendar um papo técnico para a vaga de Software Engineer?' },
    { from:'cand', at:'qua 15:30', text:'Claro! Quinta 15h funciona.' }
  ]}
];

// ─────────── Notificações ───────────
window.MOCK_NOTIFS = [
  { id:'n1', type:'new_cand', title:'12 novos candidatos', desc:'Vaga: Engenheiro Estrutural Especialista', at:'Há 10min', unread:true, icon:'users' },
  { id:'n2', type:'msg', title:'Rafael Lima respondeu', desc:'"Últimos 3 anos em edifícios residenciais..."', at:'Há 42min', unread:true, icon:'mail' },
  { id:'n3', type:'offer', title:'Daniel Araújo visualizou sua proposta', desc:'Eng. Civil Sênior · aguardando retorno', at:'Há 2h', unread:true, icon:'file' },
  { id:'n4', type:'match', title:'Match 95% encontrado', desc:'Priscila Tavares para Eng. Estrutural Especialista', at:'Há 3h', unread:false, icon:'spark' },
  { id:'n5', type:'hire', title:'Pedro Almeida aceitou a oferta', desc:'Início em 05/05 · Eng. Civil Pleno', at:'Ontem', unread:false, icon:'check' },
  { id:'n6', type:'interview', title:'Entrevista amanhã 10h', desc:'Patrícia Barros · presencial', at:'Ontem', unread:false, icon:'calendar' },
  { id:'n7', type:'expire', title:'Vaga "Eng. de Segurança" pausada há 3 semanas', desc:'Reative ou encerre para liberar o slot', at:'Há 2 dias', unread:false, icon:'alert' }
];

// ─────────── Funil agregado ───────────
window.MOCK_FUNNEL = [
  { label:'Visualizações', value:11950, delta:'+18%' },
  { label:'Candidaturas', value:517, delta:'+12%' },
  { label:'Triados', value:186, delta:'+6%' },
  { label:'Em entrevista', value:62, delta:'+22%' },
  { label:'Oferta', value:18, delta:'+4%' },
  { label:'Contratados', value:9, delta:'+1' }
];

// ─────────── Heatmap (atividade por dia/hora) ───────────
window.MOCK_HEATMAP = (() => {
  const seed = [
    [0,0,1,1,0,2,3,2,1,0,0,0],
    [0,1,2,3,4,5,4,3,2,1,0,0],
    [1,2,3,4,5,6,5,4,3,2,1,0],
    [1,2,4,5,6,7,6,5,4,3,1,0],
    [1,3,4,6,7,8,7,6,5,3,2,1],
    [0,1,2,3,3,4,4,3,2,1,0,0],
    [0,0,1,1,2,2,2,1,1,0,0,0]
  ];
  return seed;
})();
