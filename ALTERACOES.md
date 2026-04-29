# Registro de alterações do projeto

Este arquivo documenta mudanças de interface e comportamento com **comparativo** (antes × depois), valores numéricos e trechos de código quando ajudam a entender o diff.

**Convenção:** em cada entrada, todo bloco de código deve vir acompanhado da linha **Arquivo:** com o caminho relativo ao projeto (por exemplo `src/shell.jsx`), para saber onde aplicar ou rever a mudança.

---

## 2026-04-29 — Botão “Filtrar” ativo com opções (Vagas)

**Arquivos afetados:** `src/vagas.jsx`, `ALTERACOES.md`

### 1. Botão “Filtrar” deixou de ser placeholder e passou a aplicar filtros/ordenação

**Antes:** botão `Filtrar` não aplicava filtros/ordenação (sem popover funcional).
**Depois:** botão `Filtrar` abre um popover com:

- Ordenação: **Data (mais recentes / mais antigas)** e **Título (A→Z / Z→A)**
- Filtros: **Modalidade**, **Nível** e **Cidade**
- Estado visual **ativo** quando qualquer opção difere do padrão, com opção de **Limpar filtros**

**Arquivo:** `src/vagas.jsx`
```jsx
const [filtersOpen, setFiltersOpen] = useStateV(false);
const [sortBy, setSortBy] = useStateV('recentes');
const [modeF, setModeF] = useStateV('Todas');
const [levelF, setLevelF] = useStateV('Todos');
const [cityF, setCityF] = useStateV('Todas');

const filtersActive =
  sortBy !== 'recentes' || modeF !== 'Todas' || levelF !== 'Todos' || cityF !== 'Todas';
```

### 2. Ordenação por data usando `openedAt` (“Há X dias / semanas”)

**Antes:** ordenação não existia e a lista seguia a ordem original.
**Depois:** ordenação passou a converter `openedAt` (texto) para dias e ordenar por mais recentes/antigas.

**Arquivo:** `src/vagas.jsx`
```jsx
const parseOpenedAtDays = (openedAt) => {
  const m = String(openedAt || '').match(/Há\s+(\d+)\s+(dia|dias|semana|semanas)/i);
  // ...
};
```

---

## 2026-04-29 — Vagas: filtro por status mais claro (aba “Todas”, resumo e limpar busca)

**Arquivos afetados:** `src/vagas.jsx`, `ALTERACOES.md`

### 1. Aba padrão e opções do filtro de status

**Antes:** a tela abria por padrão em **`Publicada`**, com abas apenas para status específicos.
**Depois:** adicionada a aba **`Todas`** e a tela abre por padrão em **`Todas`**.

**Arquivo:** `src/vagas.jsx`
```jsx
const [tab, setTab] = useStateV('Todas');
const tabs = ['Todas', 'Publicada', 'Rascunho', 'Pausada', 'Encerrada'];
```

### 2. Resumo do que está sendo exibido + limpar rápido

**Antes:** não havia feedback “Mostrando X de Y” e a busca não tinha botão de limpar.
**Depois:** adicionados:

- Resumo: **“Mostrando X de Y”** (com status/busca/filtros quando aplicável)
- Botões rápidos: **“Ver todas”**, **“Limpar busca”** e **“Limpar filtros”**
- Ícone “X” dentro do input para limpar a busca

**Arquivo:** `src/vagas.jsx`
```jsx
{qNorm && (
  <button type="button" onClick={()=>setQ('')} title="Limpar busca">
    <Icon name="x" size={14}/>
  </button>
)}
```

---

## 2026-04-29 — Lista de vagas: itens com bordas mais arredondadas

**Arquivos afetados:** `src/vagas.jsx`, `src/dashboard.jsx`, `ALTERACOES.md`

### 1. Raio de borda maior nos cards de vaga (lista + destaque)

**Antes:** itens da lista de vagas usavam o `Card` padrão (raio 8) e o “Top 3 vagas” no dashboard tinha `borderRadius: 10`.
**Depois:** itens passaram a ter cantos mais arredondados (lista: `borderRadius: 14`; dashboard: `borderRadius: 14`) para um visual mais suave e consistente.

