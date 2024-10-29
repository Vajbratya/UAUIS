import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useAppContext } from '../contexts/AppContext'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Save, Download, Printer, Users, Tag, CornerUpLeft, CornerUpRight, Maximize2, Minimize2, Copy, Ruler, List, FileText, Brain, Lightbulb, Wand2, X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { useToast } from './ui/use-toast'
import { generateClaudeResponse } from '../utils/claudeApi'
import { MeasurementManager } from './MeasurementManager'
import TemplateManager from './TemplateManager'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Card } from './ui/card'
import { Progress } from './ui/progress'
import { Template, AutoTextoTrigger } from '../utils/types'
import { defaultTemplates } from '../utils/templates'

interface EditorProps {}

// AutoTexto triggers matching the UI
const autoTextoTriggers: AutoTextoTrigger[] = [
  {
    id: 'normal',
    trigger: '/normal',
    content: 'Estudo sem alterações significativas.',
    category: 'Geral',
    tags: ['normal'],
    conditions: []
  },
  {
    id: 'tc-torax-normal',
    trigger: '/tc-torax-normal',
    content: `TÉCNICA: Realizadas aquisições tomográficas do tórax, sem administração de meio de contraste endovenoso.

ANÁLISE:
Parênquima pulmonar com atenuação, distribuição e espessura normais.
Ausência de nódulos ou massas.
Árvore brônquica de calibre normal.
Estruturas vasculares com distribuição habitual.
Ausência de derrame pleural ou espessamentos pleurais.
Mediastino com morfologia e dimensões normais.
Estruturas cardíacas dentro dos limites da normalidade.
Ausência de linfonodomegalias mediastinais.
Estruturas ósseas sem alterações.

IMPRESSÃO:
Exame dentro dos limites da normalidade.`,
    category: 'Tórax',
    tags: ['tc', 'tórax', 'normal'],
    conditions: []
  },
  {
    id: 'tc-torax-covid',
    trigger: '/tc-torax-covid',
    content: `TÉCNICA: Realizadas aquisições tomográficas do tórax, sem administração de meio de contraste endovenoso.

ANÁLISE:
Opacidades em vidro fosco multifocais, com distribuição periférica e predominantemente posterior, acometendo todos os lobos pulmonares, com extensão aproximada de 25% do parênquima.
Ausência de derrame pleural.
Mediastino e estruturas cardiovasculares sem alterações significativas.
Estruturas ósseas sem lesões.

IMPRESSÃO:
Achados tomográficos compatíveis com pneumonia viral em atividade (COVID-19), com acometimento pulmonar leve (< 25%).`,
    category: 'Tórax',
    tags: ['tc', 'tórax', 'covid'],
    conditions: []
  },
  {
    id: 'rm-cranio-normal',
    trigger: '/rm-cranio-normal',
    content: `TÉCNICA: Realizadas sequências multiplanares ponderadas em T1, T2, FLAIR e difusão.

ANÁLISE:
Parênquima encefálico com morfologia, sinal e distribuição normais da substância branca e cinzenta.
Sistema ventricular de morfologia e dimensões normais.
Ausência de coleções extra-axiais.
Estruturas da linha média centradas.
Tronco cerebral e cerebelo sem alterações.
Ausência de restrição à difusão.
Estruturas ósseas sem alterações.

IMPRESSÃO:
Exame dentro dos limites da normalidade.`,
    category: 'Crânio',
    tags: ['rm', 'crânio', 'normal'],
    conditions: []
  },
  {
    id: 'rx-torax-normal',
    trigger: '/rx-torax-normal',
    content: `TÉCNICA: Radiografia de tórax em PA.

ANÁLISE:
Campos pulmonares com transparência normal.
Ausência de opacidades focais.
Hilos pulmonares de aspecto normal.
Seios costofrênicos livres.
Silhueta cardíaca dentro dos limites da normalidade.
Estruturas ósseas sem alterações.

IMPRESSÃO:
Radiografia de tórax dentro dos limites da normalidade.`,
    category: 'Tórax',
    tags: ['rx', 'tórax', 'normal'],
    conditions: []
  }
]

