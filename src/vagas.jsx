/* global React */
const { useState: useStateV, useMemo: useMemoV } = React;

// ─────────── Vagas list page ───────────
window.VagasPage = ({ vagas, onGo, onOpenNew, onEdit }) => {
  const [tab, setTab] = useStateV('Publicada');
  const [q, setQ] = useStateV('');
  const tabs = ['Publicada','Rascunho','Pausada','Encerrada'];
  const counts = tabs.reduce((a,t)=>(a[t]=vagas.filter(v=>v.status===t).length, a), {});
  const filtered = vagas.filter(v => v.status === tab && (q==='' || v.title.toLowerCase().includes(q.toLowerCase())));

  return (
    <main style={{padding:'28px 36px 48px'}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:22, gap:24}}>
        <div>
          <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:12, color:T.blue, letterSpacing:'.08em', marginBottom:8}}>GESTÃO DE VAGAS</div>
          <h1 style={{fontFamily:'Poppins', fontWeight:500, fontSize:30, color:T.ink, margin:0, letterSpacing:'-0.01em'}}>Suas vagas e onde elas estão no radar</h1>
        </div>
        <Btn variant="primary" size="lg" icon={<Icon name="plus" size={15}/>} onClick={onOpenNew}>Nova vaga</Btn>
      </div>

      {/* Tabs + busca */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:20, marginBottom:20, flexWrap:'wrap'}}>
        <div style={{display:'flex', gap:6, background:'#fff', border:`1px solid ${T.border}`, borderRadius:100, padding:4}}>
          {tabs.map(t => (
            <button key={t} onClick={()=>setTab(t)} style={{padding:'8px 16px', borderRadius:100, border:0, background: tab===t?T.ink:'transparent', color: tab===t?'#fff':T.ink, fontFamily:'Poppins', fontSize:13, fontWeight: tab===t?700:500, cursor:'pointer', display:'flex', alignItems:'center', gap:8}}>
              {t} <span style={{background: tab===t?'rgba(255,255,255,.2)':T.page, padding:'2px 7px', borderRadius:10, fontSize:11, fontWeight:700}}>{counts[t]}</span>
            </button>
          ))}
        </div>
        <div style={{display:'flex', gap:10, alignItems:'center'}}>
          <div style={{display:'flex', alignItems:'center', gap:8, background:'#fff', border:`1px solid ${T.border}`, borderRadius:100, padding:'8px 14px', width:280}}>
            <Icon name="search" size={14} color={T.meta}/>
            <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Buscar vaga..." style={{border:0, outline:0, flex:1, fontFamily:'Poppins', fontSize:13}}/>
          </div>
          <Btn variant="secondary" size="md" icon={<Icon name="filter" size={14}/>}>Filtrar</Btn>
        </div>
      </div>

      {/* Vagas list */}
      <div style={{display:'flex', flexDirection:'column', gap:10}}>
        {filtered.map(v => <VagaRow key={v.id} vaga={v} onGo={onGo} onEdit={()=>onEdit(v)}/>)}
        {filtered.length===0 && <Empty icon="briefcase" title="Nenhuma vaga nesta aba" desc={`Você ainda não tem vagas em status "${tab}".`}/>}
      </div>
    </main>
  );
};

