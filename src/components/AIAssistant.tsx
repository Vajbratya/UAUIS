import React, { useState, useCallback } from 'react'
import { useAppContext } from '../contexts/AppContext'
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { Brain, Lightbulb, FileText, Wand2, Loader2, ChevronDown, ChevronUp, Copy, Send, Edit } from 'lucide-react'
import { useToast } from "./ui/use-toast"
import { generateClaudeResponse, generateFallbackResponse } from '../utils/claudeApi'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Card } from "./ui/card"
import { Textarea } from "./ui/textarea"

export function AIAssistant() {
  const { content, setContent } = useAppContext()
  const [isProcessing, setIsProcessing] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [lastAction, setLastAction] = useState('')
  const [isEditMode, setIsEditMode] = useState(false)
  const [editInstructions, setEditInstructions] = useState('')
  const [showPreview, setShowPreview] = useState(false)
  const { toast } = useToast()

  const handleAIAction = useCallback(async (action: string) => {
    if (!content.trim()) {
      toast({
        title: "Conteúdo Vazio",
        description: "Por favor, insira algum conteúdo no editor antes de gerar o relatório.",
        variant: "destructive"
      })
      return
    }

    setIsProcessing(true)
    setLastAction(action)
    try {
      let response: string
      try {
        if (isEditMode) {
          response = await generateClaudeResponse(content, `${action} with following instructions: ${editInstructions}`)
        } else {
          response = await generateClaudeResponse(content, action)
        }
      } catch (error) {
        console.error("Erro ao gerar resposta Claude:", error)
        response = generateFallbackResponse(action)
        toast({
          title: "Erro de Conexão",
          description: "Não foi possível acessar o serviço de IA. Usando uma resposta local alternativa.",
          variant: "destructive"
        })
      }

      setGeneratedContent(response)
      setShowPreview(true)
      toast({
        title: "Ação de IA Concluída",
        description: `${action} foi realizada com sucesso.`,
        variant: "default"
      })
    } catch (error) {
      console.error("Erro inesperado:", error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro inesperado. Por favor, tente novamente mais tarde.",
        variant: "destructive"
      })
    } finally {
      setIsProcessing(false)
      setIsEditMode(false)
      setEditInstructions('')
    }
  }, [content, toast, isEditMode, editInstructions])

  const handleTransferToEditor = useCallback(() => {
    setContent(generatedContent)
    setGeneratedContent('')
    setShowPreview(false)
    toast({
      title: "Conteúdo Transferido",
      description: "O conteúdo foi transferido para o editor.",
      variant: "default"
    })
  }, [generatedContent, setContent, toast])

  const handleEditWithInstructions = useCallback(() => {
    setIsEditMode(true)
    setIsModalOpen(true)
  }, [])

  const handleReprocessWithInstructions = useCallback(() => {
    if (!editInstructions.trim()) {
      toast({
        title: "Instruções Vazias",
        description: "Por favor, insira instruções para reprocessamento.",
        variant: "destructive"
      })
      return
    }
    setIsModalOpen(false)
    handleAIAction(lastAction)
  }, [editInstructions, handleAIAction, lastAction, toast])

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(generatedContent)
    toast({
      title: "Conteúdo Copiado",
      description: "O conteúdo gerado foi copiado para a área de transferência.",
      variant: "default"
    })
  }, [generatedContent, toast])

  const getActionTitle = (action: string) => {
    switch (action) {
      case "Follow-up Recommendations":
        return "Recomendações de Acompanhamento"
      case "Generate Impressions":
        return "Impressões"
      case "Generate Report":
        return "Relatório Gerado"
      case "Enhance Report":
        return "Relatório Aprimorado"
      default:
        return "Resultado"
    }
  }

  return (
    <div className="h-full min-h-0 flex flex-col">
      <div className="flex-shrink-0 space-y-2 mb-4">
        <Button 
          className="w-full justify-start font-medium bg-slate-700 hover:bg-slate-600 text-white shadow-sm" 
          onClick={() => handleAIAction("Follow-up Recommendations")} 
          disabled={isProcessing}
        >
          <Brain className="h-5 w-5 mr-2" />
          Recomendações de Acompanhamento
        </Button>
        <Button 
          className="w-full justify-start font-medium bg-stone-700 hover:bg-stone-600 text-white shadow-sm" 
          onClick={() => handleAIAction("Generate Impressions")} 
          disabled={isProcessing}
        >
          <Lightbulb className="h-5 w-5 mr-2" />
          Gerar Impressões
        </Button>
        <Button 
          className="w-full justify-start font-medium bg-neutral-700 hover:bg-neutral-600 text-white shadow-sm" 
          onClick={() => handleAIAction("Generate Report")} 
          disabled={isProcessing}
        >
          <FileText className="h-5 w-5 mr-2" />
          Gerar Relatório
        </Button>
        <Button 
          className="w-full justify-start font-medium bg-zinc-700 hover:bg-zinc-600 text-white shadow-sm" 
          onClick={() => handleAIAction("Enhance Report")} 
          disabled={isProcessing}
        >
          <Wand2 className="h-5 w-5 mr-2" />
          Aprimorar Relatório
        </Button>
      </div>

      <ScrollArea className="flex-1 min-h-0">
        {isProcessing && (
          <div className="flex items-center justify-center p-4 bg-muted rounded-md">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span className="font-medium">Processando sua solicitação...</span>
          </div>
        )}

        {showPreview && generatedContent && (
          <Card className="p-4 mt-4 border-2 shadow-lg max-w-[600px] mx-auto">
            <div className="flex flex-col space-y-4 mb-4">
              <h3 className="text-xl font-bold text-foreground">{getActionTitle(lastAction)} - Prévia</h3>
              <div className="flex flex-col space-y-2">
                <Button 
                  onClick={handleTransferToEditor} 
                  className="w-full font-medium bg-slate-700 hover:bg-slate-600 text-white justify-center shadow-sm"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Transferir para Editor
                </Button>
                <Button 
                  onClick={handleEditWithInstructions} 
                  className="w-full font-medium bg-stone-700 hover:bg-stone-600 text-white justify-center shadow-sm"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar com Instruções
                </Button>
              </div>
            </div>

            <div className={`border-2 rounded-md p-4 ${isExpanded ? 'h-[60vh]' : 'h-64'} bg-card overflow-auto`}>
              <div className="whitespace-pre-wrap text-foreground font-medium leading-relaxed">
                {generatedContent}
              </div>
            </div>

            <div className="mt-4 flex justify-between items-center">
              <Button 
                className="font-medium bg-neutral-700 hover:bg-neutral-600 text-white shadow-sm"
                onClick={() => setIsExpanded(!isExpanded)}
              >
                {isExpanded ? (
                  <>
                    <ChevronUp className="h-4 w-4 mr-2" />
                    Recolher
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4 mr-2" />
                    Expandir
                  </>
                )}
              </Button>
              <Button 
                onClick={copyToClipboard}
                className="font-medium bg-zinc-700 hover:bg-zinc-600 text-white shadow-sm"
              >
                <Copy className="h-4 w-4 mr-2" />
                Copiar
              </Button>
            </div>
          </Card>
        )}
      </ScrollArea>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">Instruções para Reprocessamento</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Textarea
              placeholder="Digite suas instruções para o reprocessamento do relatório..."
              value={editInstructions}
              onChange={(e) => setEditInstructions(e.target.value)}
              className="min-h-[200px] text-base font-medium"
            />
            <div className="mt-4 flex justify-end space-x-2">
              <Button 
                className="font-medium bg-neutral-700 hover:bg-neutral-600 text-white shadow-sm"
                onClick={() => setIsModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handleReprocessWithInstructions}
                className="font-medium bg-slate-700 hover:bg-slate-600 text-white shadow-sm"
              >
                Reprocessar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
