/* global React, ReactDOM */
const { useState } = React;

function CompanyProfilePage({ company }) {
  return (
    <main style={{ padding: '28px 36px 48px', maxWidth: 1040 }}>
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 12, color: T.blue, letterSpacing: '.08em', marginBottom: 8 }}>PERFIL DA EMPRESA</div>
        <h1 style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 30, color: T.ink, margin: 0 }}>{company.name}</h1>
        <div style={{ fontFamily: 'Poppins', fontSize: 14, color: T.meta, marginTop: 8 }}>{company.tagline}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Card>
          <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 13, color: T.ink, marginBottom: 12 }}>Visão geral</div>
          <div style={{ fontFamily: 'Poppins', fontSize: 13, color: T.ink2, lineHeight: 1.6, marginBottom: 14 }}>{company.about}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, fontFamily: 'Poppins', fontSize: 12, color: T.meta }}>
            <span>{company.sector}</span><span>·</span><span>Fundada em {company.founded}</span><span>·</span><span>{company.size}</span><span>·</span><span>{company.hq}</span>
          </div>
        </Card>
        <Card>
          <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 13, color: T.ink, marginBottom: 12 }}>Presença online</div>
          <div style={{ fontFamily: 'Poppins', fontSize: 14, color: T.ink2 }}>
            <div style={{ marginBottom: 8 }}><Icon name="link" size={14} /> {company.site}</div>
            <div>LinkedIn {company.linkedin}</div>
          </div>
        </Card>
      </div>

      <Card style={{ marginBottom: 16 }}>
        <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 13, color: T.ink, marginBottom: 12 }}>Cultura</div>
        <ul style={{ margin: 0, paddingLeft: 18, fontFamily: 'Poppins', fontSize: 14, color: T.ink2, lineHeight: 1.7 }}>
          {company.culture.map((c, i) => (
            <li key={i}>{c}</li>
          ))}
        </ul>
      </Card>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 16 }}>
        <Card>
          <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 13, color: T.ink, marginBottom: 12 }}>Benefícios destacados</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {company.benefits.map((b) => (
              <Tag key={b} tone="green" size="sm">{b}</Tag>
            ))}
          </div>
        </Card>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {company.gallery.map((g, i) => (
            <div key={i} style={{ flex: 1, minHeight: 72, borderRadius: 8, background: g.tint + '33', border: `1px solid ${T.border}`, display: 'flex', alignItems: 'flex-end', padding: 12 }}>
              <span style={{ fontFamily: 'Poppins', fontSize: 11, color: T.ink, fontWeight: 600 }}>{g.label}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function TweaksModal({ onClose }) {
  const [density, setDensity] = useState(window.__DENSITY || 'comfy');
  const apply = (next) => {
    window.__DENSITY = next;
    window.dispatchEvent(new Event('density-change'));
    setDensity(next);
  };
  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(5,8,5,0.45)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={onClose}>
      <div style={{ background: '#fff', borderRadius: 12, padding: 28, maxWidth: 420, width: '100%', border: `1px solid ${T.border}` }} onClick={(e) => e.stopPropagation()}>
        <div style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 18, color: T.ink, marginBottom: 8 }}>Tweaks</div>
        <div style={{ fontFamily: 'Poppins', fontSize: 13, color: T.meta, marginBottom: 20 }}>Ajustes rápidos do protótipo (densidade da UI).</div>
        <Toggle on={density === 'dense'} onChange={(v) => apply(v ? 'dense' : 'comfy')} label="Layout denso (cards mais compactos onde aplicável)" />
        <div style={{ marginTop: 22, display: 'flex', justifyContent: 'flex-end' }}>
          <Btn variant="primary" onClick={onClose}>Fechar</Btn>
        </div>
      </div>
    </div>
  );
}

