  import { Template, Modality, TemplateSection, DynamicField } from './types'

export const defaultTemplates: Template[] = [
  {
    id: 'ct-chest-normal',
    name: 'CT Tórax Normal',
    description: 'Template padrão para TC de tórax normal',
    modality: Modality.CT,
    bodyPart: 'Chest',
    type: 'normal',
    tags: ['tórax', 'normal', 'rotina'],
    sections: [
      {
        id: 'technique',
        title: 'TÉCNICA',
        content: 'Realizadas aquisições volumétricas do tórax, sem administração endovenosa de contraste iodado.',
        isOptional: false
      },
      {
        id: 'lungs',
        title: 'PULMÕES E VIAS AÉREAS',
        content: 'Pulmões expandidos, com atenuação preservada.\nVias aéreas pérvias, de calibre normal.\nAusência de nódulos ou massas pulmonares.\nNão há derrame pleural.',
        isOptional: false,
        dynamicFields: [
          {
            id: 'has-nodules',
            name: 'Nódulos',
            type: 'boolean',
            defaultValue: false
          }
        ]
      },
      {
        id: 'mediastinum',
        title: 'MEDIASTINO',
        content: 'Estruturas mediastinais com aspecto anatômico.\nÁrea cardíaca com dimensões normais.\nAusência de linfonodomegalias.',
        isOptional: false
      },
      {
        id: 'pleura',
        title: 'PLEURA E PAREDE TORÁCICA',
        content: 'Superfícies pleurais regulares.\nEstruturas ósseas e partes moles da parede torácica sem alterações.',
        isOptional: false
      }
    ]
  },
  {
    id: 'ct-chest-covid',
    name: 'CT Tórax - COVID-19',
    description: 'Template para achados típicos de COVID-19',
    modality: Modality.CT,
    bodyPart: 'Chest',
    type: 'findings',
    tags: ['tórax', 'covid', 'infecção'],
    sections: [
      {
        id: 'technique',
        title: 'TÉCNICA',
        content: 'Realizadas aquisições volumétricas do tórax, sem administração endovenosa de contraste iodado.',
        isOptional: false
      },
      {
        id: 'findings',
        title: 'ACHADOS',
        content: 'Opacidades em vidro fosco de distribuição periférica e predominantemente posterior, acometendo:',
        isOptional: false,
        dynamicFields: [
          {
            id: 'involvement',
            name: 'Envolvimento',
            type: 'select',
            options: ['< 10%', '10-25%', '25-50%', '50-75%', '> 75%'],
            defaultValue: '10-25%'
          },
          {
            id: 'pattern',
            name: 'Padrão',
            type: 'select',
            options: ['Típico', 'Indeterminado', 'Atípico'],
            defaultValue: 'Típico'
          }
        ]
      },
      {
        id: 'conclusion',
        title: 'CONCLUSÃO',
        content: 'Achados tomográficos típicos de pneumonia viral, podendo corresponder a infecção pelo SARS-CoV-2, considerando o contexto epidemiológico atual.',
        isOptional: false
      }
    ]
  },
  {
    id: 'mri-brain-normal',
    name: 'RM Crânio Normal',
    description: 'Template padrão para RM de crânio normal',
    modality: Modality.MRI,
    bodyPart: 'Brain',
    type: 'normal',
    tags: ['neurologia', 'crânio', 'normal'],
    sections: [
      {
        id: 'technique',
        title: 'TÉCNICA',
        content: 'Realizadas sequências multiplanares ponderadas em T1, T2, FLAIR, DWI e SWI, sem administração endovenosa de contraste paramagnético.',
        isOptional: false
      },
      {
        id: 'parenchyma',
        title: 'PARÊNQUIMA ENCEFÁLICO',
        content: 'Parênquima encefálico com morfologia, sinal e distribuição da substância branca e cinzenta preservados.\nSistema ventricular com morfologia e dimensões normais.\nNão há efeito de massa ou desvio da linha média.',
        isOptional: false,
        dynamicFields: [
          {
            id: 'ventricles',
            name: 'Ventrículos',
            type: 'select',
            options: ['Normais', 'Aumentados', 'Diminuídos'],
            defaultValue: 'Normais'
          }
        ]
      },
      {
        id: 'extra-axial',
        title: 'ESPAÇOS EXTRA-AXIAIS',
        content: 'Espaços extra-axiais com amplitude normal.\nCisternas da base pérvias.',
        isOptional: false
      },
      {
        id: 'vascular',
        title: 'ESTRUTURAS VASCULARES',
        content: 'Artérias do polígono de Willis com morfologia e sinal de fluxo habituais.\nSeios venosos pérvios.',
        isOptional: false
      }
    ]
  },
  {
    id: 'xr-chest-normal',
    name: 'RX Tórax Normal',
    description: 'Template padrão para radiografia de tórax normal',
    modality: Modality.XR,
    bodyPart: 'Chest',
    type: 'normal',
    tags: ['tórax', 'raio-x', 'normal'],
    sections: [
      {
        id: 'technique',
        title: 'TÉCNICA',
        content: 'Radiografia de tórax em incidências PA e perfil.',
        isOptional: false
      },
      {
        id: 'findings',
        title: 'ACHADOS',
        content: 'Campos pulmonares com transparência normal.\nSeios costofrênicos livres.\nÍndice cardiotorácico dentro dos limites da normalidade.\nHilos pulmonares com aspecto habitual.\nMediastino centrado.\nEstruturas ósseas sem alterações.',
        isOptional: false,
        dynamicFields: [
          {
            id: 'cardio-thoracic-index',
            name: 'ICT',
            type: 'measurement',
            unit: '%',
            defaultValue: 50
          }
        ]
      }
    ]
  }
]

