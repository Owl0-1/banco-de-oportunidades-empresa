/* global React */
const { useState: useStateK, useMemo: useMemoK } = React;

// ─────────── Kanban ───────────
window.KanbanPage = ({ vagas, candidates, onGo, initialVagaId, variant='classic', showMatch=true, onOpenCand, onStartChat, onMove }) => {
  const [vagaId, setVagaId] = useStateK(initialVagaId || 'v1');
  const vaga = vagas.find(v => v.id === vagaId) || vagas[0];
  const [filterStack, setFilterStack] = useStateK('');
  const [dragging, setDragging] = useStateK(null);

  // Map candidates to columns by stage. Assign candidates to first matching vaga by role keyword (for mock purposes, show all c1-c15 for v1, c16-c18 for v3, c19-c21 for v9).
  const forVaga = (() => {
    if (vagaId === 'v1') return candidates.slice(0, 15);
    if (vagaId === 'v3') return candidates.slice(15, 18);
    if (vagaId === 'v9') return candidates.slice(18, 21);
    // fallback: synthesize a small pipeline
    return candidates.slice(0, Math.min(vaga.pipeline.novos + vaga.pipeline.triagem + vaga.pipeline.entrevista + vaga.pipeline.oferta + vaga.pipeline.contratado, 12));
  })().filter(c => !filterStack || c.skills.some(s => s.toLowerCase().includes(filterStack.toLowerCase())));

  const stages = [
    { key:'novos', label:'Candidatos', color:T.blue, tone:'blue' },
    { key:'triagem', label:'Em triagem', color:T.purple, tone:'neutral' },
    { key:'entrevista', label:'Entrevista técnica', color:T.orange, tone:'orange' },
    { key:'oferta', label:'Oferta', color:T.green, tone:'green' },
    { key:'contratado', label:'Contratado', color:T.ink, tone:'dark' }
  ];

  const onDragStart = (e, cand) => { setDragging(cand); e.dataTransfer.effectAllowed = 'move'; };
  const onDragOver = (e) => { e.preventDefault(); };
  const onDrop = (e, stage) => { e.preventDefault(); if (dragging && dragging.stage !== stage) onMove(dragging.id, stage); setDragging(null); };

  return (
    <main style={{padding:'24px 28px 40px', minHeight:'100vh'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:20, marginBottom:20, flexWrap:'wrap'}}>
        <div style={{flex:1, minWidth:320}}>
          <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:12, color:T.blue, letterSpacing:'.08em', marginBottom:8}}>PIPELINE DE CANDIDATOS</div>
          <div style={{display:'flex', alignItems:'center', gap:14}}>
            <h1 style={{fontFamily:'Poppins', fontWeight:500, fontSize:26, color:T.ink, margin:0, letterSpacing:'-0.01em'}}>{vaga.title}</h1>
          </div>
          <div style={{display:'flex', gap:10, marginTop:10, alignItems:'center', fontFamily:'Poppins', fontSize:13, color:T.meta}}>
            <Tag tone="neutral">{vaga.level}</Tag>
            <Tag tone="neutral">{vaga.mode}</Tag>
            <Tag tone="neutral">{vaga.city}</Tag>
            <span>·</span>
            <span>{forVaga.length} candidatos no pipeline</span>
          </div>
        </div>
        <div style={{display:'flex', gap:10, alignItems:'center'}}>
          <Field as="select" value={vagaId} onChange={setVagaId} options={vagas.filter(v=>v.status==='Publicada').map(v=>v.id)} style={{minWidth:300}}/>
          <Btn variant="secondary" icon={<Icon name="plus" size={14}/>} onClick={()=>onGo('hunting')}>Adicionar candidato</Btn>
        </div>
      </div>

      {/* vaga picker pills, real */}
      <div style={{display:'flex', gap:8, marginBottom:18, flexWrap:'wrap'}}>
        {vagas.filter(v=>v.status==='Publicada').slice(0,6).map(v => (
          <button key={v.id} onClick={()=>setVagaId(v.id)} style={{padding:'8px 14px', borderRadius:100, border:`1px solid ${vagaId===v.id?T.ink:T.border}`, background: vagaId===v.id?T.ink:'#fff', color: vagaId===v.id?'#fff':T.ink, fontFamily:'Poppins', fontSize:12.5, fontWeight: vagaId===v.id?700:500, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:8}}>
            {v.title.split(' — ')[0].slice(0, 34)}
            <span style={{background: vagaId===v.id?'rgba(255,255,255,.2)':T.page, padding:'2px 7px', borderRadius:10, fontSize:10, fontWeight:700}}>{v.applicants}</span>
          </button>
        ))}
      </div>

      {/* Filter bar */}
      <div style={{display:'flex', gap:10, marginBottom:16, alignItems:'center', flexWrap:'wrap'}}>
        <div style={{display:'flex', alignItems:'center', gap:8, background:'#fff', border:`1px solid ${T.border}`, borderRadius:100, padding:'7px 14px', width:260}}>
          <Icon name="search" size={14} color={T.meta}/>
          <input value={filterStack} onChange={e=>setFilterStack(e.target.value)} placeholder="Filtrar por skill…" style={{border:0, outline:0, flex:1, fontFamily:'Poppins', fontSize:13}}/>
        </div>
        <Tag tone="neutral">Match ≥ 70%</Tag>
        <Tag tone="neutral">Todos os níveis</Tag>
        <Tag tone="neutral">Qualquer cidade</Tag>
        <div style={{marginLeft:'auto', display:'flex', gap:10, alignItems:'center', fontFamily:'Poppins', fontSize:12, color:T.meta}}>
          Visualização: 
          <Tag tone={variant==='classic'?'dark':'neutral'}>Clássico</Tag>
          <Tag tone={variant==='dense'?'dark':'neutral'}>Denso</Tag>
          <Tag tone={variant==='match'?'dark':'neutral'}>Match score</Tag>
        </div>
      </div>

      {/* Columns */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(5, minmax(240px, 1fr))', gap:12, overflowX:'auto'}}>
        {stages.map(st => {
          const cands = forVaga.filter(c => c.stage === st.key);
          return (
            <div key={st.key} onDragOver={onDragOver} onDrop={e=>onDrop(e, st.key)} style={{background: dragging?'#fff':T.page, borderRadius:10, padding:10, border:`1px solid ${dragging?T.blue:T.border}`, minHeight:400, transition:'border-color 150ms, background 150ms'}}>
              <div style={{display:'flex', alignItems:'center', justifyContent:'space-between', padding:'4px 6px 12px'}}>
                <div style={{display:'flex', alignItems:'center', gap:8}}>
                  <div style={{width:6, height:6, borderRadius:3, background:st.color}}/>
                  <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:13, color:T.ink}}>{st.label}</div>
                </div>
                <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:12, color:T.meta, background:'#fff', padding:'2px 8px', borderRadius:10, border:`1px solid ${T.border}`}}>{cands.length}</div>
              </div>
              <div style={{display:'flex', flexDirection:'column', gap:8}}>
                {cands.map(c => (
                  <KanbanCard key={c.id} cand={c} variant={variant} showMatch={showMatch} onOpen={()=>onOpenCand(c)} onChat={()=>onStartChat(c)} onDragStart={onDragStart}/>
                ))}
                {cands.length === 0 && <div style={{padding:'24px 8px', textAlign:'center', fontFamily:'Poppins', fontSize:12, color:T.meta, border:`1px dashed ${T.border}`, borderRadius:6}}>Arraste candidatos aqui</div>}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
};

