/* global React */
const { useState, useEffect, useRef } = React;

// ─────────── Colors & tokens (re-used in JS) ───────────
window.T = {
  blue:'#0657F9', bluePress:'#0044CB', blue04:'rgba(6,87,249,0.04)', blue12:'rgba(6,87,249,0.12)', blue24:'rgba(6,87,249,0.24)',
  green:'#40A27A', orange:'#F38354', purple:'#8A38F5', neon:'#00FF10', red:'#FF0E00',
  ink:'#050805', ink2:'#3B3C39', meta:'#626B86', mute:'#898B8D', placeholder:'#909090',
  divider:'#D9D9D9', border:'#E5E5E5', surface:'#EDEDED', page:'#F9FBFC', card:'#FFFFFF',
  footer:'#15110D'
};

// ─────────── Button ───────────
window.Btn = ({ variant='primary', size='md', children, icon, onClick, disabled, style={}, title }) => {
  const base = { display:'inline-flex', alignItems:'center', justifyContent:'center', gap:8, borderRadius:100, fontFamily:'Poppins', fontWeight:700, cursor: disabled?'not-allowed':'pointer', border:0, transition:'all 150ms ease-out', whiteSpace:'nowrap' };
  const sizes = { lg:{padding:'14px 24px', fontSize:15}, md:{padding:'11px 18px', fontSize:14}, sm:{padding:'8px 14px', fontSize:13}, xs:{padding:'6px 10px', fontSize:12} };
  const variants = {
    primary: { background: T.blue, color:'#fff' },
    secondary: { background:'#fff', color: T.ink, border:`1px solid ${T.border}`, fontWeight:500 },
    dark: { background: T.ink, color:'#fff' },
    ghost: { background:'transparent', color: T.ink, fontWeight:500 },
    danger: { background:'#fff', color: T.red, border:`1px solid ${T.border}`, fontWeight:500 }
  };
  return <button title={title} disabled={disabled} onClick={onClick} style={{...base, ...sizes[size], ...variants[variant], opacity:disabled?0.5:1, ...style}}
    onMouseEnter={e=>{ if (!disabled && variant==='primary') e.currentTarget.style.background = T.bluePress; }}
    onMouseLeave={e=>{ if (!disabled && variant==='primary') e.currentTarget.style.background = T.blue; }}>
    {children}{icon && <span style={{display:'inline-flex'}}>{icon}</span>}
  </button>;
};

// ─────────── Icon (lucide-like inline SVG) ───────────
window.Icon = ({ name, size=18, stroke=1.75, color='currentColor' }) => {
  const P = (d) => <path d={d}/>;
  const map = {
    home: <><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-7h-6v7H4a1 1 0 0 1-1-1V9.5z"/></>,
    dashboard: <><rect x="3" y="3" width="7" height="9" rx="1.5"/><rect x="14" y="3" width="7" height="5" rx="1.5"/><rect x="14" y="12" width="7" height="9" rx="1.5"/><rect x="3" y="16" width="7" height="5" rx="1.5"/></>,
    briefcase: <><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><path d="M2 13h20"/></>,
    kanban: <><rect x="3" y="3" width="5" height="18" rx="1"/><rect x="10" y="3" width="5" height="11" rx="1"/><rect x="17" y="3" width="4" height="7" rx="1"/></>,
    users: <><circle cx="9" cy="8" r="4"/><path d="M1 21v-1a6 6 0 0 1 6-6h4a6 6 0 0 1 6 6v1"/><circle cx="17" cy="7" r="3"/><path d="M23 21v-1a5 5 0 0 0-4-4.9"/></>,
    chat: <><path d="M21 12a8 8 0 0 1-11.3 7.3L3 21l1.7-6.7A8 8 0 1 1 21 12z"/></>,
    bell: <><path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></>,
    building: <><rect x="4" y="3" width="16" height="18" rx="1.5"/><path d="M9 8h2M13 8h2M9 12h2M13 12h2M9 16h2M13 16h2"/></>,
    search: <><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></>,
    plus: <><path d="M12 5v14M5 12h14"/></>,
    arrow: <><path d="M7 17L17 7M8 7h9v9"/></>,
    arrowRight: <><path d="M5 12h14M13 6l6 6-6 6"/></>,
    check: <><path d="M5 13l4 4L19 7"/></>,
    x: <><path d="M6 6l12 12M6 18L18 6"/></>,
    eye: <><path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z"/><circle cx="12" cy="12" r="3"/></>,
    filter: <><path d="M3 4h18l-7 9v6l-4 2v-8z"/></>,
    dots: <><circle cx="5" cy="12" r="1.5"/><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/></>,
    star: <><path d="M12 3l2.9 6 6.6.6-5 4.6 1.5 6.5L12 17.3 5.9 20.7 7.4 14.2l-5-4.6 6.6-.6z"/></>,
    spark: <><path d="M12 3v6M12 15v6M3 12h6M15 12h6M6.3 6.3l4.2 4.2M13.5 13.5l4.2 4.2M6.3 17.7l4.2-4.2M13.5 10.5l4.2-4.2"/></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4"/></>,
    mapPin: <><path d="M12 22s7-6.5 7-12a7 7 0 1 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="10" r="2.5"/></>,
    clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 7 9-7"/></>,
    send: <><path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/></>,
    trash: <><path d="M4 7h16M10 11v6M14 11v6M5 7l1 14h12l1-14M9 7V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/></>,
    pause: <><rect x="6" y="5" width="4" height="14" rx="1"/><rect x="14" y="5" width="4" height="14" rx="1"/></>,
    play: <><path d="M6 4v16l14-8z"/></>,
    edit: <><path d="M12 20h9M16.5 3.5a2 2 0 1 1 3 3L7 19l-4 1 1-4z"/></>,
    link: <><path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/></>,
    alert: <><path d="M12 3 2 21h20z"/><path d="M12 9v5M12 18v.01"/></>,
    chevRight: <><path d="M9 6l6 6-6 6"/></>,
    chevDown: <><path d="M6 9l6 6 6-6"/></>,
    trend: <><path d="M3 17l6-6 4 4 8-8"/><path d="M14 7h7v7"/></>,
    file: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></>,
    drag: <><circle cx="9" cy="5" r="1.3"/><circle cx="15" cy="5" r="1.3"/><circle cx="9" cy="12" r="1.3"/><circle cx="15" cy="12" r="1.3"/><circle cx="9" cy="19" r="1.3"/><circle cx="15" cy="19" r="1.3"/></>,
    flame:<><path d="M12 2c3 4 5 7 5 11a5 5 0 0 1-10 0c0-2 1-3 2-4 0 2 1 3 2 3 0-3 0-6 1-10z"/></>,
    image: <><rect x="3" y="4" width="18" height="16" rx="2"/><circle cx="9" cy="10" r="2"/><path d="m3 18 5-5 4 4 3-3 6 6"/></>,
    bookmark:<><path d="M6 3h12v18l-6-4-6 4z"/></>,
    external:<><path d="M14 3h7v7M10 14 21 3M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6"/></>
  };
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{flexShrink:0}}>{map[name]}</svg>;
};

