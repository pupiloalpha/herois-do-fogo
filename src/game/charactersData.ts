import { CharacterStats } from './types';

export const CHARACTERS: Record<string, CharacterStats> = {
  foguinho: {
    id: 'foguinho',
    name: 'Foguinho',
    role: 'Bombeiro Especialista em Combate',
    gender: 'Masculino',
    description: 'Robusto e experiente. Traja farda de proteção térmica cáqui e capacete de combate amarelo com o brasão oficial dos Bombeiros Militares.',
    avatarUrl: '/foguinho.jpg',
    badge: 'CBMMG - Minas Gerais',
    speed: 195,
    maxHealth: 135,
    maxExtinguisher: 125,
    extinguishPower: 1.25,
    heatResistance: 0.45, // takes 45% less damage from heat and flames
    rescueSpeedMultiplier: 1.0,
    specialTrait: 'Resistência Térmica: Suporta chamas intensas e tanque de extintor reforçado.',
  },
  faisca: {
    id: 'faisca',
    name: 'Faísca',
    role: 'Bombeira Especialista em Resgate',
    gender: 'Feminino',
    description: 'Ágil e veloz. Traja a vibrante farda operacional laranja com faixas refletivas, trança elegante e boné tático oficial CBMMG.',
    avatarUrl: '/faisca.jpg',
    badge: 'CBMMG - Minas Gerais',
    speed: 255, // +30% faster movement
    maxHealth: 100,
    maxExtinguisher: 100,
    extinguishPower: 1.1,
    heatResistance: 0.15,
    rescueSpeedMultiplier: 1.6, // rescues civilians and pets much faster
    specialTrait: 'Agilidade Suprema: Movimento veloz e resgate prioritário de pessoas e animais.',
  },
};
