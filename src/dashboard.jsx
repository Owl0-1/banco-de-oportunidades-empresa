/* global React */
const { useState: useStateD, useMemo: useMemoD } = React;

// ─────────── Funnel Chart (layout "cards") ───────────
window.FunnelChart = ({ data, variant='layered' }) => {
  const max = data[0].value;
  const colors = [T.blue, '#2D6BFD', '#5486FE', '#8EAEFE', '#F38354', T.green];

  if (variant === 'horizontal') {
    // layout alt: horizontal bars
    return (
      <div style={{display:'flex', flexDirection:'column', gap:10}}>
        {data.map((d, i) => {
          const pct = (d.value / max) * 100;
          return (
            <div key={d.label} style={{display:'grid', gridTemplateColumns:'160px 1fr 90px', alignItems:'center', gap:16}}>
              <div style={{fontFamily:'Poppins', fontSize:13, fontWeight:500, color:T.ink}}>{d.label}</div>
              <div style={{height:28, background:T.page, border:`1px solid ${T.border}`, borderRadius:4, position:'relative', overflow:'hidden'}}>
                <div style={{position:'absolute', inset:0, width:pct+'%', background: colors[i], borderRadius:4, transition:'width 400ms ease-out'}}/>
                <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', padding:'0 12px', fontFamily:'Poppins', fontSize:12, fontWeight:700, color: pct>25?'#fff':T.ink}}>{fmtNum(d.value)}</div>
              </div>
              <div style={{fontFamily:'Poppins', fontSize:12, color: d.delta?.startsWith('+')?T.green:T.meta, fontWeight:500, textAlign:'right'}}>{d.delta}</div>
            </div>
          );
        })}
      </div>
    );
  }

  // layered trapezoids
  return (
    <div style={{display:'flex', flexDirection:'column', gap:4, alignItems:'center'}}>
      {data.map((d, i) => {
        const w = 100 - (i * 13);
        return (
          <div key={d.label} style={{width: w+'%', minWidth:200, background: colors[i], color:'#fff', padding:'14px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', borderRadius: i===0?'8px 8px 0 0': i===data.length-1?'0 0 8px 8px':0, clipPath: i===0||i===data.length-1?'none':'polygon(3% 0, 97% 0, 100% 100%, 0% 100%)'}}>
            <div style={{fontFamily:'Poppins', fontSize:13, fontWeight:500}}>{d.label}</div>
            <div style={{display:'flex', alignItems:'baseline', gap:10}}>
              <span style={{fontFamily:'Poppins', fontSize:18, fontWeight:700}}>{fmtNum(d.value)}</span>
              <span style={{fontFamily:'Poppins', fontSize:11, opacity:.85}}>{d.delta}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─────────── Heatmap ───────────
window.Heatmap = ({ data }) => {
  const days = ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'];
  const hours = ['08','10','12','14','16','18'];
  const hoursFull = Array.from({length:12}, (_,i)=>i); // 12 cols
  const max = 8;
  return (
    <div>
      <div style={{display:'grid', gridTemplateColumns:'32px repeat(12, 1fr)', gap:3, marginBottom:8}}>
        <div/>
        {hoursFull.map((h,i) => (
          <div key={i} style={{fontFamily:'Poppins', fontSize:10, color:T.meta, textAlign:'center'}}>{i%2===0?(8+i):''}</div>
        ))}
      </div>
      {days.map((day, r) => (
        <div key={day} style={{display:'grid', gridTemplateColumns:'32px repeat(12, 1fr)', gap:3, marginBottom:3}}>
          <div style={{fontFamily:'Poppins', fontSize:11, color:T.meta, alignSelf:'center'}}>{day}</div>
          {data[r].map((v, c) => (
            <div key={c} title={`${day} · ${8+c}h — ${v} atividades`} style={{aspectRatio:'1', background: v===0?T.page:`rgba(6,87,249,${0.15 + (v/max)*0.75})`, borderRadius:3, border:`1px solid ${v===0?T.border:'transparent'}`}}/>
          ))}
        </div>
      ))}
      <div style={{display:'flex', alignItems:'center', gap:10, marginTop:14, fontFamily:'Poppins', fontSize:11, color:T.meta}}>
        Menos
        {[0.15, 0.3, 0.5, 0.7, 0.9].map(op => <span key={op} style={{width:16, height:16, background:`rgba(6,87,249,${op})`, borderRadius:3}}/>)}
        Mais
      </div>
    </div>
  );
};

// ─────────── Stat card ───────────
window.KpiCard = ({ label, value, delta, deltaTone='green', icon, accent=T.blue, compact }) => (
  <Card pad={compact?16:20} style={{flex:1, minWidth:0}}>
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:12}}>
      <div style={{fontFamily:'Poppins', fontSize:13, color:T.meta, fontWeight:500}}>{label}</div>
      <div style={{width:32, height:32, borderRadius:6, background: accent+(accent===T.blue?'12':'20'), color:accent, display:'flex', alignItems:'center', justifyContent:'center'}}><Icon name={icon} size={16}/></div>
    </div>
    <div style={{fontFamily:'Poppins', fontWeight:700, fontSize: compact?24:32, color:T.ink, lineHeight:1, letterSpacing:'-0.02em'}}>{value}</div>
    {delta && <div style={{marginTop:10, fontFamily:'Poppins', fontSize:12, color: deltaTone==='green'?T.green:deltaTone==='red'?T.red:T.meta, fontWeight:500, display:'inline-flex', alignItems:'center', gap:4}}>
      <Icon name={deltaTone==='red'?'trend':'trend'} size={13}/> {delta}
    </div>}
  </Card>
);

// ─────────── Action feed ───────────
window.ActionFeed = ({ onGo }) => {
  const items = [
    { icon:'users', color:T.blue, title:'12 novos candidatos em "Eng. Estrutural Especialista"', time:'Há 10min', action:'Triar agora', go:'kanban', vaga:'v3' },
    { icon:'mail', color:T.orange, title:'Rafael Lima respondeu no chat', time:'Há 42min', action:'Responder', go:'chat' },
    { icon:'file', color:T.purple, title:'Daniel Araújo visualizou sua proposta', time:'Há 2h', action:'Acompanhar', go:'kanban' },
    { icon:'spark', color:T.green, title:'Match 95% · Priscila Tavares disponível', time:'Há 3h', action:'Ver perfil', go:'hunting' },
    { icon:'alert', color:T.red, title:'Vaga "Eng. Segurança" pausada há 3 semanas', time:'Há 2 dias', action:'Reativar', go:'vagas' }
  ];
  return (
    <div style={{display:'flex', flexDirection:'column'}}>
      {items.map((it, i) => (
        <div key={i} style={{display:'flex', alignItems:'center', gap:14, padding:'14px 0', borderBottom: i<items.length-1?`1px solid ${T.border}`:'none'}}>
          <div style={{width:36, height:36, borderRadius:8, background: it.color+'20', color: it.color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
            <Icon name={it.icon} size={16}/>
          </div>
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontFamily:'Poppins', fontSize:13.5, color:T.ink, fontWeight:500, lineHeight:1.35}}>{it.title}</div>
            <div style={{fontFamily:'Poppins', fontSize:12, color:T.meta, marginTop:3}}>{it.time}</div>
          </div>
          <button onClick={()=>onGo(it.go)} style={{fontFamily:'Poppins', fontSize:12, fontWeight:700, color:T.blue, background:'transparent', border:0, cursor:'pointer', whiteSpace:'nowrap'}}>{it.action} →</button>
        </div>
      ))}
    </div>
  );
};

// ─────────── Dashboard page ───────────
window.DashboardPage = ({ user, vagas, onGo, layout='balanced' }) => {
  const openVagas = vagas.filter(v => v.status === 'Publicada');
  const topVagas = [...openVagas].sort((a,b) => (b.newApplicants + b.applicants*0.1) - (a.newApplicants + a.applicants*0.1)).slice(0,3);
  const totalPipeline = vagas.reduce((s,v) => s + v.pipeline.novos + v.pipeline.triagem + v.pipeline.entrevista + v.pipeline.oferta, 0);

  return (
    <main style={{padding:'28px 36px 48px'}}>
      {/* Hero greeting */}
      <div style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:24, marginBottom:28}}>
        <div>
          <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:12, color:T.blue, letterSpacing:'.08em', marginBottom:8}}>PAINEL DA EMPRESA · {new Date().toLocaleDateString('pt-BR',{weekday:'long', day:'numeric', month:'long'}).toUpperCase()}</div>
          <h1 style={{fontFamily:'Poppins', fontWeight:500, fontSize:34, color:T.ink, margin:0, lineHeight:1.15, letterSpacing:'-0.01em'}}>
            Olá, {user.name.split(' ')[0]}. <span style={{color:T.meta}}>Você tem</span> 22 ações <span style={{color:T.meta}}>exigindo atenção hoje.</span>
          </h1>
        </div>
        <div style={{display:'flex', gap:10}}>
          <Btn variant="secondary" icon={<Icon name="users" size={14}/>} onClick={()=>onGo('hunting')}>Buscar talentos</Btn>
          <Btn variant="primary" icon={<Icon name="plus" size={14}/>} onClick={()=>onGo('vagas-new')}>Nova vaga</Btn>
        </div>
      </div>

      {/* KPIs */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14, marginBottom:28}}>
        <KpiCard label="Vagas abertas" value={openVagas.length} delta={'+2 esta semana'} icon="briefcase" accent={T.blue}/>
        <KpiCard label="Candidatos na pipeline" value={fmtNum(totalPipeline)} delta={'+54 esta semana'} icon="users" accent={T.green}/>
        <KpiCard label="Mensagens não lidas" value="8" delta={'+4 hoje'} icon="chat" accent={T.orange}/>
        <KpiCard label="Entrevistas esta semana" value="6" delta={'próxima: qui 10h'} deltaTone="neutral" icon="calendar" accent={T.purple}/>
      </div>

      {/* Grid principal */}
      <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:16, marginBottom:28}}>
        {/* Funil */}
        <Card>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:20}}>
            <div>
              <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:12, color:T.blue, letterSpacing:'.08em', marginBottom:6}}>FUNIL DO MÊS</div>
              <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:18, color:T.ink}}>Visualização → Contratação</div>
            </div>
            <div style={{display:'flex', gap:6}}>
              <Tag tone="dark" size="sm">Todas as vagas</Tag>
              <Tag tone="neutral" size="sm">Abril 2026</Tag>
            </div>
          </div>
          <FunnelChart data={MOCK_FUNNEL} variant={layout==='funnel-hero'?'layered':'horizontal'}/>
          <div style={{marginTop:20, paddingTop:18, borderTop:`1px solid ${T.border}`, display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20}}>
            <div><div style={{fontFamily:'Poppins', fontSize:11, color:T.meta}}>Taxa candidatura → triagem</div><div style={{fontFamily:'Poppins', fontSize:20, fontWeight:700, color:T.ink, marginTop:4}}>36%</div></div>
            <div><div style={{fontFamily:'Poppins', fontSize:11, color:T.meta}}>Taxa triagem → entrevista</div><div style={{fontFamily:'Poppins', fontSize:20, fontWeight:700, color:T.ink, marginTop:4}}>33%</div></div>
            <div><div style={{fontFamily:'Poppins', fontSize:11, color:T.meta}}>Tempo médio até contratar</div><div style={{fontFamily:'Poppins', fontSize:20, fontWeight:700, color:T.ink, marginTop:4}}>21 <span style={{fontSize:13, color:T.meta, fontWeight:500}}>dias</span></div></div>
          </div>
        </Card>

        {/* Feed de ações */}
        <Card>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:4}}>
            <div>
              <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:12, color:T.orange, letterSpacing:'.08em', marginBottom:6}}>EXIGE SUA ATENÇÃO</div>
              <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:18, color:T.ink}}>Próximas ações</div>
            </div>
            <Btn variant="ghost" size="sm" onClick={()=>onGo('notifs')}>Ver todas</Btn>
          </div>
          <ActionFeed onGo={onGo}/>
        </Card>
      </div>

      {/* Top vagas + atividade */}
      <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:16}}>
        <Card>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16}}>
            <div>
              <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:12, color:T.blue, letterSpacing:'.08em', marginBottom:6}}>MAIS ATIVAS</div>
              <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:18, color:T.ink}}>Top 3 vagas</div>
            </div>
            <Btn variant="ghost" size="sm" onClick={()=>onGo('vagas')}>Ver todas →</Btn>
          </div>
          <div style={{display:'flex', flexDirection:'column', gap:10}}>
            {topVagas.map(v => (
              <div key={v.id} onClick={()=>onGo('kanban', {vagaId:v.id})} style={{display:'grid', gridTemplateColumns:'1fr auto auto auto', gap:20, alignItems:'center', padding:'14px 16px', background:T.page, borderRadius:8, cursor:'pointer', border:`1px solid ${T.border}`}}>
                <div style={{minWidth:0}}>
                  <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:14, color:T.ink, marginBottom:4, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{v.title}</div>
                  <div style={{display:'flex', gap:8, fontFamily:'Poppins', fontSize:12, color:T.meta}}>
                    <span>{v.level}</span>·<span>{v.mode}</span>·<span>{v.openedAt}</span>
                  </div>
                </div>
                <div style={{textAlign:'center', minWidth:60}}>
                  <div style={{fontFamily:'Poppins', fontSize:10, color:T.meta, textTransform:'uppercase', letterSpacing:'.05em'}}>Novos</div>
                  <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:18, color:v.newApplicants>0?T.orange:T.ink}}>{v.newApplicants}</div>
                </div>
                <div style={{textAlign:'center', minWidth:60}}>
                  <div style={{fontFamily:'Poppins', fontSize:10, color:T.meta, textTransform:'uppercase', letterSpacing:'.05em'}}>Total</div>
                  <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:18, color:T.ink}}>{v.applicants}</div>
                </div>
                <Icon name="chevRight" size={16} color={T.meta}/>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={{marginBottom:16}}>
            <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:12, color:T.blue, letterSpacing:'.08em', marginBottom:6}}>ATIVIDADE</div>
            <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:18, color:T.ink}}>Quando os candidatos se mexem</div>
            <div style={{fontFamily:'Poppins', fontSize:13, color:T.meta, marginTop:4}}>Últimos 7 dias · horário comercial</div>
          </div>
          <Heatmap data={MOCK_HEATMAP}/>
        </Card>
      </div>
    </main>
  );
};