**Arquivo:** `src/vagas.jsx`
```jsx
<Card
  pad={20}
  style={{
    cursor: 'pointer',
    borderRadius: 14,
    overflow: 'hidden'
  }}
  onClick={() => onGo('kanban', { vagaId: vaga.id })}
>
```

**Arquivo:** `src/dashboard.jsx`
```jsx
style={{
  // ...
  borderRadius: 14,
  // ...
}}
```

---

## 2026-04-29 — Lista de vagas: ações no rodapé (Editar ao lado de “Triar agora”)

**Arquivos afetados:** `src/vagas.jsx`, `ALTERACOES.md`

### 1. Ações do item: remover “3 pontos” e mover “Editar”

**Antes:** o item tinha uma coluna à direita com botão **Editar** e um botão de **3 pontos** (menu).
**Depois:** o botão de **3 pontos** foi removido e o **Editar** foi movido para o rodapé; quando existir CTA **Triar agora**, o **Editar** aparece ao lado.

**Arquivo:** `src/vagas.jsx`
```jsx
<div style={{display:'flex', alignItems:'center', gap:10}} onClick={(e)=>e.stopPropagation()}>
  <Btn variant="secondary" size="sm" onClick={onEdit}>Editar</Btn>
  {showTriage && (
    <Btn
      variant="primary"
      size="sm"
      icon={<Icon name="arrowRight" size={12}/>}
      onClick={() => onGo('kanban', { vagaId: vaga.id })}
    >
      Triar agora
    </Btn>
  )}
</div>
```

### 2. Tipografia do CTA “Triar agora”

**Antes:** o botão seguia o `Btn` padrão (em `primary`, com peso mais alto).
**Depois:** no item da lista, o CTA **Triar agora** passou a usar **12px** e **peso 500**.

**Arquivo:** `src/vagas.jsx`
```jsx
<Btn
  variant="primary"
  size="sm"
  // ...
  style={{ fontSize: 12, fontWeight: 500 }}
>
  Triar agora
</Btn>
```

**Antes (Editar):** botão seguia o `Btn` padrão (tamanho do `size="sm"`).
**Depois (Editar):** label do botão **Editar** passou a usar **12px** e **peso 500** (no rodapé do item).

**Arquivo:** `src/vagas.jsx`
```jsx
<Btn
  variant="secondary"
  size="sm"
  onClick={onEdit}
  style={{ fontSize: 12, fontWeight: 500 }}
>
  Editar
</Btn>
```

### 3. Texto “X novos candidatos…” (rodapé do item)

**Antes:** texto do rodapé usava `fontSize: 13`.
**Depois:** texto do rodapé passou a usar **12px**.

**Arquivo:** `src/vagas.jsx`
```jsx
<div
  style={{
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    fontFamily: 'Poppins',
    fontSize: 12,
    color: T.ink
  }}
>
```

### 4. Indicador (bolinha) de novos candidatos

**Antes:** bolinha **laranja** (`T.orange`) com **8×8px** (`borderRadius: 4`).
**Depois:** bolinha **azul** (`T.blue`) com **6×6px** (`borderRadius: 3`).

**Arquivo:** `src/vagas.jsx`
```jsx
<div
  style={{
    width: 6,
    height: 6,
    borderRadius: 3,
    background: T.blue,
    animation: 'pulse 2s infinite'
  }}
/>
```

### 5. Hover do item (card da vaga)

**Antes:** item não tinha feedback visual ao passar o mouse (sem hover).
**Depois:** item ganha hover com:

- Borda: `T.border` → `T.divider`
- Sombra: `0 1px 2px rgba(5, 8, 5, 0.05)` → `0 8px 22px rgba(5, 8, 5, 0.10)`
- Leve “lift”: `translateY(-1px)` (com transição)

**Arquivo:** `src/vagas.jsx`
```jsx
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
```

### 6. Título do item (nome da vaga)

**Antes:** `fontSize: 17`.
**Depois:** `fontSize: 14`.