// Template Generator Functions
export function generateTemplateId(name: string): string {
  return name.toLowerCase().replace(/\s+/g, '-')
}

export function createEmptyTemplate(): Template {
  return {
    id: generateTemplateId('new-template'),
    name: '',
    description: '',
    modality: Modality.CT,
    bodyPart: '',
    type: 'normal',
    tags: [],
    sections: []
  }
}

export function createEmptySection(): TemplateSection {
  return {
    id: crypto.randomUUID(),
    title: '',
    content: '',
    isOptional: false,
    dynamicFields: []
  }
}

export function createDynamicField(): DynamicField {
  return {
    id: crypto.randomUUID(),
    name: '',
    type: 'text',
    options: [],
    defaultValue: ''
  }
}

export function generateTemplate(
  name: string,
  description: string,
  modality: Modality,
  bodyPart: string,
  type: 'normal' | 'findings' | 'emergency',
  tags: string[],
  sections: TemplateSection[]
): Template {
  return {
    id: generateTemplateId(name),
    name,
    description,
    modality,
    bodyPart,
    type,
    tags,
    sections
  }
}

export function cloneTemplate(template: Template): Template {
  return {
    ...template,
    id: generateTemplateId(`${template.name}-copy`),
    name: `${template.name} (Copy)`,
    sections: template.sections.map(section => ({
      ...section,
      id: crypto.randomUUID(),
      dynamicFields: section.dynamicFields?.map(field => ({
        ...field,
        id: crypto.randomUUID()
      }))
    }))
  }
}

export function validateTemplate(template: Template): string[] {
  const errors: string[] = []

  if (!template.name) errors.push('Template name is required')
  if (!template.description) errors.push('Template description is required')
  if (!template.modality) errors.push('Template modality is required')
  if (!template.bodyPart) errors.push('Template body part is required')
  if (!template.type) errors.push('Template type is required')
  if (!template.sections || template.sections.length === 0) {
    errors.push('Template must have at least one section')
  }

  template.sections?.forEach((section, index) => {
    if (!section.title) errors.push(`Section ${index + 1} title is required`)
    if (!section.content) errors.push(`Section ${index + 1} content is required`)

    section.dynamicFields?.forEach((field, fieldIndex) => {
      if (!field.name) errors.push(`Field ${fieldIndex + 1} in section ${index + 1} name is required`)
      if (!field.type) errors.push(`Field ${fieldIndex + 1} in section ${index + 1} type is required`)
      if (field.type === 'select' && (!field.options || field.options.length === 0)) {
        errors.push(`Field ${fieldIndex + 1} in section ${index + 1} must have options`)
      }
    })
  })

  return errors
}

