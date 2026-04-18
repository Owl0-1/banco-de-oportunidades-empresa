# Design system — Banco de oportunidades

Documento de referência de produto e interface, alinhado ao código e aos tokens do repositório.

## 1. Visão do produto

**Banco de oportunidades** é um protótipo de aplicação web voltado à **visão empresa**: gestão de vagas, pipeline de candidatos, prospecção em banco de talentos, mensagens e notificações, com perfil institucional da contratante.

O cenário de demonstração usa a empresa fictícia **Construtex Engenharia** (dados em `src/data.jsx`).

### Módulos principais

| Área | Rota interna | Função |
|------|----------------|--------|
| Início | `dashboard` | Resumo, métricas e gráficos (funil, heatmap, cards de estatística). |
| Vagas | `vagas` | Lista e gestão de vagas; fluxo “Nova vaga” / edição em modal. |
| Candidatos | `kanban` | Kanban por vaga, estágios do funil, drawer do candidato, arrastar etapas. |
| Banco de talentos | `hunting` | Descoberta de perfis; match score; iniciar conversa. |
| Mensagens | `chat` | Lista de conversas e thread por candidato/vaga. |
| Notificações | `notifs` | Centro de alertas. |
| Perfil da empresa | `perfil` | Visão geral, cultura, benefícios, presença online. |

Navegação: **sidebar fixa** (248px) + **top bar** com título da rota, busca global (⌘K como indicação visual), CTA “Nova vaga”, atalhos a mensagens/notificações e chip do usuário.

---

## 2. Stack e implementação de UI

- **React 18** + **Vite 5**, sem roteador externo: estado de rota em `useState` em `src/app.jsx`.
- Estilos majoritariamente **inline** nos componentes, com **tokens CSS** globais em `styles/tokens.css`.
- Objeto **`window.T`** em `src/primitives.jsx` espelha cores e superfícies usadas no JS (consistência com tokens).
- Componentes globais no padrão `window.Nome` (`Btn`, `Icon`, `Card`, `Shell`, etc.), carregados via `src/main.jsx`.

Fontes: **Poppins** (UI, títulos, botões) e **Mulish** (corpo “editorial” / footer no sistema Figma), importadas no `tokens.css`.

---

## 3. Origem do sistema visual

Os tokens em `styles/tokens.css` declaram como fonte o arquivo Figma **“UI System Desktop.fig”** (página Desktop). O HTML usa `lang="pt-BR"` e título alinhado ao contexto empresa.

---

## 4. Cores

### Marca e primário

- **Azul primário**: `#0657F9` (`--brand-blue` / `T.blue`)
- **Press/hover (primário)**: `#0044CB` (`--brand-blue-press` / `T.bluePress`)
- Variações com alpha: `0.04`, `0.12`, `0.24`, `0.56` para fundos, seleção e decoração.

### Acentos por audiência (design system amplo)

- Estudante: alinhado ao azul marca
- Engenheiro: `#40A27A`
- Empresa: `#F38354` / `#FF854C` (chip da empresa na sidebar usa laranja)

### Neutros e texto

- **Ink principal**: `#050805`
- **Corpo em fundo claro**: `#3B3C39`
- **Meta (vagas, labels secundários)**: `#626B86`
- **Mute**: `#898B8D`
- Bordas: `#E5E5E5`; divisores: `#D9D9D9`; superfície neutra: `#EDEDED`
- **Página**: `#F9FBFC`; **cartão**: `#FFFFFF`

### Estados e feedback

- **Sucesso / match alto**: verde `#40A27A`
- **Alerta / match médio**: laranja marca
- **Erro / destaque crítico**: `#FF0E00`
- **Roxo / destaque pontual**: `#8A38F5`
- **Neon** (`#00FF10`): uso decorativo e esparsamente, conforme comentários nos tokens.

### Tags (tons em `Tag`)

