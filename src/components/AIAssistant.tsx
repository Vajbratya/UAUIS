import React, { useState, useCallback } from 'react'
import { useAppContext } from '../contexts/AppContext'
import { Button } from "./ui/button"
import { ScrollArea } from "./ui/scroll-area"
import { Brain, Lightbulb, FileText, Wand2, Loader2, CheckCircle2, AlertCircle, ChevronDown, ChevronUp, Copy } from 'lucide-react'
import { useToast } from "./ui/use-toast"
import { generateClaudeResponse, generateFallbackResponse } from '../utils/claudeApi'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Card } from "./ui/card"

export function AIAssistant() {
  const { content, setContent } = useAppContext()
  const [isProcessing, setIsProcessing] = useState(false)
  const [generatedContent, setGeneratedContent] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)
  const [lastAction, setLastAction] = useState('')
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
        response = await generateClaudeResponse(content, action)
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
      setIsModalOpen(true)
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
    }
  }, [content, toast])

  const applyGeneratedContent = useCallback(() => {
    const newContent = content + "\n\n" + generatedContent
    setContent(newContent)
    setGeneratedContent('')
    setIsModalOpen(false)
    toast({
      title: "Conteúdo Aplicado",
      description: "O conteúdo gerado foi adicionado ao seu relatório.",
      variant: "default"
    })
  }, [content, generatedContent, setContent, toast])

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
        <Button className="w-full justify-start" onClick={() => handleAIAction("Follow-up Recommendations")} disabled={isProcessing}>
          <Brain className="h-5 w-5 mr-2" />
          Recomendações de Acompanhamento
        </Button>
        <Button className="w-full justify-start" onClick={() => handleAIAction("Generate Impressions")} disabled={isProcessing}>
          <Lightbulb className="h-5 w-5 mr-2" />
          Gerar Impressões
        </Button>
        <Button className="w-full justify-start" onClick={() => handleAIAction("Generate Report")} disabled={isProcessing}>
          <FileText className="h-5 w-5 mr-2" />
          Gerar Relatório
        </Button>
        <Button className="w-full justify-start" onClick={() => handleAIAction("Enhance Report")} disabled={isProcessing}>
          <Wand2 className="h-5 w-5 mr-2" />
          Aprimorar Relatório
        </Button>
      </div>
      <ScrollArea className="flex-1 min-h-0">
        {isProcessing && (
          <div className="flex items-center justify-center p-4 bg-muted rounded-md">
            <Loader2 className="h-6 w-6 animate-spin mr-2" />
            <span>Processando sua solicitação...</span>
          </div>
        )}
        {generatedContent && !isModalOpen && (
          <Card className="p-4 mt-4 cursor-pointer hover:bg-accent" onClick={() => setIsModalOpen(true)}>
            <h3 className="font-semibold mb-2">{getActionTitle(lastAction)}</h3>
            <p className="text-sm text-muted-foreground line-clamp-3">
              {generatedContent}
            </p>
            <div className="flex justify-end mt-2">
              <Button variant="ghost" size="sm">
                <ChevronDown className="h-4 w-4" />
                Expandir
              </Button>
            </div>
          </Card>
        )}
      </ScrollArea>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>{getActionTitle(lastAction)}</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <ScrollArea className={`border rounded-md p-4 ${isExpanded ? 'h-[60vh]' : 'h-64'}`}>
              <div className="whitespace-pre-wrap">{generatedContent}</div>
            </ScrollArea>
            <div className="mt-2 flex justify-between items-center">
              <Button variant="outline" onClick={() => setIsExpanded(!isExpanded)}>
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
              <div className="space-x-2">
                <Button onClick={copyToClipboard}>
                  <Copy className="h-4 w-4 mr-2" />
                  Copiar
                </Button>
                <Button onClick={applyGeneratedContent}>
                  Aplicar ao Relatório
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
