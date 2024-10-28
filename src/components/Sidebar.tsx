import React, { useState, useCallback } from 'react'
import { useAppContext } from '../contexts/AppContext'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { Textarea } from "./ui/textarea"
import { Card, CardContent } from "./ui/card"
import { ScrollArea } from "./ui/scroll-area"
import { PenTool, Trash2, Plus, ChevronDown, ChevronUp } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"
import { useToast } from "./ui/use-toast"

interface AutoTextoTrigger {
  id: string
  trigger: string
  content: string
  tags: string[]
  category: string
  conditions: string[]
}

interface AutoTextoTriggerProps {
  trigger: AutoTextoTrigger
  onEdit: (trigger: AutoTextoTrigger) => void
  onDelete: (id: string) => void
}

function AutoTextoTriggerComponent({ trigger, onEdit, onDelete }: AutoTextoTriggerProps) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card className="mb-2 hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-4">
        <div className="flex justify-between items-center">
          <div className="flex-grow">
            <h3 className="font-medium text-primary">{trigger.trigger}</h3>
            <p className="text-sm text-muted-foreground truncate">{trigger.content.substring(0, 50)}...</p>
          </div>
          <div className="flex space-x-2">
            <Button variant="ghost" size="icon" onClick={() => setIsExpanded(!isExpanded)}>
              {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onEdit(trigger)}>
              <PenTool className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => onDelete(trigger.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {isExpanded && (
          <div className="mt-2">
            <p className="text-sm"><strong>Category:</strong> {trigger.category}</p>
            <p className="text-sm"><strong>Tags:</strong> {trigger.tags.join(', ')}</p>
            <p className="text-sm"><strong>Conditions:</strong></p>
            <ul className="list-disc list-inside text-sm">
              {trigger.conditions.map((condition, index) => (
                <li key={index}>{condition}</li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

export function Sidebar() {
  const { autoTextoTriggers, addAutoTextoTrigger, updateAutoTextoTrigger, deleteAutoTextoTrigger } = useAppContext()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTrigger, setEditingTrigger] = useState<AutoTextoTrigger | null>(null)
  const [newTrigger, setNewTrigger] = useState<Omit<AutoTextoTrigger, 'id'>>({
    trigger: '',
    content: '',
    tags: [],
    category: '',
    conditions: []
  })
  const { toast } = useToast()

  const handleAddTrigger = useCallback(() => {
    setEditingTrigger(null)
    setNewTrigger({
      trigger: '',
      content: '',
      tags: [],
      category: '',
      conditions: []
    })
    setIsDialogOpen(true)
  }, [])

  const handleEditTrigger = useCallback((trigger: AutoTextoTrigger) => {
    setEditingTrigger(trigger)
    setNewTrigger(trigger)
    setIsDialogOpen(true)
  }, [])

  const handleDeleteTrigger = useCallback((id: string) => {
    deleteAutoTextoTrigger(id)
    toast({
      title: "Trigger Deleted",
      description: "The AutoTexto trigger has been removed.",
    })
  }, [deleteAutoTextoTrigger, toast])

  const handleSaveTrigger = useCallback(() => {
    if (editingTrigger) {
      updateAutoTextoTrigger(editingTrigger.id, newTrigger)
      toast({
        title: "Trigger Updated",
        description: "The AutoTexto trigger has been updated successfully.",
      })
    } else {
      addAutoTextoTrigger(newTrigger)
      toast({
        title: "Trigger Added",
        description: "A new AutoTexto trigger has been added.",
      })
    }
    setIsDialogOpen(false)
  }, [editingTrigger, newTrigger, addAutoTextoTrigger, updateAutoTextoTrigger, toast])

  return (
    <aside className="w-64 bg-card text-card-foreground border-r p-4 flex flex-col h-full">
      <h2 className="text-lg font-semibold mb-4 text-primary">AutoTexto Triggers</h2>
      <Button className="mb-4 w-full" onClick={handleAddTrigger}>
        <Plus className="h-4 w-4 mr-2" />
        Add Trigger
      </Button>
      <ScrollArea className="flex-grow">
        {autoTextoTriggers.map(trigger => (
          <AutoTextoTriggerComponent
            key={trigger.id}
            trigger={trigger}
            onEdit={handleEditTrigger}
            onDelete={handleDeleteTrigger}
          />
        ))}
      </ScrollArea>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingTrigger ? 'Edit Trigger' : 'Add Trigger'}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Trigger"
              value={newTrigger.trigger}
              onChange={e => setNewTrigger(prev => ({ ...prev, trigger: e.target.value }))}
            />
            <Textarea
              placeholder="Content"
              value={newTrigger.content}
              onChange={e => setNewTrigger(prev => ({ ...prev, content: e.target.value }))}
            />
            <Input
              placeholder="Tags (comma-separated)"
              value={newTrigger.tags.join(', ')}
              onChange={e => setNewTrigger(prev => ({ ...prev, tags: e.target.value.split(',').map(tag => tag.trim()) }))}
            />
            <Select
              value={newTrigger.category}
              onValueChange={value => setNewTrigger(prev => ({ ...prev, category: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="General">General</SelectItem>
                <SelectItem value="Chest">Chest</SelectItem>
                <SelectItem value="Musculoskeletal">Musculoskeletal</SelectItem>
                <SelectItem value="Neurological">Neurological</SelectItem>
                <SelectItem value="Abdominal">Abdominal</SelectItem>
              </SelectContent>
            </Select>
            <Textarea
              placeholder="Conditions (one per line)"
              value={newTrigger.conditions.join('\n')}
              onChange={e => setNewTrigger(prev => ({ ...prev, conditions: e.target.value.split('\n').map(condition => condition.trim()) }))}
            />
          </div>
          <Button onClick={handleSaveTrigger} className="w-full mt-4">Save</Button>
        </DialogContent>
      </Dialog>
    </aside>
  )
}