**Arquivo:** `src/vagas.jsx`
```jsx
<div style={{fontFamily:'Poppins', fontWeight:700, fontSize:14, color:T.ink}}>{vaga.title}</div>
```

### 7. Pipeline no item: voltar ao layout original (5 cards)

**Antes:** pipeline estava na variação “barra empilhada + legenda”.
**Depois:** pipeline voltou ao layout original em **5 cards** (um por fase), com número em destaque e label abaixo.

**Arquivo:** `src/vagas.jsx`
```jsx
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
```

### 8. Rodapé do item sem “Ações” quando não há triagem

**Antes:** quando não havia novos candidatos, o lado esquerdo do rodapé mostrava o texto **“Ações”**.
**Depois:** o texto foi removido; o rodapé fica sem rótulo à esquerda e mantém os botões à direita.

**Arquivo:** `src/vagas.jsx`
```jsx
{showTriage ? (
  <>
    <div /* bolinha */ />
    <strong>{vaga.newApplicants} novos candidatos</strong> aguardando triagem
  </>
) : null}
```

---

## 2026-04-29 — Botões brancos (`Btn`): hover adicionado

**Arquivos afetados:** `src/primitives.jsx`, `ALTERACOES.md`

### 1. Hover nos botões `secondary`/`danger`

**Antes:** só `variant="primary"` mudava no hover; botões brancos ficavam sem feedback.
**Depois:** `secondary` e `danger` passam a ter hover sutil (fundo `T.page` e borda `T.divider`). `ghost` também ganha um hover leve (`T.blue04`).

**Arquivo:** `src/primitives.jsx`
```jsx
const hoverStyles = {
  primary: { background: T.bluePress },
  secondary: { background: T.page, borderColor: T.divider },
  danger: { background: T.page, borderColor: T.divider },
  ghost: { background: T.blue04 }
};
```

---

## 2026-04-29 — Correção de build: ícone `external` com JSX válido

**Arquivos afetados:** `src/primitives.jsx`, `ALTERACOES.md`

### 1. `Icon.map.external` com fragmento fechado corretamente (Vite voltando a compilar)

**Antes:** o item `external` no `map` do componente `Icon` estava com JSX incompleto (fragmento não fechado), causando erro do Vite/Babel: **“Unexpected token”** e o projeto deixava de subir.
**Depois:** `external` foi reescrito como fragmento válido com 2 `<path />`, restabelecendo a compilação (`npm run dev` e `npm run build` ok).

**Arquivo:** `src/primitives.jsx`
```jsx
external: (
  <>
    <path d="M14 3h7v7M10 14 21 3" />
    <path d="M19 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h6" />
  </>
)
```


## 2026-04-18 — Menu lateral (`Shell`): labels, ícones, hovers e badges

**Arquivo afetado (único nesta entrada):** `src/shell.jsx`  
**Referência “antes”:** última versão commitada em `HEAD` (`git show HEAD:src/shell.jsx` vs working tree).

### 1. Tamanho do texto das labels (itens de navegação)

| Propriedade | Antes | Depois |
|-------------|-------|--------|
| `fontSize` (texto do botão: Início, Vagas, etc.) | **14** px | **12** px |
| `fontWeight` (ativo) | 700 | 700 (inalterado) |
| `fontWeight` (inativo) | 500 | 500 (inalterado) |

**Antes (trecho)** — **Arquivo:** `src/shell.jsx`

```jsx
fontWeight: on?700:500, fontSize:14, textAlign:'left', borderRadius:8, cursor:'pointer', position:'relative', transition:'all 150ms'
```

**Depois (trecho)** — **Arquivo:** `src/shell.jsx`

```jsx
fontWeight:fw, fontSize:12, textAlign:'left', borderRadius:8, cursor:'pointer', position:'relative', transition:'background 150ms ease, color 150ms ease'
```

(`fw` = `on ? 700 : 500`, igual à lógica anterior.)

---

### 2. Ícones ao lado das labels (`<Icon />` nos itens do menu)

| Propriedade | Antes | Depois |
|-------------|-------|--------|
| `size` | **18** | **16** |
| `stroke` | `on ? 2 : 1.6` (só dependia do estado ativo) | `on \|\| hi ? 2 : 1.6` (ativo **ou** hover) |

