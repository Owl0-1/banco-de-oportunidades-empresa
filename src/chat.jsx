/* global React */
const { useState: useStateC, useEffect: useEffectC, useRef: useRefC } = React;

// ─────────── Chat — subcomponentes ───────────
const NotifsTabPill = ({ label, active, onClick }) => {
  const [hot, setHot] = useStateC(false);
  const bg = active ? T.ink : (hot ? T.page : 'transparent');
  const fg = active ? '#fff' : T.ink;
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        padding:'8px 16px',
        borderRadius:100,
        border:0,
        background: bg,
        color: fg,
        fontFamily:'Poppins',
        fontSize:13,
        fontWeight: active?700:500,
        cursor:'pointer',
        transition:'background 140ms ease, color 140ms ease'
      }}
      onMouseEnter={() => setHot(true)}
      onMouseLeave={() => setHot(false)}
      onFocus={() => setHot(true)}
      onBlur={() => setHot(false)}
    >
      {label}
    </button>
  );
};

const ChatSidebarHeader = ({ unreadCount, q, onQ }) => (
  <div style={{padding:'18px 20px', borderBottom:`1px solid ${T.border}`}}>
    <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:12}}>
      <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:16, color:T.ink}}>Conversas</div>
      <Tag tone="blue" size="sm">{unreadCount} não lidas</Tag>
    </div>
    <div style={{display:'flex', alignItems:'center', gap:8, background:T.page, border:`1px solid ${T.border}`, borderRadius:100, padding:'8px 14px'}}>
      <Icon name="search" size={13} color={T.meta}/>
      <input value={q} onChange={e=>onQ(e.target.value)} placeholder="Buscar..." style={{border:0, outline:0, flex:1, fontFamily:'Poppins', fontSize:13, background:'transparent'}}/>
    </div>
  </div>
);

