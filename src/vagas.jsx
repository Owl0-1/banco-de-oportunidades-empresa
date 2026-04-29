/* global React */
const { useState: useStateV, useMemo: useMemoV, useEffect: useEffectV, useRef: useRefV } = React;

// ─────────── Vagas list page ───────────
const VagasTabPill = ({ label, active, count, dimmed, onClick }) => {
  const [hot, setHot] = useStateV(false);
  const bg = active ? (hot ? T.blue24 : T.blue12) : (hot ? T.page : 'transparent');
  const fg = active ? T.blue : T.ink;
  return (
    <button
      type="button"
      onClick={onClick}
      title={`Status: ${label}`}
      style={{
        padding:'8px 16px',
        borderRadius:100,
        border:0,
        background: bg,
        color: fg,
        fontFamily:'Poppins',
        fontSize:12,
        fontWeight: active ? 700 : 500,
        cursor:'pointer',
        display:'flex',
        alignItems:'center',
        gap:8,
        opacity: dimmed ? 0.55 : 1,
        transition:'background 140ms ease, color 140ms ease'
      }}
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      onFocus={() => setHot(true)}
      onBlur={() => setHot(false)}
    >
      {label}{' '}
      <span style={{background: active?'#fff':T.page, padding:'2px 7px', borderRadius:10, fontSize:11, fontWeight:700, color: active?T.blue:T.ink}}>
        {count}
      </span>
    </button>
  );
};