const KanbanCard = ({ cand, variant, showMatch, onOpen, onChat, onDragStart }) => {
  if (variant === 'match' && showMatch) {
    return (
      <div draggable onDragStart={e=>onDragStart(e, cand)} onClick={onOpen} style={{background:'#fff', border:`1px solid ${T.border}`, borderRadius:8, padding:12, cursor:'pointer', transition:'border 150ms'}}>
        <div style={{display:'flex', alignItems:'center', gap:10}}>
          <MatchScore value={cand.match} size={52} thickness={5}/>
          <div style={{minWidth:0, flex:1}}>
            <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:13, color:T.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{cand.name}</div>
            <div style={{fontFamily:'Poppins', fontSize:11, color:T.meta, marginTop:2}}>{cand.role.slice(0, 28)}</div>
            <div style={{fontFamily:'Poppins', fontSize:10, color:T.blue, marginTop:6, fontWeight:500}}>Há {cand.daysInStage}d · {cand.salary}</div>
          </div>
        </div>
        <div style={{display:'flex', gap:4, marginTop:8, flexWrap:'wrap'}}>
          {cand.skills.slice(0,2).map(s => <Tag key={s} tone="neutral" size="sm">{s}</Tag>)}
          {cand.skills.length>2 && <span style={{fontFamily:'Poppins', fontSize:10, color:T.meta, alignSelf:'center'}}>+{cand.skills.length-2}</span>}
        </div>
      </div>
    );
  }
  if (variant === 'dense') {
    return (
      <div draggable onDragStart={e=>onDragStart(e, cand)} onClick={onOpen} style={{background:'#fff', border:`1px solid ${T.border}`, borderRadius:6, padding:'8px 10px', cursor:'pointer', display:'flex', alignItems:'center', gap:10}}>
        <Avatar initials={cand.initials} color={cand.color} size={28}/>
        <div style={{minWidth:0, flex:1}}>
          <div style={{fontFamily:'Poppins', fontWeight:600, fontSize:12.5, color:T.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{cand.name}</div>
          <div style={{fontFamily:'Poppins', fontSize:10.5, color:T.meta, marginTop:1}}>Há {cand.daysInStage}d</div>
        </div>
        {showMatch && <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:11, color: cand.match>=85?T.green:T.meta}}>{cand.match}</div>}
      </div>
    );
  }
  // classic
  return (
    <div draggable onDragStart={e=>onDragStart(e, cand)} onClick={onOpen} style={{background:'#fff', border:`1px solid ${T.border}`, borderRadius:8, padding:12, cursor:'pointer'}}>
      <div style={{display:'flex', alignItems:'flex-start', gap:10}}>
        <Avatar initials={cand.initials} color={cand.color} size={36}/>
        <div style={{minWidth:0, flex:1}}>
          <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:13, color:T.ink}}>{cand.name}</div>
          <div style={{fontFamily:'Poppins', fontSize:11, color:T.meta, marginTop:2}}>{cand.role}</div>
        </div>
        {showMatch && (
          <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:11, color: cand.match>=85?T.green:cand.match>=70?T.blue:T.meta, background: cand.match>=85?'rgba(64,162,122,0.12)':cand.match>=70?T.blue12:T.page, padding:'3px 7px', borderRadius:10}}>
            {cand.match}%
          </div>
        )}
      </div>
      <div style={{display:'flex', gap:4, marginTop:10, flexWrap:'wrap'}}>
        {cand.skills.slice(0,3).map(s => <Tag key={s} tone="neutral" size="sm">{s}</Tag>)}
      </div>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginTop:10, paddingTop:10, borderTop:`1px solid ${T.border}`, fontFamily:'Poppins', fontSize:11, color:T.meta}}>
        <span><Icon name="clock" size={11}/> Há {cand.daysInStage}d</span>
        {cand.hasChat && <span style={{color:T.blue, fontWeight:500}}><Icon name="chat" size={11}/> ativo</span>}
      </div>
    </div>
  );
};

