import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog'
import { ScrollArea } from './ui/scroll-area'
import { autoTextoTriggers } from '../utils/autoTexto'

interface AutoTextoHelpProps {
  isOpen: boolean
  onClose: () => void
}

export function AutoTextoHelp({ isOpen, onClose }: AutoTextoHelpProps) {
  // Group triggers by category
  const groupedTriggers = autoTextoTriggers.reduce((acc, trigger) => {
    if (!acc[trigger.category]) {
      acc[trigger.category] = []
    }
    acc[trigger.category].push(trigger)
    return acc
  }, {} as Record<string, typeof autoTextoTriggers>)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>AutoTexto - Atalhos Disponíveis</DialogTitle>
        </DialogHeader>
        <ScrollArea className="mt-4 h-[60vh]">
          <div className="space-y-6 pr-4">
            {Object.entries(groupedTriggers).map(([category, triggers]) => (
              <div key={category}>
                <h3 className="font-semibold mb-2 capitalize">{category}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {triggers.map(trigger => (
                    <div key={trigger.id} className="flex items-center justify-between p-2 rounded bg-muted">
                      <code className="text-sm font-mono">{trigger.trigger}</code>
                      <span className="text-sm text-muted-foreground">{trigger.content}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