`neutral`, `blue`, `green`, `orange`, `red`, `dark` — fundos suaves com alpha onde aplicável e borda opcional.

---

## 5. Tipografia

Escala principal (px) definida em CSS:

| Token / classe | Uso |
|----------------|-----|
| `--fs-hero` (64) | Hero marketing (sistema completo) |
| `--fs-h1`–`--fs-h4` | Hierarquia de títulos |
| `--fs-lead` (20) | Subtítulos, descrições de audiência |
| `--fs-body` (16) | Corpo, botões, inputs |
| `--fs-sm` (14) | Meta de vaga, filtros |
| Classes `.h1`, `.lead`, `.meta`, `.eyebrow`, etc. | Uso em páginas que optam por classes em vez de só inline |

Na app empresa, a maioria dos blocos usa **Poppins** com pesos **500–700** para hierarquia clara.

---

## 6. Layout e espaçamento

- **Grid shell**: `248px` (sidebar) + `1fr` (conteúdo).
- **Altura top bar**: `72px`; sticky com borda inferior.
- **Espaçamento**: escala `--space-1` … `--space-9` (4px até 96px); gutters de página no token sheet (`--page-gutter`, `--header-gutter`).
- **Largura máxima de conteúdo**: varia por página (ex.: perfil da empresa ~1040px no `app.jsx`).

---

## 7. Forma, borda e profundidade

- **Raios**: `4px` (inputs), `8px` (cards, painéis), `16px` (grandes wrappers), **pill** `100px` (botões, busca, tags).
- **Sombra**: uma única sombra de sistema — `--shadow-floating: 0 4px 24px rgba(0,0,0,0.25)` — para elementos flutuantes (modais, overlays).

---

## 8. Componentes primitivos (`src/primitives.jsx`)

| Componente | Papel |
|------------|--------|
| `Btn` | Variantes: `primary`, `secondary`, `dark`, `ghost`, `danger`; tamanhos `lg` / `md` / `sm` / `xs`; primário com hover para `bluePress`. |
| `Icon` | Biblioteca inline estilo Lucide (stroke configurável). |
| `Tag` | Chips de status, skills, benefícios. |
| `Avatar` | Iniciais sobre cor sólida. |
| `MatchScore` | Donut de 0–100%; cor por faixa (verde / azul / laranja / meta). |
| `Field` | Label, input, textarea, select, helper, prefixo. |
| `Card` | Container branco com borda e raio 8. |
| `SectionHead` | Eyebrow em azul + título + slot `right`. |
| `Empty` | Estado vazio com ícone em círculo azul claro. |
| `Toggle` | Interruptor para preferências (ex.: densidade). |

---

## 9. Padrões de produto e UX

- **Busca global** na top bar: placeholder “Buscar candidatos, vagas, skills…”.
- **Badges de não lidos** em itens da sidebar (Mensagens, Notificações) e ícones na top bar.
- **Modal “Nova vaga”** e **drawer de candidato** sobrepõem o shell sem trocar de URL (protótipo).
- **Tweaks** (rodapé da sidebar): modal com toggle de **densidade** (`comfy` / `dense`), propagada via `window.__DENSITY` e evento `density-change`; hook `useDensity()` para telas que reagem à densidade.

---

## 10. Idioma e conteúdo

- Interface em **português (Brasil)**.
- Números formatados com `pt-BR` (`fmtNum`).

---

## 11. Assets

- Logo: `assets/logo-mark.svg` (sidebar).
- Favicon / meta: revisar `index.html` se necessário para publicação.

---

## 12. Manutenção do documento

- Alterações de cor, tipo ou raios devem ser refletidas primeiro em **`styles/tokens.css`** e, para uso em JS, no objeto **`T`** em **`src/primitives.jsx`**.
- Novas rotas ou áreas: atualizar a tabela da seção 1 e o mapa de títulos em `TopBar` (`src/shell.jsx`).
