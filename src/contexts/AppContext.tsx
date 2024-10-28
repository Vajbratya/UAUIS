import React, { createContext, useContext, useState, useCallback } from 'react'
import { Template, AutoTextoTrigger } from '../utils/types'

interface AppContextType {
  content: string
  setContent: (content: string) => void
  autoTextoTriggers: AutoTextoTrigger[]
  addAutoTextoTrigger: (trigger: Omit<AutoTextoTrigger, 'id'>) => void
  updateAutoTextoTrigger: (id: string, trigger: Omit<AutoTextoTrigger, 'id'>) => void
  deleteAutoTextoTrigger: (id: string) => void
  expandAutoTexto: (trigger: string) => string | null
  reportProgress: number
  wordCount: number
  characterCount: number
  autoSave: boolean
  setAutoSave: (value: boolean) => void
  keywords: string[]
  tags: string[]
  favoriteTemplates: Template[]
  recentTemplates: Template[]
  addToFavorites: (template: Template) => void
  removeFromFavorites: (templateId: string) => void
  addToRecent: (template: Template) => void
  notifications: Array<{ id: string; message: string }>
}

const AppContext = createContext<AppContextType | undefined>(undefined)

export function useAppContext() {
  const context = useContext(AppContext)
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppContextProvider')
  }
  return context
}

const defaultAutoTextoTriggers: AutoTextoTrigger[] = [
  {
    id: '1',
    trigger: '/normal',
    content: 'Estudo sem alterações significativas.',
    category: 'Geral',
    tags: ['normal', 'padrão'],
    conditions: ['Sem alterações significativas']
  },
  {
    id: '2',
    trigger: '/tc-torax-normal',
    content: 'TÉCNICA:\nRealizadas aquisições volumétricas do tórax, sem administração endovenosa de contraste iodado.\n\nACHADOS:\nPulmões expandidos, com atenuação preservada.\nVias aéreas pérvias, de calibre normal.\nAusência de nódulos ou massas pulmonares.\nNão há derrame pleural.\n\nEstrutura mediastinais com aspecto anatômico.\nÁrea cardíaca com dimensões normais.\nAusência de linfonodomegalias.\n\nSuperfícies pleurais regulares.\nEstruturas ósseas e partes moles da parede torácica sem alterações.',
    category: 'Tórax',
    tags: ['tórax', 'normal', 'tc'],
    conditions: ['Tórax normal']
  },
  {
    id: '3',
    trigger: '/tc-torax-covid',
    content: 'TÉCNICA:\nRealizadas aquisições volumétricas do tórax, sem administração endovenosa de contraste iodado.\n\nACHADOS:\nOpacidades em vidro fosco de distribuição periférica e predominantemente posterior, acometendo múltiplos lobos pulmonares.\n\nCONCLUSÃO:\nAchados tomográficos típicos de pneumonia viral, podendo corresponder a infecção pelo SARS-CoV-2, considerando o contexto epidemiológico atual.',
    category: 'Tórax',
    tags: ['tórax', 'covid', 'tc'],
    conditions: ['COVID-19']
  },
  {
    id: '4',
    trigger: '/rm-cranio-normal',
    content: 'TÉCNICA:\nRealizadas sequências multiplanares ponderadas em T1, T2, FLAIR, DWI e SWI, sem administração endovenosa de contraste paramagnético.\n\nACHADOS:\nParênquima encefálico com morfologia, sinal e distribuição da substância branca e cinzenta preservados.\nSistema ventricular com morfologia e dimensões normais.\nNão há efeito de massa ou desvio da linha média.\n\nEspaços extra-axiais com amplitude normal.\nCisternas da base pérvias.\n\nArtérias do polígono de Willis com morfologia e sinal de fluxo habituais.\nSeios venosos pérvios.',
    category: 'Neurologia',
    tags: ['crânio', 'normal', 'rm'],
    conditions: ['Crânio normal']
  },
  {
    id: '5',
    trigger: '/rx-torax-normal',
    content: 'TÉCNICA:\nRadiografia de tórax em incidências PA e perfil.\n\nACHADOS:\nCampos pulmonares com transparência normal.\nSeios costofrênicos livres.\nÍndice cardiotorácico dentro dos limites da normalidade.\nHilos pulmonares com aspecto habitual.\nMediastino centrado.\nEstruturas ósseas sem alterações.',
    category: 'Tórax',
    tags: ['tórax', 'normal', 'rx'],
    conditions: ['Tórax normal']
  }
]

export function AppContextProvider({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState('')
  const [autoSave, setAutoSave] = useState(true)
  const [favoriteTemplates, setFavoriteTemplates] = useState<Template[]>([])
  const [recentTemplates, setRecentTemplates] = useState<Template[]>([])
  const [notifications] = useState<Array<{ id: string; message: string }>>([])
  const [autoTextoTriggers, setAutoTextoTriggers] = useState<AutoTextoTrigger[]>(defaultAutoTextoTriggers)

  const addAutoTextoTrigger = useCallback((trigger: Omit<AutoTextoTrigger, 'id'>) => {
    setAutoTextoTriggers(prev => [
      ...prev,
      {
        ...trigger,
        id: crypto.randomUUID()
      }
    ])
  }, [])

  const updateAutoTextoTrigger = useCallback((id: string, updatedTrigger: Omit<AutoTextoTrigger, 'id'>) => {
    setAutoTextoTriggers(prev =>
      prev.map(trigger =>
        trigger.id === id
          ? { ...updatedTrigger, id }
          : trigger
      )
    )
  }, [])

  const deleteAutoTextoTrigger = useCallback((id: string) => {
    setAutoTextoTriggers(prev => prev.filter(trigger => trigger.id !== id))
  }, [])

  const expandAutoTexto = useCallback((trigger: string): string | null => {
    const found = autoTextoTriggers.find(t => t.trigger === trigger)
    return found ? found.content : null
  }, [autoTextoTriggers])

  const addToFavorites = useCallback((template: Template) => {
    setFavoriteTemplates(prev => {
      if (prev.some(t => t.id === template.id)) return prev
      return [...prev, template]
    })
  }, [])

  const removeFromFavorites = useCallback((templateId: string) => {
    setFavoriteTemplates(prev => prev.filter(t => t.id !== templateId))
  }, [])

  const addToRecent = useCallback((template: Template) => {
    setRecentTemplates(prev => {
      const withoutCurrent = prev.filter(t => t.id !== template.id)
      return [template, ...withoutCurrent].slice(0, 10) // Keep last 10 templates
    })
  }, [])

  // Calculate word and character count
  const wordCount = content.trim() ? content.trim().split(/\s+/).length : 0
  const characterCount = content.length

  // Calculate report progress (simplified version)
  const reportProgress = Math.min(100, Math.round((wordCount / 100) * 100))

  // Mock data for keywords and tags
  const keywords = ['normal', 'sem alterações']
  const tags = ['rotina']

  const value = {
    content,
    setContent,
    autoTextoTriggers,
    addAutoTextoTrigger,
    updateAutoTextoTrigger,
    deleteAutoTextoTrigger,
    expandAutoTexto,
    reportProgress,
    wordCount,
    characterCount,
    autoSave,
    setAutoSave,
    keywords,
    tags,
    favoriteTemplates,
    recentTemplates,
    addToFavorites,
    removeFromFavorites,
    addToRecent,
    notifications
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
