# Registro de alterações do projeto

Este arquivo documenta mudanças de interface e comportamento com **comparativo** (antes × depois), valores numéricos e trechos de código quando ajudam a entender o diff.

**Convenção:** em cada entrada, todo bloco de código deve vir acompanhado da linha **Arquivo:** com o caminho relativo ao projeto (por exemplo `src/shell.jsx`), para saber onde aplicar ou rever a mudança.

---

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