window.VagasPage = ({ vagas, onGo, onOpenNew, onEdit }) => {
  const [tab, setTab] = useStateV('Todas');
  const [q, setQ] = useStateV('');
  const [filtersOpen, setFiltersOpen] = useStateV(false);
  const [sortBy, setSortBy] = useStateV('recentes'); // recentes | antigas | titulo_az | titulo_za
  const [modeF, setModeF] = useStateV('Todas'); // Presencial | Híbrido | Remoto | Todas
  const [levelF, setLevelF] = useStateV('Todos'); // Júnior | Pleno | Sênior | Especialista | Todos
  const [cityF, setCityF] = useStateV('Todas'); // valor de city | Todas
  const filtersRef = useRefV(null);
  const tabs = ['Todas', 'Publicada', 'Rascunho', 'Pausada', 'Encerrada'];

  const qNorm = (q || '').trim().toLowerCase();
  const counts = useMemoV(() => {
    const by = tabs.reduce((a, t) => (a[t] = 0, a), {});
    by.Todas = (vagas || []).length;
    (vagas || []).forEach(v => {
      if (by[v.status] !== undefined) by[v.status] += 1;
    });
    return by;
  }, [vagas]);

  const parseOpenedAtDays = (openedAt) => {
    const s = String(openedAt || '').trim();
    if (!s || s === '—') return Number.POSITIVE_INFINITY;
    const m = s.match(/Há\s+(\d+)\s+(dia|dias|semana|semanas)/i);
    if (!m) return Number.POSITIVE_INFINITY;
    const n = Number(m[1]);
    if (!Number.isFinite(n)) return Number.POSITIVE_INFINITY;
    const unit = m[2].toLowerCase();
    return unit.startsWith('semana') ? n * 7 : n;
  };

  const filterOptions = useMemoV(() => {
    const pool = (vagas || []);
    const modes = Array.from(new Set(pool.map(v => v.mode).filter(Boolean)));
    const levels = Array.from(new Set(pool.map(v => v.level).filter(Boolean)));
    const cities = Array.from(new Set(pool.map(v => v.city).filter(Boolean)));
    modes.sort((a,b)=>String(a).localeCompare(String(b), 'pt-BR'));
    levels.sort((a,b)=>String(a).localeCompare(String(b), 'pt-BR'));
    cities.sort((a,b)=>String(a).localeCompare(String(b), 'pt-BR'));
    return { modes, levels, cities };
  }, [vagas]);

  const filtersActive = sortBy !== 'recentes' || modeF !== 'Todas' || levelF !== 'Todos' || cityF !== 'Todas';

  const appliedFilters = useMemoV(() => {
    const a = [];
    if (modeF !== 'Todas') a.push(`Modalidade: ${modeF}`);
    if (levelF !== 'Todos') a.push(`Nível: ${levelF}`);
    if (cityF !== 'Todas') a.push(`Cidade: ${cityF}`);
    if (sortBy !== 'recentes') {
      const sortLabel = {
        antigas: 'Data (mais antigas)',
        titulo_az: 'Título (A → Z)',
        titulo_za: 'Título (Z → A)'
      }[sortBy] || sortBy;
      a.push(`Ordenação: ${sortLabel}`);
    }
    return a;
  }, [modeF, levelF, cityF, sortBy]);

  const appliedCount = appliedFilters.length;

  useEffectV(() => {
    if (!filtersOpen) return;
    const onDoc = (e) => {
      if (!filtersRef.current) return;
      if (!filtersRef.current.contains(e.target)) setFiltersOpen(false);
    };
    document.addEventListener('mousedown', onDoc);
    return () => document.removeEventListener('mousedown', onDoc);
  }, [filtersOpen]);

  const filtered = useMemoV(() => {
    const pool = (tab === 'Todas') ? (vagas || []) : (vagas || []).filter(v => v.status === tab);
    const byQ = qNorm ? pool.filter(v => (v.title || '').toLowerCase().includes(qNorm)) : pool;
    const byMode = modeF === 'Todas' ? byQ : byQ.filter(v => v.mode === modeF);
    const byLevel = levelF === 'Todos' ? byMode : byMode.filter(v => v.level === levelF);
    const byCity = cityF === 'Todas' ? byLevel : byLevel.filter(v => v.city === cityF);
    const out = [...byCity];
    out.sort((a, b) => {
      if (sortBy === 'titulo_az') return String(a.title || '').localeCompare(String(b.title || ''), 'pt-BR');
      if (sortBy === 'titulo_za') return String(b.title || '').localeCompare(String(a.title || ''), 'pt-BR');
      const da = parseOpenedAtDays(a.openedAt);
      const db = parseOpenedAtDays(b.openedAt);
      return sortBy === 'antigas' ? (db - da) : (da - db);
    });
    return out;
  }, [vagas, tab, qNorm, sortBy, modeF, levelF, cityF]);

  return (
    <main style={{padding:'28px 36px 48px'}}>
      <div style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:24, marginBottom:28}}>
        <div>
          <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:12, color:T.blue, letterSpacing:'.08em', marginBottom:8}}>
            GESTÃO DE VAGAS · {new Date().toLocaleDateString('pt-BR',{weekday:'long', day:'numeric', month:'long'}).toUpperCase()}
          </div>
          <h1 style={{fontFamily:'Poppins', fontWeight:500, fontSize:24, color:T.ink, margin:0, lineHeight:1.15, letterSpacing:'-0.01em'}}>
            Suas vagas e onde elas estão no radar
          </h1>
        </div>
        <div style={{display:'flex', gap:10}}>
          <Btn
            variant="primary"
            size="md"
            icon={<Icon name="plus" size={14}/>}
            onClick={onOpenNew}
            style={{fontSize:12, fontWeight:500, padding:'11px 18px'}}
          >
            Nova vaga
          </Btn>
        </div>
      </div>

      {/* Tabs + busca */}
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:20, marginBottom:10, flexWrap:'wrap'}}>
        <div style={{display:'flex', gap:6, background:'#fff', border:`1px solid ${T.border}`, borderRadius:100, padding:4, flexWrap:'wrap'}}>
          {tabs.map(t => {
            const on = tab === t;
            const n = counts[t] ?? 0;
            return (
              <VagasTabPill
                key={t}
                label={t}
                active={on}
                count={n}
                dimmed={!on && n === 0}
                onClick={() => setTab(t)}
              />
            );
          })}
        </div>
        <div style={{display:'flex', gap:10, alignItems:'center', position:'relative'}} ref={filtersRef}>
          <div
            style={{
              display:'flex',
              alignItems:'center',
              gap:8,
              background:'#fff',
              border:`1px solid ${T.border}`,
              borderRadius:100,
              height:40,
              padding:'0 14px',
              width:320,
              transition:'border-color 140ms ease, background 140ms ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = T.divider;
              e.currentTarget.style.background = T.page;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = T.border;
              e.currentTarget.style.background = '#fff';
            }}
          >
            <Icon name="search" size={14} color={T.meta}/>
            <input
              value={q}
              onChange={e=>setQ(e.target.value)}
              placeholder="Buscar por título..."
              style={{border:0, outline:0, flex:1, fontFamily:'Poppins', fontSize:13, minWidth:0, background:'transparent'}}
            />
            {qNorm && (
              <button type="button" onClick={()=>setQ('')} title="Limpar busca" style={{border:0, background:'transparent', cursor:'pointer', color:T.meta, display:'inline-flex'}}>
                <Icon name="x" size={14}/>
              </button>
            )}
          </div>
          <Btn
            variant="secondary"
            size="sm"
            onClick={() => setFiltersOpen(o => !o)}
            icon={<Icon name={filtersOpen ? 'chevDown' : 'chevDown'} size={14} />}
            title="Filtrar e ordenar"
            style={{
              border: filtersActive ? `1px solid ${T.blue16}` : `1px solid ${T.border}`,
              background: filtersActive ? T.blue12 : '#fff',
              color: filtersActive ? T.blue : T.ink,
              fontWeight: 600,
              fontSize: 12,
              height: 40,
              padding: '0 14px'
            }}
          >
            <span style={{display:'inline-flex', alignItems:'center', gap:8}}>
              <Icon name="filter" size={14} color={filtersActive ? T.blue : T.ink2}/>
              Filtrar
              {appliedCount > 0 && (
                <span
                  style={{
                    marginLeft: 2,
                    minWidth: 18,
                    height: 18,
                    padding: '0 6px',
                    borderRadius: 100,
                    background: '#fff',
                    border: `1px solid ${T.blue16}`,
                    color: T.blue,
                    fontFamily: 'Poppins',
                    fontSize: 11,
                    fontWeight: 700,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    lineHeight: 1
                  }}
                  title={`${appliedCount} filtro${appliedCount === 1 ? '' : 's'} aplicado${appliedCount === 1 ? '' : 's'}`}
                >
                  {appliedCount}
                </span>
              )}
            </span>
          </Btn>

          {filtersOpen && (
            <div
              role="dialog"
              aria-label="Filtros de vagas"
              style={{
                position:'absolute',
                right:0,
                top:'calc(100% + 10px)',
                width:360,
                background:'#fff',
                border:`1px solid ${T.border}`,
                borderRadius:12,
                boxShadow:'0 12px 40px rgba(5,8,5,0.12)',
                padding:0,
                zIndex:20,
                boxSizing:'border-box',
                overflow:'hidden'
              }}
              onClick={(e)=>e.stopPropagation()}
            >
              {/* Header */}
              <div style={{padding:'14px 14px 12px', borderBottom:`1px solid ${T.border}`, display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:12}}>
                <div style={{display:'flex', alignItems:'flex-start', gap:10, minWidth:0}}>
                  <div style={{minWidth:0}}>
                    <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:13, color:T.ink, lineHeight:1.2}}>Filtros</div>
                    <div style={{fontFamily:'Poppins', fontSize:10.5, color:T.meta, marginTop:2, lineHeight:1.25}}>
                      Ajuste a lista por data, modalidade, nível e cidade.
                    </div>
                  </div>
                </div>
                <div style={{display:'flex', gap:6, alignItems:'center', flexShrink:0}}>
                  <button
                    type="button"
                    onClick={() => setFiltersOpen(false)}
                    title="Fechar"
                    style={{width:34, height:34, borderRadius:10, border:`1px solid ${T.border}`, background:'#fff', cursor:'pointer', color:T.meta, display:'inline-flex', alignItems:'center', justifyContent:'center'}}
                  >
                    <Icon name="x" size={16}/>
                  </button>
                </div>
              </div>

              {/* Body */}
              <div style={{padding:14}}>
              <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:12, minWidth:0}}>
                <div style={{minWidth:0}}>
                  <div style={{fontFamily:'Poppins', fontSize:12, fontWeight:500, color:T.meta, marginBottom:6}}>Ordenar por</div>
                  <div style={{width:'100%', boxSizing:'border-box', height:40, border:`1px solid ${T.border}`, borderRadius:10, background:'#fff', display:'flex', alignItems:'center', gap:10, padding:'0 12px', overflow:'hidden'}}>
                    <Icon name="calendar" size={14} color={T.meta}/>
                    <select
                      value={sortBy}
                      onChange={(e)=>setSortBy(e.target.value)}
                      style={{border:0, outline:'none', flex:1, fontFamily:'Poppins', fontSize:13, color:T.ink, background:'transparent', minWidth:0, appearance:'none', WebkitAppearance:'none', MozAppearance:'none'}}
                    >
                      <option value="recentes">Data (mais recentes)</option>
                      <option value="antigas">Data (mais antigas)</option>
                      <option value="titulo_az">Título (A → Z)</option>
                      <option value="titulo_za">Título (Z → A)</option>
                    </select>
                    <Icon name="chevDown" size={16} color={T.meta}/>
                  </div>
                </div>
                <div style={{minWidth:0}}>
                  <div style={{fontFamily:'Poppins', fontSize:12, fontWeight:500, color:T.meta, marginBottom:6}}>Modalidade</div>
                  <div style={{width:'100%', boxSizing:'border-box', height:40, border:`1px solid ${T.border}`, borderRadius:10, background:'#fff', display:'flex', alignItems:'center', gap:10, padding:'0 12px', overflow:'hidden'}}>
                    <Icon name="clock" size={14} color={T.meta}/>
                    <select
                      value={modeF}
                      onChange={(e)=>setModeF(e.target.value)}
                      style={{border:0, outline:'none', flex:1, fontFamily:'Poppins', fontSize:13, color:T.ink, background:'transparent', minWidth:0, appearance:'none', WebkitAppearance:'none', MozAppearance:'none'}}
                    >
                      <option value="Todas">Todas</option>
                      {filterOptions.modes.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <Icon name="chevDown" size={16} color={T.meta}/>
                  </div>
                </div>
                <div style={{minWidth:0}}>
                  <div style={{fontFamily:'Poppins', fontSize:12, fontWeight:500, color:T.meta, marginBottom:6}}>Nível</div>
                  <div style={{width:'100%', boxSizing:'border-box', height:40, border:`1px solid ${T.border}`, borderRadius:10, background:'#fff', display:'flex', alignItems:'center', gap:10, padding:'0 12px', overflow:'hidden'}}>
                    <Icon name="star" size={14} color={T.meta}/>
                    <select
                      value={levelF}
                      onChange={(e)=>setLevelF(e.target.value)}
                      style={{border:0, outline:'none', flex:1, fontFamily:'Poppins', fontSize:13, color:T.ink, background:'transparent', minWidth:0, appearance:'none', WebkitAppearance:'none', MozAppearance:'none'}}
                    >
                      <option value="Todos">Todos</option>
                      {filterOptions.levels.map(l => <option key={l} value={l}>{l}</option>)}
                    </select>
                    <Icon name="chevDown" size={16} color={T.meta}/>
                  </div>
                </div>
                <div style={{minWidth:0}}>
                  <div style={{fontFamily:'Poppins', fontSize:12, fontWeight:500, color:T.meta, marginBottom:6}}>Cidade</div>
                  <div style={{width:'100%', boxSizing:'border-box', height:40, border:`1px solid ${T.border}`, borderRadius:10, background:'#fff', display:'flex', alignItems:'center', gap:10, padding:'0 12px', overflow:'hidden'}}>
                    <Icon name="mapPin" size={14} color={T.meta}/>
                    <select
                      value={cityF}
                      onChange={(e)=>setCityF(e.target.value)}
                      style={{border:0, outline:'none', flex:1, fontFamily:'Poppins', fontSize:13, color:T.ink, background:'transparent', minWidth:0, appearance:'none', WebkitAppearance:'none', MozAppearance:'none'}}
                    >
                      <option value="Todas">Todas</option>
                      {filterOptions.cities.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <Icon name="chevDown" size={16} color={T.meta}/>
                  </div>
                </div>
              </div>

              <div style={{marginTop:12, paddingTop:12, borderTop:`1px solid ${T.border}`, display:'flex', justifyContent:'space-between', alignItems:'center', gap:10}}>
                <Btn
                  variant="ghost"
                  size="xs"
                  disabled={!filtersActive}
                  onClick={() => { setSortBy('recentes'); setModeF('Todas'); setLevelF('Todos'); setCityF('Todas'); }}
                  style={{ color: filtersActive ? T.blue : T.meta, fontWeight: 500, padding: '8px 10px' }}
                  title={filtersActive ? 'Limpar filtros' : 'Nenhum filtro para limpar'}
                >
                  <span style={{display:'inline-flex', alignItems:'center', gap:8}}>
                    <Icon name="brushCleaning" size={14} color={filtersActive ? T.blue : T.meta} />
                    Limpar filtros
                  </span>
                </Btn>
                <Btn
                  variant="primary"
                  size="xs"
                  onClick={() => setFiltersOpen(false)}
                  style={{ padding: '8px 16px', minWidth: 120, fontWeight: 500 }}
                >
                  Aplicar
                </Btn>
              </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', gap:12, marginBottom:20, flexWrap:'wrap'}}>
        <div style={{fontFamily:'Poppins', fontSize:12.5, color:T.meta}}>
          Mostrando <strong style={{color:T.ink, fontWeight:700}}>{filtered.length}</strong> de <strong style={{color:T.ink, fontWeight:700}}>{(tab === 'Todas') ? counts.Todas : (counts[tab] ?? 0)}</strong> {tab === 'Todas' ? 'vagas' : `em "${tab}"`}
          {qNorm ? <span> · busca: <strong style={{color:T.ink, fontWeight:700}}>{qNorm}</strong></span> : null}
          {filtersActive ? (
            <span>
              {' '}· filtros:{' '}
              <strong style={{color:T.ink, fontWeight:700}}>
                {appliedFilters.join(' · ')}
              </strong>
            </span>
          ) : null}
        </div>
        {(qNorm || tab !== 'Todas' || filtersActive) && (
          <div style={{display:'flex', gap:8, alignItems:'center'}}>
            {tab !== 'Todas' && (
              <button type="button" onClick={()=>setTab('Todas')} style={{border:0, background:'transparent', cursor:'pointer', fontFamily:'Poppins', fontSize:12.5, color:T.blue, fontWeight:700}}>
                Ver todas
              </button>
            )}
            {qNorm && (
              <button
                type="button"
                onClick={()=>setQ('')}
                style={{
                  border:0,
                  background:'transparent',
                  cursor:'pointer',
                  fontFamily:'Poppins',
                  fontSize:12,
                  color:T.blue,
                  fontWeight:500,
                  display:'inline-flex',
                  alignItems:'center',
                  gap:8
                }}
              >
                <Icon name="brushCleaning" size={14} color={T.blue}/>
                Limpar busca
              </button>
            )}
            {filtersActive && (
              <Btn
                variant="ghost"
                size="xs"
                onClick={() => { setSortBy('recentes'); setModeF('Todas'); setLevelF('Todos'); setCityF('Todas'); }}
                title="Limpar filtros"
                style={{ color: T.blue, fontWeight: 500, padding: '8px 10px' }}
              >
                <span style={{display:'inline-flex', alignItems:'center', gap:8}}>
                  <Icon name="brushCleaning" size={14} color={T.blue} />
                  Limpar filtros
                </span>
              </Btn>
            )}
          </div>
        )}
      </div>

      {/* Vagas list */}
      <div style={{display:'flex', flexDirection:'column', gap:10}}>
        {filtered.map(v => <VagaRow key={v.id} vaga={v} onGo={onGo} onEdit={()=>onEdit(v)}/>)}
        {filtered.length===0 && (
          <Empty
            icon="briefcase"
            title={qNorm ? 'Nenhum resultado' : 'Nenhuma vaga aqui'}
            desc={qNorm
              ? `Não encontramos vagas em "${tab}" com o título contendo "${qNorm}".`
              : (tab === 'Todas'
                ? 'Você ainda não cadastrou vagas.'
                : `Você ainda não tem vagas em status "${tab}".`
              )
            }
            cta={
              <div style={{display:'flex', justifyContent:'center', gap:10, flexWrap:'wrap'}}>
                {tab !== 'Todas' && <Btn variant="secondary" size="sm" onClick={()=>setTab('Todas')}>Ver todas</Btn>}
                {qNorm && (
                  <Btn
                    variant="secondary"
                    size="sm"
                    onClick={()=>setQ('')}
                    style={{ fontSize: 12, fontWeight: 500 }}
                    icon={<Icon name="brushCleaning" size={14} />}
                  >
                    Limpar busca
                  </Btn>
                )}
              </div>
            }
          />
        )}
      </div>
    </main>
  );
};