const ChatThreadRow = ({ c, active, onSelect }) => (
  <button type="button" onClick={()=>onSelect(c.id)} style={{width:'100%', display:'flex', gap:12, padding:'14px 20px', background: active?T.blue04:'transparent', border:0, borderBottom:`1px solid ${T.border}`, cursor:'pointer', textAlign:'left', borderLeft: active?`3px solid ${T.blue}`:'3px solid transparent'}}>
    <Avatar initials={c.initials} color={c.color} size={40}/>
    <div style={{flex:1, minWidth:0}}>
      <div style={{display:'flex', justifyContent:'space-between', gap:8, marginBottom:2}}>
        <div style={{fontFamily:'Poppins', fontWeight: c.unread?700:500, fontSize:13.5, color:T.ink, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{c.candName}</div>
        <div style={{fontFamily:'Poppins', fontSize:11, color:T.meta, flexShrink:0}}>{c.lastAt}</div>
      </div>
      <div style={{fontFamily:'Poppins', fontSize:11.5, color:T.blue, marginBottom:4, fontWeight:500}}>{c.vaga}</div>
      <div style={{display:'flex', justifyContent:'space-between', gap:8}}>
        <div style={{fontFamily:'Poppins', fontSize:12, color:T.meta, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{c.messages[c.messages.length-1].text}</div>
        {c.unread>0 && <div style={{background:T.blue16, color:T.blue, fontFamily:'Poppins', fontWeight:700, fontSize:10, padding:'1px 7px', borderRadius:10, flexShrink:0}}>{c.unread}</div>}
      </div>
    </div>
  </button>
);

const ChatSidebar = ({ chats, q, onQ, activeId, onSetActive }) => {
  const unreadCount = chats.filter(c=>c.unread>0).length;
  const filtered = chats.filter(c => !q || c.candName.toLowerCase().includes(q.toLowerCase()));
  return (
    <div style={{borderRight:`1px solid ${T.border}`, display:'flex', flexDirection:'column', background:'#fff'}}>
      <ChatSidebarHeader unreadCount={unreadCount} q={q} onQ={onQ}/>
      <div style={{flex:1, overflowY:'auto'}}>
        {filtered.map(c => (
          <ChatThreadRow key={c.id} c={c} active={activeId===c.id} onSelect={onSetActive}/>
        ))}
      </div>
    </div>
  );
};

const ChatThreadHeader = ({ thread, onGoKanban }) => (
  <div style={{padding:'18px 28px', borderBottom:`1px solid ${T.border}`, background:'#fff', display:'flex', alignItems:'center', gap:14}}>
    <Avatar initials={thread.initials} color={thread.color} size={44}/>
    <div style={{flex:1}}>
      <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:16, color:T.ink}}>{thread.candName}</div>
      <div style={{fontFamily:'Poppins', fontSize:12, color:T.meta, marginTop:2}}>Candidato · {thread.vaga}</div>
    </div>
    <Btn variant="secondary" size="sm" icon={<Icon name="file" size={13}/>}>Ver currículo</Btn>
    <Btn variant="secondary" size="sm" icon={<Icon name="arrowRight" size={13}/>} onClick={onGoKanban}>Ver no pipeline</Btn>
  </div>
);

const ChatInMailBanner = () => (
  <div style={{padding:'10px 28px', background:'rgba(6,87,249,0.06)', borderBottom:`1px solid ${T.border}`, display:'flex', alignItems:'center', gap:10, fontFamily:'Poppins', fontSize:12, color:T.ink2}}>
    <Icon name="spark" size={14} color={T.blue}/>
    <strong style={{color:T.ink, fontWeight:700}}>Chat protegido.</strong> Você iniciou esta conversa. O candidato só consegue responder — não pode abrir novos chats.
  </div>
);

const ChatMessageBubble = ({ m, candName }) => {
  const fromEmp = m.from==='empresa';
  return (
    <div style={{display:'flex', justifyContent: fromEmp ? 'flex-end' : 'flex-start'}}>
      <div style={{maxWidth:'62%'}}>
        <div style={{fontFamily:'Poppins', fontSize:10.5, color:T.meta, marginBottom:4, paddingLeft:fromEmp?0:4, paddingRight:fromEmp?4:0, textAlign:fromEmp?'right':'left'}}>
          {fromEmp ? (m.who || 'Você') : candName} · {m.at}
        </div>
        <div style={{padding:'12px 16px', borderRadius: fromEmp ? '14px 14px 4px 14px' : '14px 14px 14px 4px', background: fromEmp ? T.blue : '#fff', color: fromEmp ? '#fff' : T.ink, fontFamily:'Poppins', fontSize:14, lineHeight:1.5, border: fromEmp ? 'none' : `1px solid ${T.border}`}}>{m.text}</div>
      </div>
    </div>
  );
};

const ChatMessageList = ({ messages, candName, scrollRef }) => (
  <div ref={scrollRef} style={{flex:1, overflowY:'auto', padding:'24px 28px', display:'flex', flexDirection:'column', gap:16}}>
    {messages.map((m, i) => (
      <ChatMessageBubble key={i} m={m} candName={candName}/>
    ))}
  </div>
);

const ChatComposer = () => (
  <div style={{padding:'14px 28px 20px', background:'#fff', borderTop:`1px solid ${T.border}`}}>
    <div style={{display:'flex', gap:6, marginBottom:10}}>
      <button type="button" style={{padding:'5px 10px', background:T.page, border:`1px solid ${T.border}`, borderRadius:100, fontFamily:'Poppins', fontSize:11.5, color:T.ink, cursor:'pointer'}}>📋 Template: convite entrevista</button>
      <button type="button" style={{padding:'5px 10px', background:T.page, border:`1px solid ${T.border}`, borderRadius:100, fontFamily:'Poppins', fontSize:11.5, color:T.ink, cursor:'pointer'}}>📋 Template: proposta</button>
    </div>
    <div style={{display:'flex', gap:10, alignItems:'flex-end', padding:'10px 14px', border:`1px solid ${T.border}`, borderRadius:12, background:T.page}}>
      <textarea placeholder="Escrever mensagem para o candidato..." rows={2} style={{flex:1, background:'transparent', border:0, outline:0, fontFamily:'Poppins', fontSize:13.5, color:T.ink, resize:'none', lineHeight:1.5}}/>
      <Btn variant="primary" size="sm" icon={<Icon name="send" size={13}/>}>Enviar</Btn>
    </div>
  </div>
);

const ChatThreadPanel = ({ thread, scrollRef, onGo }) => (
  <div style={{display:'flex', flexDirection:'column', background:T.page, minWidth:0}}>
    <ChatThreadHeader thread={thread} onGoKanban={()=>onGo('kanban')}/>
    <ChatInMailBanner/>
    <ChatMessageList messages={thread.messages} candName={thread.candName} scrollRef={scrollRef}/>
    <ChatComposer/>
  </div>
);

window.ChatPage = ({ chats, onGo, activeId, onSetActive }) => {
  const [q, setQ] = useStateC('');
  const active = chats.find(c => c.id === activeId) || chats[0];
  const endRef = useRefC();
  useEffectC(() => { endRef.current?.scrollTo(0, 999999); }, [active?.id]);

  return (
    <main style={{display:'grid', gridTemplateColumns:'340px 1fr', height:'calc(100vh - 72px)'}}>
      <ChatSidebar chats={chats} q={q} onQ={setQ} activeId={active?.id} onSetActive={onSetActive}/>
      {active ? <ChatThreadPanel thread={active} scrollRef={endRef} onGo={onGo}/> : (
        <div style={{display:'flex', flexDirection:'column', background:T.page, minWidth:0}}/>
      )}
    </main>
  );
};

// ─────────── Notifications — subcomponentes ───────────
const NOTIF_TABS = ['Todas','Não lidas','Candidatos','Mensagens','Vagas'];

const notifIconColor = (type) =>
  type==='new_cand'?T.blue : type==='msg'?T.orange : type==='offer'?T.purple : type==='match'?T.green : type==='hire'?T.green : type==='interview'?T.blue : T.red;

const NotifsPageHeader = () => (
  <div style={{marginBottom:20}}>
    <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:12, color:T.blue, letterSpacing:'.08em', marginBottom:8}}>CENTRAL DE NOTIFICAÇÕES</div>
    <h1 style={{fontFamily:'Poppins', fontWeight:500, fontSize:28, color:T.ink, margin:0, letterSpacing:'-0.01em'}}>O que mudou desde ontem</h1>
  </div>
);

