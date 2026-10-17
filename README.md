# 🚒 Heróis do Fogo: Missão 10 Andares

[![PWA Ready](https://img.shields.io/badge/PWA-100%25%20Offline-orange?logo=pwa)](https://developer.mozilla.org/pt-BR/docs/Web/Progressive_web_apps)
[![Phaser.js](https://img.shields.io/badge/Engine-Phaser%203-red?logo=phaser)](https://phaser.io/)
[![React](https://img.shields.io/badge/Framework-React%2019-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/Language-TypeScript%205-3178c6?logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Styles-Tailwind%20v4-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)

> **Jogo arcade 2D de resgate vertical e combate a incêndio em HTML5**, jogável diretamente no navegador em computadores e dispositivos móveis, com suporte completo a **PWA (Progressive Web App)** para funcionamento 100% offline.

Inspirado nas diretrizes e fardamentos operacionais do **Corpo de Bombeiros Militar de Minas Gerais (CBMMG)**.

---

## 📖 Sobre o Jogo

Em **Heróis do Fogo**, um edifício corporativo e residencial sofreu um grave incêndio estrutural que teve início no térreo. O jogador assume o papel de um bravo bombeiro militar e deve subir andar por andar (do **1º ao 10º andar**) cumprindo missões críticas para conter a tragédia e evacuar todos com segurança até o helicóptero de resgate no heliponto da cobertura!

### 🎯 As 5 Missões Fundamentais em Cada Andar:
1. **🧯 Combater Focos de Incêndio**: Use o esguicho pressurizado de água/espuma para sufocar chamas de pequeno, médio e grande porte.
2. **🤝 Resgatar Civis**: Salve recepcionistas, analistas, chefs de cozinha, famílias com crianças e médicos encurralados pela fumaça.
3. **🐾 Salvar Animais de Estimação**: Resgate cães guia, gatinhos mascotes e animais domésticos presos nas salas.
4. **⚠️ Fechar Registros de Gás GLP**: Estanque vazamentos de gás combustível em copas e cozinhas industriais para evitar reignição e explosões.
5. **⚡ Desligar Painéis Elétricos Energizados**: Desarme disjuntores e quadros de alta tensão que estejam gerando arcos voltaicos perigosos.

---

## 🧑‍🚒 Escolha de Personagens

O jogo oferece dois bombeiros jogáveis, cada um com atributos únicos de resistência e velocidade baseados em seus designs e fardas:

| Bombeiro | Farda & Acessórios | Atributo Especial | Velocidade | Vida / Defesa |
| :--- | :--- | :--- | :--- | :--- |
| **Foguinho** (Masculino) | Traje de combate térmico cáqui com faixas reflexivas e capacete amarelo de combate com brasão CBMMG. | **Resistência Máxima**: Tanque de extintor ampliado e **-45% de dano** por calor e contato com chamas. | 195 km/h (Firme) | 135 HP / Alta Resistência |
| **Faísca** (Feminino) | Farda operacional laranja vibrante com faixas prata refletivas, trança elegante e boné tático CBMMG. | **Agilidade Suprema**: **+31% mais rápida** no deslocamento e velocidade acelerada no resgate de vítimas e animais. | 255 km/h (Veloz) | 100 HP / Resgate Ágil |

---

## 🏢 Os 10 Andares do Edifício

1. **1º Andar — Térreo & Portaria**: Curto na fiação da recepção. Resgate da recepcionista e corte do painel de entrada.
2. **2º Andar — Escritórios Administrativos**: Chamas em baias de computadores. Resgate de funcionário e do gatinho mascote.
3. **3º Andar — Cozinha Industrial & Refeitório**: Incêndio com gordura e óleo. Fechamento de registros duplos de gás GLP e socorro ao Chef e cão de assistência.
4. **4º Andar — Datacenter & Servidores**: Risco elétrico Classe C. Desarme de disjuntores de alta tensão e resgate dos engenheiros de TI.
5. **5º Andar — Apartamentos Familiares**: Corredor de fumaça densa. Resgate prioritário de mãe com bebê, moradores e animais.
6. **6º Andar — Andar em Reforma**: Latas de solvente e tíner. Desobstrução de caminhos e socorro ao mestre de obras e ao cãozinho da obra.
7. **7º Andar — Biblioteca & Arquivo**: Propagação acelerada em papel seco e estantes. Criação de corredores de água para salvar a bibliotecária.
8. **8º Andar — Centro Médico & Farmácia**: Cilindros de O2 medicinal em risco de superaquecimento. Resfriamento preventivo e resgate de idoso com respirador.
9. **9º Andar — Cobertura Executiva**: Incêndio generalizado em carpetes e cortinas. Fechamento da tubulação principal de gás.
10. **10º Andar — O Terraço & Heliporto do Resgate**: A grande missão final! O helicóptero de resgate pousou no heliponto. Elimine todos os focos do terraço e evacue todos os sobreviventes a bordo da aeronave!

---

## 🎮 Controles

### No Computador (Teclado)
- **W, A, S, D** ou **Setas do Teclado**: Movimentar o bombeiro.
- **Barra de Espaço**: Acionar o extintor / jato pressurizado de água.
- **E** ou **Enter**: Interagir / Salvar pessoas / Resgatar animais / Fechar válvulas de gás / Desligar painéis.
- **Shift**: Correr rápido (Sprint).
- **Esc** ou **P**: Pausar o jogo.

### No Celular e Tablet (Toque na Tela)
- **Joystick Virtual (Polegar Esquerdo)**: Movimentação analógica em 360°.
- **Botão Laranja [🧯 EXTINGUIR] (Polegar Direito)**: Jato contínuo com mira assistida e buffer de rajada mínima.
- **Botão Verde [🤝 SALVAR]**: Resgate e interação com objetos ao redor.
- **Botão Amarelo [⚡ CORRER]**: Corrida com velocidade ampliada.

---

## ⚙️ Tecnologias Utilizadas

- **[Phaser.js 3](https://phaser.io/)**: Motor principal da física Arcade 2D, renderização 60 FPS, gerenciamento de partículas (espuma, água, fogo, fumaça, faíscas) e detecção de colisões.
- **[React 19](https://react.dev/) & [TypeScript](https://www.typescriptlang.org/)**: Camada de interface, modais reativos com rolagem vertical suave e gerenciamento de estado desacoplado do game loop.
- **[Vite 8](https://vite.dev/) & [Tailwind CSS v4](https://tailwindcss.com/)**: Bundling ultrarrápido com estilização moderna, responsiva e suporte a telas pequenas (`dvh`, safe area insets).
- **[Vite Plugin PWA](https://vite-pwa-org.netlify.app/)**: Configuração de Service Workers via Workbox para precache integral de scripts e assets, permitindo jogar sem conexão à internet.
- **Web Audio API Procedural**: Sintetizador sonoro integrado em tempo real (sem necessidade de carregar arquivos externos de áudio .mp3/.wav):
  - Som de chiado de água sob alta pressão.
  - Estalo característico de chamas sendo sufocadas.
  - Miados de gatos e latidos de cães.
  - Válvula mecânica de gás e disjuntor elétrico estalando.
  - Fanfarras heróicas de vitória e alarme sonoro.
- **Sprites Vetoriais Procedurais (HTML5 Canvas 2D)**: Texturas desenhadas em tempo de carregamento com zero latência de rede e nitidez máxima em telas Retina/High-DPI.

---

## 🚀 Como Executar Localmente

### Pré-requisitos
- **Node.js** (versão 20 ou superior recomendada)
- **npm** ou **bun**

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/seu-usuario/herois-do-fogo.git
cd herois-do-fogo
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

4. Abra no seu navegador:
```
http://localhost:3000
```

### Compilação de Produção
Para gerar os arquivos otimizados prontos para deploy estático (GitHub Pages, Vercel, Netlify ou Firebase Hosting):
```bash
npm run build
```

Para pré-visualizar a build de produção:
```bash
npm run preview
```

---

## 📲 Instalação como App (PWA)

O jogo pode ser instalado como um aplicativo nativo diretamente pelo navegador:

- **Android (Google Chrome)**: Clique no botão **"Instalar App PWA"** na tela inicial do jogo ou toque nos três pontinhos do navegador e selecione *"Instalar aplicativo"*.
- **iOS (Safari no iPhone/iPad)**: Toque no botão de **Compartilhar** (ícone quadrado com seta para cima) na barra inferior do Safari, role a lista e selecione **"Adicionar à Tela de Início"**.
- **Desktop (Chrome/Edge)**: Clique no ícone de instalação na barra de endereços do navegador.

Uma vez instalado, o jogo abre em tela cheia (modo *standalone*) sem barras de navegação e continua funcionando mesmo em modo avião ou sem sinal de internet!

---

## 📱 Prevenção de Barras do Navegador (Sem Instalar o PWA)

Se o usuário jogar diretamente no navegador sem instalar o app, implementamos 4 soluções combinadas para garantir que nenhuma barra de navegação ou URL cubra elementos do jogo:

1. **⛶ Modo Tela Cheia (Fullscreen API)**:
   - Botão **[⛶ Tela Cheia]** disponível na tela inicial, no topo do HUD e no menu de pausa.
   - Em navegadores Android (Chrome, Samsung Internet, Edge, Firefox) e Desktop, um único toque oculta completamente a barra de endereços, guias e barra de navegação inferior do sistema.
   - Ao iniciar a partida no celular, o jogo solicita automaticamente o modo tela cheia.

2. **📐 Sincronização Dinâmica com `window.visualViewport`**:
   - O jogo monitora a altura visível real da tela (`visualViewport.height`) e ajusta variáveis CSS (`--app-height`) e a escala do canvas do Phaser em tempo real.
   - Mesmo que as barras do navegador expandam ou recolham, nada na tela é cortado ou empurrado para fora da visão.

3. **↕ Botão de Elevação dos Controles [▲ Elevar]**:
   - Na parte inferior central da tela, o jogador pode tocar em **[▲ Elevar]** para levantar o joystick virtual e os botões de ação caso a barra inferior do navegador do celular seja espessa.
   - O jogo ativa automaticamente uma margem de segurança extra (`safe-area-inset-bottom + 26px`) quando detecta que não está em modo standalone.

4. **🍎 Guia Prático para iOS Safari**:
   - Como a Apple restringe a API de Fullscreen em abas normais do Safari no iPhone, o jogo exibe um modal ilustrado ensinando a tocar em **Compartilhar (quadrado com seta) ➔ Adicionar à Tela de Início**, criando o ícone que abre o jogo em tela cheia definitiva sem nenhuma barra do Safari.

---

## 🦺 Dicas de Segurança e Prevenção do CBMMG

Em situações reais de emergência com incêndio:
- 🚨 **Disque 193**: Acione imediatamente o Corpo de Bombeiros Militar.
- 🚫 **Nunca use elevadores**: Em caso de fogo, os elevadores podem parar por corte elétrico ou se tornar condutos de fumaça. Use sempre as **escadas de emergência**.
- 💨 **Rasteje sob a fumaça**: Os gases tóxicos e o calor sobem; o ar respirável fica próximo ao chão.
- 🧯 **Conheça o extintor certo**:
  - **Água (Classe A)**: Apenas para madeira, papel e tecidos. **NUNCA jogue água em fios energizados (Classe C) nem em óleo quente (Classe K)**!
  - **Pó Químico / CO2 (Classes B e C)**: Para líquidos inflamáveis e equipamentos elétricos.
- ⚠️ **Feche o registro de gás**: Em caso de cheiro de gás, não acenda luzes nem fósforos; ventile o ambiente e feche a válvula imediatamente.

---

## 📄 Licença

Este projeto é desenvolvido para fins educativos e recreativos sob a licença **Apache 2.0**.
Homenagem aos valorosos profissionais do **Corpo de Bombeiros Militar de Minas Gerais (CBMMG)**.