function App() {
  const [route, setRoute] = useState('dashboard');
  const [kanbanVagaId, setKanbanVagaId] = useState('v1');
  const [candidates, setCandidates] = useState(() => [...MOCK_CANDIDATES]);
  const [drawerCand, setDrawerCand] = useState(null);
  const [chatActiveId, setChatActiveId] = useState(MOCK_CHATS[0]?.id || '');
  const [showNovaVaga, setShowNovaVaga] = useState(false);
  const [editingVaga, setEditingVaga] = useState(null);
  const [showTweaks, setShowTweaks] = useState(false);

  const unread = {
    chat: MOCK_CHATS.reduce((s, c) => s + c.unread, 0),
    notifs: MOCK_NOTIFS.filter((n) => n.unread).length
  };

  const onNav = (key, payload) => {
    if (key === 'configuracoes' || key === 'sair') {
      return;
    }
    if (key === 'vagas-new') {
      setEditingVaga(null);
      setShowNovaVaga(true);
      setRoute('vagas');
      return;
    }
    if (key === 'kanban') {
      if (payload?.vagaId) setKanbanVagaId(payload.vagaId);
      setRoute('kanban');
      return;
    }
    setRoute(key);
  };

  const onMove = (candId, stage) => {
    setCandidates((cs) => cs.map((c) => (c.id === candId ? { ...c, stage } : c)));
    setDrawerCand((d) => (d && d.id === candId ? { ...d, stage } : d));
  };

  const onStartChatFromCand = (cand) => {
    setRoute('chat');
    const ch = MOCK_CHATS.find((x) => x.candId === cand.id);
    if (ch) setChatActiveId(ch.id);
  };

  const onStartChatTalent = () => {
    setRoute('chat');
  };

  let body = null;
  if (route === 'dashboard') body = <DashboardPage user={MOCK_USER} vagas={MOCK_VAGAS} onGo={onNav} />;
  else if (route === 'vagas') {
    body = (
      <VagasPage
        vagas={MOCK_VAGAS}
        onGo={onNav}
        onOpenNew={() => { setEditingVaga(null); setShowNovaVaga(true); }}
        onEdit={(v) => { setEditingVaga(v); setShowNovaVaga(true); }}
      />
    );
  } else if (route === 'kanban') {
    body = (
      <KanbanPage
        vagas={MOCK_VAGAS}
        candidates={candidates}
        onGo={onNav}
        initialVagaId={kanbanVagaId}
        onOpenCand={setDrawerCand}
        onStartChat={onStartChatFromCand}
        onMove={onMove}
      />
    );
  } else if (route === 'hunting') {
    body = (
      <HuntingPage
        talents={MOCK_TALENT}
        vagas={MOCK_VAGAS}
        onStartChat={onStartChatTalent}
        onAddToVaga={() => {}}
      />
    );
  } else if (route === 'chat') {
    body = <ChatPage chats={MOCK_CHATS} onGo={onNav} activeId={chatActiveId} onSetActive={setChatActiveId} />;
  } else if (route === 'notifs') {
    body = <NotifsPage notifs={MOCK_NOTIFS} onGo={onNav} />;
  } else if (route === 'perfil') {
    body = <CompanyProfilePage company={MOCK_COMPANY} />;
  }

  return (
    <>
      <Shell
        active={route}
        onNav={onNav}
        company={MOCK_COMPANY}
        user={MOCK_USER}
        unread={unread}
        onOpenTweaks={() => setShowTweaks(true)}
      >
        {body}
      </Shell>
      {showNovaVaga && (
        <NovaVagaModal
          onClose={() => { setShowNovaVaga(false); setEditingVaga(null); }}
          editing={editingVaga}
        />
      )}
      {drawerCand && (
        <CandDrawer
          cand={drawerCand}
          onClose={() => setDrawerCand(null)}
          onStartChat={(c) => { onStartChatFromCand(c); setDrawerCand(null); }}
          onMove={onMove}
        />
      )}
      {showTweaks && <TweaksModal onClose={() => setShowTweaks(false)} />}
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