const VagaRow = ({ vaga, onGo, onEdit }) => {
  const totalPipeline = vaga.pipeline.novos + vaga.pipeline.triagem + vaga.pipeline.entrevista + vaga.pipeline.oferta;
  const statusTone = { Publicada:'green', Pausada:'orange', Rascunho:'neutral', Encerrada:'red' }[vaga.status];
  return (
    <Card pad={20} style={{cursor:'pointer'}} onClick={()=>onGo('kanban', {vagaId:vaga.id})}>
      <div style={{display:'grid', gridTemplateColumns:'1fr 420px 100px', gap:24, alignItems:'center'}}>
        <div>
          <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:8}}>
            <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:17, color:T.ink}}>{vaga.title}</div>
            {vaga.mustHire && <Tag tone="orange" size="sm"><Icon name="flame" size={11}/> prioridade</Tag>}
            <Tag tone={statusTone} size="sm">{vaga.status}</Tag>
          </div>
          <div style={{display:'flex', flexWrap:'wrap', gap:8, alignItems:'center', fontFamily:'Poppins', fontSize:12.5, color:T.meta}}>
            <span>{vaga.level}</span><span>·</span>
            <span>{vaga.mode}</span><span>·</span>
            <span>{vaga.city}</span><span>·</span>
            <span>{vaga.openedAt}</span>
            {vaga.salaryHidden ? null : <>
              <span>·</span><span style={{color:T.ink, fontWeight:500}}>{vaga.salary}</span>
            </>}
          </div>
          <div style={{display:'flex', gap:6, marginTop:10, flexWrap:'wrap'}}>
            {vaga.skills.slice(0,4).map(s => <Tag key={s} tone="neutral" size="sm">{s}</Tag>)}
            {vaga.skills.length>4 && <Tag tone="neutral" size="sm">+{vaga.skills.length-4}</Tag>}
          </div>
        </div>

        {/* Pipeline stats */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(5, 1fr)', gap:6}}>
          {[['Novos', vaga.pipeline.novos, T.orange],['Triagem', vaga.pipeline.triagem, T.blue],['Entrevista', vaga.pipeline.entrevista, T.purple],['Oferta', vaga.pipeline.oferta, T.green],['Contratado', vaga.pipeline.contratado, T.ink]].map(([l,v,c]) => (
            <div key={l} style={{textAlign:'center', padding:'8px 4px', background:T.page, borderRadius:6, border:`1px solid ${T.border}`}}>
              <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:16, color:v>0?c:T.meta, lineHeight:1}}>{v}</div>
              <div style={{fontFamily:'Poppins', fontSize:10, color:T.meta, marginTop:4, textTransform:'uppercase', letterSpacing:'.04em'}}>{l}</div>
            </div>
          ))}
        </div>

        <div style={{display:'flex', flexDirection:'column', gap:6}} onClick={e=>e.stopPropagation()}>
          <Btn variant="secondary" size="sm" onClick={onEdit}>Editar</Btn>
          <button style={{fontFamily:'Poppins', fontSize:12, color:T.meta, background:'transparent', border:0, cursor:'pointer'}}>
            <Icon name="dots" size={14}/>
          </button>
        </div>
      </div>

      {vaga.newApplicants > 0 && vaga.status==='Publicada' && (
        <div style={{marginTop:14, paddingTop:14, borderTop:`1px solid ${T.border}`, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div style={{display:'flex', alignItems:'center', gap:10, fontFamily:'Poppins', fontSize:13, color:T.ink}}>
            <div style={{width:8, height:8, borderRadius:4, background:T.orange, animation:'pulse 2s infinite'}}/>
            <strong style={{fontWeight:700}}>{vaga.newApplicants} novos candidatos</strong> aguardando triagem
          </div>
          <Btn variant="primary" size="sm" icon={<Icon name="arrowRight" size={12}/>} onClick={(e)=>{e.stopPropagation(); onGo('kanban', {vagaId:vaga.id});}}>Triar agora</Btn>
        </div>
      )}
    </Card>
  );
};

