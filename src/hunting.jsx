/* global React */
const { useState: useStateH } = React;

// ─────────── Hunting — Banco de Talentos ───────────
window.HuntingPage = ({ talents, vagas, cardVariant='compact', showMatch=true, onStartChat, onAddToVaga }) => {
  const [level, setLevel] = useStateH('Todos');
  const [minMatch, setMinMatch] = useStateH(60);
  const [onlyAvail, setOnlyAvail] = useStateH(false);
  const [edu, setEdu] = useStateH('Todas');
  const [salary, setSalary] = useStateH(25000);
  const [q, setQ] = useStateH('');
  const [selected, setSelected] = useStateH(null);

  const filtered = talents.filter(t =>
    (level==='Todos' || t.level===level) &&
    t.match >= minMatch &&
    (!onlyAvail || t.available) &&
    (edu==='Todas' || t.education.includes(edu)) &&
    (q==='' || t.name.toLowerCase().includes(q.toLowerCase()) || t.skills.some(s=>s.toLowerCase().includes(q.toLowerCase())))
  );

  return (
    <main style={{padding:'24px 28px 40px'}}>
      <div style={{marginBottom:18}}>
        <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:12, color:T.blue, letterSpacing:'.08em', marginBottom:8}}>BANCO DE TALENTOS · HUNTING</div>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end'}}>
          <h1 style={{fontFamily:'Poppins', fontWeight:500, fontSize:28, color:T.ink, margin:0, letterSpacing:'-0.01em'}}>Encontre engenheiros antes da concorrência</h1>
          <div style={{fontFamily:'Poppins', fontSize:13, color:T.meta}}><strong style={{color:T.ink, fontWeight:700}}>{fmtNum(filtered.length)}</strong> de {fmtNum(talents.length)} engenheiros no radar</div>
        </div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'280px 1fr', gap:16}}>
        {/* Filters rail */}
        <Card pad={20} style={{height:'fit-content', position:'sticky', top:88}}>
          <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:13, color:T.ink, marginBottom:16}}>Filtros</div>

          <FilterGroup label="Senioridade">
            {['Todos','Júnior','Pleno','Sênior','Especialista'].map(l => (
              <label key={l} style={{display:'flex', alignItems:'center', gap:8, padding:'6px 0', fontFamily:'Poppins', fontSize:13, color:T.ink, cursor:'pointer'}}>
                <input type="radio" name="level" checked={level===l} onChange={()=>setLevel(l)}/> {l}
              </label>
            ))}
          </FilterGroup>

          <FilterGroup label={`Match mínimo · ${minMatch}%`}>
            <input type="range" min={50} max={100} value={minMatch} onChange={e=>setMinMatch(+e.target.value)} style={{width:'100%', accentColor:T.blue}}/>
          </FilterGroup>

          <FilterGroup label={`Pretensão salarial · até R$ ${fmtNum(salary)}`}>
            <input type="range" min={5000} max={25000} step={500} value={salary} onChange={e=>setSalary(+e.target.value)} style={{width:'100%', accentColor:T.blue}}/>
          </FilterGroup>

          <FilterGroup label="Formação">
            <Field as="select" value={edu} onChange={setEdu} options={['Todas','UFMA','UEMA','USP','UFPE','IME-USP']}/>
          </FilterGroup>

          <FilterGroup label="Disponibilidade">
            <Toggle on={onlyAvail} onChange={setOnlyAvail} label="Somente disponíveis agora"/>
          </FilterGroup>

          <Btn variant="ghost" size="sm" style={{marginTop:8, padding:0}} onClick={()=>{setLevel('Todos');setMinMatch(60);setOnlyAvail(false);setEdu('Todas');setSalary(25000);}}>Limpar filtros</Btn>
        </Card>

        {/* Results */}
        <div>
          <div style={{display:'flex', gap:10, marginBottom:14, alignItems:'center'}}>
            <div style={{flex:1, display:'flex', alignItems:'center', gap:10, background:'#fff', border:`1px solid ${T.border}`, borderRadius:100, padding:'10px 18px'}}>
              <Icon name="search" size={16} color={T.meta}/>
              <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Ex: React + Sênior + Disponível..." style={{border:0, outline:0, flex:1, fontFamily:'Poppins', fontSize:14}}/>
            </div>
            <Btn variant="secondary" size="md" icon={<Icon name="bookmark" size={14}/>}>Salvar busca</Btn>
          </div>

          <div style={{display:'grid', gridTemplateColumns: cardVariant==='rich' ? '1fr' : 'repeat(2, 1fr)', gap:12}}>
            {filtered.map(t => (
              cardVariant==='rich'
                ? <TalentCardRich key={t.id} t={t} showMatch={showMatch} vagas={vagas} onStartChat={()=>onStartChat(t)} onAdd={(vaga)=>onAddToVaga(t, vaga)} onOpen={()=>setSelected(t)}/>
                : <TalentCardCompact key={t.id} t={t} showMatch={showMatch} vagas={vagas} onStartChat={()=>onStartChat(t)} onAdd={(vaga)=>onAddToVaga(t, vaga)} onOpen={()=>setSelected(t)}/>
            ))}
          </div>
          {filtered.length===0 && <Empty icon="search" title="Nenhum engenheiro com esses filtros" desc="Relaxe os critérios ou aumente o alcance da busca."/>}
        </div>
      </div>

      {selected && <TalentDrawer t={selected} onClose={()=>setSelected(null)} onStartChat={()=>{onStartChat(selected); setSelected(null);}} vagas={vagas} onAdd={(v)=>{onAddToVaga(selected, v); setSelected(null);}}/>}
    </main>
  );
};

