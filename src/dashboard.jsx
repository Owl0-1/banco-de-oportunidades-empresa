/* global React */
const { useState: useStateD } = React;

// ─────────── Funnel Chart ───────────
window.FunnelChart = ({ data, variant='wave' }) => {
  const funnelLabelColor = 'rgb(98, 107, 134)';
  const max = data[0]?.value || 1;
  const colors = [T.blue, '#2D6BFD', '#5486FE', '#8EAEFE', '#F38354', T.green];
  /** Número principal estilo “256,2 mil” para caber no layout em colunas */
  const fmtFunnelPrimary = (n) => {
    const abs = Math.abs(n);
    if (abs >= 1e6) return `${(n / 1e6).toLocaleString('pt-BR', { maximumFractionDigits: 1, minimumFractionDigits: 1 })} mi`;
    if (abs >= 1e3) return `${(n / 1e3).toLocaleString('pt-BR', { maximumFractionDigits: 1, minimumFractionDigits: 1 })} mil`;
    return fmtNum(n);
  };

  if (variant === 'horizontal') {
    // layout alt: horizontal bars
    return (
      <div style={{display:'flex', flexDirection:'column', gap:10, paddingBottom:24}}>
        {data.map((d, i) => {
          const pct = (d.value / max) * 100;
          return (
            <div key={d.label} style={{display:'grid', gridTemplateColumns:'160px 1fr 90px', alignItems:'center', gap:16}}>
              <div style={{fontFamily:'Poppins', fontSize:13, fontWeight:500, color:funnelLabelColor}}>{d.label}</div>
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

  if (variant === 'layered') {
    return (
      <div style={{display:'flex', flexDirection:'column', gap:4, alignItems:'center'}}>
        {data.map((d, i) => {
          const w = 100 - (i * 13);
          return (
            <div key={d.label} style={{width: w+'%', minWidth:200, background: colors[i], color:'#fff', padding:'14px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', borderRadius: i===0?'8px 8px 0 0': i===data.length-1?'0 0 8px 8px':0, clipPath: i===0||i===data.length-1?'none':'polygon(3% 0, 97% 0, 100% 100%, 0% 100%)'}}>
              <div style={{fontFamily:'Poppins', fontSize:13, fontWeight:500, color:funnelLabelColor}}>{d.label}</div>
              <div style={{display:'flex', alignItems:'baseline', gap:10}}>
                <span style={{fontFamily:'Poppins', fontSize:18, fontWeight:700}}>{fmtNum(d.value)}</span>
                <span style={{fontFamily:'Poppins', fontSize:11, opacity:.85}}>{d.delta}</span>
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // wave: colunas + área com curvas (modelo “e-commerce funnel”)
  const n = data.length;
  const v0 = Math.max(data[0]?.value || 0, 1);
  /** Degradê claro → escuro a partir do azul do sistema (`T.blue` / `T.bluePress`). */
  const blues = ['#E8EFFC', '#C5D7FC', '#8EB4FD', '#5486FE', T.blue, T.bluePress];
  const colW = 100;
  const vbH = 100;
  const bottom = vbH;
  const topPad = 6;
  const usableH = vbH - topPad - 4;
  /** Escala em potência: funis muito íngremes não “somem” na área (valores nas colunas continuam reais). */
  const visNorm = (v) => Math.pow(Math.max(v / v0, 1e-9), 0.34);
  const yTop = data.map((d) => topPad + usableH * (1 - visNorm(d.value)));
  const vbW = colW * n;

  return (
    <div style={{ marginTop: 4 }}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${n}, minmax(0, 1fr))`,
          borderBottom: `1px solid ${T.border}`,
          paddingBottom: 20,
          marginBottom: 0
        }}
      >
        {data.map((d, i) => {
          const next = data[i + 1];
          const drop = next != null ? Math.max(0, d.value - next.value) : 0;
          const dropPct = next != null && d.value > 0 ? (drop / d.value) * 100 : 0;
          const dropLabel = d.dropoffLabel || 'Não avançaram';
          return (
            <div
              key={d.label}
              style={{
                padding: '0 12px 0 14px',
                textAlign: 'left',
                borderRight: i < n - 1 ? `1px solid ${T.border}` : 'none',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                minWidth: 0
              }}
            >
              <div style={{ fontFamily: 'Poppins', fontSize: 12, fontWeight: 500, color: funnelLabelColor, marginBottom: 8, lineHeight: 1.25 }}>{d.label}</div>
              <div style={{ fontFamily: 'Poppins', fontSize: 20, fontWeight: 700, color: T.ink, letterSpacing: '-0.02em', lineHeight: 1.1 }}>{fmtFunnelPrimary(d.value)}</div>
              {next != null && (
                <div style={{ marginTop: 14, width: '100%' }}>
                  <div style={{ fontFamily: 'Poppins', fontSize: 11, color: T.meta, fontWeight: 500, lineHeight: 1.35, marginBottom: 4 }}>{dropLabel}</div>
                  <div style={{ fontFamily: 'Poppins', fontSize: 12, fontWeight: 700, color: T.ink }}>
                    {fmtNum(drop)}{' '}
                    <span style={{ fontWeight: 500, color: T.meta }}>
                      {dropPct.toLocaleString('pt-BR', { maximumFractionDigits: 2, minimumFractionDigits: 2 })}%
                    </span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <svg
        width="100%"
        height={140}
        viewBox={`0 0 ${vbW} ${vbH}`}
        preserveAspectRatio="none"
        style={{ display: 'block', marginTop: -1 }}
        aria-hidden
      >
        {data.map((d, i) => {
          const x0 = i * colW;
          const x1 = (i + 1) * colW;
          const y0 = yTop[i];
          const y1 = i < n - 1 ? yTop[i + 1] : yTop[i];
          const dx = x1 - x0;
          const c1x = x0 + dx * 0.42;
          const c2x = x1 - dx * 0.42;
          const dPath = `M ${x0} ${bottom} L ${x0} ${y0} C ${c1x} ${y0} ${c2x} ${y1} ${x1} ${y1} L ${x1} ${bottom} Z`;
          const fill = blues[i % blues.length];
          return <path key={d.label} d={dPath} fill={fill} />;
        })}
      </svg>
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

// ─────────── KPI sparkline (curva suave + escala com folga) ───────────
/** Série suave monotônica entre dois valores (útil quando não quiser oscilação). */
window.kpiSparkRamp = (from, to, len = 14) => {
  const n = Math.max(2, Number(len) || 14);
  const a = Number(from);
  const b = Number(to);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return Array(n).fill(0);
  const out = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const eased = 1 - Math.pow(1 - t, 1.35);
    out.push(a + (b - a) * eased);
  }
  return out;
};

/**
 * Série com subidas e descidas ao longo do período, ainda ligando `from` → `to`.
 * `cycles` controla quantas “ondas” aparecem no trecho.
 */
window.kpiSparkWander = (from, to, len = 14, cycles = 2.35) => {
  const n = Math.max(2, Number(len) || 14);
  const a = Number(from);
  const b = Number(to);
  if (!Number.isFinite(a) || !Number.isFinite(b)) return Array(n).fill(0);
  if (Math.abs(b - a) < 1e-9) return Array(n).fill(a);
  const span = Math.abs(b - a);
  const amp = Math.max(span * 0.2, 0.85);
  const c = Number(cycles) || 2.35;
  const clamp0 = a >= 0 && b >= 0;
  const out = [];
  for (let i = 0; i < n; i++) {
    const t = i / (n - 1);
    const trend = a + (b - a) * t;
    const envelope = Math.sin(Math.PI * t);
    const wobble = Math.sin(t * Math.PI * 2 * c) * amp * (0.32 + 0.68 * envelope);
    const v = trend + wobble;
    out.push(clamp0 ? Math.max(0, v) : v);
  }
  out[0] = a;
  out[n - 1] = b;
  return out;
};

const kpiSmoothPath = (pts) => {
  if (pts.length < 2) return '';
  if (pts.length === 2) return `M ${pts[0][0]} ${pts[0][1]} L ${pts[1][0]} ${pts[1][1]}`;
  let d = `M ${pts[0][0]} ${pts[0][1]}`;
  const tension = 6;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i];
    const p1 = pts[i + 1];
    const prev = pts[i - 1] || p0;
    const next = pts[i + 2] || p1;
    const c1x = p0[0] + (p1[0] - prev[0]) / tension;
    const c1y = p0[1] + (p1[1] - prev[1]) / tension;
    const c2x = p1[0] - (next[0] - p0[0]) / tension;
    const c2y = p1[1] - (next[1] - p0[1]) / tension;
    d += ` C ${c1x} ${c1y} ${c2x} ${c2y} ${p1[0]} ${p1[1]}`;
  }
  return d;
};

window.KpiSparkline = ({ values, color, gradId }) => {
  if (!values || values.length < 2) return null;
  const h = 40;
  const w = 100;
  const padX = 0.5;
  const padYRatio = 0.14;
  const rawMin = Math.min(...values);
  const rawMax = Math.max(...values);
  const span = rawMax - rawMin || Math.max(Math.abs(rawMax), 1) * 0.08;
  const padY = span * padYRatio;
  const yMin = rawMin - padY;
  const yMax = rawMax + padY;
  const yAt = (v) => {
    if (yMax === yMin) return h / 2;
    return 5 + (1 - (v - yMin) / (yMax - yMin)) * (h - 10);
  };
  const pts = values.map((v, i) => {
    const x = padX + (i / (values.length - 1)) * (w - 2 * padX);
    return [x, yAt(v)];
  });
  const dLine = kpiSmoothPath(pts);
  const last = pts[pts.length - 1];
  const first = pts[0];
  const curveOnly = dLine.replace(/^M\s+[\d.-]+\s+[\d.-]+/, '');
  const dArea2 = `M 0 ${h} L ${first[0]} ${h} L ${first[0]} ${first[1]}${curveOnly} L ${last[0]} ${h} L ${w} ${h} Z`;
  const gid = gradId || 'kpi-spark-fill';
  return (
    <svg width="100%" height={48} viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none" style={{ display: 'block' }} aria-hidden>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.14" />
          <stop offset="70%" stopColor={color} stopOpacity="0.05" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={dArea2} fill={`url(#${gid})`} />
      <path d={dLine} fill="none" stroke={color} strokeWidth="1.35" strokeLinecap="round" strokeLinejoin="round" opacity={0.92} />
    </svg>
  );
};

/** Card de KPI alinhado a referência: título + badge, valor + subtexto, sparkline à direita. */
window.KpiCard = ({ label, value, delta, deltaTone = 'green', subtext, series, compact }) => {
  const neutral = deltaTone === 'neutral';
  const neg = deltaTone === 'red';
  const lineColor = neutral ? T.meta : neg ? T.red : T.green;
  const badgeBg = neutral ? 'rgba(98,107,134,0.12)' : neg ? 'rgba(255,14,0,0.1)' : 'rgba(64,162,122,0.12)';
  const badgeFg = neutral ? T.ink2 : neg ? '#C41E16' : '#2d7a5c';
  const defaultSeries = neg
    ? kpiSparkWander(9, 6.2, 14, 2.5)
    : neutral
      ? kpiSparkWander(4.8, 5.4, 14, 2.9)
      : kpiSparkWander(3.2, 7.2, 14, 2.25);
  const spark = series && series.length >= 2 ? series : defaultSeries;
  const gradId = `kpi-spark-${String(label).replace(/\s+/g, '-').slice(0, 24)}`;
  return (
    <Card
      pad={compact ? 18 : 22}
      style={{
        flex: 1,
        minWidth: 0,
        borderRadius: 14,
        overflow: 'hidden',
        boxShadow: '0 1px 2px rgba(5, 8, 5, 0.04)'
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1fr) minmax(88px, 34%)',
          gridTemplateRows: 'auto 1fr',
          columnGap: 12,
          rowGap: 4,
          alignItems: 'start'
        }}
      >
        <div
          style={{
            fontFamily: 'Poppins',
            fontSize: 12,
            fontWeight: 600,
            color: '#555555',
            lineHeight: 1.3,
            paddingTop: 2
          }}
        >
          {label}
        </div>
        {delta ? (
          <div style={{ justifySelf: 'end', alignSelf: 'start' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                fontFamily: 'Poppins',
                fontSize: 11,
                fontWeight: 600,
                lineHeight: 1,
                padding: '5px 10px',
                borderRadius: 100,
                background: badgeBg,
                color: badgeFg,
                whiteSpace: 'nowrap',
                maxWidth: '100%'
              }}
            >
              {!neutral && <Icon name={neg ? 'trendDown' : 'trend'} size={12} color={badgeFg} />}
              {delta}
            </span>
          </div>
        ) : (
          <div />
        )}
        <div style={{ minWidth: 0, alignSelf: 'end', paddingBottom: 2 }}>
          <div
            style={{
              fontFamily: 'Poppins',
              fontWeight: 700,
              fontSize: compact ? 24 : 27,
              color: T.ink,
              lineHeight: 1.1,
              letterSpacing: '-0.025em'
            }}
          >
            {value}
          </div>
          {subtext && (
            <div
              style={{
                marginTop: 8,
                fontFamily: 'Poppins',
                fontSize: 12,
                fontWeight: 400,
                color: '#999999',
                lineHeight: 1.35
              }}
            >
              {subtext}
            </div>
          )}
        </div>
        <div style={{ alignSelf: 'end', width: '100%', marginTop: delta ? 6 : 0 }}>
          <KpiSparkline values={spark} color={lineColor} gradId={gradId} />
        </div>
      </div>
    </Card>
  );
};

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
          <div style={{width:36, height:36, borderRadius:'50%', background: it.color+'20', color: it.color, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
            <Icon name={it.icon} size={16}/>
          </div>
          <div style={{flex:1, minWidth:0}}>
            <div style={{fontFamily:'Poppins', fontSize:12, color:T.ink, fontWeight:500, lineHeight:1.35}}>{it.title}</div>
            <div style={{fontFamily:'Poppins', fontSize:12, color:T.meta, marginTop:3}}>{it.time}</div>
          </div>
          <Btn
            variant="secondary"
            size="xs"
            icon={<Icon name="arrowRight" size={12} color={T.ink2} stroke={1.85} />}
            onClick={() => onGo(it.go, it.vaga ? { vagaId: it.vaga } : undefined)}
            style={{ flexShrink: 0, fontWeight: 500, color: T.ink }}
          >
            {it.action}
          </Btn>
        </div>
      ))}
    </div>
  );
};

// ─────────── Dashboard page ───────────
const FUNIL_MESES = [
  { v: '1', label: 'Janeiro' },
  { v: '2', label: 'Fevereiro' },
  { v: '3', label: 'Março' },
  { v: '4', label: 'Abril' },
  { v: '5', label: 'Maio' },
  { v: '6', label: 'Junho' },
  { v: '7', label: 'Julho' },
  { v: '8', label: 'Agosto' },
  { v: '9', label: 'Setembro' },
  { v: '10', label: 'Outubro' },
  { v: '11', label: 'Novembro' },
  { v: '12', label: 'Dezembro' }
];

window.DashboardPage = ({ user, vagas, onGo, layout='balanced' }) => {
  const hoje = new Date();
  const anoAtual = hoje.getFullYear();
  const anosFunil = Array.from({ length: 7 }, (_, i) => String(anoAtual - 3 + i));
  const [funnelVagaId, setFunnelVagaId] = useStateD('');
  const [funnelMes, setFunnelMes] = useStateD(String(hoje.getMonth() + 1));
  const [funnelAno, setFunnelAno] = useStateD(String(anoAtual));
  /** Mesmo visual dos chips do funil (pill, fundo página, borda leve). */
  const funnelSelectStyle = {
    minWidth: 0,
    lineHeight: 1,
    padding: '8px 10px',
    paddingRight: 22,
    borderRadius: 100,
    cursor: 'pointer',
    border: `1px solid ${T.border}`,
    backgroundColor: T.page,
    color: T.ink,
    fontFamily: 'Poppins',
    fontWeight: 500,
    fontSize: 12,
    outline: 'none',
    appearance: 'none',
    WebkitAppearance: 'none',
    MozAppearance: 'none',
    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='${T.meta.replace('#', '%23')}' stroke-width='2'><path d='m6 9 6 6 6-6'/></svg>")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 8px center'
  };
  const openVagas = vagas.filter(v => v.status === 'Publicada');
  const topVagas = [...openVagas].sort((a,b) => (b.newApplicants + b.applicants*0.1) - (a.newApplicants + a.applicants*0.1)).slice(0,3);
  const totalPipeline = vagas.reduce((s,v) => s + v.pipeline.novos + v.pipeline.triagem + v.pipeline.entrevista + v.pipeline.oferta, 0);
  const pipelinePrev = Math.max(0, totalPipeline - 54);
  const pipelineSpark =
    totalPipeline <= 0 ? kpiSparkRamp(0, 0, 14) : kpiSparkWander(pipelinePrev, totalPipeline, 14, 2.4);
  const vagasPrev = Math.max(0, openVagas.length - 2);
  const vagasSpark = kpiSparkWander(vagasPrev, openVagas.length, 14, 2.15);
  const msgsSpark = kpiSparkWander(4, 8, 14, 2.65);
  const entrevSpark = kpiSparkWander(4.2, 6, 14, 2.05);

  return (
    <main style={{padding:'28px 36px 48px'}}>
      {/* Hero greeting */}
      <div style={{display:'flex', alignItems:'flex-end', justifyContent:'space-between', gap:24, marginBottom:28}}>
        <div>
          <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:12, color:T.blue, letterSpacing:'.08em', marginBottom:8}}>PAINEL DA EMPRESA · {new Date().toLocaleDateString('pt-BR',{weekday:'long', day:'numeric', month:'long'}).toUpperCase()}</div>
          <h1 style={{fontFamily:'Poppins', fontWeight:500, fontSize:24, color:T.ink, margin:0, lineHeight:1.15, letterSpacing:'-0.01em'}}>
            Olá, {user.name.split(' ')[0]}. <span style={{color:T.meta}}>Você tem</span> 22 ações <span style={{color:T.meta}}>exigindo atenção hoje.</span>
          </h1>
        </div>
        <div style={{display:'flex', gap:10}}>
          <Btn variant="secondary" icon={<Icon name="users" size={14}/>} onClick={()=>onGo('hunting')} style={{fontSize:12, fontWeight:500}}>Buscar talentos</Btn>
          <Btn variant="primary" icon={<Icon name="plus" size={14}/>} onClick={()=>onGo('vagas-new')} style={{fontSize:12, fontWeight:500}}>Nova vaga</Btn>
        </div>
      </div>

      {/* KPIs */}
      <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:14, marginBottom:28}}>
        <KpiCard
          label="Vagas abertas"
          value={openVagas.length}
          delta="+2 esta semana"
          subtext={
            vagasPrev === openVagas.length
              ? 'Mesmo volume há cerca de 30 dias'
              : `Há 30 dias: ${vagasPrev} publicada${vagasPrev === 1 ? '' : 's'}`
          }
          series={vagasSpark}
        />
        <KpiCard
          label="Candidatos na pipeline"
          value={fmtNum(totalPipeline)}
          delta="+54 esta semana"
          subtext={`Total há 30 dias: ${fmtNum(pipelinePrev)}`}
          series={pipelineSpark}
        />
        <KpiCard
          label="Mensagens não lidas"
          value="8"
          delta="+4 hoje"
          subtext="Ontem ao fechar do dia: 4"
          series={msgsSpark}
        />
        <KpiCard
          label="Entrevistas esta semana"
          value="6"
          delta="próxima: qui 10h"
          deltaTone="neutral"
          subtext="Semana anterior: 4 agendadas"
          series={entrevSpark}
        />
      </div>

      {/* Grid principal */}
      <div style={{display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:16, marginBottom:24}}>
        {/* Funil */}
        <Card>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', paddingBottom:24}}>
            <div>
              <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:10, color:T.blue, letterSpacing:'.08em', marginBottom:6}}>FUNIL DO MÊS</div>
              <div style={{fontFamily:'Poppins', fontWeight:500, fontSize:14, color:T.ink}}>Visualização → Contratação</div>
            </div>
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 6,
                maxWidth: '100%'
              }}
              role="group"
              aria-label="Filtros do funil"
            >
              <select
                value={funnelVagaId}
                onChange={(e) => setFunnelVagaId(e.target.value)}
                aria-label="Vaga"
                style={{ ...funnelSelectStyle, flex: '1 1 140px', maxWidth: 260 }}
              >
                <option value="">Todas as vagas</option>
                {vagas.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.title}
                  </option>
                ))}
              </select>
              <select
                value={funnelMes}
                onChange={(e) => setFunnelMes(e.target.value)}
                aria-label="Mês"
                style={{ ...funnelSelectStyle, flex: '0 1 auto' }}
              >
                {FUNIL_MESES.map((m) => (
                  <option key={m.v} value={m.v}>
                    {m.label}
                  </option>
                ))}
              </select>
              <select
                value={funnelAno}
                onChange={(e) => setFunnelAno(e.target.value)}
                aria-label="Ano"
                style={{ ...funnelSelectStyle, flex: '0 0 auto' }}
              >
                {anosFunil.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <FunnelChart data={MOCK_FUNNEL} variant={layout==='funnel-hero'?'layered':'wave'}/>
          <div style={{marginTop:20, paddingTop:24, borderTop:`1px solid ${T.border}`, display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:20}}>
            <div><div style={{fontFamily:'Poppins', fontSize:11, color:T.meta}}>Taxa candidatura → triagem</div><div style={{fontFamily:'Poppins', fontSize:20, fontWeight:700, color:T.ink, marginTop:4}}>36%</div></div>
            <div><div style={{fontFamily:'Poppins', fontSize:11, color:T.meta}}>Taxa triagem → entrevista</div><div style={{fontFamily:'Poppins', fontSize:20, fontWeight:700, color:T.ink, marginTop:4}}>33%</div></div>
            <div><div style={{fontFamily:'Poppins', fontSize:11, color:T.meta}}>Tempo médio até contratar</div><div style={{fontFamily:'Poppins', fontSize:20, fontWeight:700, color:T.ink, marginTop:4}}>21 <span style={{fontSize:13, color:T.meta, fontWeight:500}}>dias</span></div></div>
          </div>
        </Card>

        {/* Feed de ações */}
        <Card>
          <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', paddingBottom:24}}>
            <div>
              <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:10, color:T.orange, letterSpacing:'.08em', marginBottom:6}}>EXIGE SUA ATENÇÃO</div>
              <div style={{fontFamily:'Poppins', fontWeight:500, fontSize:14, color:T.ink}}>Próximas ações</div>
            </div>
            <Btn variant="ghost" size="xs" onClick={()=>onGo('notifs')}>
              Ver todas
            </Btn>
          </div>
          <ActionFeed onGo={onGo}/>
        </Card>
      </div>

      {/* Top vagas + atividade */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 16, alignItems: 'stretch' }}>
        <Card
          style={{
            display: 'flex',
            flexDirection: 'column',
            height: '100%',
            minHeight: 0,
            boxSizing: 'border-box'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexShrink: 0 }}>
            <div>
              <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:10, color:T.blue, letterSpacing:'.08em', marginBottom:6}}>MAIS ATIVAS</div>
              <div style={{fontFamily:'Poppins', fontWeight:500, fontSize:14, color:T.ink}}>Top 3 vagas</div>
            </div>
            <Btn variant="ghost" size="xs" onClick={()=>onGo('vagas')}>
              Ver todas
            </Btn>
          </div>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gridTemplateRows: 'minmax(0, 1fr)',
              gap: 12,
              alignItems: 'stretch',
              flex: 1,
              minHeight: 0
            }}
          >
            {topVagas.map((v) => (
              <div
                key={v.id}
                onClick={() => onGo('kanban', { vagaId: v.id })}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: '100%',
                  minHeight: 0,
                  boxSizing: 'border-box',
                  padding: 18,
                  background: T.card,
                  borderRadius: 10,
                  cursor: 'pointer',
                  border: `1px solid ${T.border}`,
                  boxShadow: '0 1px 2px rgba(5, 8, 5, 0.05)',
                  transition: 'border-color 140ms ease, box-shadow 140ms ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = T.divider;
                  e.currentTarget.style.boxShadow = '0 4px 14px rgba(5, 8, 5, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = T.border;
                  e.currentTarget.style.boxShadow = '0 1px 2px rgba(5, 8, 5, 0.05)';
                }}
              >
                {/* Cabeçalho: ícone + título + faixa */}
                <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 16 }}>
                  <div
                    style={{
                      width: 36,
                      height: 36,
                      flexShrink: 0,
                      borderRadius: 10,
                      background: T.blue12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: T.blue
                    }}
                  >
                    <Icon name="briefcase" size={18} stroke={1.75} color={T.blue} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontFamily: 'Poppins',
                        fontWeight: 500,
                        fontSize: 12,
                        color: T.ink,
                        lineHeight: 1.35,
                        marginBottom: 8,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        whiteSpace: 'nowrap'
                      }}
                    >
                      {v.title}
                    </div>
                    <div style={{ fontFamily: 'Poppins', fontSize: 10, lineHeight: 1.45 }}>
                      <span style={{ color: T.meta, fontWeight: 500 }}>Faixa salarial </span>
                      <span style={{ color: T.ink, fontWeight: 600 }}>
                        {v.salaryHidden ? 'Não divulgada' : v.salary}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Faixa central (métricas) + rodapé: preenche altura sem “vazio” acima das métricas */}
                <div
                  style={{
                    flex: 1,
                    minHeight: 0,
                    display: 'flex',
                    flexDirection: 'column'
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                      minHeight: 0,
                      display: 'flex',
                      alignItems: 'stretch',
                      justifyContent: 'center',
                      borderTop: `1px solid ${T.border}`,
                      padding: '10px 0 12px'
                    }}
                  >
                    <div
                      role="presentation"
                      style={{
                        width: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 0,
                        fontFamily: 'Poppins'
                      }}
                    >
                      {[
                        {
                          label: 'Novos',
                          value: fmtNum(v.newApplicants),
                          valueColor: v.newApplicants > 0 ? T.blue : T.ink
                        },
                        { label: 'Candidatos', value: fmtNum(v.applicants), valueColor: T.ink },
                        { label: 'Visitas', value: fmtNum(v.views), valueColor: T.ink, last: true }
                      ].map((m) => (
                        <div
                          key={m.label}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: 12,
                            minHeight: 0,
                            padding: '9px 0',
                            borderBottom: m.last ? 'none' : `1px solid ${T.border}`
                          }}
                        >
                          <span style={{ fontSize: 12, fontWeight: 500, color: T.meta, flexShrink: 0 }}>
                            {m.label}
                          </span>
                          <span
                            style={{
                              fontSize: 14,
                              fontWeight: 500,
                              color: m.valueColor,
                              fontVariantNumeric: 'tabular-nums',
                              textAlign: 'right',
                              minWidth: 0
                            }}
                          >
                            {m.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Rodapé: local + nível / modelo + chevron */}
                  <div
                    style={{
                      flexShrink: 0,
                      borderTop: `1px solid ${T.border}`,
                      paddingTop: 14,
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: 12
                    }}
                  >
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        fontFamily: 'Poppins',
                        fontSize: 11,
                        color: T.meta,
                        fontWeight: 500,
                        marginBottom: 6
                      }}
                    >
                      Local
                    </div>
                    <div
                      style={{
                        fontFamily: 'Poppins',
                        fontSize: 13,
                        fontWeight: 500,
                        color: T.ink,
                        lineHeight: 1.4
                      }}
                    >
                      {v.city}
                    </div>
                    <div
                      style={{
                        fontFamily: 'Poppins',
                        fontSize: 12,
                        color: T.meta,
                        marginTop: 8,
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0 4px',
                        alignItems: 'center'
                      }}
                    >
                      <span>{v.level}</span>
                      <span aria-hidden="true">·</span>
                      <span>{v.mode}</span>
                      <span aria-hidden="true">·</span>
                      <span>{v.openedAt}</span>
                    </div>
                  </div>
                  <div style={{ paddingTop: 2, flexShrink: 0, color: T.meta }}>
                    <Icon name="chevRight" size={18} color={T.meta} />
                  </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <div style={{marginBottom:16}}>
            <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:10, color:T.blue, letterSpacing:'.08em', marginBottom:6}}>ATIVIDADE</div>
            <div style={{fontFamily:'Poppins', fontWeight:500, fontSize:14, color:T.ink}}>Quando os candidatos se mexem</div>
            <div style={{fontFamily:'Poppins', fontSize:13, color:T.meta, marginTop:4}}>Últimos 7 dias · horário comercial</div>
          </div>
          <Heatmap data={MOCK_HEATMAP}/>
        </Card>
      </div>
    </main>
  );
};