// ─────────── Tag / Chip ───────────
window.Tag = ({ children, tone='neutral', size='sm', style={} }) => {
  const tones = {
    neutral:{bg:T.page, fg:T.ink, bd:T.border},
    blue:{bg:T.blue12, fg:T.blue, bd:'transparent'},
    green:{bg:'rgba(64,162,122,0.12)', fg:T.green, bd:'transparent'},
    orange:{bg:'rgba(243,131,84,0.12)', fg:T.orange, bd:'transparent'},
    red:{bg:'rgba(255,14,0,0.08)', fg:T.red, bd:'transparent'},
    dark:{bg:T.ink, fg:'#fff', bd:T.ink}
  };
  const s = { sm:{fontSize:12, padding:'4px 10px'}, md:{fontSize:13, padding:'6px 12px'} }[size];
  const t = tones[tone];
  return <span style={{display:'inline-flex', alignItems:'center', gap:6, background:t.bg, color:t.fg, border:`1px solid ${t.bd}`, borderRadius:100, fontFamily:'Poppins', fontWeight:500, lineHeight:1, ...s, ...style}}>{children}</span>;
};

// ─────────── Avatar ───────────
window.Avatar = ({ initials, color, size=40, style={} }) => (
  <div style={{width:size, height:size, minWidth:size, borderRadius:size/2, background:color||T.blue, color:'#fff', fontFamily:'Poppins', fontWeight:700, fontSize:size*0.38, display:'flex', alignItems:'center', justifyContent:'center', letterSpacing:'-0.02em', ...style}}>{initials}</div>
);

// ─────────── Match Score donut ───────────
window.MatchScore = ({ value, size=44, thickness=4, hidden=false }) => {
  if (hidden) return null;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  const color = value >= 90 ? T.green : value >= 75 ? T.blue : value >= 60 ? T.orange : T.meta;
  return (
    <div style={{position:'relative', width:size, height:size, flexShrink:0}} title={`Match ${value}%`}>
      <svg width={size} height={size} style={{transform:'rotate(-90deg)'}}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={T.border} strokeWidth={thickness}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={thickness} strokeLinecap="round" strokeDasharray={`${dash} ${c}`}/>
      </svg>
      <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Poppins', fontWeight:700, fontSize:size*0.3, color}}>{value}</div>
    </div>
  );
};

