import { Template, Modality } from './types'

export const defaultTemplates: Template[] = [
  {
    id: 'ct-chest-normal',
    name: 'TC de Tórax Normal',
    description: 'Template básico para TC de tórax com achados normais',
    modality: Modality.CT,
    bodyPart: 'Tórax',
    type: 'normal',
    tags: ['tórax', 'normal', 'rotina'],
    shortcut: '/tctn', // Add shortcuts for quick access
    sections: [
      {
        id: 'technique',
        title: 'Técnica',
        content: 'Exame de tomografia computadorizada do tórax, realizado com técnica helicoidal multislice, sem administração de contraste endovenoso.',
        isOptional: false,
        dynamicFields: [
          {
            id: 'contrast',
            name: 'Contraste',
            type: 'select',
            options: ['sem', 'com'],
            defaultValue: 'sem'
          }
        ]
      },
      {
        id: 'findings',
        title: 'Achados',
        content: `Parênquima pulmonar com atenuação, distribuição e espessura normais.
Ausência de nódulos ou massas.
Árvore brônquica de calibre normal.
Estruturas vasculares com distribuição habitual.
Ausência de derrame pleural ou espessamentos pleurais.
Mediastino com morfologia e dimensões normais.
Estruturas cardíacas dentro dos limites da normalidade.
Ausência de linfonodomegalias mediastinais.
Estruturas ósseas sem alterações.`,
      },
      {
        id: 'impression',
        title: 'Impressão',
        content: 'Exame dentro dos limites da normalidade.',
      }
    ]
  },
  {
    id: 'ct-chest-nodule',
    name: 'TC de Tórax - Nódulo',
    description: 'Template para TC de tórax com nódulo pulmonar',
    modality: Modality.CT,
    bodyPart: 'Tórax',
    type: 'findings',
    tags: ['tórax', 'nódulo', 'follow-up'],
    shortcut: '/tcnd',
    sections: [
      // ... sections
    ]
  }
  // Add more default templates here
]