export function Editor({}: EditorProps) {
  const { content, setContent } = useAppContext()
  const [localContent, setLocalContent] = useState(content)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMeasurementManagerOpen, setIsMeasurementManagerOpen] = useState(false)
  const [isTemplateManagerOpen, setIsTemplateManagerOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()
  const [previewContent, setPreviewContent] = useState<string>('')
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [reportProgress, setReportProgress] = useState(0)
  const [recentTemplates, setRecentTemplates] = useState<Template[]>([])
  const [favoriteTemplates, setFavoriteTemplates] = useState<string[]>([])
  const [showShortcutHint, setShowShortcutHint] = useState(true)

  useEffect(() => {
    setLocalContent(content)
  }, [content])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    const cursorPosition = e.target.selectionStart

    // Get the current word being typed
    const textBeforeCursor = newContent.substring(0, cursorPosition)
    const textAfterCursor = newContent.substring(cursorPosition)
    const currentWordMatch = textBeforeCursor.match(/\/\S*$/)

    if (currentWordMatch) {
      const currentWord = currentWordMatch[0]
      // Find matching trigger
      const trigger = autoTextoTriggers.find(t => t.trigger === currentWord)

      if (trigger) {
        // Calculate the start position of the trigger
        const triggerStartPos = cursorPosition - currentWord.length
        
        // Replace trigger with content
        const finalContent = textBeforeCursor.substring(0, triggerStartPos) + 
                           trigger.content + 
                           textAfterCursor

        setLocalContent(finalContent)
        setContent(finalContent)

        // Set cursor position after inserted content
        setTimeout(() => {
          if (textareaRef.current) {
            const newPosition = triggerStartPos + trigger.content.length
            textareaRef.current.selectionStart = newPosition
            textareaRef.current.selectionEnd = newPosition
            textareaRef.current.focus()
          }
        }, 0)

        toast({
          title: "AutoTexto Inserido",
          description: `AutoTexto "${trigger.trigger}" inserido.`,
        })
        return
      }
    }

    setLocalContent(newContent)
    setContent(newContent)
    const progress = Math.min(Math.floor((newContent.length / 500) * 100), 100)
    setReportProgress(progress)
  }

  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = textareaRef.current?.selectionStart || 0
      const end = textareaRef.current?.selectionEnd || 0
      const newContent = localContent.substring(0, start) + '  ' + localContent.substring(end)
      setLocalContent(newContent)
      setContent(newContent)
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2
        }
      }, 0)
    }
  }, [localContent, setContent])

  const handleTemplateInsert = useCallback((templateContent: string) => {
    const newContent = content + '\n\n' + templateContent
    setContent(newContent)
    setLocalContent(newContent)
  }, [content, setContent])

  const handleGeneratePreview = useCallback(async () => {
    if (!localContent) return
    
    setIsPreviewLoading(true)
    try {
      const response = await generateClaudeResponse(localContent, "Generate Report")
      setPreviewContent(response)
    } catch (error) {
      toast({
        title: "Erro",
        description: "Não foi possível gerar a prévia do relatório.",
        variant: "destructive"
      })
    } finally {
      setIsPreviewLoading(false)
    }
  }, [localContent, toast])

  return (
    <div className={`h-full min-h-0 flex flex-col ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
      <div className="flex-1 flex gap-4">
        {/* Left side - Editor */}
        <div className="flex-1 flex flex-col min-h-0">
          {/* Toolbar */}
          <div className="flex justify-between items-center mb-4 flex-shrink-0">
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={() => setIsTemplateManagerOpen(true)}>
                <List className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setIsMeasurementManagerOpen(true)}>
                <Ruler className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="icon" onClick={() => setIsFullscreen(!isFullscreen)}>
                {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Editor tabs */}
          <Tabs defaultValue="edit" className="flex-1 flex flex-col min-h-0">
            <TabsList className="flex-shrink-0">
              <TabsTrigger value="edit">Editar</TabsTrigger>
              <TabsTrigger value="preview">Visualizar</TabsTrigger>
            </TabsList>
            <TabsContent value="edit" className="flex-1 min-h-0 h-0">
              <Textarea
                ref={textareaRef}
                value={localContent}
                onChange={handleContentChange}
                onKeyDown={handleKeyDown}
                className="w-full h-full resize-none font-mono"
                placeholder="Comece a digitar seu relatório aqui..."
              />
            </TabsContent>
            <TabsContent value="preview" className="flex-1 min-h-0 h-0 overflow-auto">
              <div className="prose dark:prose-invert max-w-none">
                <ReactMarkdown>{localContent}</ReactMarkdown>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* Right side - Preview Card */}
        <Card className="w-96 p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold">Prévia do Relatório</h3>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleGeneratePreview}
              disabled={isPreviewLoading}
            >
              {isPreviewLoading ? 'Gerando...' : 'Atualizar'}
            </Button>
          </div>
          <div className="flex-1 overflow-auto">
            {previewContent ? (
              <div className="prose dark:prose-invert">
                <ReactMarkdown>{previewContent}</ReactMarkdown>
              </div>
            ) : (
              <div className="text-muted-foreground text-center">
                Clique em "Atualizar" para gerar uma prévia do relatório
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Dialogs */}
      <MeasurementManager
        isOpen={isMeasurementManagerOpen}
        onClose={() => setIsMeasurementManagerOpen(false)}
      />
      <TemplateManager
        isOpen={isTemplateManagerOpen}
        onClose={() => setIsTemplateManagerOpen(false)}
        onInsertTemplate={handleTemplateInsert}
      />

      {/* Right sidebar with recent and favorite templates */}
      <div className="w-64 flex flex-col gap-4">
        {recentTemplates.length > 0 && (
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Templates Recentes</h3>
            <div className="space-y-2">
              {recentTemplates.map(template => (
                <Button
                  key={template.id}
                  variant="ghost"
                  className="w-full justify-start text-sm"
                  onClick={() => handleTemplateInsert(template.name)}
                >
                  {template.name}
                </Button>
              ))}
            </div>
          </Card>
        )}
        
        {favoriteTemplates.length > 0 && (
          <Card className="p-4">
            <h3 className="font-semibold mb-2">Templates Favoritos</h3>
            <div className="space-y-2">
              {favoriteTemplates.map(templateId => {
                const template = defaultTemplates.find(t => t.id === templateId)
                if (!template) return null
                return (
                  <Button
                    key={template.id}
                    variant="ghost"
                    className="w-full justify-start text-sm"
                    onClick={() => handleTemplateInsert(template.name)}
                  >
                    {template.name}
                  </Button>
                )
              })}
            </div>
          </Card>
        )}
      </div>

      {/* Add template shortcut handler */}
      {showShortcutHint && (
        <div className="bg-muted p-2 rounded-md mb-2 text-sm flex justify-between items-center">
          <span>Dica: Use atalhos como /normal para inserir templates rapidamente</span>
          <Button variant="ghost" size="sm" onClick={() => setShowShortcutHint(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