// ─────────── Nova Vaga — Stepper ───────────
window.NovaVagaModal = ({ onClose, editing }) => {
  const [step, setStep] = useStateV(0);
  const [data, setData] = useStateV(editing || {
    title:'', level:'Pleno', mode:'Presencial', city:'São Luís – MA',
    salary_min:'', salary_max:'', salaryHidden:false,
    skills:[], benefits:[], description:'', requirements:''
  });
  const steps = ['Básico', 'Requisitos', 'Benefícios', 'Publicar'];

  const setF = (k, v) => setData(d => ({...d, [k]:v}));

  return (
    <div style={{position:'fixed', inset:0, background:'rgba(5,8,5,0.5)', zIndex:100, display:'flex', alignItems:'center', justifyContent:'center', padding:32}} onClick={onClose}>
      <div style={{background:'#fff', borderRadius:12, width:'100%', maxWidth:880, maxHeight:'92vh', display:'flex', flexDirection:'column', overflow:'hidden'}} onClick={e=>e.stopPropagation()}>
        {/* Header */}
        <div style={{padding:'22px 28px', borderBottom:`1px solid ${T.border}`, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:12, color:T.blue, letterSpacing:'.08em', marginBottom:4}}>{editing?'EDITANDO':'NOVA VAGA'}</div>
            <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:20, color:T.ink}}>{data.title || 'Defina a posição que você precisa preencher'}</div>
          </div>
          <button onClick={onClose} style={{width:36, height:36, borderRadius:18, border:`1px solid ${T.border}`, background:'#fff', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center'}}><Icon name="x" size={16}/></button>
        </div>

        {/* Stepper */}
        <div style={{padding:'16px 28px', borderBottom:`1px solid ${T.border}`, display:'flex', alignItems:'center', gap:8}}>
          {steps.map((s, i) => (
            <React.Fragment key={s}>
              <div style={{display:'flex', alignItems:'center', gap:10, padding:'6px 12px', borderRadius:100, background: i===step?T.blue12:i<step?T.page:'transparent', color: i===step?T.blue:i<step?T.ink:T.meta}}>
                <div style={{width:22, height:22, borderRadius:11, background: i<step?T.blue:i===step?T.blue:T.border, color: i<=step?'#fff':T.meta, fontFamily:'Poppins', fontWeight:700, fontSize:11, display:'flex', alignItems:'center', justifyContent:'center'}}>{i<step?'✓':i+1}</div>
                <span style={{fontFamily:'Poppins', fontWeight: i===step?700:500, fontSize:13}}>{s}</span>
              </div>
              {i<steps.length-1 && <div style={{flex:1, height:2, background: i<step?T.blue:T.border, borderRadius:2}}/>}
            </React.Fragment>
          ))}
        </div>

        {/* Body */}
        <div style={{flex:1, overflowY:'auto', padding:'28px'}}>
          {step===0 && <StepBasico data={data} setF={setF}/>}
          {step===1 && <StepRequisitos data={data} setF={setF}/>}
          {step===2 && <StepBeneficios data={data} setF={setF}/>}
          {step===3 && <StepPublicar data={data}/>}
        </div>

        {/* Footer */}
        <div style={{padding:'18px 28px', borderTop:`1px solid ${T.border}`, display:'flex', justifyContent:'space-between'}}>
          <Btn variant="ghost" onClick={onClose}>Salvar rascunho e sair</Btn>
          <div style={{display:'flex', gap:10}}>
            {step>0 && <Btn variant="secondary" onClick={()=>setStep(s=>s-1)}>Voltar</Btn>}
            {step<3 ? <Btn variant="primary" icon={<Icon name="arrowRight" size={14}/>} onClick={()=>setStep(s=>s+1)}>Avançar</Btn>
              : <Btn variant="primary" icon={<Icon name="check" size={14}/>} onClick={onClose}>Publicar vaga</Btn>}
          </div>
        </div>
      </div>
    </div>
  );
};