export function mergeTemplates(template1: Template, template2: Template): Template {
  return {
    ...template1,
    sections: [...template1.sections, ...template2.sections],
    tags: [...new Set([...template1.tags, ...template2.tags])]
  }
}

export function extractDynamicFields(template: Template): DynamicField[] {
  return template.sections.reduce((fields: DynamicField[], section) => {
    return fields.concat(section.dynamicFields || [])
  }, [])
}

export function updateDynamicFieldValues(
  template: Template,
  values: Record<string, string | number | boolean>
): Template {
  return {
    ...template,
    sections: template.sections.map(section => ({
      ...section,
      dynamicFields: section.dynamicFields?.map(field => ({
        ...field,
        defaultValue: values[field.id] !== undefined ? values[field.id] : field.defaultValue
      }))
    }))
  }
}

export function generateReport(template: Template, values: Record<string, string | number | boolean>): string {
  let report = ''

  template.sections.forEach(section => {
    if (!section.isOptional) {
      report += `${section.title}\n${section.content}\n\n`
    }
  })

  return report.trim()
}

export function searchTemplates(
  templates: Template[],
  query: string,
  filters?: {
    modality?: Modality
    bodyPart?: string
    type?: 'normal' | 'findings' | 'emergency'
    tags?: string[]
  }
): Template[] {
  return templates.filter(template => {
    const matchesQuery =
      template.name.toLowerCase().includes(query.toLowerCase()) ||
      template.description.toLowerCase().includes(query.toLowerCase()) ||
      template.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()))

    if (!matchesQuery) return false

    if (filters?.modality && template.modality !== filters.modality) return false
    if (filters?.bodyPart && template.bodyPart !== filters.bodyPart) return false
    if (filters?.type && template.type !== filters.type) return false
    if (filters?.tags && !filters.tags.every(tag => template.tags.includes(tag))) return false

    return true
  })
}

export function sortTemplates(
  templates: Template[],
  sortBy: 'name' | 'modality' | 'bodyPart' | 'type',
  order: 'asc' | 'desc' = 'asc'
): Template[] {
  return [...templates].sort((a, b) => {
    const aValue = a[sortBy].toLowerCase()
    const bValue = b[sortBy].toLowerCase()
    return order === 'asc'
      ? aValue.localeCompare(bValue)
      : bValue.localeCompare(aValue)
  })
}

export function groupTemplatesByModality(templates: Template[]): Record<Modality, Template[]> {
  return templates.reduce((groups, template) => {
    const modality = template.modality
    if (!groups[modality]) {
      groups[modality] = []
    }
    groups[modality].push(template)
    return groups
  }, {} as Record<Modality, Template[]>)
}

export function groupTemplatesByBodyPart(templates: Template[]): Record<string, Template[]> {
  return templates.reduce((groups, template) => {
    const bodyPart = template.bodyPart
    if (!groups[bodyPart]) {
      groups[bodyPart] = []
    }
    groups[bodyPart].push(template)
    return groups
  }, {} as Record<string, Template[]>)
}

export function exportTemplate(template: Template): string {
  return JSON.stringify(template, null, 2)
}

export function importTemplate(json: string): Template {
  try {
    const template = JSON.parse(json) as Template
    const errors = validateTemplate(template)
    if (errors.length > 0) {
      throw new Error(`Invalid template: ${errors.join(', ')}`)
    }
    return template
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to import template: ${error.message}`)
    }
    throw new Error('Failed to import template: Unknown error')
  }
}
