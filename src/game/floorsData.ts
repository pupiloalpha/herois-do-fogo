import { FloorData } from './types';

export const FLOORS_DATA: FloorData[] = [
  // ANDAR 1 - RECEPÇÃO & PORTARIA
  {
    floorNumber: 1,
    name: '1º Andar - Térreo & Portaria',
    subtitle: 'Recepção e Entrada Principal',
    themeColor: '#f97316',
    floorTileColor: '#e2d9cd',
    wallColor: '#3b170b',
    description: 'O fogo começou na fiação da portaria! Apague os focos iniciais, resgate a recepcionista Dona Vera e desarme o painel elétrico.',
    radioDispatch: 'Central CBMMG: Equipe, fogo detectado no térreo. Muita fumaça na recepção. Neutralize os riscos e avance para a escadaria!',
    width: 1100,
    height: 720,
    playerStart: { x: 100, y: 360 },
    exitDoor: { x: 1000, y: 360 },
    timeLimitSeconds: 90,
    walls: [
      { x: 0, y: 0, w: 1100, h: 30 },
      { x: 0, y: 690, w: 1100, h: 30 },
      { x: 0, y: 0, w: 30, h: 720 },
      { x: 1070, y: 0, w: 30, h: 720 },
      { x: 340, y: 30, w: 24, h: 260 },
      { x: 340, y: 430, w: 24, h: 260 },
      { x: 720, y: 160, w: 24, h: 400 },
    ],
    civilians: [
      { id: 'c1_1', name: 'Dona Vera (Recepcionista)', x: 480, y: 180, quote: 'Obrigada bombeiro! Achei que não conseguiria sair!', spriteType: 'civilian_receptionist' }
    ],
    pets: [
      { id: 'p1_1', type: 'cat', name: 'Nina (Gata Tricolor da Portaria)', x: 780, y: 180, spriteType: 'pet_cat_calico' }
    ],
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

  // ANDAR 2 - ESCRITÓRIOS ADMINISTRATIVOS
  {
    floorNumber: 2,
    name: '2º Andar - Escritórios Administrativos',
    subtitle: 'Baias Corporativas e Copa',
    themeColor: '#3b82f6',
    floorTileColor: '#1e3a8a',
    wallColor: '#334155',
    description: 'Curto-circuito na copa atingiu papéis e computadores. Um analista e o estagiário estão encurralados e ouvimos o gatinho mascote miando!',
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
      { x: 360, y: 30, w: 24, h: 320 },
      { x: 360, y: 460, w: 24, h: 230 },
      { x: 700, y: 220, w: 24, h: 470 },
      { x: 520, y: 220, w: 180, h: 24 },
    ],
    civilians: [
      { id: 'c2_1', name: 'Carlos (Analista Financeiro)', x: 580, y: 120, quote: 'Valha-me Deus! Muito obrigado, Bombeiros!', spriteType: 'civilian_analyst' },
      { id: 'c2_2', name: 'Pedro (Estagiário com Mochila)', x: 380, y: 550, quote: 'O fogo bloqueou o corredor de saída! Obrigado!', spriteType: 'civilian_student' }
    ],
    pets: [
      { id: 'p2_1', type: 'cat', name: 'Miau (Gato Mascote)', x: 880, y: 140, spriteType: 'pet_cat_ginger' }
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

  // ANDAR 3 - COZINHA INDUSTRIAL & REFEITÓRIO
  {
    floorNumber: 3,
    name: '3º Andar - Cozinha Industrial & Refeitório',
    subtitle: 'Área de Alta Carga Térmica & GLP',
    themeColor: '#ef4444',
    floorTileColor: '#991b1b',
    wallColor: '#7f1d1d',
    description: 'Chamas nas fritadeiras industriais com vazamento em registros de gás GLP! O Chef Jean e seu cão guia Toby esperam ajuda.',
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
      { id: 'c3_1', name: 'Chef Jean (Cozinheiro Chefe)', x: 860, y: 480, quote: 'Mon Dieu! O gás começou a vazar e tudo explodiu! Obrigado!', spriteType: 'civilian_chef' }
    ],
    pets: [
      { id: 'p3_1', type: 'dog', name: 'Toby (Cão Guia Dálmata)', x: 480, y: 320, spriteType: 'pet_dog_dalmatian' }
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

  // ANDAR 4 - DATACENTER & SERVIDORES
  {
    floorNumber: 4,
    name: '4º Andar - Datacenter & Servidores',
    subtitle: 'Risco Elétrico Classe C & No-Breaks',
    themeColor: '#06b6d4',
    floorTileColor: '#1e293b',
    wallColor: '#090d16',
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
      { x: 280, y: 120, w: 40, h: 480 },
      { x: 480, y: 120, w: 40, h: 480 },
      { x: 680, y: 120, w: 40, h: 480 },
      { x: 880, y: 120, w: 40, h: 480 },
    ],
    civilians: [
      { id: 'c4_1', name: 'Mariana (Engenheira de TI)', x: 380, y: 220, quote: 'Os servidores superaqueceram! Que alívio ver vocês!', spriteType: 'civilian_it' },
      { id: 'c4_2', name: 'Lucas (SysAdmin)', x: 780, y: 520, quote: 'Os no-breaks explodiram! Rápido, vamos sair!', spriteType: 'civilian_analyst' }
    ],
    pets: [
      { id: 'p4_1', type: 'cat', name: 'Bit (Gato Preto do Datacenter)', x: 580, y: 360, spriteType: 'pet_cat_black' }
    ],
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

  // ANDAR 5 - APARTAMENTOS FAMILIARES
  {
    floorNumber: 5,
    name: '5º Andar - Apartamentos Familiares',
    subtitle: 'Residências e Corredor Central',
    themeColor: '#10b981',
    floorTileColor: '#065f46',
    wallColor: '#14532d',
    description: 'Chamas no corredor dos apartamentos! Uma mãe com seu bebê e uma gatinha siamesa estão trancadas em quartos com muita fumaça.',
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
      { x: 30, y: 330, w: 420, h: 24 },
      { x: 560, y: 330, w: 510, h: 24 },
      { x: 440, y: 30, w: 24, h: 180 },
      { x: 440, y: 480, w: 24, h: 210 },
      { x: 760, y: 30, w: 24, h: 190 },
      { x: 760, y: 480, w: 24, h: 210 },
    ],
    civilians: [
      { id: 'c5_1', name: 'Dona Helena e Bebê Gael', x: 200, y: 160, quote: 'Meu Deus, protejam meu filho! Heróis do corpo de bombeiros, obrigada!', spriteType: 'civilian_family' },
      { id: 'c5_2', name: 'Vovô Silveira (Aposentado)', x: 920, y: 160, quote: 'A fumaça já estava me sufocando! Grato demais!', spriteType: 'civilian_elderly' }
    ],
    pets: [
      { id: 'p5_1', type: 'cat', name: 'Luna (Gatinha Siamesa)', x: 600, y: 560, spriteType: 'pet_cat_siamese' },
      { id: 'p5_2', type: 'cat', name: 'Pipoca (Coelhinho Branco)', x: 200, y: 560, spriteType: 'pet_bunny' }
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

  // ANDAR 6 - OBRAS & REFORMA
  {
    floorNumber: 6,
    name: '6º Andar - Andar em Obras & Reforma',
    subtitle: 'Entulhos, Andaimes e Solventes',
    themeColor: '#eab308',
    floorTileColor: '#3f3f46',
    wallColor: '#52525b',
    description: 'Latas de tinta inflamável e fiação solta espalham fogo por todo o chão. Mestre Tonho e o cãozinho vira-lata Caramelo da obra estão encurralados!',
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
      { id: 'c6_1', name: 'Mestre Tonho (Encarregado da Obra)', x: 920, y: 560, quote: 'O tíner pegou faísca e virou um inferno! Valeu, guerreiros de MG!', spriteType: 'civilian_builder' }
    ],
    pets: [
      { id: 'p6_1', type: 'dog', name: 'Caramelo (Cão Mascote da Obra)', x: 380, y: 120, spriteType: 'pet_dog_caramelo' }
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

  // ANDAR 7 - BIBLIOTECA & ARQUIVO
  {
    floorNumber: 7,
    name: '7º Andar - Biblioteca & Arquivo Histórico',
    subtitle: 'Madeira Maciça & Livros Raros',
    themeColor: '#a855f7',
    floorTileColor: '#572c05',
    wallColor: '#581c87',
    description: 'Milhares de livros e arquivos antigos alimentam chamas rápidas. A bibliotecária Profª Lúcia e a arara de estimação Loro estão cercados!',
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
      { id: 'c7_1', name: 'Profª Lúcia (Bibliotecária Chefe)', x: 560, y: 150, quote: 'Os manuscritos históricos... mas mais importante é a vida! Obrigada!', spriteType: 'civilian_librarian' },
      { id: 'c7_2', name: 'Prof. Alencar (Pesquisador)', x: 760, y: 550, quote: 'Pensei que era o fim! Vocês são verdadeiros heróis!', spriteType: 'civilian_elderly' }
    ],
    pets: [
      { id: 'p7_1', type: 'bird', name: 'Loro (Arara de Estimação)', x: 960, y: 150, spriteType: 'pet_bird_arara' }
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

  // ANDAR 8 - CENTRO MÉDICO & FARMÁCIA
  {
    floorNumber: 8,
    name: '8º Andar - Centro Médico & Farmácia',
    subtitle: 'Cilindros de Oxigênio Pressurizados',
    themeColor: '#14b8a6',
    floorTileColor: '#115e59',
    wallColor: '#134e4a',
    description: 'PERIGO: Cilindros de O2 medicinal em risco de superaquecer! O Dr. Marcos, um paciente idoso e um cãozinho poodle esperam seu socorro.',
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
      { id: 'c8_1', name: 'Dr. Marcos (Médico Plantonista)', x: 520, y: 140, quote: 'Consegui estabilizar o paciente, mas as chamas bloquearam o corredor!', spriteType: 'civilian_doctor' },
      { id: 'c8_2', name: 'Dona Neusa (Paciente Idosa)', x: 880, y: 460, quote: 'Obrigada meus anjos de farda! Minha respiração voltou ao normal!', spriteType: 'civilian_elderly' }
    ],
    pets: [
      { id: 'p8_1', type: 'dog', name: 'Floquinho (Poodle Terapêutico)', x: 880, y: 220, spriteType: 'pet_dog_poodle' }
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

  // ANDAR 9 - COBERTURA EXECUTIVA
  {
    floorNumber: 9,
    name: '9º Andar - Cobertura Executiva & Salão VIP',
    subtitle: 'Incêndio Generalizado nas Suítes Presidenciais',
    themeColor: '#8b5cf6',
    floorTileColor: '#4c1d95',
    wallColor: '#3b0764',
    description: 'O fogo se espalhou pelo carpete de luxo e cortinas! Feche as duas tubulações de gás e resgate o Diretor Roberto e seus animais antes que a laje desabe.',
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
      { id: 'c9_1', name: 'Diretor Roberto (CEO)', x: 420, y: 160, quote: 'Fiquei preso com o fogo na porta! Obrigado, vocês salvaram minha vida!', spriteType: 'civilian_vip' },
      { id: 'c9_2', name: 'Beatriz (Secretária Executiva)', x: 920, y: 550, quote: 'Vamos todos para o heliporto no terraço!', spriteType: 'civilian_receptionist' }
    ],
    pets: [
      { id: 'p9_1', type: 'cat', name: 'Princesa (Gata Siamesa VIP)', x: 420, y: 550, spriteType: 'pet_cat_siamese' },
      { id: 'p9_2', type: 'dog', name: 'Paçoca (Pug de Estimação)', x: 920, y: 350, spriteType: 'pet_dog_pug' }
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

  // ANDAR 10 - TERRAÇO & HELIPORTO (GRANDE FINAL)
  {
    floorNumber: 10,
    name: '10º Andar - O Terraço & Heliporto do Resgate',
    subtitle: 'Evacuação Aérea pelo Helicóptero Águia CBMMG',
    themeColor: '#f59e0b',
    floorTileColor: '#18181b',
    wallColor: '#27272a',
    description: 'MISSÃO FINAL: O helicóptero do Corpo de Bombeiros pousou no centro do terraço! O fogo ameaça a aeronave. Corte a energia, apague as chamas ao redor do heliponto e resgate as últimas vítimas!',
    radioDispatch: 'Central para Foguinho e Faísca: Helicóptero Águia no heliponto pronto para resgate! Contenham o fogo do terraço e evacuem todos com honra!',
    width: 1100,
    height: 720,
    playerStart: { x: 120, y: 360 },
    exitDoor: { x: 600, y: 360 },
    timeLimitSeconds: 150,
    walls: [
      { x: 0, y: 0, w: 1100, h: 30 },
      { x: 0, y: 690, w: 1100, h: 30 },
      { x: 0, y: 0, w: 30, h: 720 },
      { x: 1070, y: 0, w: 30, h: 720 },
      { x: 260, y: 140, w: 24, h: 160 },
      { x: 260, y: 420, w: 24, h: 160 },
      { x: 880, y: 140, w: 24, h: 160 },
      { x: 880, y: 420, w: 24, h: 160 },
    ],
    civilians: [
      { id: 'c10_1', name: 'Comandante Moreira (Síndico Geral)', x: 920, y: 220, quote: 'Vocês salvaram todo o edifício! Honra ao Corpo de Bombeiros Militar de MG!', spriteType: 'civilian_builder' },
      { id: 'c10_2', name: 'Dona Helena (Moradora)', x: 920, y: 520, quote: 'O helicóptero está aqui! Estamos salvos, graças a Deus e a vocês!', spriteType: 'civilian_family' }
    ],
    pets: [
      { id: 'p10_1', type: 'dog', name: 'Brasa (Cão Mascote Bombeiro)', x: 380, y: 220, spriteType: 'pet_dog_dalmatian' },
      { id: 'p10_2', type: 'cat', name: 'Valente (Gato Guerreiro)', x: 380, y: 520, spriteType: 'pet_cat_black' }
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