const StepBasico = ({ data, setF }) => (
  <div style={{display:'grid', gap:20}}>
    <Field label="Título da vaga" required placeholder="Ex: Engenheiro Civil Sênior — Obras Residenciais" value={data.title} onChange={v=>setF('title', v)} helper="Seja específico. Vagas com título claro recebem 2x mais candidaturas qualificadas."/>
    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
      <Field label="Nível de senioridade" required as="select" value={data.level} onChange={v=>setF('level', v)} options={['Júnior','Pleno','Sênior','Especialista']}/>
      <Field label="Modalidade" required as="select" value={data.mode} onChange={v=>setF('mode', v)} options={['Presencial','Híbrido','Remoto']}/>
    </div>
    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
      <Field label="Cidade / Região" required placeholder="São Luís – MA" value={data.city} onChange={v=>setF('city', v)}/>
      <Field label="Área de atuação" as="select" value={data.area} onChange={v=>setF('area', v)} options={['Civil','Estrutural','Elétrica','Hidráulica','Mecânica','Software','Segurança','Planejamento']}/>
    </div>
    <Field label="Descrição da vaga" as="textarea" rows={5} placeholder="O que o engenheiro vai fazer no dia a dia? Projetos, equipe, responsabilidades..." value={data.description} onChange={v=>setF('description', v)}/>
  </div>
);

const StepRequisitos = ({ data, setF }) => {
  const popular = ['AutoCAD','Revit','NBR 6118','CREA ativo','MS Project','SAP2000','TQS','NR-10','Orçamento','Primavera P6','React','TypeScript','Node.js'];
  const toggle = (s) => setF('skills', data.skills.includes(s) ? data.skills.filter(x=>x!==s) : [...data.skills, s]);
  return (
    <div style={{display:'grid', gap:20}}>
      <div>
        <label style={{display:'block', fontFamily:'Poppins', fontSize:13, fontWeight:500, color:T.ink, marginBottom:8}}>Stack principal <span style={{color:T.red}}>*</span></label>
        <div style={{fontFamily:'Poppins', fontSize:12, color:T.meta, marginBottom:12}}>Clique para adicionar. As primeiras 5 skills aparecem no cartão da vaga.</div>
        <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:16}}>
          {popular.map(s => {
            const on = data.skills.includes(s);
            return <button key={s} onClick={()=>toggle(s)} style={{padding:'8px 14px', borderRadius:100, border:`1px solid ${on?T.blue:T.border}`, background: on?T.blue:'#fff', color: on?'#fff':T.ink, fontFamily:'Poppins', fontSize:13, fontWeight:500, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6}}>
              {on?<Icon name="check" size={12}/>:<Icon name="plus" size={12}/>} {s}
            </button>;
          })}
        </div>
        <Field placeholder="Adicionar skill customizada e Enter..."/>
      </div>
      <Field label="Requisitos mínimos" as="textarea" rows={5} placeholder="• Formação em Engenharia Civil&#10;• 5+ anos de experiência&#10;• CREA ativo" value={data.requirements} onChange={v=>setF('requirements', v)}/>
      <div style={{display:'grid', gridTemplateColumns:'1fr 1fr 180px', gap:16, alignItems:'end'}}>
        <Field label="Salário mínimo" prefix="R$" placeholder="8.000" value={data.salary_min} onChange={v=>setF('salary_min', v)}/>
        <Field label="Salário máximo" prefix="R$" placeholder="12.000" value={data.salary_max} onChange={v=>setF('salary_max', v)}/>
        <label style={{display:'flex', alignItems:'center', gap:10, padding:'12px 14px', border:`1px solid ${T.border}`, borderRadius:4, cursor:'pointer', background:'#fff', height:44}}>
          <input type="checkbox" checked={data.salaryHidden} onChange={e=>setF('salaryHidden', e.target.checked)}/>
          <span style={{fontFamily:'Poppins', fontSize:13, color:T.ink}}>Ocultar do público</span>
        </label>
      </div>
    </div>
  );
};