// ─────────── Candidate drawer ───────────
window.CandDrawer = ({ cand, onClose, onStartChat, onMove }) => {
  if (!cand) return null;
  const stages = ['novos','triagem','entrevista','oferta','contratado'];
  const stageIdx = stages.indexOf(cand.stage);
  return (
    <div style={{position:'fixed', inset:0, zIndex:90}}>
      <div style={{position:'absolute', inset:0, background:'rgba(5,8,5,0.4)'}} onClick={onClose}/>
      <aside style={{position:'absolute', top:0, right:0, width:520, height:'100vh', background:'#fff', overflowY:'auto', display:'flex', flexDirection:'column'}}>
        {/* Header */}
        <div style={{padding:'20px 24px', borderBottom:`1px solid ${T.border}`, display:'flex', alignItems:'flex-start', gap:14}}>
          <Avatar initials={cand.initials} color={cand.color} size={60}/>
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:19, color:T.ink}}>{cand.name}</div>
            <div style={{fontFamily:'Poppins', fontSize:13, color:T.meta, marginTop:2}}>{cand.role} · {cand.experience}</div>
            <div style={{display:'flex', gap:6, marginTop:10}}>
              <Tag tone="blue" size="sm">{cand.level}</Tag>
              <Tag tone={cand.available?'green':'neutral'} size="sm">{cand.available?'Disponível':'Empregado'}</Tag>
            </div>
          </div>
          <button onClick={onClose} style={{width:32, height:32, borderRadius:16, border:`1px solid ${T.border}`, background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}><Icon name="x" size={14}/></button>
        </div>

        {/* Match + stage */}
        <div style={{padding:'16px 24px', borderBottom:`1px solid ${T.border}`, display:'grid', gridTemplateColumns:'auto 1fr', gap:20, alignItems:'center'}}>
          <MatchScore value={cand.match} size={64} thickness={6}/>
          <div>
            <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:13, color:T.ink, marginBottom:4}}>Match com a vaga</div>
            <div style={{fontFamily:'Poppins', fontSize:12, color:T.meta, marginBottom:10}}>Baseado em skills, senioridade e formação.</div>
            <div style={{display:'flex', gap:6}}>
              {stages.map((s, i) => (
                <div key={s} style={{flex:1, height:6, background: i<=stageIdx?T.blue:T.border, borderRadius:3}} title={s}/>
              ))}
            </div>
            <div style={{fontFamily:'Poppins', fontSize:11, color:T.meta, marginTop:6}}>Etapa atual: <strong style={{color:T.ink, textTransform:'capitalize'}}>{cand.stage}</strong> · há {cand.daysInStage} dias</div>
          </div>
        </div>

        {/* Body */}
        <div style={{flex:1, padding:'20px 24px', overflowY:'auto'}}>
          <Section title="Skills">
            <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
              {cand.skills.map(s => <Tag key={s} tone="neutral">{s}</Tag>)}
            </div>
          </Section>
          <Section title="Formação">
            <div style={{fontFamily:'Poppins', fontSize:13.5, color:T.ink}}>{cand.university}</div>
          </Section>
          <Section title="Pretensão salarial">
            <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:18, color:T.ink}}>{cand.salary}<span style={{fontSize:12, color:T.meta, fontWeight:500}}> / mês</span></div>
          </Section>
          <Section title="Localidade">
            <div style={{fontFamily:'Poppins', fontSize:13.5, color:T.ink}}><Icon name="mapPin" size={13}/> {cand.city}</div>
          </Section>
          {cand.notes && (
            <Section title="Notas internas">
              <div style={{padding:12, background:'rgba(243,131,84,0.08)', borderLeft:`3px solid ${T.orange}`, borderRadius:4, fontFamily:'Poppins', fontSize:13, color:T.ink2, lineHeight:1.5}}>{cand.notes}</div>
            </Section>
          )}
          <Section title="Histórico">
            <div style={{display:'flex', flexDirection:'column', gap:10}}>
              {[
                {t:'Candidatou-se à vaga', at:cand.applied, icon:'arrow'},
                cand.hasChat && {t:'Chat iniciado por Luiza Andrade', at:'Há 2 dias', icon:'chat'},
                {t:`Movido para "${cand.stage}"`, at:`Há ${cand.daysInStage}d`, icon:'arrowRight'}
              ].filter(Boolean).map((h, i) => (
                <div key={i} style={{display:'flex', gap:10, fontFamily:'Poppins', fontSize:12.5, color:T.ink2}}>
                  <div style={{width:24, height:24, borderRadius:12, background:T.page, border:`1px solid ${T.border}`, display:'flex', alignItems:'center', justifyContent:'center', color:T.meta, flexShrink:0}}><Icon name={h.icon} size={12}/></div>
                  <div style={{flex:1}}>{h.t}<div style={{fontSize:11, color:T.meta, marginTop:2}}>{h.at}</div></div>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Footer actions */}
        <div style={{padding:'16px 24px', borderTop:`1px solid ${T.border}`, display:'flex', gap:10, background:'#fff'}}>
          <Btn variant="secondary" size="md" style={{flex:1}} onClick={()=>onStartChat(cand)} icon={<Icon name="chat" size={14}/>}>{cand.hasChat?'Abrir chat':'Iniciar chat'}</Btn>
          <Btn variant="primary" size="md" style={{flex:1}} icon={<Icon name="arrowRight" size={14}/>}>Avançar etapa</Btn>
        </div>
      </aside>
    </div>
  );
};

const Section = ({ title, children }) => (
  <div style={{marginBottom:22}}>
    <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:11, color:T.meta, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:10}}>{title}</div>
    {children}
  </div>
);