const VagaRow = ({ vaga, onGo, onEdit }) => {
  const totalPipeline = vaga.pipeline.novos + vaga.pipeline.triagem + vaga.pipeline.entrevista + vaga.pipeline.oferta;
  const statusTone = { Publicada:'green', Pausada:'orange', Rascunho:'neutral', Encerrada:'red' }[vaga.status];
  const showTriage = vaga.newApplicants > 0 && vaga.status === 'Publicada';
  return (
    <Card
      pad={20}
      style={{
        cursor: 'pointer',
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 1px 2px rgba(5, 8, 5, 0.05)',
        transition: 'border-color 140ms ease, box-shadow 140ms ease, transform 140ms ease'
      }}
      onClick={() => onGo('kanban', { vagaId: vaga.id })}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = T.divider;
        e.currentTarget.style.boxShadow = '0 8px 22px rgba(5, 8, 5, 0.10)';
        e.currentTarget.style.transform = 'translateY(-1px)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = T.border;
        e.currentTarget.style.boxShadow = '0 1px 2px rgba(5, 8, 5, 0.05)';
        e.currentTarget.style.transform = 'translateY(0)';
      }}
    >
      <div style={{display:'grid', gridTemplateColumns:'1fr 420px', gap:24, alignItems:'center'}}>
        <div>
          <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:8}}>
            <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:14, color:T.ink}}>{vaga.title}</div>
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
          {[
            ['Novos', vaga.pipeline.novos, T.orange],
            ['Triagem', vaga.pipeline.triagem, T.blue],
            ['Entrevista', vaga.pipeline.entrevista, T.purple],
            ['Oferta', vaga.pipeline.oferta, T.green],
            ['Contratado', vaga.pipeline.contratado, T.ink]
          ].map(([l,v,c]) => (
            <div key={l} style={{textAlign:'center', padding:'8px 4px', background:T.page, borderRadius:10, border:`1px solid ${T.border}`}}>
              <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:14, color:v>0?c:T.meta, lineHeight:1}}>{v}</div>
              <div style={{fontFamily:'Poppins', fontSize:9, color:T.meta, marginTop:4, textTransform:'uppercase', letterSpacing:'.04em'}}>{l}</div>
            </div>
          ))}
        </div>
      </div>

        <div style={{marginTop:14, paddingTop:14, borderTop:`1px solid ${T.border}`, display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div style={{display:'flex', alignItems:'center', gap:10, fontFamily:'Poppins', fontSize:12, color:T.ink, minWidth:0}}>
            {showTriage ? (
              <>
                <div style={{width:6, height:6, borderRadius:3, background:T.blue, animation:'pulse 2s infinite'}}/>
                <strong style={{fontWeight:700}}>{vaga.newApplicants} novos candidatos</strong> aguardando triagem
              </>
            ) : null}
          </div>
          <div style={{display:'flex', alignItems:'center', gap:10}} onClick={(e)=>e.stopPropagation()}>
            <Btn variant="secondary" size="sm" onClick={onEdit} style={{ fontSize: 12, fontWeight: 500 }}>Editar</Btn>
            {showTriage && (
              <Btn
                variant="primary"
                size="sm"
                icon={<Icon name="arrowRight" size={12}/>}
                onClick={() => onGo('kanban', { vagaId: vaga.id })}
                style={{ fontSize: 12, fontWeight: 500 }}
              >
                Triar agora
              </Btn>
            )}
          </div>
        </div>
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