const StepBeneficios = ({ data, setF }) => {
  const all = ['Plano de saúde','Plano odontológico','Vale alimentação','Vale refeição','Vale transporte','PLR','Bônus anual','Home office flexível','Auxílio creche','Gympass','Seguro de vida','Cursos CREA','Licença parental estendida','Day-off aniversário','Stock options','Alojamento'];
  const toggle = (s) => setF('benefits', data.benefits.includes(s) ? data.benefits.filter(x=>x!==s) : [...data.benefits, s]);
  return (
    <div style={{display:'grid', gap:20}}>
      <div>
        <label style={{display:'block', fontFamily:'Poppins', fontSize:13, fontWeight:500, color:T.ink, marginBottom:8}}>Benefícios oferecidos</label>
        <div style={{fontFamily:'Poppins', fontSize:12, color:T.meta, marginBottom:12}}>Vagas com 5+ benefícios têm 60% mais chance de conversão.</div>
        <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          {all.map(s => {
            const on = data.benefits.includes(s);
            return <button key={s} onClick={()=>toggle(s)} style={{padding:'10px 16px', borderRadius:100, border:`1px solid ${on?T.green:T.border}`, background: on?'rgba(64,162,122,0.12)':'#fff', color: on?T.green:T.ink, fontFamily:'Poppins', fontSize:13, fontWeight:500, cursor:'pointer', display:'inline-flex', alignItems:'center', gap:6}}>
              {on?<Icon name="check" size={12}/>:<Icon name="plus" size={12}/>} {s}
            </button>;
          })}
        </div>
      </div>
      <div style={{padding:16, background:T.page, border:`1px solid ${T.border}`, borderRadius:8, display:'flex', alignItems:'flex-start', gap:12}}>
        <Icon name="spark" size={18} color={T.blue}/>
        <div style={{fontFamily:'Poppins', fontSize:13, color:T.ink2, lineHeight:1.6}}>
          <strong>Dica do BdO:</strong> os benefícios mais valorizados por engenheiros em {data.city||'Maranhão'} são <strong>PLR, plano de saúde Bradesco e home office flexível</strong>. Sua vaga tem 3/3.
        </div>
      </div>
    </div>
  );
};

const StepPublicar = ({ data }) => (
  <div style={{display:'grid', gap:20}}>
    <div style={{fontFamily:'Poppins', fontSize:14, color:T.meta}}>Revise o anúncio antes de publicar. Você poderá editar a qualquer momento.</div>
    <Card pad={24} style={{background:T.page}}>
      <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:22, color:T.ink, marginBottom:10}}>{data.title || 'Título da vaga'}</div>
      <div style={{display:'flex', gap:8, flexWrap:'wrap', marginBottom:14}}>
        <Tag tone="blue">{data.level}</Tag><Tag tone="neutral">{data.mode}</Tag><Tag tone="neutral">{data.city}</Tag>
        {!data.salaryHidden && data.salary_min && <Tag tone="green">R$ {data.salary_min}–{data.salary_max}</Tag>}
      </div>
      <div style={{fontFamily:'Poppins', fontSize:13, color:T.ink2, lineHeight:1.6, marginBottom:14}}>{data.description || 'Descrição da vaga aparece aqui.'}</div>
      <div style={{display:'flex', gap:6, flexWrap:'wrap'}}>
        {data.skills.map(s => <Tag key={s} tone="neutral">{s}</Tag>)}
      </div>
    </Card>
    <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:16}}>
      <label style={{display:'flex', alignItems:'center', gap:12, padding:16, border:`1px solid ${T.blue}`, borderRadius:8, cursor:'pointer', background:T.blue12}}>
        <input type="radio" name="pub" defaultChecked/>
        <div>
          <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:14, color:T.ink}}>Publicar agora</div>
          <div style={{fontFamily:'Poppins', fontSize:12, color:T.meta, marginTop:2}}>Vaga visível para os engenheiros imediatamente.</div>
        </div>
      </label>
      <label style={{display:'flex', alignItems:'center', gap:12, padding:16, border:`1px solid ${T.border}`, borderRadius:8, cursor:'pointer', background:'#fff'}}>
        <input type="radio" name="pub"/>
        <div>
          <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:14, color:T.ink}}>Agendar publicação</div>
          <div style={{fontFamily:'Poppins', fontSize:12, color:T.meta, marginTop:2}}>Escolha data e horário para publicar.</div>
        </div>
      </label>
    </div>
  </div>
);