const FilterGroup = ({ label, children }) => (
  <div style={{marginBottom:18, paddingBottom:16, borderBottom:`1px solid ${T.border}`}}>
    <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:11, color:T.meta, letterSpacing:'.06em', textTransform:'uppercase', marginBottom:10}}>{label}</div>
    {children}
  </div>
);

// Compact card — grid of 2
const TalentCardCompact = ({ t, showMatch, vagas, onStartChat, onAdd, onOpen }) => (
  <Card pad={16} style={{cursor:'pointer'}} onClick={onOpen}>
    <div style={{display:'flex', alignItems:'flex-start', gap:12, marginBottom:12}}>
      <Avatar initials={t.initials} color={t.color} size={44}/>
      <div style={{flex:1, minWidth:0}}>
        <div style={{display:'flex', alignItems:'center', gap:8, marginBottom:2}}>
          <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:15, color:T.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{t.name}</div>
          {t.available && <div style={{width:6, height:6, borderRadius:3, background:T.green}} title="Disponível"/>}
        </div>
        <div style={{fontFamily:'Poppins', fontSize:12.5, color:T.meta}}>{t.role}</div>
        <div style={{fontFamily:'Poppins', fontSize:11, color:T.meta, marginTop:3}}>{t.city} · {t.experience}</div>
      </div>
      {showMatch && <MatchScore value={t.match} size={44} thickness={4}/>}
    </div>
    <div style={{display:'flex', gap:5, flexWrap:'wrap', marginBottom:12}}>
      {t.skills.slice(0,3).map(s => <Tag key={s} tone="neutral" size="sm">{s}</Tag>)}
      {t.skills.length>3 && <Tag tone="neutral" size="sm">+{t.skills.length-3}</Tag>}
    </div>
    <div style={{display:'flex', gap:8}} onClick={e=>e.stopPropagation()}>
      <Btn variant="primary" size="sm" style={{flex:1}} icon={<Icon name="chat" size={12}/>} onClick={onStartChat}>Iniciar chat</Btn>
      <Btn variant="secondary" size="sm" icon={<Icon name="plus" size={12}/>} onClick={()=>onAdd(vagas[0])} title="Adicionar à vaga"/>
    </div>
  </Card>
);

// Rich card — full width, tons of detail
const TalentCardRich = ({ t, showMatch, vagas, onStartChat, onAdd, onOpen }) => (
  <Card pad={24} style={{cursor:'pointer'}} onClick={onOpen}>
    <div style={{display:'grid', gridTemplateColumns:'auto 1fr auto', gap:24, alignItems:'center'}}>
      <Avatar initials={t.initials} color={t.color} size={64}/>
      <div>
        <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:4}}>
          <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:19, color:T.ink}}>{t.name}</div>
          <Tag tone={t.available?'green':'neutral'} size="sm">{t.available?'Disponível':'Empregado'}</Tag>
          <span style={{fontFamily:'Poppins', fontSize:11, color:T.meta}}>· Ativo {t.lastActive}</span>
        </div>
        <div style={{fontFamily:'Poppins', fontSize:14, color:T.ink2, marginBottom:6}}>{t.role} · {t.experience} · {t.city}</div>
        <div style={{fontFamily:'Poppins', fontSize:12.5, color:T.meta, marginBottom:10, lineHeight:1.5, maxWidth:620}}>{t.bio}</div>
        <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
          {t.skills.map(s => <Tag key={s} tone="neutral" size="sm">{s}</Tag>)}
        </div>
        <div style={{display:'flex', gap:20, marginTop:12, fontFamily:'Poppins', fontSize:12, color:T.meta}}>
          <span><strong style={{color:T.ink, fontWeight:700}}>{t.salary}</strong> pretensão</span>
          <span>{t.education}</span>
        </div>
      </div>
      <div style={{display:'flex', flexDirection:'column', alignItems:'center', gap:14}} onClick={e=>e.stopPropagation()}>
        {showMatch && <MatchScore value={t.match} size={72} thickness={6}/>}
        <div style={{display:'flex', gap:8}}>
          <Btn variant="primary" size="md" icon={<Icon name="chat" size={14}/>} onClick={onStartChat}>Iniciar chat</Btn>
          <Btn variant="secondary" size="md" icon={<Icon name="plus" size={14}/>} onClick={()=>onAdd(vagas[0])}>Adicionar à vaga</Btn>
        </div>
      </div>
    </div>
  </Card>
);

