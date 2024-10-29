import React, { useState, useCallback, useEffect, useRef } from 'react'
import { useAppContext } from '../contexts/AppContext'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'
import { Save, Download, Printer, Users, Tag, CornerUpLeft, CornerUpRight, Maximize2, Minimize2, Copy, Ruler, List, FileText, Brain, Lightbulb, Wand2, HelpCircle } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import { useToast } from './ui/use-toast'
import { generateClaudeResponse } from '../utils/claudeApi'
import { MeasurementManager } from './MeasurementManager'
import TemplateManager from './TemplateManager'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { Card } from './ui/card'
import { Progress } from './ui/progress'
import { findTriggerMatch } from '../utils/autoTexto'
import { AutoTextoHelp } from './AutoTextoHelp'

interface EditorProps {}

export function Editor({}: EditorProps) {
  const { content, setContent } = useAppContext()
  const [localContent, setLocalContent] = useState(content)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMeasurementManagerOpen, setIsMeasurementManagerOpen] = useState(false)
  const [isTemplateManagerOpen, setIsTemplateManagerOpen] = useState(false)
  const [isAutoTextoHelpOpen, setIsAutoTextoHelpOpen] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const { toast } = useToast()
  const [previewContent, setPreviewContent] = useState<string>('')
  const [isPreviewLoading, setIsPreviewLoading] = useState(false)
  const [reportProgress, setReportProgress] = useState(0)

  useEffect(() => {
    setLocalContent(content)
  }, [content])

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value
    setLocalContent(newContent)
    setContent(newContent)
    // Calculate progress based on content length and structure
    const progress = Math.min(Math.floor((newContent.length / 500) * 100), 100)
    setReportProgress(progress)
  }

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Tab') {
      e.preventDefault()
      const start = textareaRef.current?.selectionStart || 0
      const end = textareaRef.current?.selectionEnd || 0
      const newContent = localContent.substring(0, start) + '  ' + localContent.substring(end)
      setLocalContent(newContent)
      setContent(newContent)
      // Set cursor position after tab
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.selectionStart = textareaRef.current.selectionEnd = start + 2
        }
      }, 0)
    } else if (e.key === ' ' || e.key === 'Enter') {
      // Check for auto-texto triggers when space or enter is pressed
      const textarea = textareaRef.current
      if (textarea) {
        const cursorPosition = textarea.selectionStart
        const textBeforeCursor = textarea.value.substring(0, cursorPosition)
        const words = textBeforeCursor.split(/\s+/)
        const currentWord = words[words.length - 1]

        // Check if the current word matches any auto-texto trigger
        const matchingTrigger = findTriggerMatch(currentWord)

        if (matchingTrigger) {
          e.preventDefault()
          // Replace the trigger word with the content
          const textBeforeWord = textBeforeCursor.substring(0, textBeforeCursor.length - currentWord.length)
          const textAfterCursor = textarea.value.substring(cursorPosition)
          
          const newContent = textBeforeWord + matchingTrigger.content + (e.key === 'Enter' ? '\n' : ' ') + textAfterCursor
          setLocalContent(newContent)
          setContent(newContent)

          // Set cursor position after the inserted content
          setTimeout(() => {
            if (textareaRef.current) {
              const newPosition = textBeforeWord.length + matchingTrigger.content.length + (e.key === 'Enter' ? 1 : 1)
              textareaRef.current.selectionStart = textareaRef.current.selectionEnd = newPosition
            }
          }, 0)
        }
      }
    }
  }, [localContent, setContent])

  const handleTemplateInsert = useCallback((templateContent: string) => {
    // Templates replace the entire content since they are complete reports
    setContent(templateContent)
    setLocalContent(templateContent)
  }, [setContent])

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
              <Button variant="outline" size="icon" onClick={() => setIsTemplateManagerOpen(true)} title="Templates (Relatórios Completos)">
                <List className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setIsMeasurementManagerOpen(true)}>
                <Ruler className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="icon" onClick={() => setIsAutoTextoHelpOpen(true)} title="Ajuda AutoTexto">
                <HelpCircle className="h-4 w-4" />
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
                placeholder="Comece a digitar seu relatório aqui... (Use /n para 'normal', /p para 'preservado', /b para 'bilateral', etc)"
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
      <AutoTextoHelp
        isOpen={isAutoTextoHelpOpen}
        onClose={() => setIsAutoTextoHelpOpen(false)}
      />
    </div>
  )
}