const NotifsTabBar = ({ tab, onTab }) => (
  <div style={{display:'flex', gap:6, background:'#fff', border:`1px solid ${T.border}`, borderRadius:100, padding:4, marginBottom:16, width:'fit-content'}}>
    {NOTIF_TABS.map(t => (
      <NotifsTabPill key={t} label={t} active={tab===t} onClick={()=>onTab(t)}/>
    ))}
  </div>
);

const NotifRow = ({ n, isLast, onGo }) => (
  <div style={{padding:'18px 22px', borderBottom: isLast?'none':`1px solid ${T.border}`, display:'flex', gap:14, alignItems:'center', background: n.unread?T.blue04:'transparent'}}>
    <div style={{width:42, height:42, borderRadius:8, background: T.page, border:`1px solid ${T.border}`, color: T.ink, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0}}>
      <Icon name={n.icon} size={18} color={notifIconColor(n.type)}/>
    </div>
    <div style={{flex:1, minWidth:0}}>
      <div style={{display:'flex', alignItems:'center', gap:10, marginBottom:4}}>
        <div style={{fontFamily:'Poppins', fontWeight: n.unread?700:500, fontSize:14.5, color:T.ink}}>{n.title}</div>
        {n.unread && <div style={{width:7, height:7, borderRadius:4, background:T.blue}}/>}
      </div>
      <div style={{fontFamily:'Poppins', fontSize:13, color:T.meta}}>{n.desc}</div>
      <div style={{fontFamily:'Poppins', fontSize:11, color:T.meta, marginTop:4}}>{n.at}</div>
    </div>
    <Btn variant="ghost" size="sm" onClick={()=>onGo(n.type==='msg'?'chat':n.type==='match'?'hunting':'kanban')}>Ver →</Btn>
  </div>
);

window.NotifsPage = ({ notifs, onGo }) => {
  const [tab, setTab] = useStateC('Todas');
  const filtered = tab==='Todas' ? notifs : tab==='Não lidas' ? notifs.filter(n=>n.unread) : notifs;
  return (
    <main style={{padding:'28px 36px 48px', maxWidth:880, margin:'0 auto'}}>
      <NotifsPageHeader/>
      <NotifsTabBar tab={tab} onTab={setTab}/>
      <Card pad={0}>
        {filtered.map((n, i) => (
          <NotifRow key={n.id} n={n} isLast={i===filtered.length-1} onGo={onGo}/>
        ))}
      </Card>
    </main>
  );
};
