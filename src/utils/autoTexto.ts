import { AutoTextoTrigger } from './types'

export const autoTextoTriggers: AutoTextoTrigger[] = [
  // Common descriptions
  {
    id: 'normal',
    trigger: '/n',
    content: 'normal',
    category: 'common',
    tags: ['normal'],
    conditions: []
  },
  {
    id: 'preserved',
    trigger: '/p',
    content: 'preservado',
    category: 'common',
    tags: ['normal'],
    conditions: []
  },
  {
    id: 'bilateral',
    trigger: '/b',
    content: 'bilateral',
    category: 'common',
    tags: ['location'],
    conditions: []
  },
  {
    id: 'symmetrical',
    trigger: '/s',
    content: 'simétrico',
    category: 'common',
    tags: ['description'],
    conditions: []
  },
  // Measurements
  {
    id: 'measures',
    trigger: '/m',
    content: 'mede',
    category: 'measurements',
    tags: ['measurement'],
    conditions: []
  },
  {
    id: 'approximately',
    trigger: '/a',
    content: 'aproximadamente',
    category: 'measurements',
    tags: ['measurement'],
    conditions: []
  },
  // Locations
  {
    id: 'right',
    trigger: '/d',
    content: 'direito',
    category: 'location',
    tags: ['location'],
    conditions: []
  },
  {
    id: 'left',
    trigger: '/e',
    content: 'esquerdo',
    category: 'location',
    tags: ['location'],
    conditions: []
  },
  {
    id: 'superior',
    trigger: '/sup',
    content: 'superior',
    category: 'location',
    tags: ['location'],
    conditions: []
  },
  {
    id: 'inferior',
    trigger: '/inf',
    content: 'inferior',
    category: 'location',
    tags: ['location'],
    conditions: []
  },
  // Common phrases
  {
    id: 'no-changes',
    trigger: '/nc',
    content: 'Sem alterações significativas',
    category: 'phrases',
    tags: ['normal'],
    conditions: []
  },
  {
    id: 'compared-to',
    trigger: '/cp',
    content: 'em comparação com exame anterior',
    category: 'phrases',
    tags: ['comparison'],
    conditions: []
  },
  {
    id: 'suggests',
    trigger: '/sg',
    content: 'sugere',
    category: 'phrases',
    tags: ['impression'],
    conditions: []
  },
  // Negatives
  {
    id: 'without',
    trigger: '/sem',
    content: 'sem',
    category: 'negatives',
    tags: ['negative'],
    conditions: []
  },
  {
    id: 'no-evidence',
    trigger: '/ne',
    content: 'sem evidências de',
    category: 'negatives',
    tags: ['negative'],
    conditions: []
  },
  // Technical terms
  {
    id: 'density',
    trigger: '/den',
    content: 'densidade',
    category: 'technical',
    tags: ['description'],
    conditions: []
  },
  {
    id: 'signal',
    trigger: '/sig',
    content: 'sinal',
    category: 'technical',
    tags: ['description'],
    conditions: []
  },
  {
    id: 'intensity',
    trigger: '/int',
    content: 'intensidade',
    category: 'technical',
    tags: ['description'],
    conditions: []
  }
]

// Helper function to get all triggers for documentation
export function getAutoTextoTriggers(): string {
  return autoTextoTriggers
    .map(trigger => `${trigger.trigger} - ${trigger.content}`)
    .join('\n')
}

// Helper function to find a trigger match
export function findTriggerMatch(word: string): AutoTextoTrigger | undefined {
  return autoTextoTriggers.find(trigger => 
    trigger.trigger.toLowerCase() === word.toLowerCase()
  )
}
