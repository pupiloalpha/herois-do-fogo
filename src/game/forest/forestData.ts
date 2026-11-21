import { ForestSectorData } from './forestTypes';

export const FOREST_SECTORS: ForestSectorData[] = [
  {
    sectorNumber: 1,
    name: 'Clareira da Portaria',
    subtitle: 'Setor 1 · Primeiros Focos',
    description:
      'Um incêndio rasteiro começou próximo à entrada do parque. Use o Abafador (2) ou Bomba d\'Água (3) nos focos, abra aceiros com a Enxada (1) e resgate o Tatu e o Tucano!',
    radioDispatch:
      'Atenção equipe: foco inicial na clareira sul! Vento leve para Leste. Resgatem os animais silvestres antes que as chamas alcancem o bosque.',
    cols: 20,
    rows: 14,
    tileSize: 48,
    playerStart: { col: 2, row: 7 },
    windDirection: 'E',
    windStrength: 1.0,
    timeLimitSeconds: 115,
    maxBurnPercent: 65,
    spreadIntervalMs: 3600,
    streams: [
      { col: 2, row: 11, w: 3, h: 2 },
    ],
    rocks: [
      { col: 7, row: 3, w: 2, h: 1 },
      { col: 14, row: 10, w: 2, h: 1 },
    ],
    treeZones: [
      { col: 14, row: 2, w: 4, h: 4 },
      { col: 15, row: 8, w: 3, h: 4 },
    ],
    bushZones: [
      { col: 6, row: 5, w: 3, h: 3 },
      { col: 10, row: 7, w: 3, h: 3 },
    ],
    initialFires: [
      { col: 9, row: 6, intensity: 1 },
      { col: 10, row: 7, intensity: 1 },
      { col: 12, row: 4, intensity: 1 },
    ],
    wildlife: [
      { id: 'w1_tatu', species: 'tatu', name: 'Tatu-Canastra', col: 12, row: 10 },
      { id: 'w1_tucano', species: 'tucano', name: 'Tucano-Toco', col: 16, row: 4 },
    ],
    hikers: [],
  },
  {
    sectorNumber: 2,
    name: 'Trilha das Nascentes',
    subtitle: 'Setor 2 · Contenção por Aceiros',
    description:
      'O vento empurra as chamas rumo às árvores antigas. Use a Enxada (1) para abrir um aceiro de terra na frente do fogo e salve o Lobo-Guará e o Tamanduá!',
    radioDispatch:
      'Foco avançando para Nordeste! Abram aceiros entre o capim seco e a mata ciliar. Há fauna presa perto da nascente!',
    cols: 22,
    rows: 15,
    tileSize: 48,
    playerStart: { col: 2, row: 11 },
    windDirection: 'NE',
    windStrength: 1.15,
    timeLimitSeconds: 120,
    maxBurnPercent: 62,
    spreadIntervalMs: 3400,
    streams: [
      { col: 2, row: 3, w: 3, h: 2 },
      { col: 17, row: 12, w: 3, h: 2 },
    ],
    rocks: [
      { col: 8, row: 8, w: 2, h: 2 },
      { col: 14, row: 5, w: 2, h: 1 },
    ],
    treeZones: [
      { col: 14, row: 2, w: 6, h: 4 },
      { col: 4, row: 2, w: 4, h: 3 },
    ],
    bushZones: [
      { col: 6, row: 10, w: 4, h: 3 },
      { col: 12, row: 7, w: 4, h: 3 },
    ],
    initialFires: [
      { col: 7, row: 11, intensity: 1 },
      { col: 9, row: 10, intensity: 1 },
      { col: 13, row: 8, intensity: 1 },
    ],
    wildlife: [
      { id: 'w2_lobo', species: 'lobo_guara', name: 'Lobo-Guará', col: 17, row: 4 },
      { id: 'w2_tamandua', species: 'tamandua', name: 'Tamanduá-Bandeira', col: 11, row: 4 },
    ],
    hikers: [
      { id: 'h2_1', name: 'Guia Ambiental', col: 18, row: 9, quote: 'Obrigado! A fumaça fechou a trilha principal!' },
    ],
  },
  {
    sectorNumber: 3,
    name: 'Campo Seco da Serra',
    subtitle: 'Setor 3 · Fogo Rasteiro Veloz',
    description:
      'Vegetação seca queima rápido! Alterne entre o Abafador (2) para economizar água nos focos pequenos e a Enxada (1) para cortar o avanço.',
    radioDispatch:
      'Atenção: capim muito seco! Use o abafador no fogo rasteiro e guarde a bomba costal para os arbustos densos.',
    cols: 22,
    rows: 16,
    tileSize: 48,
    playerStart: { col: 3, row: 3 },
    windDirection: 'S',
    windStrength: 1.2,
    timeLimitSeconds: 125,
    maxBurnPercent: 60,
    spreadIntervalMs: 3200,
    streams: [
      { col: 17, row: 3, w: 3, h: 2 },
      { col: 2, row: 12, w: 2, h: 2 },
    ],
    rocks: [
      { col: 10, row: 5, w: 2, h: 2 },
      { col: 6, row: 10, w: 2, h: 1 },
    ],
    treeZones: [
      { col: 14, row: 10, w: 5, h: 4 },
      { col: 4, row: 11, w: 3, h: 3 },
    ],
    bushZones: [
      { col: 7, row: 4, w: 3, h: 3 },
      { col: 13, row: 6, w: 4, h: 3 },
    ],
    initialFires: [
      { col: 8, row: 4, intensity: 1 },
      { col: 13, row: 5, intensity: 1 },
      { col: 14, row: 7, intensity: 2 },
      { col: 9, row: 9, intensity: 1 },
    ],
    wildlife: [
      { id: 'w3_tatu', species: 'tatu', name: 'Tatu-Bola', col: 16, row: 12 },
      { id: 'w3_tucano', species: 'tucano', name: 'Tucano-de-Bico-Preto', col: 5, row: 13 },
      { id: 'w3_lobo', species: 'lobo_guara', name: 'Lobo-Guará', col: 18, row: 8 },
    ],
    hikers: [],
  },
  {
    sectorNumber: 4,
    name: 'Bosque dos Ipês',
    subtitle: 'Setor 4 · Troncos em Brasa',
    description:
      'Árvores incendiadas deixam troncos em brasa após apagar a chama. Use a Pá (4) ou [AÇÃO] para enterrá-los antes que reacendam o incêndio!',
    radioDispatch:
      'Alerta crítico: troncos antigos em brasa estão reacendendo a mata! Enterrem cada brasa com a pá!',
    cols: 24,
    rows: 16,
    tileSize: 48,
    playerStart: { col: 2, row: 8 },
    windDirection: 'E',
    windStrength: 1.25,
    timeLimitSeconds: 130,
    maxBurnPercent: 60,
    spreadIntervalMs: 3100,
    streams: [
      { col: 2, row: 2, w: 3, h: 2 },
      { col: 11, row: 13, w: 3, h: 2 },
    ],
    rocks: [
      { col: 9, row: 4, w: 2, h: 2 },
      { col: 17, row: 11, w: 2, h: 2 },
    ],
    treeZones: [
      { col: 6, row: 6, w: 4, h: 4 },
      { col: 13, row: 3, w: 5, h: 5 },
      { col: 16, row: 9, w: 5, h: 4 },
    ],
    bushZones: [
      { col: 11, row: 8, w: 3, h: 3 },
    ],
    initialFires: [
      { col: 7, row: 7, intensity: 2 },
      { col: 8, row: 8, intensity: 2 },
      { col: 14, row: 5, intensity: 2 },
      { col: 12, row: 9, intensity: 1 },
    ],
    wildlife: [
      { id: 'w4_tamandua', species: 'tamandua', name: 'Tamanduá', col: 19, row: 5 },
      { id: 'w4_tucano', species: 'tucano', name: 'Tucano', col: 19, row: 12 },
      { id: 'w4_tatu', species: 'tatu', name: 'Tatu', col: 6, row: 13 },
    ],
    hikers: [
      { id: 'h4_1', name: 'Fotógrafa', col: 15, row: 12, quote: 'Os ipês estavam ardendo em brasa, vocês chegaram a tempo!' },
    ],
  },
  {
    sectorNumber: 5,
    name: 'Vale do Vento Forte',
    subtitle: 'Setor 5 · Rajadas a Oeste',
    description:
      'Rajadas intensas sopram de Leste para Oeste. Corte aceiros largos à frente das chamas e proteja a colônia de animais no vale.',
    radioDispatch:
      'Ventos fortes para Oeste! Faíscas podem saltar aceiros finos. Segurem a linha de defesa e salvem a fauna!',
    cols: 24,
    rows: 17,
    tileSize: 48,
    playerStart: { col: 21, row: 8 },
    windDirection: 'W',
    windStrength: 1.45,
    timeLimitSeconds: 135,
    maxBurnPercent: 58,
    spreadIntervalMs: 2950,
    streams: [
      { col: 19, row: 2, w: 3, h: 2 },
      { col: 3, row: 13, w: 3, h: 2 },
    ],
    rocks: [
      { col: 12, row: 4, w: 2, h: 2 },
      { col: 11, row: 11, w: 2, h: 2 },
    ],
    treeZones: [
      { col: 3, row: 3, w: 5, h: 5 },
      { col: 4, row: 9, w: 4, h: 4 },
      { col: 15, row: 6, w: 4, h: 5 },
    ],
    bushZones: [
      { col: 9, row: 6, w: 4, h: 4 },
    ],
    initialFires: [
      { col: 17, row: 7, intensity: 2 },
      { col: 16, row: 9, intensity: 2 },
      { col: 14, row: 5, intensity: 1 },
      { col: 11, row: 8, intensity: 1 },
    ],
    wildlife: [
      { id: 'w5_lobo', species: 'lobo_guara', name: 'Lobo-Guará', col: 4, row: 5 },
      { id: 'w5_tatu', species: 'tatu', name: 'Tatu-Canastra', col: 6, row: 11 },
      { id: 'w5_tucano', species: 'tucano', name: 'Tucano', col: 10, row: 3 },
    ],
    hikers: [
      { id: 'h5_1', name: 'Pesquisador', col: 4, row: 8, quote: 'O vento virou de repente! Salvem os animais da mata!' },
    ],
  },
  {
    sectorNumber: 6,
    name: 'Troncos Centenários',
    subtitle: 'Setor 6 · Múltiplas Brasas',
    description:
      'Madeira pesada arde profundamente neste trecho. Extinga com Água (3) e enterre rapidamente cada brasa com a Pá (4)!',
    radioDispatch:
      'Setor denso com árvores centenárias. Mantenham vigilância sobre troncos em brasa e reabasteçam no riacho central!',
    cols: 25,
    rows: 17,
    tileSize: 48,
    playerStart: { col: 12, row: 8 },
    windDirection: 'SE',
    windStrength: 1.35,
    timeLimitSeconds: 140,
    maxBurnPercent: 58,
    spreadIntervalMs: 2850,
    streams: [
      { col: 11, row: 7, w: 3, h: 2 },
      { col: 21, row: 14, w: 3, h: 2 },
    ],
    rocks: [
      { col: 6, row: 6, w: 2, h: 1 },
      { col: 18, row: 5, w: 2, h: 2 },
    ],
    treeZones: [
      { col: 3, row: 2, w: 5, h: 4 },
      { col: 15, row: 2, w: 5, h: 4 },
      { col: 3, row: 10, w: 5, h: 5 },
      { col: 16, row: 10, w: 5, h: 4 },
    ],
    bushZones: [
      { col: 9, row: 4, w: 3, h: 3 },
      { col: 12, row: 11, w: 3, h: 3 },
    ],
    initialFires: [
      { col: 5, row: 4, intensity: 2 },
      { col: 17, row: 4, intensity: 2 },
      { col: 5, row: 12, intensity: 2 },
      { col: 14, row: 12, intensity: 1 },
    ],
    wildlife: [
      { id: 'w6_tamandua', species: 'tamandua', name: 'Tamanduá', col: 21, row: 4 },
      { id: 'w6_lobo', species: 'lobo_guara', name: 'Lobo-Guará', col: 4, row: 14 },
      { id: 'w6_tucano', species: 'tucano', name: 'Tucano', col: 19, row: 13 },
    ],
    hikers: [
      { id: 'h6_1', name: 'Botânica', col: 8, row: 12, quote: 'Esses troncos seguram brasa por horas, ótimo trabalho!' },
    ],
  },
  {
    sectorNumber: 7,
    name: 'Mirante dos Trilheiros',
    subtitle: 'Setor 7 · Resgate na Serra',
    description:
      'Visitantes e animais ficaram cercados entre penhascos rochosos. Abra passagem dissipando o fogo nas trilhas estreitas.',
    radioDispatch:
      'Chamado urgente no Mirante: dois trilheiros e fauna isolados entre as pedras. Prioridade total ao salvamento!',
    cols: 26,
    rows: 18,
    tileSize: 48,
    playerStart: { col: 3, row: 14 },
    windDirection: 'N',
    windStrength: 1.4,
    timeLimitSeconds: 145,
    maxBurnPercent: 56,
    spreadIntervalMs: 2800,
    streams: [
      { col: 2, row: 14, w: 3, h: 2 },
      { col: 20, row: 3, w: 3, h: 2 },
    ],
    rocks: [
      { col: 7, row: 5, w: 2, h: 4 },
      { col: 14, row: 7, w: 3, h: 2 },
      { col: 18, row: 11, w: 2, h: 3 },
    ],
    treeZones: [
      { col: 3, row: 2, w: 4, h: 4 },
      { col: 11, row: 2, w: 6, h: 4 },
      { col: 11, row: 11, w: 5, h: 4 },
    ],
    bushZones: [
      { col: 9, row: 7, w: 4, h: 3 },
      { col: 19, row: 7, w: 4, h: 3 },
    ],
    initialFires: [
      { col: 5, row: 10, intensity: 2 },
      { col: 10, row: 9, intensity: 2 },
      { col: 13, row: 12, intensity: 2 },
      { col: 20, row: 9, intensity: 1 },
      { col: 15, row: 4, intensity: 1 },
    ],
    wildlife: [
      { id: 'w7_tatu', species: 'tatu', name: 'Tatu', col: 5, row: 3 },
      { id: 'w7_tucano', species: 'tucano', name: 'Tucano', col: 15, row: 3 },
      { id: 'w7_lobo', species: 'lobo_guara', name: 'Lobo-Guará', col: 22, row: 13 },
    ],
    hikers: [
      { id: 'h7_1', name: 'Trilheiro Lucas', col: 12, row: 5, quote: 'Achamos que não ia dar tempo de sair do mirante!' },
      { id: 'h7_2', name: 'Trilheira Marina', col: 22, row: 6, quote: 'Salvamos nossas mochilas e a trilha graças a vocês!' },
    ],
  },
  {
    sectorNumber: 8,
    name: 'Corredor da Fauna',
    subtitle: 'Setor 8 · Santuário Ecológico',
    description:
      'Quatro espécies nativas estão cercadas no corredor ecológico. Proteja o santuário sem deixar mais de 55% da mata queimar.',
    radioDispatch:
      'Santuário ameaçado por duas frentes de fogo! Resgatem todos os animais silvestres e contenham o incêndio!',
    cols: 26,
    rows: 18,
    tileSize: 48,
    playerStart: { col: 13, row: 9 },
    windDirection: 'NW',
    windStrength: 1.5,
    timeLimitSeconds: 150,
    maxBurnPercent: 55,
    spreadIntervalMs: 2650,
    streams: [
      { col: 12, row: 8, w: 3, h: 2 },
      { col: 3, row: 3, w: 2, h: 2 },
    ],
    rocks: [
      { col: 8, row: 9, w: 2, h: 2 },
      { col: 17, row: 8, w: 2, h: 2 },
    ],
    treeZones: [
      { col: 4, row: 5, w: 4, h: 4 },
      { col: 19, row: 3, w: 5, h: 4 },
      { col: 19, row: 11, w: 5, h: 5 },
      { col: 4, row: 12, w: 5, h: 4 },
    ],
    bushZones: [
      { col: 10, row: 3, w: 4, h: 3 },
      { col: 11, row: 13, w: 4, h: 3 },
    ],
    initialFires: [
      { col: 21, row: 13, intensity: 2 },
      { col: 20, row: 12, intensity: 2 },
      { col: 13, row: 14, intensity: 2 },
      { col: 6, row: 13, intensity: 1 },
      { col: 21, row: 5, intensity: 1 },
    ],
    wildlife: [
      { id: 'w8_lobo', species: 'lobo_guara', name: 'Lobo-Guará', col: 5, row: 6 },
      { id: 'w8_tamandua', species: 'tamandua', name: 'Tamanduá', col: 22, row: 4 },
      { id: 'w8_tucano', species: 'tucano', name: 'Tucano', col: 11, row: 4 },
      { id: 'w8_tatu', species: 'tatu', name: 'Tatu-Canastra', col: 6, row: 15 },
    ],
    hikers: [
      { id: 'h8_1', name: 'Bióloga Clara', col: 16, row: 4, quote: 'Conseguimos evacuar os ninhos e animais feridos!' },
    ],
  },
  {
    sectorNumber: 9,
    name: 'Serra Alta · Vento Mutável',
    subtitle: 'Setor 9 · Virada de Vento',
    description:
      'O vento muda de direção no meio do combate! Observe o indicador de vento no topo e adapte seus aceiros rapidamente.',
    radioDispatch:
      'Atenção máxima: frente fria se aproximando na Serra Alta! O vento vai virar para Sul em instantes!',
    cols: 28,
    rows: 18,
    tileSize: 48,
    playerStart: { col: 3, row: 9 },
    windDirection: 'E',
    windStrength: 1.55,
    windShiftAfterSec: 45,
    shiftedWindDirection: 'S',
    timeLimitSeconds: 155,
    maxBurnPercent: 55,
    spreadIntervalMs: 2550,
    streams: [
      { col: 2, row: 8, w: 3, h: 2 },
      { col: 15, row: 14, w: 3, h: 2 },
      { col: 23, row: 4, w: 3, h: 2 },
    ],
    rocks: [
      { col: 9, row: 5, w: 2, h: 2 },
      { col: 19, row: 9, w: 2, h: 2 },
    ],
    treeZones: [
      { col: 6, row: 2, w: 5, h: 3 },
      { col: 13, row: 4, w: 5, h: 5 },
      { col: 21, row: 7, w: 5, h: 5 },
      { col: 7, row: 11, w: 5, h: 4 },
    ],
    bushZones: [
      { col: 13, row: 10, w: 4, h: 3 },
      { col: 19, row: 3, w: 3, h: 3 },
    ],
    initialFires: [
      { col: 8, row: 8, intensity: 2 },
      { col: 14, row: 6, intensity: 2 },
      { col: 15, row: 7, intensity: 2 },
      { col: 22, row: 9, intensity: 2 },
      { col: 9, row: 12, intensity: 1 },
    ],
    wildlife: [
      { id: 'w9_lobo', species: 'lobo_guara', name: 'Lobo-Guará', col: 25, row: 14 },
      { id: 'w9_tucano', species: 'tucano', name: 'Tucano', col: 16, row: 2 },
      { id: 'w9_tamandua', species: 'tamandua', name: 'Tamanduá', col: 9, row: 15 },
      { id: 'w9_tatu', species: 'tatu', name: 'Tatu', col: 24, row: 10 },
    ],
    hikers: [
      { id: 'h9_1', name: 'Brigadista João', col: 17, row: 12, quote: 'O vento virou! Ainda bem que reforçamos o aceiro!' },
      { id: 'h9_2', name: 'Observadora Ana', col: 22, row: 3, quote: 'Estávamos ilhados pela fumaça, valeu CBMMG!' },
    ],
  },
  {
    sectorNumber: 10,
    name: 'Linha de Contenção Total',
    subtitle: 'Setor 10 · Grande Incêndio',
    description:
      'Operação final no coração do Parque Estadual! Três frentes ativas, vento forte que muda de rumo, 4 animais silvestres e 2 visitantes em perigo.',
    radioDispatch:
      'Todas as viaturas em alerta: setor final da Serra Verde! Salvem a fauna, protejam o parque e zerem todas as brasas!',
    cols: 28,
    rows: 20,
    tileSize: 48,
    playerStart: { col: 14, row: 17 },
    windDirection: 'NE',
    windStrength: 1.7,
    windShiftAfterSec: 50,
    shiftedWindDirection: 'NW',
    timeLimitSeconds: 170,
    maxBurnPercent: 52,
    spreadIntervalMs: 2400,
    streams: [
      { col: 12, row: 16, w: 4, h: 2 },
      { col: 3, row: 9, w: 2, h: 2 },
      { col: 23, row: 9, w: 2, h: 2 },
    ],
    rocks: [
      { col: 8, row: 8, w: 2, h: 2 },
      { col: 18, row: 8, w: 2, h: 2 },
      { col: 13, row: 4, w: 2, h: 2 },
    ],
    treeZones: [
      { col: 3, row: 2, w: 5, h: 5 },
      { col: 20, row: 2, w: 5, h: 5 },
      { col: 11, row: 7, w: 6, h: 5 },
      { col: 4, row: 13, w: 5, h: 4 },
      { col: 19, row: 13, w: 5, h: 4 },
    ],
    bushZones: [
      { col: 9, row: 3, w: 3, h: 3 },
      { col: 16, row: 3, w: 3, h: 3 },
      { col: 10, row: 13, w: 3, h: 3 },
      { col: 15, row: 13, w: 3, h: 3 },
    ],
    initialFires: [
      { col: 5, row: 5, intensity: 2 },
      { col: 22, row: 5, intensity: 2 },
      { col: 13, row: 9, intensity: 2 },
      { col: 14, row: 10, intensity: 2 },
      { col: 7, row: 14, intensity: 1 },
      { col: 20, row: 14, intensity: 1 },
    ],
    wildlife: [
      { id: 'w10_lobo', species: 'lobo_guara', name: 'Lobo-Guará', col: 4, row: 3 },
      { id: 'w10_tucano', species: 'tucano', name: 'Tucano-Toco', col: 24, row: 3 },
      { id: 'w10_tamandua', species: 'tamandua', name: 'Tamanduá-Bandeira', col: 5, row: 16 },
      { id: 'w10_tatu', species: 'tatu', name: 'Tatu-Canastra', col: 23, row: 16 },
    ],
    hikers: [
      { id: 'h10_1', name: 'Guarda-Parque Pedro', col: 14, row: 2, quote: 'O parque todo depende da contenção hoje!' },
      { id: 'h10_2', name: 'Brigadista Sofia', col: 14, row: 13, quote: 'Juntos vamos salvar cada árvore e cada animal!' },
    ],
  },
];
