/* global React */
import { Settings, LogOut } from 'lucide-react';

const { useState: useStateS } = React;

window.Shell = ({ active, onNav, company, user, unread, children, onOpenTweaks }) => {
  const [hoverKey, setHoverKey] = React.useState(null);
  const [tweaksHover, setTweaksHover] = React.useState(false);
  const items = [
    ['dashboard', 'Início', 'dashboard'],
    ['vagas', 'Vagas', 'briefcase'],
    ['kanban', 'Candidatos', 'kanban'],
    ['hunting', 'Banco de talentos', 'users'],
    ['chat', 'Mensagens', 'chat', unread.chat],
    ['notifs', 'Notificações', 'bell', unread.notifs],
    ['perfil', 'Perfil da empresa', 'building']
  ];

  return (
    <div style={{display:'grid', gridTemplateColumns:'248px 1fr', minHeight:'100vh', background:T.page}}>
      {/* ─── Sidebar ─── */}
      <aside style={{background:'#fff', borderRight:`1px solid ${T.border}`, padding:'20px 14px 20px', display:'flex', flexDirection:'column', gap:2, position:'sticky', top:0, height:'100vh', overflowY:'auto'}}>
        <div style={{display:'flex', alignItems:'center', gap:12, padding:'6px 10px 20px'}}>
          <img src="assets/logo-mark.svg" width="28" height="28" alt=""/>
          <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:13, lineHeight:1.1, color:T.ink}}>Banco<br/><span style={{fontWeight:500}}>de oportunidades.</span></div>
        </div>

        {/* Empresa chip */}
        <div style={{display:'flex', alignItems:'center', gap:10, padding:'10px 10px', marginBottom:12, border:`1px solid ${T.border}`, borderRadius:8}}>
          <div style={{width:32, height:32, borderRadius:6, background:T.orange, color:'#fff', fontFamily:'Poppins', fontWeight:700, fontSize:14, display:'flex', alignItems:'center', justifyContent:'center'}}>{company.logoLetter}</div>
          <div style={{minWidth:0, flex:1}}>
            <div style={{fontFamily:'Poppins', fontWeight:700, fontSize:12, color:T.ink, lineHeight:1.1, whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis'}}>{company.name}</div>
            <div style={{fontFamily:'Poppins', fontSize:11, color:T.meta, marginTop:2}}>Empresa · Plano Pro</div>
          </div>
        </div>

        <div style={{fontFamily:'Poppins', fontSize:11, fontWeight:600, color:'rgb(98, 107, 134)', padding:'4px 10px 8px', textAlign:'left', alignSelf:'stretch'}}>Menu</div>

        {items.map(([k, label, icon, badge]) => {
          const on = active === k;
          const hi = hoverKey === k;
          const bg = on ? (hi ? 'rgba(6,87,249,0.18)' : T.blue12) : (hi ? T.blue04 : 'transparent');
          const fg = on ? T.blue : (hi ? T.blue : T.ink);
          const fw = on ? 700 : 500;
          const stroke = on || hi ? 2 : 1.6;
          return (
            <button key={k} onClick={()=>onNav(k)}
              onMouseEnter={()=>setHoverKey(k)}
              onMouseLeave={()=>setHoverKey(null)}
              style={{display:'flex', alignItems:'center', gap:12, padding:'10px 12px', border:0, background:bg, color:fg, fontFamily:'Poppins', fontWeight:fw, fontSize:12, textAlign:'left', borderRadius:8, cursor:'pointer', position:'relative', transition:'background 150ms ease, color 150ms ease'}}>
              <Icon name={icon} size={16} stroke={stroke}/>
              <span style={{flex:1}}>{label}</span>
              {badge > 0 && (
                <span style={{background: T.blue16, color: T.blue, fontFamily:'Poppins', fontWeight:700, fontSize:10, padding:'2px 7px', borderRadius:10, lineHeight:1}}>{badge}</span>
              )}
            </button>
          );
        })}

        <div role="separator" style={{height:1, background:T.border, margin:'12px 10px'}} aria-hidden />

        <div style={{fontFamily:'Poppins', fontSize:11, fontWeight:600, color:'rgb(98, 107, 134)', padding:'8px 10px 4px', textAlign:'left', alignSelf:'stretch'}}>Outros</div>

        {[
          ['configuracoes', 'Configurações', Settings],
          ['sair', 'Sair', LogOut]
        ].map(([k, label, LucideIcon]) => {
          const on = active === k;
          const hi = hoverKey === k;
          const bg = on ? (hi ? 'rgba(6,87,249,0.18)' : T.blue12) : (hi ? T.blue04 : 'transparent');
          const fg = on ? T.blue : (hi ? T.blue : T.ink);
          const fw = on ? 700 : 500;
          const stroke = on || hi ? 2 : 1.6;
          return (
            <button key={k} type="button" onClick={()=>onNav(k)}
              onMouseEnter={()=>setHoverKey(k)}
              onMouseLeave={()=>setHoverKey(null)}
              style={{display:'flex', alignItems:'center', gap:12, padding:'10px 12px', border:0, background:bg, color:fg, fontFamily:'Poppins', fontWeight:fw, fontSize:12, textAlign:'left', borderRadius:8, cursor:'pointer', transition:'background 150ms ease, color 150ms ease'}}>
              <LucideIcon size={16} strokeWidth={stroke} color={fg} aria-hidden />
              <span style={{flex:1}}>{label}</span>
            </button>
          );
        })}

        <div style={{marginTop:'auto', display:'flex', flexDirection:'column', gap:10}}>
          <button onClick={onOpenTweaks}
            onMouseEnter={()=>setTweaksHover(true)}
            onMouseLeave={()=>setTweaksHover(false)}
            style={{display:'flex', alignItems:'center', gap:10, padding:'10px 12px', border:`1px solid ${tweaksHover ? T.blue16 : T.border}`, background:tweaksHover ? T.blue04 : '#fff', borderRadius:8, cursor:'pointer', fontFamily:'Poppins', fontSize:13, fontWeight:500, color:tweaksHover ? T.blue : T.ink, textAlign:'left', transition:'background 150ms ease, border-color 150ms ease, color 150ms ease'}}>
            <Icon name="spark" size={16} stroke={tweaksHover ? 2 : 1.6}/> Tweaks
          </button>
          <div style={{padding:12, background:T.page, borderRadius:8, fontFamily:'Poppins', fontSize:12, color:T.meta, lineHeight:1.5}}>
            Dúvidas com a plataforma?<br/>
            <a href="#" style={{color:T.blue, fontWeight:700, textDecoration:'none'}}>Falar com suporte ↗</a>
          </div>
        </div>
      </aside>

      {/* ─── Main ─── */}
      <div style={{minWidth:0, display:'flex', flexDirection:'column'}}>
        <TopBar active={active} user={user} onNav={onNav} unread={unread}/>
        <div style={{flex:1, minWidth:0}}>{children}</div>
      </div>
    </div>
  );
};

