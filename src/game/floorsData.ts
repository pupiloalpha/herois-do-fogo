import { FloorData } from './types';

export const FLOORS_DATA: FloorData[] = [
  // ANDAR 1
  {
    floorNumber: 1,
    name: '1º Andar - Térreo & Portaria',
    subtitle: 'Recepção e Entrada Principal',
    themeColor: '#f97316',
    description: 'O fogo começou na fiação da portaria! Apague os focos iniciais, resgate a recepcionista e corte o painel energizado.',
    radioDispatch: 'Central CBMMG: Equipe, fogo detectado no térreo. Muita fumaça na recepção. Neutralize os riscos e avance para a escadaria!',
    width: 1100,
    height: 720,
    playerStart: { x: 100, y: 360 },
    exitDoor: { x: 1000, y: 360 },
    timeLimitSeconds: 90,
    walls: [
      // Outer boundaries
      { x: 0, y: 0, w: 1100, h: 30 },
      { x: 0, y: 690, w: 1100, h: 30 },
      { x: 0, y: 0, w: 30, h: 720 },
      { x: 1070, y: 0, w: 30, h: 720 },
      // Interior partition walls
      { x: 340, y: 30, w: 24, h: 260 },
      { x: 340, y: 430, w: 24, h: 260 },
      { x: 720, y: 160, w: 24, h: 400 },
    ],
    civilians: [
      { id: 'c1_1', name: 'Dona Vera (Recepcionista)', x: 480, y: 180, quote: 'Obrigada bombeiro! Achei que não conseguiria sair!' }
    ],
    pets: [],
    fires: [
      { id: 'f1_1', x: 260, y: 220, size: 'small' },
      { id: 'f1_2', x: 550, y: 520, size: 'medium' },
      { id: 'f1_3', x: 860, y: 340, size: 'small' }
    ],
    gasValves: [],
    electricPanels: [
      { id: 'e1_1', x: 260, y: 80 }
    ],
    refillStations: [
      { id: 'r1_1', x: 500, y: 640 }
    ]
  },

  // ANDAR 2
  {
    floorNumber: 2,
    name: '2º Andar - Escritórios Administrativos',
    subtitle: 'Baias de Trabalho e Copa',
    themeColor: '#ea580c',
    description: 'Curto-circuito na copa atingiu papéis e computadores. Um funcionário está encurralado e ouvimos um miado desesperado!',
    radioDispatch: 'Central: Funcionário relatou que o gatinho mascote do escritório ficou preso na sala de reuniões. Resgate-o com cuidado!',
    width: 1100,
    height: 720,
    playerStart: { x: 100, y: 150 },
    exitDoor: { x: 1000, y: 550 },
    timeLimitSeconds: 100,
    walls: [
      { x: 0, y: 0, w: 1100, h: 30 },
      { x: 0, y: 690, w: 1100, h: 30 },
      { x: 0, y: 0, w: 30, h: 720 },
      { x: 1070, y: 0, w: 30, h: 720 },
      // Partitions
      { x: 360, y: 30, w: 24, h: 320 },
      { x: 360, y: 460, w: 24, h: 230 },
      { x: 700, y: 220, w: 24, h: 470 },
      { x: 520, y: 220, w: 180, h: 24 },
    ],
    civilians: [
      { id: 'c2_1', name: 'Carlos (Analista)', x: 580, y: 120, quote: 'Valha-me Deus! Muito obrigado, Bombeiros!' }
    ],
    pets: [
      { id: 'p2_1', type: 'cat', name: 'Miau (Gato Mascote)', x: 880, y: 140 }
    ],
    fires: [
      { id: 'f2_1', x: 250, y: 460, size: 'medium' },
      { id: 'f2_2', x: 480, y: 350, size: 'small' },
      { id: 'f2_3', x: 780, y: 400, size: 'large' },
      { id: 'f2_4', x: 920, y: 280, size: 'small' },
    ],
    gasValves: [
      { id: 'g2_1', x: 200, y: 640 }
    ],
    electricPanels: [
      { id: 'e2_1', x: 800, y: 80 }
    ],
    refillStations: [
      { id: 'r2_1', x: 420, y: 640 }
    ]
  },

  // ANDAR 3
  {
    floorNumber: 3,
    name: '3º Andar - Cozinha Industrial & Refeitório',
    subtitle: 'Área de Alta Carga Térmica',
    themeColor: '#c2410c',
    description: 'Chamas nas fritadeiras industriais com vazamento em registros de gás GLP! O Chef e seu cão de assistência precisam de ajuda.',
    radioDispatch: 'Atenção redobrada na cozinha! Feche imediatamente as duas válvulas de gás para cessar o combustível das chamas!',
    width: 1100,
    height: 720,
    playerStart: { x: 100, y: 600 },
    exitDoor: { x: 1000, y: 120 },
    timeLimitSeconds: 110,
    walls: [
      { x: 0, y: 0, w: 1100, h: 30 },
      { x: 0, y: 690, w: 1100, h: 30 },
      { x: 0, y: 0, w: 30, h: 720 },
      { x: 1070, y: 0, w: 30, h: 720 },
      { x: 300, y: 180, w: 24, h: 510 },
      { x: 640, y: 30, w: 24, h: 380 },
      { x: 640, y: 500, w: 24, h: 190 },
      { x: 780, y: 300, w: 290, h: 24 },
    ],
    civilians: [
      { id: 'c3_1', name: 'Chef Jean (Cozinheiro Chefe)', x: 860, y: 480, quote: 'Mon Dieu! O gás começou a vazar e tudo explodiu! Obrigado!' }
    ],
    pets: [
      { id: 'p3_1', type: 'dog', name: 'Toby (Cão Guia)', x: 480, y: 320 }
    ],
    fires: [
      { id: 'f3_1', x: 460, y: 140, size: 'large' },
      { id: 'f3_2', x: 540, y: 560, size: 'medium' },
      { id: 'f3_3', x: 780, y: 150, size: 'medium' },
      { id: 'f3_4', x: 920, y: 600, size: 'large' },
      { id: 'f3_5', x: 180, y: 320, size: 'small' }
    ],
    gasValves: [
      { id: 'g3_1', x: 420, y: 80 },
      { id: 'g3_2', x: 500, y: 640 }
    ],
    electricPanels: [
      { id: 'e3_1', x: 180, y: 80 }
    ],
    refillStations: [
      { id: 'r3_1', x: 680, y: 440 }
    ]
  },

  // ANDAR 4
  {
    floorNumber: 4,
    name: '4º Andar - Datacenter & Servidores',
    subtitle: 'Risco Elétrico Classe C',
    themeColor: '#b45309',
    description: 'Equipamentos de alta tensão gerando arcos voltaicos. Desative os disjuntores gerais antes de apagar chamas perto dos racks!',
    radioDispatch: 'Atenção aos painéis energizados! Use o extintor com precisão para não tomar choque elétrico. Há dois engenheiros retidos!',
    width: 1100,
    height: 720,
    playerStart: { x: 100, y: 360 },
    exitDoor: { x: 1000, y: 360 },
    timeLimitSeconds: 115,
    walls: [
      { x: 0, y: 0, w: 1100, h: 30 },
      { x: 0, y: 690, w: 1100, h: 30 },
      { x: 0, y: 0, w: 30, h: 720 },
      { x: 1070, y: 0, w: 30, h: 720 },
      // Server aisles
      { x: 280, y: 120, w: 40, h: 480 },
      { x: 480, y: 120, w: 40, h: 480 },
      { x: 680, y: 120, w: 40, h: 480 },
      { x: 880, y: 120, w: 40, h: 480 },
    ],
    civilians: [
      { id: 'c4_1', name: 'Marina (Engenheira de Redes)', x: 380, y: 220, quote: 'Os servidores superaqueceram! Que alívio ver vocês!' },
      { id: 'c4_2', name: 'Lucas (Técnico de Hardware)', x: 780, y: 520, quote: 'Os no-breaks explodiram! Rápido, vamos sair!' }
    ],
    pets: [],
    fires: [
      { id: 'f4_1', x: 380, y: 460, size: 'medium' },
      { id: 'f4_2', x: 580, y: 200, size: 'large' },
      { id: 'f4_3', x: 580, y: 560, size: 'small' },
      { id: 'f4_4', x: 780, y: 160, size: 'medium' },
      { id: 'f4_5', x: 980, y: 500, size: 'large' }
    ],
    gasValves: [],
    electricPanels: [
      { id: 'e4_1', x: 150, y: 100 },
      { id: 'e4_2', x: 980, y: 100 }
    ],
    refillStations: [
      { id: 'r4_1', x: 150, y: 620 },
      { id: 'r4_2', x: 780, y: 360 }
    ]
  },

  // ANDAR 5
  {
    floorNumber: 5,
    name: '5º Andar - Apartamentos Familiares',
    subtitle: 'Residências e Corredor Central',
    themeColor: '#ea580c',
    description: 'Chamas no corredor dos apartamentos! Uma mãe com seu bebê e uma gatinha persa estão trancadas em quartos tomados por fumaça.',
    radioDispatch: 'Alerta máximo: Vítimas civis vulneráveis no 5º andar. Resgate prioridade total para os moradores e seus animais!',
    width: 1100,
    height: 720,
    playerStart: { x: 100, y: 180 },
    exitDoor: { x: 1000, y: 620 },
    timeLimitSeconds: 120,
    walls: [
      { x: 0, y: 0, w: 1100, h: 30 },
      { x: 0, y: 690, w: 1100, h: 30 },
      { x: 0, y: 0, w: 30, h: 720 },
      { x: 1070, y: 0, w: 30, h: 720 },
      // Apartments partitions
      { x: 30, y: 330, w: 420, h: 24 },
      { x: 560, y: 330, w: 510, h: 24 },
      { x: 440, y: 30, w: 24, h: 180 },
      { x: 440, y: 480, w: 24, h: 210 },
      { x: 760, y: 30, w: 24, h: 190 },
      { x: 760, y: 480, w: 24, h: 210 },
    ],
    civilians: [
      { id: 'c5_1', name: 'Juliana e Bebê Gael', x: 200, y: 160, quote: 'Meu Deus, protejam meu filho! Heróis do corpo de bombeiros, obrigada!' },
      { id: 'c5_2', name: 'Sr. Odair (Morador)', x: 920, y: 160, quote: 'Minha fumaça já estava me sufocando! Grato demais!' }
    ],
    pets: [
      { id: 'p5_1', type: 'cat', name: 'Belinha (Gatinha)', x: 600, y: 560 }
    ],
    fires: [
      { id: 'f5_1', x: 260, y: 520, size: 'large' },
      { id: 'f5_2', x: 490, y: 220, size: 'medium' },
      { id: 'f5_3', x: 500, y: 420, size: 'medium' },
      { id: 'f5_4', x: 700, y: 140, size: 'large' },
      { id: 'f5_5', x: 880, y: 520, size: 'small' }
    ],
    gasValves: [
      { id: 'g5_1', x: 380, y: 80 }
    ],
    electricPanels: [
      { id: 'e5_1', x: 880, y: 80 }
    ],
    refillStations: [
      { id: 'r5_1', x: 100, y: 620 }
    ]
  },

  // ANDAR 6
  {
    floorNumber: 6,
    name: '6º Andar - Andar em Obras & Reforma',
    subtitle: 'Entulhos, Andaimes e Solventes',
    themeColor: '#d97706',
    description: 'Latas de tinta inflamável e fiação solta espalham fogo por todo o chão. Um operário e o cãozinho vira-lata da obra estão encurralados!',
    radioDispatch: 'Cuidado com os solventes! Há fiações desencapadas sobre os andaimes. Desative a energia antes de entrar na área dos fundos.',
    width: 1100,
    height: 720,
    playerStart: { x: 100, y: 550 },
    exitDoor: { x: 1000, y: 180 },
    timeLimitSeconds: 120,
    walls: [
      { x: 0, y: 0, w: 1100, h: 30 },
      { x: 0, y: 690, w: 1100, h: 30 },
      { x: 0, y: 0, w: 30, h: 720 },
      { x: 1070, y: 0, w: 30, h: 720 },
      { x: 260, y: 200, w: 24, h: 490 },
      { x: 520, y: 30, w: 24, h: 460 },
      { x: 780, y: 200, w: 24, h: 490 },
    ],
    civilians: [
      { id: 'c6_1', name: 'Tião (Mestre de Obras)', x: 920, y: 560, quote: 'O tíner pegou faísca e virou um inferno! Valeu, guerreiros de MG!' }
    ],
    pets: [
      { id: 'p6_1', type: 'dog', name: 'Pipoca (Caramelo da Obra)', x: 380, y: 120 }
    ],
    fires: [
      { id: 'f6_1', x: 180, y: 300, size: 'medium' },
      { id: 'f6_2', x: 380, y: 500, size: 'large' },
      { id: 'f6_3', x: 640, y: 200, size: 'large' },
      { id: 'f6_4', x: 650, y: 560, size: 'medium' },
      { id: 'f6_5', x: 920, y: 350, size: 'large' },
      { id: 'f6_6', x: 420, y: 320, size: 'small' }
    ],
    gasValves: [
      { id: 'g6_1', x: 650, y: 80 }
    ],
    electricPanels: [
      { id: 'e6_1', x: 150, y: 80 },
      { id: 'e6_2', x: 900, y: 80 }
    ],
    refillStations: [
      { id: 'r6_1', x: 400, y: 640 },
      { id: 'r6_2', x: 980, y: 640 }
    ]
  },

  // ANDAR 7
  {
    floorNumber: 7,
    name: '7º Andar - Biblioteca & Arquivo Histórico',
    subtitle: 'Material Celulósico de Alta Combustão',
    themeColor: '#b91c1c',
    description: 'Milhares de livros e arquivos antigos alimentam chamas rápidas. A bibliotecária e um pesquisador estão cercados pelas estantes em chamas.',
    radioDispatch: 'O fogo se alastra velozmente pelo papel seco! Use o jato contínuo de água para criar corredor seguro até os reféns!',
    width: 1100,
    height: 720,
    playerStart: { x: 100, y: 360 },
    exitDoor: { x: 1000, y: 360 },
    timeLimitSeconds: 125,
    walls: [
      { x: 0, y: 0, w: 1100, h: 30 },
      { x: 0, y: 690, w: 1100, h: 30 },
      { x: 0, y: 0, w: 30, h: 720 },
      { x: 1070, y: 0, w: 30, h: 720 },
      // Bookcase rows
      { x: 260, y: 90, w: 30, h: 220 },
      { x: 260, y: 410, w: 30, h: 220 },
      { x: 460, y: 90, w: 30, h: 220 },
      { x: 460, y: 410, w: 30, h: 220 },
      { x: 660, y: 90, w: 30, h: 220 },
      { x: 660, y: 410, w: 30, h: 220 },
      { x: 860, y: 90, w: 30, h: 220 },
      { x: 860, y: 410, w: 30, h: 220 },
    ],
    civilians: [
      { id: 'c7_1', name: 'Clara (Bibliotecária Chefe)', x: 560, y: 150, quote: 'Os manuscritos históricos... mas mais importante é a vida! Obrigada!' },
      { id: 'c7_2', name: 'Prof. Alencar (Historiador)', x: 760, y: 550, quote: 'Pensei que era o fim! Vocês são verdadeiros heróis!' }
    ],
    pets: [
      { id: 'p7_1', type: 'cat', name: 'Livrinho (Gato da Biblioteca)', x: 960, y: 150 }
    ],
    fires: [
      { id: 'f7_1', x: 200, y: 200, size: 'large' },
      { id: 'f7_2', x: 360, y: 520, size: 'large' },
      { id: 'f7_3', x: 560, y: 360, size: 'large' },
      { id: 'f7_4', x: 760, y: 180, size: 'large' },
      { id: 'f7_5', x: 920, y: 520, size: 'large' },
      { id: 'f7_6', x: 360, y: 180, size: 'medium' }
    ],
    gasValves: [],
    electricPanels: [
      { id: 'e7_1', x: 150, y: 80 }
    ],
    refillStations: [
      { id: 'r7_1', x: 160, y: 620 },
      { id: 'r7_2', x: 560, y: 620 }
    ]
  },

  // ANDAR 8
  {
    floorNumber: 8,
    name: '8º Andar - Centro Médico & Farmácia',
    subtitle: 'Cilindros de Oxigênio Pressurizados',
    themeColor: '#dc2626',
    description: 'PERIGO: Cilindros de O2 medicinal em risco de detonação! Doutora e paciente idoso com respirador portátil esperam seu socorro.',
    radioDispatch: 'Emergência crítica: Isole os cilindros com jatos contínuos e desligue o quadro principal antes que ocorra explosão!',
    width: 1100,
    height: 720,
    playerStart: { x: 100, y: 150 },
    exitDoor: { x: 1000, y: 550 },
    timeLimitSeconds: 130,
    walls: [
      { x: 0, y: 0, w: 1100, h: 30 },
      { x: 0, y: 690, w: 1100, h: 30 },
      { x: 0, y: 0, w: 30, h: 720 },
      { x: 1070, y: 0, w: 30, h: 720 },
      { x: 320, y: 30, w: 24, h: 350 },
      { x: 320, y: 470, w: 24, h: 220 },
      { x: 680, y: 180, w: 24, h: 510 },
      { x: 500, y: 250, w: 180, h: 24 },
    ],
    civilians: [
      { id: 'c8_1', name: 'Dra. Camila (Médica Plantonista)', x: 520, y: 140, quote: 'Consegui estabilizar o paciente, mas as chamas bloquearam o corredor!' },
      { id: 'c8_2', name: 'Sr. Juvenal (82 anos)', x: 880, y: 460, quote: 'Obrigado meus anjos de farda! Minha respiração voltou ao normal!' }
    ],
    pets: [
      { id: 'p8_1', type: 'dog', name: 'Rex (Cão Terapêutico)', x: 880, y: 220 }
    ],
    fires: [
      { id: 'f8_1', x: 220, y: 450, size: 'large' },
      { id: 'f8_2', x: 440, y: 480, size: 'large' },
      { id: 'f8_3', x: 520, y: 600, size: 'medium' },
      { id: 'f8_4', x: 800, y: 180, size: 'large' },
      { id: 'f8_5', x: 920, y: 620, size: 'large' },
      { id: 'f8_6', x: 220, y: 180, size: 'medium' }
    ],
    gasValves: [
      { id: 'g8_1', x: 420, y: 80 },
      { id: 'g8_2', x: 600, y: 640 }
    ],
    electricPanels: [
      { id: 'e8_1', x: 780, y: 80 }
    ],
    refillStations: [
      { id: 'r8_1', x: 150, y: 620 },
      { id: 'r8_2', x: 740, y: 440 }
    ]
  },

  // ANDAR 9
  {
    floorNumber: 9,
    name: '9º Andar - Cobertura Executiva & Salão VIP',
    subtitle: 'Incêndio Generalizado nas Suítes',
    themeColor: '#991b1b',
    description: 'O fogo se espalhou pelo carpete de luxo e cortinas! Feche as duas tubulações de gás e resgate os moradores antes que a laje desabe.',
    radioDispatch: 'Apenas mais um andar até o topo! A laje superior está aquecendo muito. Resgate rápido e suba imediatamente para o heliporto!',
    width: 1100,
    height: 720,
    playerStart: { x: 100, y: 550 },
    exitDoor: { x: 1000, y: 180 },
    timeLimitSeconds: 135,
    walls: [
      { x: 0, y: 0, w: 1100, h: 30 },
      { x: 0, y: 690, w: 1100, h: 30 },
      { x: 0, y: 0, w: 30, h: 720 },
      { x: 1070, y: 0, w: 30, h: 720 },
      { x: 280, y: 180, w: 24, h: 510 },
      { x: 580, y: 30, w: 24, h: 380 },
      { x: 580, y: 500, w: 24, h: 190 },
      { x: 780, y: 180, w: 24, h: 510 },
    ],
    civilians: [
      { id: 'c9_1', name: 'Eduardo (Empresário)', x: 420, y: 160, quote: 'Fiquei preso com o fogo na porta! Obrigado, vocês salvaram minha vida!' },
      { id: 'c9_2', name: 'Beatriz (Arquiteta)', x: 920, y: 550, quote: 'Vamos todos para o heliporto no terraço!' }
    ],
    pets: [
      { id: 'p9_1', type: 'cat', name: 'Princesa (Gata Siamesa)', x: 420, y: 550 },
      { id: 'p9_2', type: 'dog', name: 'Thor (Golden Retriever)', x: 920, y: 350 }
    ],
    fires: [
      { id: 'f9_1', x: 200, y: 300, size: 'large' },
      { id: 'f9_2', x: 420, y: 360, size: 'large' },
      { id: 'f9_3', x: 680, y: 200, size: 'large' },
      { id: 'f9_4', x: 680, y: 520, size: 'large' },
      { id: 'f9_5', x: 880, y: 180, size: 'large' },
      { id: 'f9_6', x: 980, y: 400, size: 'medium' },
      { id: 'f9_7', x: 480, y: 600, size: 'medium' }
    ],
    gasValves: [
      { id: 'g9_1', x: 420, y: 80 },
      { id: 'g9_2', x: 950, y: 80 }
    ],
    electricPanels: [
      { id: 'e9_1', x: 150, y: 80 },
      { id: 'e9_2', x: 680, y: 640 }
    ],
    refillStations: [
      { id: 'r9_1', x: 150, y: 300 },
      { id: 'r9_2', x: 840, y: 640 }
    ]
  },

  // ANDAR 10 - FINAL / HELIPORTO
  {
    floorNumber: 10,
    name: '10º Andar - O Terraço & Heliporto do Resgate',
    subtitle: 'Evacuação Aérea pelo Helicóptero CBMMG',
    themeColor: '#7f1d1d',
    description: 'MISSÃO FINAL: O helicóptero do Corpo de Bombeiros pousou no centro do terraço! O fogo ameaça a aeronave. Corte o gerador central, apague as chamas ao redor do heliponto e resgate as últimas vítimas!',
    radioDispatch: 'Central para Foguinho e Faísca: Helicóptero Águia no heliponto pronto para resgate! Contenham o fogo do terraço e evacuem todos com honra!',
    width: 1100,
    height: 720,
    playerStart: { x: 120, y: 360 },
    exitDoor: { x: 600, y: 360 }, // Helicopter located at center (x: 600, y: 360)
    timeLimitSeconds: 150,
    walls: [
      { x: 0, y: 0, w: 1100, h: 30 },
      { x: 0, y: 690, w: 1100, h: 30 },
      { x: 0, y: 0, w: 30, h: 720 },
      { x: 1070, y: 0, w: 30, h: 720 },
      // Parapet wind walls
      { x: 260, y: 140, w: 24, h: 160 },
      { x: 260, y: 420, w: 24, h: 160 },
      { x: 880, y: 140, w: 24, h: 160 },
      { x: 880, y: 420, w: 24, h: 160 },
    ],
    civilians: [
      { id: 'c10_1', name: 'Comandante Moreira (Síndico)', x: 920, y: 220, quote: 'Vocês salvaram todo o edifício! Honra ao Corpo de Bombeiros Militar de MG!' },
      { id: 'c10_2', name: 'Dona Helena (Moradora do 10º)', x: 920, y: 520, quote: 'O helicóptero está aqui! Estamos salvos, graças a Deus e a vocês!' }
    ],
    pets: [
      { id: 'p10_1', type: 'dog', name: 'Faísca Jr. (Mascote do Prédio)', x: 380, y: 220 },
      { id: 'p10_2', type: 'cat', name: 'Valente (Gato Guerreiro)', x: 380, y: 520 }
    ],
    fires: [
      { id: 'f10_1', x: 420, y: 160, size: 'large' },
      { id: 'f10_2', x: 740, y: 160, size: 'large' },
      { id: 'f10_3', x: 420, y: 560, size: 'large' },
      { id: 'f10_4', x: 740, y: 560, size: 'large' },
      { id: 'f10_5', x: 200, y: 360, size: 'large' },
      { id: 'f10_6', x: 980, y: 360, size: 'large' },
      { id: 'f10_7', x: 600, y: 160, size: 'large' },
      { id: 'f10_8', x: 600, y: 560, size: 'large' }
    ],
    gasValves: [
      { id: 'g10_1', x: 220, y: 80 },
      { id: 'g10_2', x: 920, y: 640 }
    ],
    electricPanels: [
      { id: 'e10_1', x: 220, y: 640 },
      { id: 'e10_2', x: 920, y: 80 }
    ],
    refillStations: [
      { id: 'r10_1', x: 140, y: 180 },
      { id: 'r10_2', x: 140, y: 540 }
    ]
  }
];