const TalentDrawer = ({ t, onClose, onStartChat, vagas, onAdd }) => (
  <div style={{position:'fixed', inset:0, zIndex:90}}>
    <div style={{position:'absolute', inset:0, background:'rgba(5,8,5,0.4)'}} onClick={onClose}/>
    <aside style={{position:'absolute', top:0, right:0, width:520, height:'100vh', background:'#fff', overflowY:'auto', display:'flex', flexDirection:'column'}}>
      <div style={{padding:'24px', borderBottom:`1px solid ${T.border}`, display:'flex', alignItems:'flex-start', gap:14}}>
        <Avatar initials={t.initials} color={t.color} size={64}/>
        <div style={{flex:1}}>
          <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:20, color:T.ink}}>{t.name}</div>
          <div style={{fontFamily:'Poppins', fontSize:13, color:T.meta, marginTop:2}}>{t.role}</div>
          <div style={{display:'flex', gap:6, marginTop:10, flexWrap:'wrap'}}>
            <Tag tone={t.available?'green':'neutral'} size="sm">{t.available?'Disponível':'Empregado'}</Tag>
            <Tag tone="blue" size="sm">{t.level}</Tag>
            <Tag tone="neutral" size="sm">{t.city}</Tag>
          </div>
        </div>
        <button onClick={onClose} style={{width:32, height:32, borderRadius:16, border:`1px solid ${T.border}`, background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}><Icon name="x" size={14}/></button>
      </div>
      <div style={{padding:'20px 24px', display:'grid', gridTemplateColumns:'auto 1fr', gap:20, alignItems:'center', borderBottom:`1px solid ${T.border}`}}>
        <MatchScore value={t.match} size={72} thickness={6}/>
        <div>
          <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:13, color:T.ink, marginBottom:4}}>Match com "Engenheiro Civil Sênior"</div>
          <div style={{fontFamily:'Poppins', fontSize:12, color:T.meta}}>Skills batem em {Math.round(t.match*0.9)}% · senioridade compatível · pretensão dentro do range.</div>
        </div>
      </div>
      <div style={{flex:1, padding:'20px 24px', overflowY:'auto'}}>
        <div style={{marginBottom:22}}>
          <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:11, color:T.meta, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:10}}>Bio</div>
          <div style={{fontFamily:'Poppins', fontSize:14, color:T.ink2, lineHeight:1.6}}>{t.bio}</div>
        </div>
        <div style={{marginBottom:22}}>
          <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:11, color:T.meta, letterSpacing:'.08em', textTransform:'uppercase', marginBottom:10}}>Skills</div>
          <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>{t.skills.map(s => <Tag key={s} tone="neutral">{s}</Tag>)}</div>
        </div>
        <div style={{marginBottom:22, display:'grid', gridTemplateColumns:'1fr 1fr', gap:14}}>
          <div><div style={{fontFamily:'Poppins', fontSize:11, color:T.meta, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:4}}>Pretensão</div><div style={{fontFamily:'Poppins', fontWeight:700, fontSize:18, color:T.ink}}>{t.salary}</div></div>
          <div><div style={{fontFamily:'Poppins', fontSize:11, color:T.meta, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:4}}>Experiência</div><div style={{fontFamily:'Poppins', fontWeight:700, fontSize:18, color:T.ink}}>{t.experience}</div></div>
          <div><div style={{fontFamily:'Poppins', fontSize:11, color:T.meta, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:4}}>Formação</div><div style={{fontFamily:'Poppins', fontSize:13, color:T.ink}}>{t.education}</div></div>
          <div><div style={{fontFamily:'Poppins', fontSize:11, color:T.meta, textTransform:'uppercase', letterSpacing:'.05em', marginBottom:4}}>Cidade</div><div style={{fontFamily:'Poppins', fontSize:13, color:T.ink}}>{t.city}</div></div>
        </div>
      </div>
      <div style={{padding:'16px 24px', borderTop:`1px solid ${T.border}`, display:'flex', gap:10}}>
        <Btn variant="secondary" size="md" style={{flex:1}} icon={<Icon name="plus" size={14}/>} onClick={()=>onAdd(vagas[0])}>Adicionar à vaga</Btn>
        <Btn variant="primary" size="md" style={{flex:1}} icon={<Icon name="chat" size={14}/>} onClick={onStartChat}>Iniciar chat</Btn>
      </div>
    </aside>
  </div>
);