**Antes** — **Arquivo:** `src/shell.jsx`

```jsx
<Icon name={icon} size={18} stroke={on?2:1.6}/>
```

**Depois** — **Arquivo:** `src/shell.jsx`

```jsx
<Icon name={icon} size={16} stroke={stroke}/>
```

com `const stroke = on || hi ? 2 : 1.6;` e `hi = hoverKey === k`.

---

### 3. Hovers e estados visuais (novo comportamento)

**Antes:** os botões do menu **não** reagiam ao passar o mouse (sem `onMouseEnter` / `onMouseLeave`, sem estado de hover).

**Depois:**

- Estado React: `hoverKey` (`null` ou chave do item) e `tweaksHover` (boolean) para o botão **Tweaks**.
- **Itens do menu:** ao hover (`hi`):
  - **Fundo:** se não ativo → `T.blue04`; se ativo e hover → `rgba(6,87,249,0.18)`; se ativo sem hover → `T.blue12`; se inativo sem hover → `transparent`.
  - **Cor do texto:** inativo com hover passa a usar `T.blue` (antes permanecia `T.ink` até clicar).
- **Transição:** de `all 150ms` para só `background` e `color` com `150ms ease`.
- **Botão Tweaks:** hover altera borda (`T.blue16` vs `T.border`), fundo (`T.blue04` vs `#fff`), cor do texto (`T.blue` vs `T.ink`) e `stroke` do ícone (`2` vs `1.6`), com `transition` em background, border-color e color.

**Código novo (resumo) — estado e handlers nos itens** — **Arquivo:** `src/shell.jsx`

```jsx
const [hoverKey, setHoverKey] = React.useState(null);
// ...
onMouseEnter={()=>setHoverKey(k)}
onMouseLeave={()=>setHoverKey(null)}
```

**Código novo — botão Tweaks** — **Arquivo:** `src/shell.jsx`

```jsx
const [tweaksHover, setTweaksHover] = React.useState(false);
// ...
onMouseEnter={()=>setTweaksHover(true)}
onMouseLeave={()=>setTweaksHover(false)}
```

---

### 4. Badge de contagem (Mensagens / Notificações na sidebar)

**Arquivo:** `src/shell.jsx` (no `map` dos itens do menu, `<span>` do `badge`).

| Propriedade | Antes | Depois |
|-------------|-------|--------|
| Fundo | `on ? T.blue : T.orange` | `T.blue16` |
| Cor do texto | `#fff` | `T.blue` |

Visual: de “pill” preenchida (azul/laranja + texto branco) para estilo mais suave (fundo `#D7E4FE` / `T.blue16` + texto azul).

---

### 5. Extra: badges da barra superior (`TopBar`)

Não faz parte do menu lateral, mas a alteração está no mesmo arquivo — **Arquivo:** `src/shell.jsx`

| | Antes | Depois |
|---|-------|--------|
| Fundo do badge (chat / sino) | `T.orange` | `T.blue16` |
| Cor do número | `#fff` | `T.blue` |

### 6. Seções “Menu” / “Outros”, Lucide e rotas placeholder

**Arquivo:** `src/shell.jsx`

| | Antes | Depois |
|---|-------|--------|
| Agrupamento visual na sidebar | Itens principais soltos | Rótulos **Menu** e **Outros** (`fontSize` 11, cor `rgb(98, 107, 134)`) + separador (`height: 1`, `T.border`) |
| Itens inferiores | — | **Configurações** e **Sair** com ícones `Settings` e `LogOut` de **`lucide-react`** (`size={16}`, `strokeWidth` ligado ao hover/ativo) |
| Import no topo | — | `import { Settings, LogOut } from 'lucide-react';` |

**Arquivo:** `src/app.jsx` — `onNav` ignora cliques em **Configurações** / **Sair** (sem mudar de rota).

```jsx
if (key === 'configuracoes' || key === 'sair') {
  return;
}
```

### 7. `TopBar`: grade, subtítulo por rota e ajustes finos