window.TopBar = ({ active, user, onNav, unread }) => {
  const titles = {
    dashboard:'Início', vagas:'Vagas', kanban:'Candidatos', hunting:'Banco de talentos',
    chat:'Mensagens', notifs:'Notificações', perfil:'Perfil da empresa'
  };
  const descriptions = {
    dashboard:'Resumo de vagas, candidatos e atividade recente.',
    vagas:'Crie e gerencie posições abertas na sua empresa.',
    kanban:'Acompanhe o funil de candidatos por vaga.',
    hunting:'Explore perfis e convide talentos para suas vagas.',
    chat:'Conversas com candidatos em um só lugar.',
    notifs:'Alertas sobre candidaturas, mensagens e eventos.',
    perfil:'Dados da empresa visíveis aos candidatos.'
  };
  return (
    <header style={{minHeight:72, display:'grid', gridTemplateColumns:'minmax(0,1fr) minmax(200px,min(460px,100%)) minmax(0,1fr)', alignItems:'center', padding:'12px 32px', gap:20, borderBottom:`1px solid ${T.border}`, background:'#fff', position:'sticky', top:0, zIndex:10}}>
      <div style={{justifySelf:'start', minWidth:0, paddingRight:8, alignSelf:'center'}}>
        <div style={{fontFamily:'Poppins', fontWeight:500, fontSize:16, color:T.ink, lineHeight:1.25, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap'}}>{titles[active] ?? active}</div>
        <div style={{fontFamily:'Poppins', fontWeight:400, fontSize:12, color:T.meta, lineHeight:1.35, marginTop:2, overflow:'hidden', textOverflow:'ellipsis', display:'-webkit-box', WebkitLineClamp:2, WebkitBoxOrient:'vertical'}}>{descriptions[active] ?? ''}</div>
      </div>

      <div style={{width:'100%', justifySelf:'center', display:'flex', alignItems:'center', gap:10, background:T.page, border:`1px solid ${T.border}`, borderRadius:100, padding:'9px 16px', minWidth:0}}>
        <Icon name="search" size={16} color={T.meta}/>
        <input placeholder="Buscar candidatos, vagas, skills…" style={{border:0, outline:0, flex:1, minWidth:0, fontFamily:'Poppins', fontSize:13, background:'transparent', color:T.ink}}/>
        <kbd style={{fontFamily:'Poppins', fontSize:11, color:T.meta, background:'#fff', border:`1px solid ${T.border}`, padding:'2px 6px', borderRadius:4, flexShrink:0}}>⌘K</kbd>
      </div>

      <div style={{justifySelf:'end', display:'flex', alignItems:'center', gap:12, minWidth:0}}>
        <Btn variant="primary" size="sm" icon={<Icon name="plus" size={14}/>} onClick={()=>onNav('vagas-new')} style={{order:1, fontSize:12, fontWeight:500, height:38, boxSizing:'border-box', padding:'0 14px'}}>Nova vaga</Btn>

        <button onClick={()=>onNav('chat')} style={{width:38, height:38, borderRadius:19, border:`1px solid ${T.border}`, background:'#fff', cursor:'pointer', position:'relative', display:'flex', alignItems:'center', justifyContent:'center'}}>
          <Icon name="chat" size={17}/>
          {unread.chat>0 && <span style={{position:'absolute', top:6, right:8, minWidth:14, height:14, background:T.blue16, color:T.blue, fontFamily:'Poppins', fontWeight:700, fontSize:9, borderRadius:7, padding:'0 4px', display:'flex', alignItems:'center', justifyContent:'center'}}>{unread.chat}</span>}
        </button>
        <button onClick={()=>onNav('notifs')} style={{width:38, height:38, borderRadius:19, border:`1px solid ${T.border}`, background:'#fff', cursor:'pointer', position:'relative', display:'flex', alignItems:'center', justifyContent:'center'}}>
          <Icon name="bell" size={17}/>
          {unread.notifs>0 && <span style={{position:'absolute', top:6, right:8, minWidth:14, height:14, background:T.blue16, color:T.blue, fontFamily:'Poppins', fontWeight:700, fontSize:9, borderRadius:7, padding:'0 4px', display:'flex', alignItems:'center', justifyContent:'center'}}>{unread.notifs}</span>}
        </button>

        <div style={{display:'flex', alignItems:'center', gap:10, padding:'4px 14px 4px 4px', border:`1px solid ${T.border}`, borderRadius:100}}>
          <Avatar initials={user.initials} color={T.blue} size={30}/>
          <div style={{fontFamily:'Poppins', fontSize:10, color:T.ink, fontWeight:500, lineHeight:1.2}}>
            {user.name}<div style={{fontSize:10, color:T.meta, fontWeight:400}}>{user.role.split(' · ')[0]}</div>
          </div>
        </div>
      </div>
    </header>
  );
};