// ─────────── Field ───────────
window.Field = ({ label, value, onChange, type='text', placeholder, required, helper, style={}, as='input', options, rows=4, prefix }) => (
  <div style={{...style}}>
    {label && <label style={{display:'block', fontFamily:'Poppins', fontSize:13, fontWeight:500, color:T.ink, marginBottom:8}}>{label}{required && <span style={{color:T.red}}> *</span>}</label>}
    <div style={{position:'relative', display:'flex', alignItems:'center'}}>
      {prefix && <span style={{position:'absolute', left:14, fontFamily:'Poppins', fontSize:14, color:T.meta}}>{prefix}</span>}
      {as==='textarea' ? (
        <textarea value={value||''} onChange={e=>onChange?.(e.target.value)} placeholder={placeholder} rows={rows}
          style={{width:'100%', resize:'vertical', padding:'12px 14px', background:'#fff', border:`1px solid ${T.border}`, borderRadius:4, fontFamily:'Poppins', fontSize:14, color:T.ink, outline:'none', lineHeight:1.5}}/>
      ) : as==='select' ? (
        <select value={value||''} onChange={e=>onChange?.(e.target.value)} style={{width:'100%', height:44, padding:'0 14px', background:'#fff', border:`1px solid ${T.border}`, borderRadius:4, fontFamily:'Poppins', fontSize:14, color:T.ink, outline:'none', appearance:'none', backgroundImage:`url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='${T.meta.replace('#','%23')}' stroke-width='2'><path d='m6 9 6 6 6-6'/></svg>")`, backgroundRepeat:'no-repeat', backgroundPosition:'right 14px center'}}>
          {(options||[]).map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : (
        <input type={type} value={value||''} onChange={e=>onChange?.(e.target.value)} placeholder={placeholder}
          style={{width:'100%', height:44, padding: prefix ? '0 14px 0 36px' : '0 14px', background:'#fff', border:`1px solid ${T.border}`, borderRadius:4, fontFamily:'Poppins', fontSize:14, color:T.ink, outline:'none'}}/>
      )}
    </div>
    {helper && <div style={{marginTop:6, fontFamily:'Poppins', fontSize:12, color:T.meta}}>{helper}</div>}
  </div>
);

// ─────────── Card wrapper ───────────
window.Card = ({ children, style={}, pad=24, ...rest }) => (
  <div {...rest} style={{background:'#fff', border:`1px solid ${T.border}`, borderRadius:8, padding:pad, ...style}}>{children}</div>
);

// ─────────── Section header ───────────
window.SectionHead = ({ eyebrow, title, right, style={} }) => (
  <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:20, gap:16, ...style}}>
    <div>
      {eyebrow && <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:12, color:T.blue, letterSpacing:'.08em', marginBottom:8, textTransform:'uppercase'}}>{eyebrow}</div>}
      <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:22, color:T.ink, lineHeight:1.2}}>{title}</div>
    </div>
    {right}
  </div>
);

// ─────────── Empty state ───────────
window.Empty = ({ icon='file', title, desc, cta }) => (
  <div style={{padding:'48px 24px', textAlign:'center', border:`1px dashed ${T.border}`, borderRadius:8, background:T.page}}>
    <div style={{width:56, height:56, margin:'0 auto 16px', borderRadius:28, background:T.blue12, color:T.blue, display:'flex', alignItems:'center', justifyContent:'center'}}><Icon name={icon} size={24}/></div>
    <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:16, color:T.ink, marginBottom:6}}>{title}</div>
    <div style={{fontFamily:'Poppins', fontSize:14, color:T.meta, marginBottom:16, maxWidth:360, margin:'0 auto 16px'}}>{desc}</div>
    {cta}
  </div>
);

// ─────────── Toggle ───────────
window.Toggle = ({ on, onChange, label }) => (
  <label style={{display:'inline-flex', alignItems:'center', gap:10, cursor:'pointer', fontFamily:'Poppins', fontSize:13, color:T.ink}}>
    <span style={{width:32, height:18, borderRadius:9, background: on?T.blue:T.border, position:'relative', transition:'background 150ms'}}>
      <span style={{position:'absolute', top:2, left: on?16:2, width:14, height:14, borderRadius:7, background:'#fff', transition:'left 150ms', boxShadow:'0 1px 3px rgba(0,0,0,.2)'}}/>
    </span>
    {label && <span>{label}</span>}
    <input type="checkbox" checked={!!on} onChange={e=>onChange?.(e.target.checked)} style={{display:'none'}}/>
  </label>
);

// ─────────── useDensity ───────────
window.useDensity = () => {
  const [d, setD] = useState(window.__DENSITY || 'comfy');
  useEffect(() => {
    const h = () => setD(window.__DENSITY);
    window.addEventListener('density-change', h);
    return () => window.removeEventListener('density-change', h);
  }, []);
  return d;
};

// ─────────── helpers ───────────
window.fmtNum = (n) => n.toLocaleString('pt-BR');
window.cx = (...a) => a.filter(Boolean).join(' ');