**Arquivo:** `src/shell.jsx` (`window.TopBar`)

| | Antes | Depois |
|---|-------|--------|
| Layout do `<header>` | Flex em linha (`height: 72`) | **Grid** 3 colunas (`minmax(0,1fr)` · busca central · ações à direita), `minHeight: 72`, `padding: 12px 32px` |
| Título | Uma linha, `fontWeight` 700, `fontSize` 18 | Título `fontWeight` 500, `fontSize` 16 + **subtítulo** (`descriptions[active]`, 2 linhas com clamp) |
| Placeholder da busca | — | `minWidth: 0` no `input` (evita overflow em colunas estreitas) |
| Botão “Nova vaga” | Estilo padrão do `Btn` | `fontSize` 12, `fontWeight` 500, `height` 38, `padding` horizontal 14px |
| Bloco do usuário (nome / cargo) | `fontSize` 13 / 11 | `fontSize` **10** / **10** |

---

## 2026-04-18 — Dependência `lucide-react`

**Arquivos:** `package.json`, `package-lock.json`

| | Antes | Depois |
|---|-------|--------|
| Dependência | — | `"lucide-react": "^1.8.0"` (uso inicial: ícones da sidebar em `src/shell.jsx`) |

---

## 2026-04-18 — Tokens e ícones (`primitives.jsx`)

**Arquivo:** `src/primitives.jsx`

| | Antes | Depois |
|---|-------|--------|
| `T.blue16` | — | `'#D7E4FE'` (badges suaves alinhados ao restante da UI) |
| Ícone `trendDown` | — | Path SVG para deltas negativos nos KPIs |

---

## 2026-04-18 — Mock do funil (`data.jsx`)

**Arquivo:** `src/data.jsx` (`window.MOCK_FUNNEL`)

- Comentário explicando **`dropoffLabel`** (rótulo de quem não avança para a próxima etapa; abandono e % continuam derivados dos valores).
- Valores de exemplo **reescalados** (ex.: visualizações 12 800, candidaturas 5 200, … contratados 88) e cada etapa (exceto a última) ganha `dropoffLabel` próprio (ex.: `'Sem candidatura'`, `'Sem triagem'`, …).

---

## 2026-04-18 — Chat e notificações (`chat.jsx`)

**Arquivo:** `src/chat.jsx`

| Tema | Antes | Depois |
|------|-------|--------|
| Estrutura | JSX monolítico em `ChatPage` / `NotifsPage` | Subcomponentes: sidebar (`ChatSidebarHeader`, `ChatThreadRow`, …), painel (`ChatThreadPanel`, `ChatComposer`, …), notificações (`NotifsPageHeader`, `NotifsTabBar`, `NotifRow`, `notifIconColor`) |
| Badge de não lidas na **lista** de threads | `T.orange` + texto `#fff` | `T.blue16` + texto `T.blue` (alinhado aos badges do shell) |
| Ponto “não lida” nas linhas de notificação | `T.orange` | `T.blue` |
| Botões | Alguns sem `type` | `type="button"` onde aplicável (evita submit acidental) |
| Estado sem thread ativa | — | Painel direito vazio (`active ? <ChatThreadPanel …> : …`) em vez de fragmento condicional apenas interno |

---

## 2026-04-18 — Dashboard (`dashboard.jsx`) — resumo do diff

**Arquivo:** `src/dashboard.jsx` (diff grande; abaixo só o essencial.)

### `FunnelChart`

| | Antes | Depois |
|---|-------|--------|
| `variant` padrão | `'layered'` | `'wave'` |
| Modo “camadas” (trapézios) | Era o único layout vertical além de `horizontal` | Mantido em ramo explícito `variant === 'layered'` |
| Novo `wave` | — | Colunas com rótulo, número em **“X mil / X mi”** (`fmtFunnelPrimary`), **dropoff** vs. próxima etapa (`fmtNum` + `%`), área SVG com curvas Bézier e degradê em azuis (`blues`, `visNorm` com expoente 0,34) |
| `max` / labels | Assumia `data[0]` | `data[0]?.value \|\| 1`; labels com cor `funnelLabelColor` (`rgb(98, 107, 134)`) onde aplicável |
| `horizontal` | — | `paddingBottom: 24`; label da primeira coluna com `funnelLabelColor` |

### KPIs (`KpiCard` + utilitários)

- Remoção de `useMemo` no import do React neste arquivo (`useMemo` não usado).
- Novos exports: `kpiSparkRamp`, `kpiSparkWander`, `KpiSparkline`, `kpiSmoothPath` — série sintética para fundo do card, curva suave SVG com gradiente.
- **`KpiCard`**: layout em **grade** (título + pill de delta, valor + `subtext` opcional, sparkline à direita); delta com pill (verde / vermelho / neutro) e ícone `trendDown` quando negativo; sem ícone circular único no canto — visual tipo “card analítico”.

### `ActionFeed`

| | Antes | Depois |
|---|-------|--------|
| Ícone da ação | `borderRadius: 8` | **`50%`** (círculo) |
| Título da linha | `fontSize` 13,5 | `fontSize` **12** |
| CTA | `<button>` texto azul | `<Btn variant="secondary" size="xs">` com ícone seta; `onClick` chama `onGo(it.go, it.vaga ? { vagaId: it.vaga } : undefined)` |

### `DashboardPage`

- Estado e estilo para **filtros do funil**: vaga (`funnelVagaId`), mês e ano (`FUNIL_MESES`, lista de anos), `funnelSelectStyle` (select nativo estilizado como pill).
- **KPIs** do topo passam a usar séries (`series` / `subtext` onde aplicável) alinhadas aos novos cards.
- **Cards de vagas** em destaque: layout mais rico (métricas em colunas, bloco “Local” + nível / modelo / data, chevron).
- Bloco **ATIVIDADE** / heatmap: label superior `fontSize` 10; título `fontWeight` 500, `fontSize` 14.

---

*Próximas entradas: data, arquivo(s) afetados no cabeçalho da entrada, e em cada snippet **Arquivo:** `caminho/relativo.ext` antes do bloco de código.*

## 2026-04-29 — Vagas: hover no input de busca por título

**Arquivos afetados:** `src/vagas.jsx`, `src/primitives.jsx`

### 1. Feedback visual no hover do campo de busca

**Antes:** campo de busca com borda fixa (`T.border`) e fundo branco, sem feedback ao passar o mouse.
**Depois:** ao hover, borda muda para `T.divider` e fundo para `T.page`, com transição suave de 140ms.

### 2. Correção do ícone “Limpar filtros” (não renderizava)

**Antes:** `src/vagas.jsx` referenciava `<Icon name="clean" .../>`, mas o ícone `clean` não existia no `Icon.map`, então nada era exibido.
**Depois:** o botão “Limpar filtros” passou a usar o ícone oficial do Lucide `brush-cleaning` (`Icon name="brushCleaning"`), com proporção/traço consistente.

---

## 2026-04-29 — Hover nos tabs de filtro (Vagas / Notificações)

**Arquivos afetados:** `src/vagas.jsx`, `src/chat.jsx`

### 1. Estado de hover/focus nos “tabs” (Todas/Publicada/…)

**Antes:** botões dos tabs não tinham feedback visual ao passar o mouse (nem ao focar via teclado).
**Depois:** adicionado hover e focus com transição (140ms) usando estado local (`hot`) controlado por React (sem mutar `e.currentTarget.style`), evitando inconsistência visual ao clicar enquanto está em hover; tab ativo ganha destaque leve no hover e tabs inativos ganham fundo `T.page`.

---

## 2026-04-29 — Vagas: “Limpar busca” com ícone e tipografia correta

**Arquivos afetados:** `src/vagas.jsx`, `src/primitives.jsx`

### 1. Botão “Limpar busca” (ações e estado vazio)

**Antes:** botão “Limpar busca” usava `fontSize: 12.5` e `fontWeight: 700`, sem ícone.
**Depois:** botão passa a usar `fontSize: 12`, `fontWeight: 500` e ícone `brushCleaning` à esquerda (SVG alinhado ao ícone oficial `brush-cleaning` do Lucide).
